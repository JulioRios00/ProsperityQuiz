"""Generate diagnosis use case."""
from dataclasses import dataclass

from ...domain.entities.diagnosis import DiagnosisEntity
from ...domain.services.diagnosis_service import DiagnosisService
from ...shared.exceptions import QuizSessionNotFound
from ..interfaces.repositories import DiagnosisRepository, QuizRepository


@dataclass
class GenerateDiagnosisInput:
    session_token: str


@dataclass
class GenerateDiagnosisOutput:
    diagnosis: DiagnosisEntity


class GenerateDiagnosisUseCase:
    def __init__(
        self,
        quiz_repository: QuizRepository,
        diagnosis_repository: DiagnosisRepository,
    ):
        self.quiz_repository = quiz_repository
        self.diagnosis_repository = diagnosis_repository
        self.diagnosis_service = DiagnosisService()

    def execute(self, input_dto: GenerateDiagnosisInput) -> GenerateDiagnosisOutput:
        quiz = self.quiz_repository.find_by_token(input_dto.session_token)
        if not quiz:
            raise QuizSessionNotFound(f"Sessão não encontrada: {input_dto.session_token}")

        # Return cached diagnosis if it already exists
        existing = self.diagnosis_repository.find_by_session_id(quiz.id)
        if existing:
            return GenerateDiagnosisOutput(diagnosis=existing)

        diagnosis = self.diagnosis_service.generate(quiz)
        saved = self.diagnosis_repository.save(diagnosis)
        return GenerateDiagnosisOutput(diagnosis=saved)
