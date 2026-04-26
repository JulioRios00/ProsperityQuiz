"""Payment webhooks and reconciliation events."""

from __future__ import annotations

import hashlib
import hmac
from datetime import UTC
from datetime import datetime
from typing import Any
from urllib.parse import parse_qs, urlparse

from flask import jsonify, request

from .. import api_v1_bp
from .....config import get_config
from .....infrastructure.database.models import AnalyticsEvent, PaymentEvent
from .....infrastructure.database.session import db

APPROVED_STATUSES = {
    "approved",
    "paid",
    "completed",
    "complete",
    "confirmed",
    "success",
    "authorized",
    "billet_paid",
}


def _deep_get(payload: dict[str, Any], *keys: str) -> Any:
    current: Any = payload
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def _first_non_empty(*values: Any) -> str | None:
    for value in values:
        if value is None:
            continue
        normalized = str(value).strip()
        if normalized:
            return normalized
    return None


def _first_non_empty_float(*values: Any) -> float | None:
    for value in values:
        if value is None:
            continue
        try:
            return float(str(value).replace(",", "."))
        except ValueError:
            continue
    return None


def _normalize_provider(provider: str) -> str:
    normalized = str(provider or "").strip().lower()
    if normalized in {"kiwify", "hotmart"}:
        return normalized
    return "unknown"


def _normalize_status(value: Any) -> str:
    return str(value or "unknown").strip().lower()


def _is_paid_status(status: str) -> bool:
    return status in APPROVED_STATUSES


def _extract_event_payload(payload: dict[str, Any]) -> dict[str, Any]:
    data = payload.get("data")
    if isinstance(data, dict):
        return data
    return payload


def _to_key(name: Any) -> str:
    return str(name or "").strip().lower()


def _extract_custom_parameters(payload: dict[str, Any]) -> dict[str, str]:
    custom = _deep_get(payload, "custom_parameters")
    if custom is None:
        custom = _deep_get(payload, "metadata")
    if custom is None:
        custom = _deep_get(payload, "tracking")

    normalized: dict[str, str] = {}
    if isinstance(custom, dict):
        for key, value in custom.items():
            if value is None:
                continue
            clean_key = _to_key(key)
            clean_value = str(value).strip()
            if clean_key and clean_value:
                normalized[clean_key] = clean_value
        return normalized

    if not isinstance(custom, list):
        return normalized

    for item in custom:
        if not isinstance(item, dict):
            continue
        key = _to_key(
            _first_non_empty(
                item.get("name"),
                item.get("key"),
                item.get("field"),
            )
        )
        value = _first_non_empty(item.get("value"), item.get("content"))
        if key and value:
            normalized[key] = value

    return normalized


def _extract_query_params(payload: dict[str, Any]) -> dict[str, str]:
    urls = [
        _first_non_empty(payload.get("checkout_url")),
        _first_non_empty(payload.get("payment_url")),
        _first_non_empty(payload.get("invoice_url")),
        _first_non_empty(_deep_get(payload, "purchase", "checkout_url")),
        _first_non_empty(_deep_get(payload, "purchase", "checkoutLink")),
        _first_non_empty(_deep_get(payload, "order", "checkout_url")),
    ]

    params: dict[str, str] = {}
    for url in urls:
        if not url:
            continue
        parsed = urlparse(url)
        query_dict = parse_qs(parsed.query)
        for key, values in query_dict.items():
            if not values:
                continue
            normalized_key = _to_key(key)
            normalized_value = str(values[0]).strip()
            if normalized_key and normalized_value:
                params[normalized_key] = normalized_value

    return params


