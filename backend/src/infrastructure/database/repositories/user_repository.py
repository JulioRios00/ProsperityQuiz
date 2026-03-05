"""SQLAlchemy implementation of UserRepository."""
from datetime import datetime
from typing import Optional
import uuid

from ....application.interfaces.repositories import UserRepository
from ....domain.entities.user import UserEntity
from ..models import User
from ..session import db


class SQLAlchemyUserRepository(UserRepository):
    def save(self, user: UserEntity) -> UserEntity:
        model = User(
            id=user.id,
            email=user.email,
            password_hash=user.password_hash,
            name=user.name,
            is_active=user.is_active,
            email_verified=user.email_verified,
        )
        db.session.add(model)
        db.session.commit()
        db.session.refresh(model)
        return self._to_entity(model)

    def find_by_email(self, email: str) -> Optional[UserEntity]:
        model = User.query.filter_by(email=email).first()
        return self._to_entity(model) if model else None

    def find_by_id(self, user_id: uuid.UUID) -> Optional[UserEntity]:
        model = db.session.get(User, user_id)
        return self._to_entity(model) if model else None

    def update(self, user: UserEntity) -> UserEntity:
        model = db.session.get(User, user.id)
        if not model:
            raise ValueError(f"User not found: {user.id}")
        model.name = user.name
        model.is_active = user.is_active
        model.email_verified = user.email_verified
        model.last_login = user.last_login
        model.updated_at = datetime.utcnow()
        db.session.commit()
        db.session.refresh(model)
        return self._to_entity(model)

    @staticmethod
    def _to_entity(model: User) -> UserEntity:
        return UserEntity(
            id=model.id,
            email=model.email,
            password_hash=model.password_hash,
            name=model.name,
            created_at=model.created_at,
            updated_at=model.updated_at,
            last_login=model.last_login,
            is_active=model.is_active,
            email_verified=model.email_verified,
        )
