"""Authentication use cases: register and login."""
from dataclasses import dataclass
from typing import Optional

import bcrypt

from ...domain.entities.user import UserEntity
from ...domain.value_objects.email import Email
from ...shared.exceptions import EmailAlreadyExists, InvalidCredentials
from ..interfaces.repositories import UserRepository


@dataclass
class RegisterInput:
    email: str
    password: str
    name: Optional[str] = None


@dataclass
class RegisterOutput:
    user: UserEntity


@dataclass
class LoginInput:
    email: str
    password: str


@dataclass
class LoginOutput:
    user: UserEntity


class RegisterUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, input_dto: RegisterInput) -> RegisterOutput:
        email = Email(input_dto.email)

        if self.user_repository.find_by_email(str(email)):
            raise EmailAlreadyExists(f"Email já cadastrado: {email}")

        password_hash = bcrypt.hashpw(
            input_dto.password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        user = UserEntity(
            email=str(email),
            password_hash=password_hash,
            name=input_dto.name,
        )
        saved = self.user_repository.save(user)
        return RegisterOutput(user=saved)


class LoginUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, input_dto: LoginInput) -> LoginOutput:
        email = Email(input_dto.email)
        user = self.user_repository.find_by_email(str(email))

        if not user or not user.is_active:
            raise InvalidCredentials("Email ou senha inválidos")

        if not bcrypt.checkpw(
            input_dto.password.encode("utf-8"), user.password_hash.encode("utf-8")
        ):
            raise InvalidCredentials("Email ou senha inválidos")

        return LoginOutput(user=user)
