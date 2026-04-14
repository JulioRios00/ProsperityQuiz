"""Analytics event tracking routes."""
import json
from collections import Counter
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


@api_v1_bp.route("/analytics/funnel", methods=["GET"])
def get_funnel_metrics():
    """Return aggregated analytics metrics for a simple dashboard."""
    limit = request.args.get("limit", default=5000, type=int)
    if limit <= 0:
        limit = 5000
    limit = min(limit, 10000)

    recent_limit = request.args.get("recent", default=30, type=int)
    if recent_limit <= 0:
        recent_limit = 30
    recent_limit = min(recent_limit, 100)

    variant_filter = request.args.get("variant", default="all", type=str)
    variant_filter = (variant_filter or "all").strip().lower()
    if variant_filter not in {"all", "a", "b", "default"}:
        variant_filter = "all"

    events = (
        AnalyticsEvent.query
        .order_by(AnalyticsEvent.created_at.desc())
        .limit(limit)
        .all()
    )

    events_by_type = Counter()
    devices = Counter()
    browsers = Counter()
    utm_sources = Counter()
    variants = Counter()
    answers_by_screen = Counter()
    screens_loaded = Counter()
    screen_time_totals = Counter()
    screen_time_counts = Counter()
    sessions = set()
    filtered_events = []

    session_variant_map = {}
    for event in events:
        data = event.event_data or {}
        explicit_variant = _normalize_variant(data.get("quiz_variant"))
        inferred_variant = _infer_variant_from_event(event.event_type, data)
        resolved_variant = explicit_variant
        if resolved_variant == "default" and inferred_variant in {"a", "b"}:
            resolved_variant = inferred_variant

        if event.session_id and resolved_variant in {"a", "b"}:
            session_variant_map[event.session_id] = resolved_variant

    for event in events:
        data = event.event_data or {}
        explicit_variant = _normalize_variant(data.get("quiz_variant"))
        inferred_variant = _infer_variant_from_event(event.event_type, data)

        quiz_variant = explicit_variant
        if quiz_variant == "default" and inferred_variant in {"a", "b"}:
            quiz_variant = inferred_variant
        if (
            quiz_variant == "default"
            and event.session_id in session_variant_map
        ):
            quiz_variant = session_variant_map[event.session_id]

        if variant_filter != "all" and quiz_variant != variant_filter:
            continue

        filtered_events.append(event)
        event_type = event.event_type or "unknown"
        screen_id = data.get("screen_id")
        device = data.get("device")
        browser = data.get("browser")
        utm_source = data.get("utm_source")
        time_on_screen = data.get("time_on_screen")
        event_value = data.get("event_value")

        events_by_type[event_type] += 1
        variants[quiz_variant] += 1

        if event.session_id:
            sessions.add(event.session_id)

        if device:
            devices[str(device)] += 1
        if browser:
            browsers[str(browser)] += 1
        if utm_source:
            utm_sources[str(utm_source)] += 1

        if event_type == "screen_loaded":
            screens_loaded[str(screen_id)] += 1

        if (
            event_type == "screen_time"
            and screen_id is not None
            and isinstance(time_on_screen, (int, float))
        ):
            key = str(screen_id)
            screen_time_totals[key] += float(time_on_screen)
            screen_time_counts[key] += 1

        if (
            event_type == "answer"
            and screen_id is not None
            and event_value is not None
        ):
            if isinstance(event_value, (dict, list)):
                normalized_value = json.dumps(event_value, ensure_ascii=False)
            else:
                normalized_value = str(event_value)
            answers_by_screen[(str(screen_id), normalized_value)] += 1

    screen_metrics = []
    screen_ids = set(
        list(screens_loaded.keys()) + list(screen_time_totals.keys())
    )
    for sid in sorted(screen_ids, key=lambda x: str(x)):
        avg_time = 0.0
        if screen_time_counts[sid] > 0:
            avg_time = round(
                screen_time_totals[sid] / screen_time_counts[sid],
                2,
            )
        screen_metrics.append({
            "screen_id": sid,
            "loads": screens_loaded[sid],
            "avg_time_on_screen": avg_time,
        })

    top_answers = [
        {"screen_id": sid, "value": value, "count": count}
        for (sid, value), count in answers_by_screen.most_common(20)
    ]

    recent_events = []
    for event in filtered_events[:recent_limit]:
        data = event.event_data or {}
        recent_events.append({
            "id": str(event.id),
            "created_at": (
                event.created_at.isoformat()
                if event.created_at else None
            ),
            "session_id": event.session_id,
            "event_type": event.event_type,
            "screen_id": data.get("screen_id"),
            "event_value": data.get("event_value"),
            "time_on_screen": data.get("time_on_screen"),
            "device": data.get("device"),
            "browser": data.get("browser"),
            "utm_source": data.get("utm_source"),
            "quiz_variant": quiz_variant,
        })

    return jsonify({
        "summary": {
            "events_analyzed": len(filtered_events),
            "sessions": len(sessions),
            "emails_submitted": events_by_type.get("email_submitted", 0),
            "answers": events_by_type.get("answer", 0),
            "screen_loaded": events_by_type.get("screen_loaded", 0),
            "screen_time": events_by_type.get("screen_time", 0),
        },
        "active_variant_filter": variant_filter,
        "events_by_type": [
            {"event_type": event_type, "count": count}
            for event_type, count in events_by_type.most_common()
        ],
        "variants": [
            {"quiz_variant": name, "count": count}
            for name, count in variants.most_common()
        ],
        "devices": [
            {"device": name, "count": count}
            for name, count in devices.most_common()
        ],
        "browsers": [
            {"browser": name, "count": count}
            for name, count in browsers.most_common()
        ],
        "utm_sources": [
            {"utm_source": name, "count": count}
            for name, count in utm_sources.most_common()
        ],
        "screens": screen_metrics,
        "top_answers": top_answers,
        "recent_events": recent_events,
    }), 200


