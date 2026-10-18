from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter()


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(data: TaskCreate, db: Session = Depends(get_db)):
    return TaskService(db).create(data)


@router.get("/", response_model=list[TaskRead])
def list_tasks(is_completed: bool | None = None, db: Session = Depends(get_db)):
    return TaskService(db).list(is_completed=is_completed)


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db)):
    service = TaskService(db)
    task = service.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")
    return service.update(task, data)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    task = service.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc")
    service.delete(task)
