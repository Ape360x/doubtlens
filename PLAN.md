# DoubtLens 15-day build sheet

## Product rule
Default output is a hint + one next step. Full answers are optional.

## Day plan

### Days 1–2 — lock the story
- Register on Devpost and join Discord
- Record a 20-second phone video of a student photographing a worksheet
- Collect 8 sample pages: algebra, geometry, physics numerical, biology experiment, chemistry equation, blurry photo, incomplete photo, non-English page

### Days 3–4 — ship the loop
- Run this repo
- Add a real Gemini or OpenAI key
- Test live vision on 8 samples
- Write down every failure: bad OCR, skipped diagram, wrong subject

### Days 5–7 — make it feel like a tutor
- Add bounding-box / crop so the student can select one question on a busy page
- Save session history on one device
- Add “I tried this” box: student types their attempt, model checks the attempt only
- Add Hindi (or one local language) end-to-end

### Days 8–10 — robustness
- Blurry image warning
- Multi-question page: list questions, let user pick one
- Refuse medical / non-school photos
- Simple confidence meter

### Days 11–12 — demo
- 2-minute video: problem photo → hint → student writes a step → next step → practice question
- One before/after: dumped-answer chatbot vs DoubtLens

### Days 13–15 — submit
- Fill DEVPOST.md
- Public GitHub
- Live link (Render, Railway, or Hugging Face Spaces)
- Recheck rules when official problem statements drop
- Submit before the Devpost cutoff

## Roles if you have a team of 4
- Person A: vision prompts + model quality
- Person B: frontend + demo polish
- Person C: sample pages + languages + testing
- Person D: Devpost, video, pitch

## What not to build
- A medical diagnosis tool
- A site that only pastes the final answer
- Training a model from scratch
- A huge account system
