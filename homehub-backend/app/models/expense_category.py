from datetime import datetime
from sqlalchemy import ForeignKey, Integer, DateTime, func, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class ExpenseCategory(Base):
    __tablename__ = 'expense_categories'

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    home_id: Mapped[int] = mapped_column(
        ForeignKey('homes.id', onupdate='CASCADE', ondelete='CASCADE'),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    icon: Mapped[str] = mapped_column(
        String(50),
        nullable=True,
    )

    color: Mapped[str] = mapped_column(
        String(20),
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )