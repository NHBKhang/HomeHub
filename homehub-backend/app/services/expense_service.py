from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate


class ExpenseService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100):
        query = select(Expense).order_by(Expense.id.desc()).offset(skip).limit(limit)
        return self.db.scalars(query).all()

    def create(self, data: ExpenseCreate):
        expense = Expense(**data.model_dump())
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def summary(self):
        total = self.db.scalar(select(func.coalesce(func.sum(Expense.amount), 0)))
        count = self.db.scalar(select(func.count(Expense.id)))
        return {"total_amount": total, "expense_count": count}

    def get(self, expense_id: int):
        return self.db.get(Expense, expense_id)

    def delete(self, expense: Expense):
        self.db.delete(expense)
        self.db.commit()
