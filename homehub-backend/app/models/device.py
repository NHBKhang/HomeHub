from typing import Any
from sqlalchemy import Boolean, String, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel


class Device(BaseModel):
    __tablename__ = "devices"

    home_id: Mapped[int] = mapped_column(
        ForeignKey("homes.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    room_id: Mapped[int] = mapped_column(
        ForeignKey("rooms.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=True,
    )

    name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
        index=True
    )

    device_type: Mapped[str] = mapped_column(
        String(40),
        nullable=False,
        index=True
    )

    manufacturer: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    model: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    connection_type: Mapped[str] = mapped_column(
        String(45),
        nullable=True,
    )

    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    is_online: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    settings: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )
