"""Database models."""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Boolean, Integer, Text, DECIMAL, TIMESTAMP, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from .session import db


class User(db.Model):
    """User model."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"<User {self.email}>"


class QuizSession(db.Model):
    """Quiz session model."""

    __tablename__ = "quiz_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), index=True)
    session_token: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    current_step: Mapped[int] = mapped_column(Integer, default=0)
    started_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    responses: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<QuizSession {self.session_token}>"


class Diagnosis(db.Model):
    """Diagnosis model."""

    __tablename__ = "diagnoses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), index=True)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), db.ForeignKey("quiz_sessions.id", ondelete="CASCADE"), index=True)
    diagnosis_text: Mapped[str] = mapped_column(Text, nullable=False)
    favorable_days: Mapped[int] = mapped_column(Integer, nullable=False)
    blocked_area: Mapped[str] = mapped_column(String(50), nullable=False)
    blockage_level: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Diagnosis {self.id}>"


class EmailCapture(db.Model):
    """Email capture model."""

    __tablename__ = "email_captures"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    quiz_data: Mapped[dict] = mapped_column(JSON, default=dict)
    source: Mapped[str] = mapped_column(String(50), default="quiz")
    captured_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    converted_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)
    is_converted: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    def __repr__(self) -> str:
        return f"<EmailCapture {self.email}>"


class Subscription(db.Model):
    """Subscription model."""

    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # 'trial', 'active', 'canceled', 'expired'
    plan: Mapped[str] = mapped_column(String(50), nullable=False)  # 'trial', 'monthly'
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)
    current_period_start: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)
    current_period_end: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    canceled_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP)

    def __repr__(self) -> str:
        return f"<Subscription {self.id} - {self.status}>"


class PaymentEvent(db.Model):
    """Payment event model."""

    __tablename__ = "payment_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="SET NULL"), index=True)
    subscription_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), db.ForeignKey("subscriptions.id", ondelete="SET NULL"))
    amount: Mapped[float] = mapped_column(DECIMAL(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="BRL")
    status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # 'pending', 'completed', 'failed', 'refunded'
    provider: Mapped[str] = mapped_column(String(50), nullable=False)  # 'kiwify', 'stripe', etc.
    provider_transaction_id: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<PaymentEvent {self.id} - {self.status}>"


class AnalyticsEvent(db.Model):
    """Analytics event model."""

    __tablename__ = "analytics_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    session_id: Mapped[Optional[str]] = mapped_column(String(255))
    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    quiz_variant: Mapped[str] = mapped_column(
        String(20),
        default="default",
        index=True,
    )
    screen_id: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    event_value_text: Mapped[Optional[str]] = mapped_column(Text)
    time_on_screen: Mapped[Optional[int]] = mapped_column(Integer)
    device: Mapped[Optional[str]] = mapped_column(String(30), index=True)
    browser: Mapped[Optional[str]] = mapped_column(String(30), index=True)
    utm_source: Mapped[Optional[str]] = mapped_column(String(120), index=True)
    utm_campaign: Mapped[Optional[str]] = mapped_column(
        String(160),
        index=True,
    )
    event_data: Mapped[dict] = mapped_column(JSON, default=dict)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        default=datetime.utcnow,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<AnalyticsEvent {self.event_type}>"
