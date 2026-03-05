"""Authentication routes: register, login, refresh."""
from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from marshmallow import ValidationError

from .....application.use_cases.authenticate_user import (
    LoginInput,
    LoginUserUseCase,
    RegisterInput,
    RegisterUserUseCase,
)
from .....infrastructure.database.repositories.user_repository import (
    SQLAlchemyUserRepository,
)
from .....shared.exceptions import EmailAlreadyExists, InvalidCredentials
from ..schemas.auth_schema import LoginRequestSchema, RegisterRequestSchema, UserResponseSchema
from .. import api_v1_bp

register_schema = RegisterRequestSchema()
login_schema = LoginRequestSchema()
user_schema = UserResponseSchema()


@api_v1_bp.route("/auth/register", methods=["POST"])
def register():
    try:
        data = register_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.messages}), 400

    try:
        result = RegisterUserUseCase(SQLAlchemyUserRepository()).execute(
            RegisterInput(email=data["email"], password=data["password"], name=data.get("name"))
        )
    except EmailAlreadyExists as e:
        return jsonify({"error": "Email Already Exists", "message": str(e)}), 409
    except ValueError as e:
        return jsonify({"error": "Validation Error", "message": str(e)}), 400

    user = result.user
    return jsonify({
        "user": user_schema.dump({
            "id": str(user.id), "email": user.email,
            "name": user.name, "created_at": user.created_at,
        }),
        "access_token": create_access_token(identity=str(user.id)),
        "refresh_token": create_refresh_token(identity=str(user.id)),
    }), 201


@api_v1_bp.route("/auth/login", methods=["POST"])
def login():
    try:
        data = login_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.messages}), 400

    try:
        result = LoginUserUseCase(SQLAlchemyUserRepository()).execute(
            LoginInput(email=data["email"], password=data["password"])
        )
    except InvalidCredentials as e:
        return jsonify({"error": "Invalid Credentials", "message": str(e)}), 401

    user = result.user
    return jsonify({
        "user": user_schema.dump({
            "id": str(user.id), "email": user.email,
            "name": user.name, "created_at": user.created_at,
        }),
        "access_token": create_access_token(identity=str(user.id)),
        "refresh_token": create_refresh_token(identity=str(user.id)),
    }), 200


@api_v1_bp.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    return jsonify({"access_token": create_access_token(identity=get_jwt_identity())}), 200
