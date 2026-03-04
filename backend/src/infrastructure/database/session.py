"""Database session configuration."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


# Initialize SQLAlchemy with custom base
db = SQLAlchemy(model_class=Base)


def init_db(app: Flask) -> None:
    """Initialize database with Flask app.

    Args:
        app: Flask application
    """
    db.init_app(app)


def get_db_session():
    """Get database session.

    Returns:
        SQLAlchemy session
    """
    return db.session
