"""SQLAlchemy implementation of QuizRepository."""
from datetime import datetime
from typing import Optional
import uuid

from ....application.interfaces.repositories import QuizRepository
from ....domain.entities.quiz_response import QuizResponseEntity
from ..models import QuizSession
from ..session import db


class SQLAlchemyQuizRepository(QuizRepository):
    def save(self, quiz: QuizResponseEntity) -> QuizResponseEntity:
        model = QuizSession(
            id=quiz.id,
            user_id=quiz.user_id,
            session_token=quiz.session_token,
            current_step=quiz.current_step,
            responses=quiz.responses,
            is_completed=quiz.is_completed,
            started_at=quiz.started_at,
            completed_at=quiz.completed_at,
        )
        db.session.add(model)
        db.session.commit()
        db.session.refresh(model)
        return self._to_entity(model)

    def find_by_token(self, token: str) -> Optional[QuizResponseEntity]:
        model = QuizSession.query.filter_by(session_token=token).first()
        return self._to_entity(model) if model else None

    def find_by_id(self, quiz_id: uuid.UUID) -> Optional[QuizResponseEntity]:
        model = db.session.get(QuizSession, quiz_id)
        return self._to_entity(model) if model else None

    def update(self, quiz: QuizResponseEntity) -> QuizResponseEntity:
        model = db.session.get(QuizSession, quiz.id)
        if not model:
            raise ValueError(f"Quiz session not found: {quiz.id}")
        model.current_step = quiz.current_step
        model.responses = quiz.responses
        model.is_completed = quiz.is_completed
        model.completed_at = quiz.completed_at
        model.updated_at = datetime.utcnow()
        db.session.commit()
        db.session.refresh(model)
        return self._to_entity(model)

    @staticmethod
    def _to_entity(model: QuizSession) -> QuizResponseEntity:
        return QuizResponseEntity(
            id=model.id,
            user_id=model.user_id,
            session_token=model.session_token,
            current_step=model.current_step,
            responses=model.responses or {},
            is_completed=model.is_completed,
            started_at=model.started_at,
            completed_at=model.completed_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
