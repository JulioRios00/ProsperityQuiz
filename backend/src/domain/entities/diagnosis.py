"""Diagnosis domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class DiagnosisEntity:
    session_id: uuid.UUID
    diagnosis_text: str
    favorable_days: int
    blocked_area: str
    blockage_level: int
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    user_id: Optional[uuid.UUID] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
