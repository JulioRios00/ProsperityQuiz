"""SQLAlchemy implementation of DiagnosisRepository."""
from typing import Optional
import uuid

from ....application.interfaces.repositories import DiagnosisRepository
from ....domain.entities.diagnosis import DiagnosisEntity
from ..models import Diagnosis
from ..session import db


class SQLAlchemyDiagnosisRepository(DiagnosisRepository):
    def save(self, diagnosis: DiagnosisEntity) -> DiagnosisEntity:
        model = Diagnosis(
            id=diagnosis.id,
            user_id=diagnosis.user_id,
            session_id=diagnosis.session_id,
            diagnosis_text=diagnosis.diagnosis_text,
            favorable_days=diagnosis.favorable_days,
            blocked_area=diagnosis.blocked_area,
            blockage_level=diagnosis.blockage_level,
        )
        db.session.add(model)
        db.session.commit()
        db.session.refresh(model)
        return self._to_entity(model)

    def find_by_id(self, diagnosis_id: uuid.UUID) -> Optional[DiagnosisEntity]:
        model = db.session.get(Diagnosis, diagnosis_id)
        return self._to_entity(model) if model else None

    def find_by_session_id(self, session_id: uuid.UUID) -> Optional[DiagnosisEntity]:
        model = Diagnosis.query.filter_by(session_id=session_id).first()
        return self._to_entity(model) if model else None

    @staticmethod
    def _to_entity(model: Diagnosis) -> DiagnosisEntity:
        return DiagnosisEntity(
            id=model.id,
            user_id=model.user_id,
            session_id=model.session_id,
            diagnosis_text=model.diagnosis_text,
            favorable_days=model.favorable_days,
            blocked_area=model.blocked_area,
            blockage_level=model.blockage_level,
            created_at=model.created_at,
        )
