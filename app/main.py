from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.schema import GradeBand, HelpMode, Subject, TutorRequestMeta
from app.settings import settings
from app.tutor import check_attempt, resolve_provider, tutor_from_image

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "static"
SAMPLES = ROOT / "samples" / "images"

app = FastAPI(title="DoubtLens", version="1.0.0")
app.mount("/static", StaticFiles(directory=STATIC), name="static")
app.mount("/samples", StaticFiles(directory=SAMPLES), name="samples")


class AttemptIn(BaseModel):
    problem: str = ""
    attempt: str = ""


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html")


@app.get("/api/health")
def health():
    provider = resolve_provider()
    return {
        "ok": True,
        "provider": provider,
        "demo_mode": provider == "mock",
        "name": "DoubtLens",
        "version": "1.0.0",
    }


@app.get("/api/samples")
def samples():
    return [
        {
            "id": "algebra",
            "title": "Algebra worksheet",
            "file": "/samples/algebra_worksheet.jpg",
            "filename": "algebra_worksheet.jpg",
        },
        {
            "id": "photosynthesis",
            "title": "Photosynthesis worksheet",
            "file": "/samples/photosynthesis_worksheet.jpg",
            "filename": "photosynthesis_worksheet.jpg",
        },
    ]


@app.post("/api/tutor")
async def tutor(
    image: UploadFile = File(...),
    grade_band: GradeBand = Form("high-school"),
    language: str = Form("English"),
    mode: HelpMode = Form("next-step"),
    subject_hint: Subject = Form("other"),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a photo of the problem.")
    payload = await image.read()
    if len(payload) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image is larger than 8 MB.")
    meta = TutorRequestMeta(
        grade_band=grade_band,
        language=language,
        mode=mode,
        subject_hint=subject_hint,
    )
    return tutor_from_image(payload, image.content_type, image.filename or "", meta)


@app.post("/api/attempt")
def attempt(body: AttemptIn):
    provider = resolve_provider()
    return check_attempt(body.problem, body.attempt, demo_mode=provider == "mock")


def run():
    import uvicorn

    uvicorn.run("app.main:app", host=settings.app_host, port=settings.app_port, reload=True)


if __name__ == "__main__":
    run()
