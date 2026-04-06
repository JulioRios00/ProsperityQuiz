"""Analytics event tracking routes."""
from datetime import datetime

from flask import request, jsonify

from .. import api_v1_bp
from .....infrastructure.database.models import AnalyticsEvent
from .....infrastructure.database.session import db


@api_v1_bp.route("/analytics/event", methods=["POST"])
def track_event():
    """Track a single analytics event."""
    data = request.get_json(silent=True) or {}
    _save_event(data)
    db.session.commit()
    return jsonify({"ok": True}), 201


@api_v1_bp.route("/analytics/events", methods=["POST"])
def track_events():
    """Track a batch of analytics events."""
    events = request.get_json(silent=True) or []
    if not isinstance(events, list):
        events = [events]
    for data in events:
        _save_event(data)
    db.session.commit()
    return jsonify({"ok": True, "count": len(events)}), 201


def _save_event(data: dict) -> None:
    event = AnalyticsEvent(
        session_id=data.get("session_id"),
        event_type=data.get("event_type", "unknown"),
        event_data={
            "screen_id": data.get("screen_id"),
            "event_value": data.get("event_value"),
            "time_on_screen": data.get("time_on_screen"),
            "device": data.get("device"),
            "browser": data.get("browser"),
            "utm_source": data.get("utm_source"),
            "utm_medium": data.get("utm_medium"),
            "utm_campaign": data.get("utm_campaign"),
            "utm_content": data.get("utm_content"),
            "utm_term": data.get("utm_term"),
            "timestamp": data.get("timestamp", datetime.utcnow().isoformat()),
        },
    )
    db.session.add(event)
