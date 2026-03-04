"""Error handling middleware."""
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import SQLAlchemyError


def register_error_handlers(app: Flask) -> None:
    """Register error handlers for the Flask application.

    Args:
        app: Flask application
    """

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        """Handle HTTP exceptions."""
        response = {
            "error": error.name,
            "message": error.description,
            "status_code": error.code
        }
        return jsonify(response), error.code

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(error: SQLAlchemyError):
        """Handle database errors."""
        app.logger.error(f"Database error: {str(error)}")
        response = {
            "error": "Database Error",
            "message": "An error occurred while processing your request.",
            "status_code": 500
        }
        return jsonify(response), 500

    @app.errorhandler(ValueError)
    def handle_value_error(error: ValueError):
        """Handle value errors."""
        response = {
            "error": "Validation Error",
            "message": str(error),
            "status_code": 400
        }
        return jsonify(response), 400

    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle 404 errors."""
        response = {
            "error": "Not Found",
            "message": "The requested resource was not found.",
            "status_code": 404
        }
        return jsonify(response), 404

    @app.errorhandler(500)
    def handle_internal_error(error):
        """Handle 500 errors."""
        app.logger.error(f"Internal server error: {str(error)}")
        response = {
            "error": "Internal Server Error",
            "message": "An unexpected error occurred.",
            "status_code": 500
        }
        return jsonify(response), 500

    @app.errorhandler(Exception)
    def handle_exception(error: Exception):
        """Handle all other exceptions."""
        app.logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
        response = {
            "error": "Internal Server Error",
            "message": "An unexpected error occurred.",
            "status_code": 500
        }
        return jsonify(response), 500
