# Devpost draft — DoubtLens

## Inspiration
Students do not get stuck because they need another paragraph of explanation. They get stuck on the next move: expand the brackets, label the forces, see which part of the leaf received light. Existing tools either cannot see the worksheet or jump straight to the final answer. DoubtLens is built around that gap.

## What it does
A student photographs a worksheet, textbook page, or handwritten problem. DoubtLens:

- extracts the question from the image
- states the learning goal in one sentence
- gives a hint
- gives only the next step
- names a common mistake
- writes two similar practice questions
- reveals a worked solution only when asked

It supports grade bands and multiple languages. If the photo is unclear, it asks for a better shot instead of guessing.

## How we built it
- FastAPI backend with a strict JSON tutor schema
- Multimodal vision through Gemini or OpenAI
- A hint-first prompt that locks the full solution unless the student asks
- A no-build frontend so the demo runs on a laptop or phone browser
- Demo mode with sample worksheets so the project still runs without an API key

## Challenges
- Busy worksheets contain several questions
- Handwriting and glare break naive OCR
- Models want to finish the problem; the product has to stop them
- Helpful tutoring is not the same as homework completion

## Accomplishments
- A complete snap-to-next-step loop
- Learning-first modes: hint, next step, full solution
- Practice questions generated from the same page
- A demo that works even before keys are added

## What we learned
Multimodal tutoring is a product problem as much as a model problem. The best answer is often one step shorter.

## What's next
- Let the student circle one question on the page
- Check the student's own written attempt
- Offline / low-bandwidth mode for school computer labs
- Teacher view: common mistakes across a class, with no student ranking wall
