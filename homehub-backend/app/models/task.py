from datetime import datetime

from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel


class Task(BaseModel):
    __tablename__ = "tasks"

    home_id: Mapped[int] = mapped_column(
        ForeignKey("homes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    creator_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(180),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        default="medium",
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
    )

    due_at: Mapped[datetime] = mapped_column(
        DATETIME,
        nullable=True,
    )

    completed_at: Mapped[datetime] = mapped_column(
        DATETIME,
        nullable=True,
    )
