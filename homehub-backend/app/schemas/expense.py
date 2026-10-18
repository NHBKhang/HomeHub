from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class ExpenseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    category: str = Field(min_length=1, max_length=60)
    note: str | None = None


class ExpenseRead(BaseModel):
    id: int
    title: str
    amount: Decimal
    category: str
    note: str | None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
