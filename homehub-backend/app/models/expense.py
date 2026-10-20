from decimal import Decimal

from sqlalchemy import Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel


class Expense(BaseModel):
    __tablename__ = "expenses"

    title: Mapped[str] = mapped_column(String(180), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
