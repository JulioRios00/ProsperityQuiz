"""Abstract repository interfaces (ports)."""
from abc import ABC, abstractmethod
from typing import Optional
import uuid

from ...domain.entities.diagnosis import DiagnosisEntity
from ...domain.entities.quiz_response import QuizResponseEntity
from ...domain.entities.user import UserEntity


class UserRepository(ABC):
    @abstractmethod
    def save(self, user: UserEntity) -> UserEntity: ...

    @abstractmethod
    def find_by_email(self, email: str) -> Optional[UserEntity]: ...

    @abstractmethod
    def find_by_id(self, user_id: uuid.UUID) -> Optional[UserEntity]: ...

    @abstractmethod
    def update(self, user: UserEntity) -> UserEntity: ...


class QuizRepository(ABC):
    @abstractmethod
    def save(self, quiz: QuizResponseEntity) -> QuizResponseEntity: ...

    @abstractmethod
    def find_by_token(self, token: str) -> Optional[QuizResponseEntity]: ...

    @abstractmethod
    def find_by_id(self, quiz_id: uuid.UUID) -> Optional[QuizResponseEntity]: ...

    @abstractmethod
    def update(self, quiz: QuizResponseEntity) -> QuizResponseEntity: ...


class DiagnosisRepository(ABC):
    @abstractmethod
    def save(self, diagnosis: DiagnosisEntity) -> DiagnosisEntity: ...

    @abstractmethod
    def find_by_id(self, diagnosis_id: uuid.UUID) -> Optional[DiagnosisEntity]: ...

    @abstractmethod
    def find_by_session_id(self, session_id: uuid.UUID) -> Optional[DiagnosisEntity]: ...


class EmailCaptureRepository(ABC):
    @abstractmethod
    def save(self, email: str, quiz_data: dict, source: str = "quiz") -> None: ...
