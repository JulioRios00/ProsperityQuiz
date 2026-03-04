"""Flask application factory."""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from .config import get_config
from .infrastructure.database.session import db, init_db
from .presentation.middleware.error_handler import register_error_handlers
from .presentation.api.v1 import api_v1_bp


def create_app(config_name: str = None) -> Flask:
    """Create and configure the Flask application.

    Args:
        config_name: Configuration name (development, testing, production)

    Returns:
        Configured Flask application
    """
    app = Flask(__name__)

    # Load configuration
    if config_name:
        app.config.from_object(f"src.config.{config_name.capitalize()}Config")
    else:
        config = get_config()
        app.config.from_object(config)

    # Initialize extensions
    init_extensions(app)

    # Register blueprints
    register_blueprints(app)

    # Register error handlers
    register_error_handlers(app)

    # Health check endpoint
    @app.route("/health", methods=["GET"])
    def health():
        """Health check endpoint."""
        return jsonify({
            "status": "healthy",
            "service": "quiz-funnel-backend",
            "version": "1.0.0"
        }), 200

    return app


def init_extensions(app: Flask) -> None:
    """Initialize Flask extensions.

    Args:
        app: Flask application
    """
    # Database
    init_db(app)
    Migrate(app, db)

    # JWT
    JWTManager(app)

    # CORS
    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        methods=app.config["CORS_METHODS"],
        allow_headers=app.config["CORS_ALLOW_HEADERS"],
        supports_credentials=app.config["CORS_SUPPORTS_CREDENTIALS"]
    )


def register_blueprints(app: Flask) -> None:
    """Register application blueprints.

    Args:
        app: Flask application
    """
    # API v1
    app.register_blueprint(api_v1_bp, url_prefix="/api/v1")
