"""API v1 Blueprint."""
from flask import Blueprint

# Create blueprint
api_v1_bp = Blueprint("api_v1", __name__)

# Import routes to register them
from .routes import health  # noqa: F401, E402
from .routes import auth  # noqa: F401, E402
from .routes import quiz  # noqa: F401, E402
from .routes import diagnosis  # noqa: F401, E402
from .routes import analytics  # noqa: F401, E402
from .routes import payments  # noqa: F401, E402
