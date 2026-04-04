"""Diagnosis domain service — orchestrates diagnosis generation."""
import calendar
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

        destiny = self._calc_destiny_number(quiz.get_birth_date())
        favorable_days = self._calculate_favorable_days(destiny)
        text = build_diagnosis_text(age_range, blocked_area, signs, blockage_level, favorable_days)

        return DiagnosisEntity(
            session_id=quiz.id,
            user_id=quiz.user_id,
            diagnosis_text=text,
            favorable_days=favorable_days,
            blocked_area=blocked_area,
            blockage_level=blockage_level,
        )

    def _calc_destiny_number(self, birth_date: str | None) -> int:
        """Pythagorean destiny number: sum all digits of birth date, reduce to 1 digit (keep 11, 22)."""
        if not birth_date:
            return 5  # neutral fallback
        digits = [int(d) for d in birth_date if d.isdigit()]
        n = sum(digits)
        while n > 9 and n not in (11, 22):
            n = sum(int(d) for d in str(n))
        return n

    def _calculate_favorable_days(self, destiny: int) -> int:
        """Count days in the current month where (day + destiny) % 9 <= 2 (spec formula)."""
        today = datetime.utcnow()
        days_in_month = calendar.monthrange(today.year, today.month)[1]
        count = sum(1 for d in range(1, days_in_month + 1) if (d + destiny) % 9 <= 2)
        return max(7, min(20, count))
