"""Diagnosis routes: generate, get, and email capture."""
import uuid

from flask import jsonify, request
from marshmallow import ValidationError

from .....application.use_cases.capture_email import CaptureEmailInput, CaptureEmailUseCase
from .....application.use_cases.generate_diagnosis import (
    GenerateDiagnosisInput,
    GenerateDiagnosisUseCase,
)
from .....infrastructure.database.repositories.diagnosis_repository import (
    SQLAlchemyDiagnosisRepository,
)
from .....infrastructure.database.repositories.email_capture_repository import (
    SQLAlchemyEmailCaptureRepository,
)
from .....infrastructure.database.repositories.quiz_repository import SQLAlchemyQuizRepository
from .....shared.exceptions import QuizSessionNotFound
from ..schemas.diagnosis_schema import CaptureEmailRequestSchema, GenerateDiagnosisRequestSchema
from .. import api_v1_bp

generate_schema = GenerateDiagnosisRequestSchema()
capture_schema = CaptureEmailRequestSchema()


@api_v1_bp.route("/diagnosis/generate", methods=["POST"])
def generate_diagnosis():
    try:
        data = generate_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.messages}), 400

    try:
        result = GenerateDiagnosisUseCase(
            SQLAlchemyQuizRepository(), SQLAlchemyDiagnosisRepository()
        ).execute(GenerateDiagnosisInput(session_token=data["session_token"]))
    except QuizSessionNotFound as e:
        return jsonify({"error": "Not Found", "message": str(e)}), 404

    d = result.diagnosis
    return jsonify({
        "id": str(d.id),
        "diagnosis_text": d.diagnosis_text,
        "favorable_days": d.favorable_days,
        "blocked_area": d.blocked_area,
        "blockage_level": d.blockage_level,
        "created_at": d.created_at.isoformat() if d.created_at else None,
    }), 200


@api_v1_bp.route("/diagnosis/<string:diagnosis_id>", methods=["GET"])
def get_diagnosis(diagnosis_id: str):
    try:
        did = uuid.UUID(diagnosis_id)
    except ValueError:
        return jsonify({"error": "Invalid diagnosis ID"}), 400

    diagnosis = SQLAlchemyDiagnosisRepository().find_by_id(did)
    if not diagnosis:
        return jsonify({"error": "Not Found", "message": "Diagnóstico não encontrado"}), 404

    return jsonify({
        "id": str(diagnosis.id),
        "diagnosis_text": diagnosis.diagnosis_text,
        "favorable_days": diagnosis.favorable_days,
        "blocked_area": diagnosis.blocked_area,
        "blockage_level": diagnosis.blockage_level,
        "created_at": diagnosis.created_at.isoformat() if diagnosis.created_at else None,
    }), 200


@api_v1_bp.route("/diagnosis/capture-email", methods=["POST"])
def capture_email():
    try:
        data = capture_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.messages}), 400

    try:
        result = CaptureEmailUseCase(SQLAlchemyEmailCaptureRepository()).execute(
            CaptureEmailInput(
                email=data["email"],
                session_token=data["session_token"],
                quiz_data=data.get("quiz_data"),
            )
        )
    except ValueError as e:
        return jsonify({"error": "Validation Error", "message": str(e)}), 400

    return jsonify({"email": result.email, "captured": result.captured}), 200
