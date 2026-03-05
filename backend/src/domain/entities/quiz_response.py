"""Quiz response domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
import uuid


@dataclass
class QuizResponseEntity:
    session_token: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    user_id: Optional[uuid.UUID] = None
    current_step: int = 0
    responses: Dict[str, Any] = field(default_factory=dict)
    is_completed: bool = False
    started_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def get_age_range(self) -> Optional[str]:
        return self.responses.get("step_1")

    def get_blocked_area(self) -> Optional[str]:
        return self.responses.get("step_2")

    def get_signs(self) -> List[str]:
        signs = self.responses.get("step_8", [])
        return signs if isinstance(signs, list) else []

    def get_blockage_level(self) -> int:
        level = self.responses.get("step_9", 3)
        try:
            return max(1, min(5, int(level)))
        except (ValueError, TypeError):
            return 3