def _save_event(data: dict) -> None:
    ua = request.headers.get("User-Agent", "")
    inferred_device, inferred_browser = _infer_from_user_agent(ua)

    normalized_device = _normalize_device(data.get("device"))
    normalized_browser = _normalize_browser(data.get("browser"))

    resolved_device = inferred_device or normalized_device
    resolved_browser = inferred_browser or normalized_browser

    event = AnalyticsEvent(
        session_id=data.get("session_id"),
        event_type=data.get("event_type", "unknown"),
        event_data={
            "screen_id": data.get("screen_id"),
            "quiz_variant": data.get("quiz_variant") or "default",
            "event_value": data.get("event_value"),
            "time_on_screen": data.get("time_on_screen"),
            "device": resolved_device,
            "browser": resolved_browser,
            "utm_source": data.get("utm_source"),
            "utm_medium": data.get("utm_medium"),
            "utm_campaign": data.get("utm_campaign"),
            "utm_content": data.get("utm_content"),
            "utm_term": data.get("utm_term"),
            "timestamp": data.get("timestamp", datetime.utcnow().isoformat()),
        },
    )
    db.session.add(event)


def _normalize_variant(value) -> str:
    normalized = str(value or "default").strip().lower()
    if normalized in {"a", "b", "default"}:
        return normalized
    return "default"


def _infer_variant_from_event(event_type: str, data: dict) -> str:
    screen_id = str(data.get("screen_id") or "").strip().lower()
    event_value = str(data.get("event_value") or "").strip().lower()

    if (
        event_type in {"page_loaded", "cta_click"}
        and screen_id == "prelanding"
    ):
        if event_value in {"a", "b"}:
            return event_value

    return "default"


def _normalize_device(value) -> str | None:
    normalized = str(value or "").strip().lower()
    if normalized in {"mobile", "tablet", "desktop"}:
        return normalized
    return None


def _normalize_browser(value) -> str | None:
    normalized = str(value or "").strip().lower()
    if normalized in {
        "chrome", "safari", "firefox", "edge", "opera",
        "samsung", "in_app", "other",
    }:
        return normalized
    return None


def _infer_from_user_agent(user_agent: str) -> tuple[str | None, str | None]:
    ua = (user_agent or "").lower()
    if not ua:
        return None, None

    is_ipad_os_desktop_ua = "macintosh" in ua and "mobile" in ua

    device = "desktop"
    if (
        "ipad" in ua
        or "tablet" in ua
        or "nexus 7" in ua
        or "nexus 10" in ua
        or "silk" in ua
        or is_ipad_os_desktop_ua
    ):
        device = "tablet"
    elif (
        "mobile" in ua
        or "mobi" in ua
        or "iphone" in ua
        or "ipod" in ua
        or "iemobile" in ua
        or "opera mini" in ua
    ):
        device = "mobile"
    elif "android" in ua and "mobile" not in ua:
        device = "tablet"

    browser = "other"
    if "fban" in ua or "fbav" in ua or "instagram" in ua:
        browser = "in_app"
    elif "edga" in ua or "edgios" in ua or "edg/" in ua:
        browser = "edge"
    elif "opr" in ua or "opera" in ua:
        browser = "opera"
    elif "samsungbrowser" in ua:
        browser = "samsung"
    elif "crios" in ua or "chrome" in ua:
        browser = "chrome"
    elif "fxios" in ua or "firefox" in ua:
        browser = "firefox"
    elif (
        "safari" in ua
        and "crios" not in ua
        and "chrome" not in ua
        and "chromium" not in ua
        and "edg" not in ua
        and "opr" not in ua
        and "samsungbrowser" not in ua
    ):
        browser = "safari"

    return device, browser
