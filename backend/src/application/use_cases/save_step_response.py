"""Save step response use case."""
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from ...shared.exceptions import QuizSessionNotFound
from ..interfaces.repositories import QuizRepository

TOTAL_STEPS = 16


@dataclass
class SaveStepInput:
    session_token: str
    step: int
    response: Any


@dataclass
class SaveStepOutput:
    session_token: str
    current_step: int
    next_step: int
    progress: float
    is_completed: bool


class SaveStepResponseUseCase:
    def __init__(self, quiz_repository: QuizRepository):
        self.quiz_repository = quiz_repository

    def execute(self, input_dto: SaveStepInput) -> SaveStepOutput:
        quiz = self.quiz_repository.find_by_token(input_dto.session_token)
        if not quiz:
            raise QuizSessionNotFound(f"Sessão não encontrada: {input_dto.session_token}")

        quiz.responses[f"step_{input_dto.step}"] = input_dto.response
        quiz.current_step = input_dto.step

        next_step = input_dto.step + 1
        is_completed = next_step > TOTAL_STEPS

        if is_completed:
            quiz.is_completed = True
            quiz.completed_at = datetime.utcnow()

        self.quiz_repository.update(quiz)

        progress = round(input_dto.step / TOTAL_STEPS, 4)

        return SaveStepOutput(
            session_token=quiz.session_token,
            current_step=input_dto.step,
            next_step=next_step,
            progress=progress,
            is_completed=is_completed,
        )
