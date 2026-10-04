# DoubtLens

**Snap the doubt. Get the next step.**

DoubtLens is a multimodal study tutor for the Multimodal AI Hackathon 2026 (Education track).

A student photographs a worksheet, textbook page, or handwritten problem. DoubtLens reads the page, explains only the next useful step, and writes two practice questions. Full solutions stay behind a toggle so the default is learning, not answer-dumping.

- Event: [Multimodal AI Hackathon 2026](https://multimodal-ai-hackathon-2026-7.devpost.com/)
- Track: Education
- Team size: 1–4 students
- Dates: 30 Sep – 15 Oct 2026

## Why this can win

Judges can understand the demo in ten seconds. The multimodal piece is required (the model must *see* the page). The product has a clear rule: hint first, solution second.

## Quick start

```bash
cd doubtlens
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# optional: paste a Gemini or OpenAI key into .env
python -m app.main
```

Open http://127.0.0.1:8000

Without an API key the app still runs in **demo mode** using sample worksheets.

## What it does

1. Upload or capture a problem photo
2. Choose grade band, subject hint, and language
3. Get:
   - the question extracted from the image
   - a short hint
   - the next step only
   - common mistake to avoid
   - two similar practice questions
4. Optionally reveal the full worked solution

## Repo map

```
app/           FastAPI backend + tutor pipeline
static/        frontend
samples/       demo worksheets + expected JSON
prompts/       system prompts
DEVPOST.md     submission draft
PLAN.md        15-day build sheet
```

## Stack

- Frontend: HTML / CSS / vanilla JS (fast to demo, no build step)
- Backend: FastAPI
- Vision: Gemini 2.0 Flash or OpenAI vision, with a local demo fallback
- Output: strict JSON so the UI never depends on messy prose
