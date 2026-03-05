"""Quiz routes: start session, save step, get session."""
import uuid

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from marshmallow import ValidationError

from .....application.use_cases.save_step_response import SaveStepInput, SaveStepResponseUseCase
from .....application.use_cases.start_quiz import StartQuizInput, StartQuizUseCase
from .....infrastructure.database.repositories.quiz_repository import SQLAlchemyQuizRepository
from .....shared.exceptions import QuizSessionNotFound
from ..schemas.quiz_schema import SaveStepRequestSchema
from .. import api_v1_bp

save_step_schema = SaveStepRequestSchema()


@api_v1_bp.route("/quiz/start", methods=["POST"])
def start_quiz():
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            user_id = uuid.UUID(identity)
    except Exception:
        pass

    result = StartQuizUseCase(SQLAlchemyQuizRepository()).execute(StartQuizInput(user_id=user_id))
    return jsonify({"session_token": result.session_token, "quiz_id": str(result.quiz_id)}), 201


@api_v1_bp.route("/quiz/step", methods=["POST"])
def save_step():
    try:
        data = save_step_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.messages}), 400

    try:
        result = SaveStepResponseUseCase(SQLAlchemyQuizRepository()).execute(
            SaveStepInput(
                session_token=data["session_token"],
                step=data["step"],
                response=data["response"],
            )
        )
    except QuizSessionNotFound as e:
        return jsonify({"error": "Not Found", "message": str(e)}), 404

    return jsonify({
        "session_token": result.session_token,
        "current_step": result.current_step,
        "next_step": result.next_step,
        "progress": result.progress,
        "is_completed": result.is_completed,
    }), 200


@api_v1_bp.route("/quiz/session/<string:token>", methods=["GET"])
def get_session(token: str):
    quiz = SQLAlchemyQuizRepository().find_by_token(token)
    if not quiz:
        return jsonify({"error": "Not Found", "message": "Sessão não encontrada"}), 404

    return jsonify({
        "session_token": quiz.session_token,
        "current_step": quiz.current_step,
        "responses": quiz.responses,
        "is_completed": quiz.is_completed,
        "started_at": quiz.started_at.isoformat() if quiz.started_at else None,
    }), 200