def _extract_tracking_fields(payload: dict[str, Any]) -> dict[str, str | None]:
    custom = _extract_custom_parameters(payload)
    query_params = _extract_query_params(payload)

    journey_id = _first_non_empty(
        payload.get("journey_id"),
        _deep_get(payload, "tracking", "journey_id"),
        _deep_get(payload, "metadata", "journey_id"),
        custom.get("journey_id"),
        query_params.get("journey_id"),
    )
    session_id = _first_non_empty(
        payload.get("session_id"),
        _deep_get(payload, "tracking", "session_id"),
        _deep_get(payload, "metadata", "session_id"),
        custom.get("session_id"),
        query_params.get("session_id"),
    )
    quiz_variant = _first_non_empty(
        payload.get("quiz_variant"),
        _deep_get(payload, "tracking", "quiz_variant"),
        _deep_get(payload, "metadata", "quiz_variant"),
        custom.get("quiz_variant"),
        query_params.get("quiz_variant"),
    )
    utm_source = _first_non_empty(
        payload.get("utm_source"),
        _deep_get(payload, "tracking", "utm_source"),
        _deep_get(payload, "utm", "source"),
        custom.get("utm_source"),
        query_params.get("utm_source"),
    )

    return {
        "journey_id": journey_id,
        "session_id": session_id,
        "quiz_variant": quiz_variant,
        "utm_source": utm_source,
    }


def _extract_hotmart_fields(
    raw_payload: dict[str, Any],
) -> dict[str, Any]:
    payload = _extract_event_payload(raw_payload)
    tracking = _extract_tracking_fields(payload)

    transaction_id = _first_non_empty(
        _deep_get(payload, "purchase", "transaction"),
        _deep_get(payload, "purchase", "id"),
        payload.get("transaction"),
        payload.get("transaction_id"),
        payload.get("id"),
    )
    status = _normalize_status(
        _first_non_empty(
            _deep_get(payload, "purchase", "status"),
            payload.get("status"),
            raw_payload.get("event"),
        )
    )

    amount = _first_non_empty_float(
        _deep_get(payload, "purchase", "price", "value"),
        _deep_get(payload, "purchase", "price", "value_with_discount"),
        payload.get("amount"),
        payload.get("price"),
    )

    email = _first_non_empty(
        _deep_get(payload, "buyer", "email"),
        _deep_get(payload, "customer", "email"),
        payload.get("email"),
    )

    return {
        "provider": "hotmart",
        "transaction_id": transaction_id,
        "status": status,
        "amount": amount,
        "journey_id": tracking["journey_id"],
        "session_id": tracking["session_id"],
        "quiz_variant": tracking["quiz_variant"],
        "utm_source": tracking["utm_source"],
        "email": email,
        "raw_payload": raw_payload,
    }


def _extract_kiwify_fields(raw_payload: dict[str, Any]) -> dict[str, Any]:
    payload = _extract_event_payload(raw_payload)
    tracking = _extract_tracking_fields(payload)

    transaction_id = _first_non_empty(
        payload.get("transaction_id"),
        payload.get("order_id"),
        payload.get("purchase_id"),
        payload.get("id"),
        _deep_get(payload, "order", "id"),
    )
    status = _normalize_status(
        _first_non_empty(
            payload.get("status"),
            payload.get("order_status"),
            _deep_get(payload, "order", "status"),
            raw_payload.get("event"),
        )
    )
    amount = _first_non_empty_float(
        payload.get("amount"),
        payload.get("price"),
        payload.get("value"),
        _deep_get(payload, "order", "amount"),
        _deep_get(payload, "order", "value"),
    )

    email = _first_non_empty(
        _deep_get(payload, "customer", "email"),
        _deep_get(payload, "buyer", "email"),
        payload.get("email"),
    )

    return {
        "provider": "kiwify",
        "transaction_id": transaction_id,
        "status": status,
        "amount": amount,
        "journey_id": tracking["journey_id"],
        "session_id": tracking["session_id"],
        "quiz_variant": tracking["quiz_variant"],
        "utm_source": tracking["utm_source"],
        "email": email,
        "raw_payload": raw_payload,
    }


def _extract_common_fields(
    provider: str,
    raw_payload: dict[str, Any],
) -> dict[str, Any]:
    if provider == "hotmart":
        return _extract_hotmart_fields(raw_payload)
    return _extract_kiwify_fields(raw_payload)


def _extract_signature(headers: dict[str, str], key: str) -> str | None:
    value = _first_non_empty(headers.get(key))
    if not value:
        return None

    normalized = value.strip()
    if normalized.startswith("sha256="):
        return normalized.split("=", maxsplit=1)[1].strip()
    return normalized


