"""Analytics event tracking routes."""
import json
from collections import Counter, defaultdict
from datetime import datetime
from typing import Any

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
    """Return aggregated analytics metrics for dashboard."""
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

    total_steps = 44

    events_by_type = Counter()
    devices = Counter()
    browsers = Counter()
    utm_sources = Counter()
    variants = Counter()
    answers_by_screen = Counter()

    timeline_by_hour = {
        hour: {
            "hour": f"{hour:02d}:00",
            "visitors": 0,
            "responses": 0,
            "leads": 0,
        }
        for hour in range(24)
    }

    sessions = set()
    visitor_keys = set()
    response_keys = set()
    lead_keys = set()
    conclusion_keys = set()
    max_screen_by_session: dict[str, int] = {}
    screen_session_hits: dict[int, set[str]] = defaultdict(set)
    filtered_events = []

    # Build a session->variant map first so events that don't carry
    # quiz_variant explicitly can still be grouped/filterable by A/B.
    session_variant_map = {}
    for event in events:
        data = _event_data(event)
        explicit_variant = _normalize_variant(data.get("quiz_variant"))
        inferred_variant = _infer_variant_from_event(event.event_type, data)

        resolved_variant = explicit_variant
        if resolved_variant == "default" and inferred_variant in {"a", "b"}:
            resolved_variant = inferred_variant

        if event.session_id and resolved_variant in {"a", "b"}:
            session_variant_map[event.session_id] = resolved_variant

    for event in events:
        data = _event_data(event)
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
        screen_id = _coalesce_string(event.screen_id, data.get("screen_id"))
        screen_idx = _screen_to_index(screen_id, total_steps)
        device = _coalesce_string(event.device, data.get("device"))
        browser = _coalesce_string(event.browser, data.get("browser"))
        utm_source = _coalesce_string(event.utm_source, data.get("utm_source"))
        event_value = data.get("event_value")
        hour = event.created_at.hour if event.created_at else 0
        session_key = event.session_id or f"anon:{event.id}"

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

        if _is_visit_event(event_type, screen_idx):
            visitor_keys.add(session_key)
            timeline_by_hour[hour]["visitors"] += 1

        if event_type == "answer":
            response_keys.add(session_key)
            timeline_by_hour[hour]["responses"] += 1

        if event_type == "email_submitted":
            lead_keys.add(session_key)
            timeline_by_hour[hour]["leads"] += 1

        if event_type in {
            "checkout_click",
            "quiz_completed",
            "diagnosis_completed",
        }:
            conclusion_keys.add(session_key)

        if event.session_id and screen_idx is not None:
            if event_type == "screen_loaded":
                screen_session_hits[screen_idx].add(event.session_id)
            if event_type in {
                "screen_loaded",
                "answer",
                "email_submitted",
                "checkout_click",
            }:
                previous = max_screen_by_session.get(event.session_id, -1)
                max_screen_by_session[event.session_id] = max(
                    previous,
                    screen_idx,
                )

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

    visits = len(visitor_keys)
    responses_started = len(response_keys)
    leads_count = len(lead_keys)
    conclusions_count = len(conclusion_keys)
    completion_rate = _percent(conclusions_count, visits)
    interaction_rate = _percent(responses_started, visits)
    bounce_rate = round(max(0.0, 100.0 - interaction_rate), 1)

    average_steps = 0.0
    if max_screen_by_session:
        reached_steps = [index + 1 for index in max_screen_by_session.values()]
        average_steps = round(sum(reached_steps) / len(reached_steps), 1)

    baseline_screen_zero = len(screen_session_hits.get(0, set()))
    baseline = baseline_screen_zero or visits
    screen_retention = []
    for screen_index in range(total_steps):
        count = len(screen_session_hits.get(screen_index, set()))
        retention = _percent(count, baseline)
        screen_retention.append({
            "screen_index": screen_index,
            "label": f"T{screen_index}",
            "visitors": count,
            "retention_rate": retention,
        })

    top_answers = [
        {"screen_id": sid, "value": value, "count": count}
        for (sid, value), count in answers_by_screen.most_common(20)
    ]

    recent_events = []
    for event in filtered_events[:recent_limit]:
        data = _event_data(event)
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
        recent_events.append({
            "id": str(event.id),
            "created_at": (
                event.created_at.isoformat()
                if event.created_at else None
            ),
            "session_id": event.session_id,
            "event_type": event.event_type,
            "screen_id": _coalesce_string(
                event.screen_id,
                data.get("screen_id"),
            ),
            "event_value": data.get("event_value"),
            "time_on_screen": _safe_int(
                _coalesce_string(None, data.get("time_on_screen"))
            ),
            "device": _coalesce_string(event.device, data.get("device")),
            "browser": _coalesce_string(event.browser, data.get("browser")),
            "utm_source": _coalesce_string(
                event.utm_source,
                data.get("utm_source"),
            ),
            "quiz_variant": quiz_variant,
        })

    best_source = None
    if utm_sources:
        best_source = utm_sources.most_common(1)[0][0]

    return jsonify({
        "summary": {
            "events_analyzed": len(filtered_events),
            "sessions": len(sessions),
            "completion_rate": completion_rate,
            "visits": visits,
            "answers_started": responses_started,
            "average_steps": average_steps,
            "total_steps": total_steps,
            "leads_emails": leads_count,
            "total_conclusions": conclusions_count,
        },
        "performance": {
            "visitors": visits,
            "responses": responses_started,
            "leads": leads_count,
            "conclusions": conclusions_count,
            "completion_rate": completion_rate,
            "total_conclusions": conclusions_count,
        },
        "traffic": {
            "interaction_rate": interaction_rate,
            "bounce_rate": bounce_rate,
            "timeline": [timeline_by_hour[hour] for hour in range(24)],
        },
        "campaigns": {
            "total_tracked": sum(utm_sources.values()),
            "best_source": best_source,
            "sources": [
                {"utm_source": source, "count": count}
                for source, count in utm_sources.most_common()
            ],
        },
        "devices_summary": {
            "most_used": devices.most_common(1)[0][0] if devices else None,
            "total": sum(devices.values()),
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
        "screen_retention": screen_retention,
        "top_answers": top_answers,
        "recent_events": recent_events,
    }), 200


def _save_event(data: dict) -> None:
    ua = request.headers.get("User-Agent", "")
    inferred_device, inferred_browser = _infer_from_user_agent(ua)

    normalized_device = _normalize_device(data.get("device"))
    normalized_browser = _normalize_browser(data.get("browser"))
    normalized_utm_source = _normalize_utm_source(data.get("utm_source"))

    resolved_device = _resolve_device(normalized_device, inferred_device)
    resolved_browser = _resolve_browser(normalized_browser, inferred_browser)
    normalized_variant = _normalize_variant(data.get("quiz_variant"))
    inferred_variant = _infer_variant_from_event(
        data.get("event_type", "unknown"),
        data,
    )
    if normalized_variant == "default" and inferred_variant in {"a", "b"}:
        normalized_variant = inferred_variant

    screen_id = _coalesce_string(None, data.get("screen_id"))
    event_value_text = _stringify_event_value(data.get("event_value"))
    normalized_time_on_screen = _safe_int(data.get("time_on_screen"))
    normalized_utm_campaign = _normalize_campaign(data.get("utm_campaign"))

    event = AnalyticsEvent(
        session_id=data.get("session_id"),
        event_type=data.get("event_type", "unknown"),
        quiz_variant=normalized_variant,
        screen_id=screen_id,
        event_value_text=event_value_text,
        time_on_screen=normalized_time_on_screen,
        device=resolved_device,
        browser=resolved_browser,
        utm_source=normalized_utm_source,
        utm_campaign=normalized_utm_campaign,
        event_data={
            "screen_id": screen_id,
            "quiz_variant": normalized_variant,
            "event_value": data.get("event_value"),
            "time_on_screen": normalized_time_on_screen,
            "device": resolved_device,
            "browser": resolved_browser,
            "utm_source": normalized_utm_source,
            "utm_medium": data.get("utm_medium"),
            "utm_campaign": normalized_utm_campaign,
            "utm_content": data.get("utm_content"),
            "utm_term": data.get("utm_term"),
            "device_client": normalized_device,
            "device_ua": inferred_device,
            "browser_client": normalized_browser,
            "browser_ua": inferred_browser,
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


def _normalize_utm_source(value) -> str | None:
    normalized = str(value or "").strip().lower()
    if normalized:
        return normalized
    return None


def _normalize_campaign(value) -> str | None:
    normalized = str(value or "").strip().lower()
    if normalized:
        return normalized
    return None


def _event_data(event: AnalyticsEvent) -> dict[str, Any]:
    return event.event_data or {}


def _coalesce_string(primary, fallback) -> str | None:
    primary_value = str(primary or "").strip()
    if primary_value:
        return primary_value
    fallback_value = str(fallback or "").strip()
    if fallback_value:
        return fallback_value
    return None


def _safe_int(value) -> int | None:
    if value is None:
        return None
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _screen_to_index(screen_id: str | None, total_steps: int) -> int | None:
    if screen_id is None:
        return None
    try:
        raw = int(float(screen_id))
    except (TypeError, ValueError):
        return None

    if 0 <= raw < total_steps:
        return raw
    if 1 <= raw <= total_steps:
        return raw - 1
    return None


def _is_visit_event(event_type: str, screen_index: int | None) -> bool:
    if event_type == "page_loaded":
        return True
    if event_type == "screen_loaded" and screen_index in {0, 1}:
        return True
    return False


def _percent(value: int, total: int) -> float:
    if total <= 0:
        return 0.0
    return round((value / total) * 100, 1)


def _stringify_event_value(value) -> str | None:
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False)
    normalized = str(value).strip()
    if normalized:
        return normalized
    return None


def _resolve_device(
    normalized_device: str | None,
    inferred_device: str | None,
) -> str | None:
    # Prefer explicit frontend classification, fallback to UA.
    return normalized_device or inferred_device


def _resolve_browser(
    normalized_browser: str | None,
    inferred_browser: str | None,
) -> str | None:
    # Use whichever source is more specific first; keep "other" as last resort.
    if normalized_browser and normalized_browser != "other":
        return normalized_browser
    if inferred_browser and inferred_browser != "other":
        return inferred_browser
    return normalized_browser or inferred_browser


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
