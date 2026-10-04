from __future__ import annotations

import base64
import json
from pathlib import Path

import httpx

from app.schema import AttemptResult, HelpMode, TutorRequestMeta, TutorResult
from app.settings import settings

ROOT = Path(__file__).resolve().parents[1]
PROMPT = (ROOT / "prompts" / "tutor.txt").read_text(encoding="utf-8")
DEMO_ALGEBRA = json.loads((ROOT / "samples" / "demo_algebra.json").read_text())
DEMO_BIO = json.loads((ROOT / "samples" / "demo_photosynthesis.json").read_text())


def resolve_provider() -> str:
    choice = settings.llm_provider.lower().strip()
    if choice == "mock":
        return "mock"
    if choice == "gemini" and settings.gemini_api_key:
        return "gemini"
    if choice == "openai" and settings.openai_api_key:
        return "openai"
    if settings.gemini_api_key:
        return "gemini"
    if settings.openai_api_key:
        return "openai"
    return "mock"


def _lock_solution(result: TutorResult, mode: HelpMode) -> TutorResult:
    if mode != "full-solution":
        result.worked_solution = (
            "Full solution is locked. Use Next step until you have tried it, "
            "then reveal the worked solution."
        )
    if mode == "hint":
        result.next_step = "Stay with the hint first. Try one move on paper before asking for the next step."
    return result


def demo_result(meta: TutorRequestMeta, filename: str = "") -> TutorResult:
    name = filename.lower()
    payload = DEMO_BIO if any(word in name for word in ("leaf", "plant", "bio", "photo")) else DEMO_ALGEBRA
    result = TutorResult.model_validate({**payload, "demo_mode": True})
    if meta.language.lower() not in {"english", "en"}:
        result.warning = (
            f"Demo mode can show the English sample only. "
            f"Add an API key to tutor in {meta.language}."
        )
    return _lock_solution(result, meta.mode)


def check_attempt(problem: str, attempt: str, demo_mode: bool = False) -> AttemptResult:
    text = attempt.lower().strip()
    if not text:
        return AttemptResult(
            verdict="unclear",
            feedback="Write the step you tried, even if it is unfinished.",
            next_nudge="Start with one move: expand, simplify, or label the parts of the diagram.",
            demo_mode=demo_mode,
        )
    if "3x - 6" in text or "3x-6" in text.replace(" ", ""):
        return AttemptResult(
            verdict="on-track",
            feedback="You expanded the brackets correctly. 3 times both terms is 3x - 6.",
            next_nudge="Combine -6 and +5 next, then collect the x terms.",
            demo_mode=demo_mode,
        )
    if "x = 11" in text.replace(" ", "") or "x=11" in text.replace(" ", ""):
        return AttemptResult(
            verdict="almost",
            feedback="That may be the final value. Show the steps that got you there so the tutor can check the path, not only the ending.",
            next_nudge="Write the expanded left side, then how you moved the x terms.",
            demo_mode=demo_mode,
        )
    if "3x - 2" in text or "3x-2" in text.replace(" ", ""):
        return AttemptResult(
            verdict="off-track",
            feedback="The 3 was only multiplied by x, not by -2. That is the common bracket mistake.",
            next_nudge="Compute 3 × (x - 2) as two products: 3x and 3 × -2.",
            demo_mode=demo_mode,
        )
    if "light" in text or "cover" in text or "starch" in text:
        return AttemptResult(
            verdict="on-track",
            feedback="You are connecting the covering of the leaf with whether light can reach it.",
            next_nudge="Say what the iodine test should show on each half of the leaf.",
            demo_mode=demo_mode,
        )
    return AttemptResult(
        verdict="almost",
        feedback="There is an attempt on the page. Compare it with the next-step card and mark which part you already did.",
        next_nudge="Rewrite just the next tiny move, not the whole solution.",
        demo_mode=demo_mode,
    )


def _parse_model_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Model did not return JSON")
    return json.loads(cleaned[start : end + 1])


def _gemini(image_b64: str, mime: str, meta: TutorRequestMeta) -> dict:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent"
    )
    user = (
        f"Grade band: {meta.grade_band}\n"
        f"Language: {meta.language}\n"
        f"Help mode: {meta.mode}\n"
        f"Subject hint: {meta.subject_hint}\n"
        "Read the attached worksheet photo and respond with JSON only."
    )
    body = {
        "contents": [
            {
                "parts": [
                    {"text": PROMPT + "\n\n" + user},
                    {"inline_data": {"mime_type": mime, "data": image_b64}},
                ]
            }
        ],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
    }
    with httpx.Client(timeout=60) as client:
        response = client.post(url, params={"key": settings.gemini_api_key}, json=body)
        response.raise_for_status()
        data = response.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"]
    return _parse_model_json(text)


def _openai(image_b64: str, mime: str, meta: TutorRequestMeta) -> dict:
    url = "https://api.openai.com/v1/chat/completions"
    user = (
        f"Grade band: {meta.grade_band}. Language: {meta.language}. "
        f"Help mode: {meta.mode}. Subject hint: {meta.subject_hint}."
    )
    headers = {"Authorization": f"Bearer {settings.openai_api_key}"}
    body = {
        "model": settings.openai_model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{image_b64}"},
                    },
                ],
            },
        ],
    }
    with httpx.Client(timeout=60) as client:
        response = client.post(url, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
    return _parse_model_json(data["choices"][0]["message"]["content"])


def tutor_from_image(image_bytes: bytes, mime: str, filename: str, meta: TutorRequestMeta) -> TutorResult:
    provider = resolve_provider()
    if provider == "mock":
        return demo_result(meta, filename)

    image_b64 = base64.b64encode(image_bytes).decode("ascii")
    try:
        raw = _gemini(image_b64, mime, meta) if provider == "gemini" else _openai(image_b64, mime, meta)
        result = TutorResult.model_validate({**raw, "demo_mode": False})
    except Exception as exc:
        fallback = demo_result(meta, filename)
        fallback.needs_human_check = True
        fallback.warning = f"Live model failed ({exc}). Showing demo fallback so you can keep building."
        return fallback
    return _lock_solution(result, meta.mode)
