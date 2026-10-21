from sqlalchemy import Boolean, Column, String
from app.models.base_model import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    username = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(
        String(255),
        nullable=False,
    )

    first_name = Column(
        String(100),
        nullable=True,
    )

    last_name = Column(
        String(100),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_superuser = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    @property
    def full_name(self) -> str:
        return f"{self.last_name or ''} {self.first_name or ''}".strip()
