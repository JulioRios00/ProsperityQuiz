"""Custom exceptions."""


class QuizFunnelException(Exception):
    """Base exception for Quiz Funnel application."""
    pass


class QuizSessionNotFound(QuizFunnelException):
    """Raised when quiz session is not found."""
    pass


class UserNotFound(QuizFunnelException):
    """Raised when user is not found."""
    pass


class InvalidCredentials(QuizFunnelException):
    """Raised when credentials are invalid."""
    pass


class EmailAlreadyExists(QuizFunnelException):
    """Raised when email already exists."""
    pass


class SubscriptionNotFound(QuizFunnelException):
    """Raised when subscription is not found."""
    pass
