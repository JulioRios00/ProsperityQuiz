"""Email value object."""
import re


class Email:
    _pattern = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

    def __init__(self, value: str):
        cleaned = value.lower().strip()
        if not self._pattern.match(cleaned):
            raise ValueError(f"Email inválido: {value}")
        self.value = cleaned

    def __str__(self) -> str:
        return self.value

    def __repr__(self) -> str:
        return f"Email({self.value!r})"

    def __eq__(self, other) -> bool:
        if isinstance(other, Email):
            return self.value == other.value
        return self.value == str(other)

    def __hash__(self) -> int:
        return hash(self.value)
