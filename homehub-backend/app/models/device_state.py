from datetime import datetime
from typing import Any
from sqlalchemy import ForeignKey, Integer, DateTime, func, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class DeviceState(Base):
    __tablename__ = "device_states"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    device_id: Mapped[int] = mapped_column(
        ForeignKey('devices.id', ondelete='CASCADE'),
        index=True,
        nullable=False,
    )

    state: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )

    record_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
