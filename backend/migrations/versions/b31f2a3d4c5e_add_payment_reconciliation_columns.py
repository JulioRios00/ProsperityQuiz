"""add payment reconciliation columns

Revision ID: b31f2a3d4c5e
Revises: 9c2a1f0b7e11
Create Date: 2026-04-26 10:15:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b31f2a3d4c5e"
down_revision = "9c2a1f0b7e11"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "payment_events",
        sa.Column("journey_id", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "payment_events",
        sa.Column("session_id", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "payment_events",
        sa.Column("quiz_variant", sa.String(length=20), nullable=True),
    )
    op.add_column(
        "payment_events",
        sa.Column("utm_source", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "payment_events",
        sa.Column("customer_email", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "payment_events",
        sa.Column("raw_payload", sa.JSON(), nullable=True),
    )
    op.add_column(
        "payment_events",
        sa.Column("updated_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_index(
        op.f("ix_payment_events_journey_id"),
        "payment_events",
        ["journey_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_payment_events_session_id"),
        "payment_events",
        ["session_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_payment_events_quiz_variant"),
        "payment_events",
        ["quiz_variant"],
        unique=False,
    )
    op.create_index(
        op.f("ix_payment_events_utm_source"),
        "payment_events",
        ["utm_source"],
        unique=False,
    )
    op.create_index(
        op.f("ix_payment_events_customer_email"),
        "payment_events",
        ["customer_email"],
        unique=False,
    )
    op.create_index(
        "ix_payment_events_provider_transaction_id",
        "payment_events",
        ["provider", "provider_transaction_id"],
        unique=False,
    )

    op.execute(
        """
        UPDATE payment_events
        SET updated_at = COALESCE(updated_at, created_at)
        """
    )


def downgrade() -> None:
    op.drop_index(
        "ix_payment_events_provider_transaction_id",
        table_name="payment_events",
    )
    op.drop_index(
        op.f("ix_payment_events_customer_email"),
        table_name="payment_events",
    )
    op.drop_index(
        op.f("ix_payment_events_utm_source"),
        table_name="payment_events",
    )
    op.drop_index(
        op.f("ix_payment_events_quiz_variant"),
        table_name="payment_events",
    )
    op.drop_index(
        op.f("ix_payment_events_session_id"),
        table_name="payment_events",
    )
    op.drop_index(
        op.f("ix_payment_events_journey_id"),
        table_name="payment_events",
    )

    op.drop_column("payment_events", "updated_at")
    op.drop_column("payment_events", "raw_payload")
    op.drop_column("payment_events", "customer_email")
    op.drop_column("payment_events", "utm_source")
    op.drop_column("payment_events", "quiz_variant")
    op.drop_column("payment_events", "session_id")
    op.drop_column("payment_events", "journey_id")
