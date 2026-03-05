"""Diagnosis domain service — orchestrates diagnosis generation."""
from datetime import datetime

from ..entities.diagnosis import DiagnosisEntity
from ..entities.quiz_response import QuizResponseEntity
from .barnum_generator import build_diagnosis_text


class DiagnosisService:
    """Generates a personalized diagnosis from a completed quiz response."""

    def generate(self, quiz: QuizResponseEntity) -> DiagnosisEntity:
        age_range = quiz.get_age_range() or "35-44"
        blocked_area = quiz.get_blocked_area() or "financeiro"
        signs = quiz.get_signs()
        blockage_level = quiz.get_blockage_level()

        favorable_days = self._calculate_favorable_days(age_range, blockage_level)
        text = build_diagnosis_text(age_range, blocked_area, signs, blockage_level, favorable_days)

        return DiagnosisEntity(
            session_id=quiz.id,
            user_id=quiz.user_id,
            diagnosis_text=text,
            favorable_days=favorable_days,
            blocked_area=blocked_area,
            blockage_level=blockage_level,
        )

    def _calculate_favorable_days(self, age_range: str, blockage_level: int) -> int:
        """Numerological calculation: produces a deterministic value between 7 and 20."""
        age_base = {"25-34": 7, "35-44": 8, "45-54": 9, "55+": 1}.get(age_range, 5)
        today = datetime.utcnow()
        day_num = sum(int(d) for d in str(today.day))
        month_num = sum(int(d) for d in str(today.month))
        total = (age_base + blockage_level + day_num + month_num) % 14
        return total + 7  # Range: 7–20
