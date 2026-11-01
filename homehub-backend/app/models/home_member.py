from datetime import datetime
from sqlalchemy import ForeignKey, Integer, DateTime, func, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class HomeMember(Base):
    __tablename__ = "home_members"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    home_id: Mapped[int] = mapped_column(
        ForeignKey("homes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    join_date: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
