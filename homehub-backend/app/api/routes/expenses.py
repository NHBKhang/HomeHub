from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.expense import ExpenseCreate, ExpenseRead
from app.services.expense_service import ExpenseService

router = APIRouter()


@router.post("/", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
def create_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    return ExpenseService(db).create(data)


@router.get("/", response_model=list[ExpenseRead])
def list_expenses(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return ExpenseService(db).list(skip=skip, limit=limit)


@router.get("/summary")
def expense_summary(db: Session = Depends(get_db)):
    return ExpenseService(db).summary()


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    service = ExpenseService(db)
    expense = service.get(expense_id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khoản chi")
    service.delete(expense)