def _validate_hmac_signature(secret: str, received: str) -> bool:
    raw_body = request.get_data(cache=True) or b""
    expected = hmac.new(
        secret.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(received, expected)


def _is_signature_valid(provider: str) -> bool:
    config = get_config()
    secret = None

    if provider == "kiwify":
        secret = getattr(config, "KIWIFY_WEBHOOK_SECRET", "")
    if provider == "hotmart":
        secret = getattr(config, "HOTMART_WEBHOOK_SECRET", "")

    if not secret:
        return True

    headers = {key: value for key, value in request.headers.items()}

    if provider == "hotmart":
        hotmart_token = _extract_signature(headers, "X-Hotmart-Hottok")
        if not hotmart_token:
            hotmart_token = _extract_signature(headers, "X-Hotmart-Token")
        return bool(
            hotmart_token
            and hmac.compare_digest(hotmart_token, secret)
        )

    kiwify_signature = _extract_signature(headers, "X-Kiwify-Signature")
    if not kiwify_signature:
        kiwify_signature = _extract_signature(headers, "X-Webhook-Signature")
    if not kiwify_signature:
        kiwify_signature = _extract_signature(headers, "X-Signature")

    if not kiwify_signature:
        return False

    if hmac.compare_digest(kiwify_signature, secret):
        return True

    return _validate_hmac_signature(secret, kiwify_signature)


def _save_payment_event(fields: dict[str, Any]) -> tuple[PaymentEvent, bool]:
    provider = fields["provider"]
    transaction_id = fields["transaction_id"]
    status = fields["status"]
    amount = fields["amount"] if fields["amount"] is not None else 0.0

    existing = None
    if transaction_id:
        existing = PaymentEvent.query.filter_by(
            provider=provider,
            provider_transaction_id=transaction_id,
        ).first()

    if existing:
        status_changed = existing.status != status
        existing.status = status
        existing.amount = amount
        existing.journey_id = fields["journey_id"]
        existing.session_id = fields["session_id"]
        existing.quiz_variant = fields["quiz_variant"]
        existing.utm_source = fields["utm_source"]
        existing.customer_email = fields["email"]
        existing.raw_payload = fields["raw_payload"]
        existing.updated_at = datetime.now(UTC)
        return existing, status_changed

    created = PaymentEvent(
        provider=provider,
        provider_transaction_id=transaction_id,
        amount=amount,
        status=status,
        currency="BRL",
        journey_id=fields["journey_id"],
        session_id=fields["session_id"],
        quiz_variant=fields["quiz_variant"],
        utm_source=fields["utm_source"],
        customer_email=fields["email"],
        raw_payload=fields["raw_payload"],
    )
    db.session.add(created)
    return created, True


def _save_purchase_analytics_event(fields: dict[str, Any]) -> None:
    event_data = {
        "journey_id": fields["journey_id"],
        "transaction_id": fields["transaction_id"],
        "quiz_variant": fields["quiz_variant"],
        "utm_source": fields["utm_source"],
        "amount": fields["amount"],
        "provider": fields["provider"],
        "status": fields["status"],
        "email": fields["email"],
        "raw_payload": fields["raw_payload"],
        "timestamp": datetime.utcnow().isoformat(),
    }

    analytics = AnalyticsEvent(
        session_id=fields["session_id"],
        event_type="purchase_confirmed",
        event_data=event_data,
    )
    db.session.add(analytics)


@api_v1_bp.route("/payments/webhook/<string:provider>", methods=["POST"])
def payment_webhook(provider: str):
    """Handle payment provider webhooks and emit purchase events."""
    normalized_provider = _normalize_provider(provider)
    if normalized_provider == "unknown":
        return jsonify({"message": "Provider não suportado."}), 400

    if not _is_signature_valid(normalized_provider):
        return jsonify({"message": "Assinatura inválida."}), 401

    payload = request.get_json(silent=True) or {}
    if not isinstance(payload, dict):
        return jsonify({"message": "Payload inválido."}), 400

    fields = _extract_common_fields(normalized_provider, payload)
    payment_event, changed = _save_payment_event(fields)

    should_emit_purchase = changed and _is_paid_status(fields["status"])
    if should_emit_purchase:
        _save_purchase_analytics_event(fields)

    db.session.commit()

    return jsonify({
        "ok": True,
        "provider": normalized_provider,
        "payment_event_id": str(payment_event.id),
        "purchase_tracked": should_emit_purchase,
        "transaction_id": fields["transaction_id"],
        "status": fields["status"],
    }), 200
