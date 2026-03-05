"""Start quiz use case — initialises a new quiz session."""
import secrets
import uuid
from dataclasses import dataclass
from typing import Optional

from ...domain.entities.quiz_response import QuizResponseEntity
from ..interfaces.repositories import QuizRepository


@dataclass
class StartQuizInput:
    user_id: Optional[uuid.UUID] = None


@dataclass
class StartQuizOutput:
    session_token: str
    quiz_id: uuid.UUID


class StartQuizUseCase:
    def __init__(self, quiz_repository: QuizRepository):
        self.quiz_repository = quiz_repository

    def execute(self, input_dto: StartQuizInput) -> StartQuizOutput:
        token = secrets.token_urlsafe(32)
        quiz = QuizResponseEntity(
            session_token=token,
            user_id=input_dto.user_id,
            current_step=1,
        )
        saved = self.quiz_repository.save(quiz)
        return StartQuizOutput(session_token=saved.session_token, quiz_id=saved.id)
