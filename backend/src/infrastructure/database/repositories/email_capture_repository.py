"""SQLAlchemy implementation of EmailCaptureRepository."""
from ....application.interfaces.repositories import EmailCaptureRepository
from ..models import EmailCapture
from ..session import db


class SQLAlchemyEmailCaptureRepository(EmailCaptureRepository):
    def save(self, email: str, quiz_data: dict, source: str = "quiz") -> None:
        model = EmailCapture(
            email=email,
            quiz_data=quiz_data,
            source=source,
        )
        db.session.add(model)
        db.session.commit()
