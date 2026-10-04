from typing import Literal

from pydantic import BaseModel, Field


GradeBand = Literal["middle-school", "high-school", "early-college"]
HelpMode = Literal["hint", "next-step", "full-solution"]
Subject = Literal["math", "physics", "chemistry", "biology", "other"]
AttemptVerdict = Literal["on-track", "almost", "off-track", "unclear"]


class TutorRequestMeta(BaseModel):
    grade_band: GradeBand = "high-school"
    language: str = "English"
    mode: HelpMode = "next-step"
    subject_hint: Subject = "other"


class PracticeQuestion(BaseModel):
    question: str
    hint: str


class FoundQuestion(BaseModel):
    label: str
    text: str


class TutorResult(BaseModel):
    subject: Subject = "other"
    confidence: float = Field(ge=0, le=1, default=0.7)
    extracted_problem: str
    found_questions: list[FoundQuestion] = []
    student_goal: str
    hint: str
    next_step: str
    common_mistake: str
    worked_solution: str
    practice: list[PracticeQuestion]
    needs_human_check: bool = False
    warning: str | None = None
    demo_mode: bool = False


class AttemptResult(BaseModel):
    verdict: AttemptVerdict
    feedback: str
    next_nudge: str
    demo_mode: bool = False
