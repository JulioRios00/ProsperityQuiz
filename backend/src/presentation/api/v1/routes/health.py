"""Health check route."""
from flask import jsonify
from .. import api_v1_bp


@api_v1_bp.route("/health", methods=["GET"])
def health_check():
    """API health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "quiz-funnel-api",
        "version": "1.0.0"
    }), 200
