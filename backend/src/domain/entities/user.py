"""User domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class UserEntity:
    email: str
    password_hash: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    name: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    is_active: bool = True
    email_verified: bool = False
