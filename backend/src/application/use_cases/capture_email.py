"""Capture email use case — lead capture at Step 13."""
from dataclasses import dataclass, field
from typing import Optional

from ...domain.value_objects.email import Email
from ..interfaces.repositories import EmailCaptureRepository


@dataclass
class CaptureEmailInput:
    email: str
    session_token: str
    quiz_data: Optional[dict] = field(default=None)


@dataclass
class CaptureEmailOutput:
    email: str
    captured: bool


class CaptureEmailUseCase:
    def __init__(self, email_capture_repository: EmailCaptureRepository):
        self.email_capture_repository = email_capture_repository

    def execute(self, input_dto: CaptureEmailInput) -> CaptureEmailOutput:
        email = Email(input_dto.email)
        self.email_capture_repository.save(str(email), input_dto.quiz_data or {})
        return CaptureEmailOutput(email=str(email), captured=True)
