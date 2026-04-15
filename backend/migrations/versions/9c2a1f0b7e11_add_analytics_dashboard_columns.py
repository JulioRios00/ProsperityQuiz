"""add analytics dashboard columns

Revision ID: 9c2a1f0b7e11
Revises: 4b7c0eaa2bb4
Create Date: 2026-04-15 12:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9c2a1f0b7e11"
down_revision = "4b7c0eaa2bb4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "analytics_events",
        sa.Column("quiz_variant", sa.String(length=20), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("screen_id", sa.String(length=64), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("event_value_text", sa.Text(), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("time_on_screen", sa.Integer(), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("device", sa.String(length=30), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("browser", sa.String(length=30), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("utm_source", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "analytics_events",
        sa.Column("utm_campaign", sa.String(length=160), nullable=True),
    )

    op.create_index(
        op.f("ix_analytics_events_quiz_variant"),
        "analytics_events",
        ["quiz_variant"],
        unique=False,
    )
    op.create_index(
        op.f("ix_analytics_events_screen_id"),
        "analytics_events",
        ["screen_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_analytics_events_device"),
        "analytics_events",
        ["device"],
        unique=False,
    )
    op.create_index(
        op.f("ix_analytics_events_browser"),
        "analytics_events",
        ["browser"],
        unique=False,
    )
    op.create_index(
        op.f("ix_analytics_events_utm_source"),
        "analytics_events",
        ["utm_source"],
        unique=False,
    )
    op.create_index(
        op.f("ix_analytics_events_utm_campaign"),
        "analytics_events",
        ["utm_campaign"],
        unique=False,
    )

    op.execute(
        """
        UPDATE analytics_events
        SET quiz_variant = COALESCE(quiz_variant, 'default')
        """
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_analytics_events_utm_campaign"),
        table_name="analytics_events",
    )
    op.drop_index(
        op.f("ix_analytics_events_utm_source"),
        table_name="analytics_events",
    )
    op.drop_index(
        op.f("ix_analytics_events_browser"),
        table_name="analytics_events",
    )
    op.drop_index(
        op.f("ix_analytics_events_device"),
        table_name="analytics_events",
    )
    op.drop_index(
        op.f("ix_analytics_events_screen_id"),
        table_name="analytics_events",
    )
    op.drop_index(
        op.f("ix_analytics_events_quiz_variant"),
        table_name="analytics_events",
    )

    op.drop_column("analytics_events", "utm_campaign")
    op.drop_column("analytics_events", "utm_source")
    op.drop_column("analytics_events", "browser")
    op.drop_column("analytics_events", "device")
    op.drop_column("analytics_events", "time_on_screen")
    op.drop_column("analytics_events", "event_value_text")
    op.drop_column("analytics_events", "screen_id")
    op.drop_column("analytics_events", "quiz_variant")
