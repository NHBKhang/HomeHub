from datetime import datetime

from sqlalchemy import ForeignKey, Float
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel


class Budget(BaseModel):
    __tablename__ = "budgets"

    home_id: Mapped[int] = mapped_column(
        ForeignKey("homes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("expense_categories.id", ondelete="CASCADE"),
        nullable=True,
    )

    period_start: Mapped[datetime] = mapped_column(
        DATETIME,
        nullable=False,
    )

    period_end: Mapped[datetime] = mapped_column(
        DATETIME,
        nullable=False,
    )

    amount: Mapped[float | int] = mapped_column(
        Float,
        nullable=False,
    )