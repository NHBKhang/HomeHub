from decimal import Decimal

from sqlalchemy import Numeric, String, Text, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel


class Expense(BaseModel):
    __tablename__ = "expenses"

    home_id: Mapped[int] = mapped_column(
        ForeignKey("homes.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    creator_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    category_id: Mapped[str] = mapped_column(
        ForeignKey("expense_categories.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    amount: Mapped[float | int] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    transaction_date: Mapped[Date] = mapped_column(
        Date,
        nullable=True,
    )

    payment_method: Mapped[str] = mapped_column(
        String(30),
        nullable=True,
    )

    note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

