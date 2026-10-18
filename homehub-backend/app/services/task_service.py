from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, is_completed: bool | None = None):
        query = select(Task).order_by(Task.id.desc())
        if is_completed is not None:
            query = query.where(Task.is_completed == is_completed)
        return self.db.scalars(query).all()

    def get(self, task_id: int):
        return self.db.get(Task, task_id)

    def create(self, data: TaskCreate):
        task = Task(**data.model_dump())
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, task: Task, data: TaskUpdate):
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(task, key, value)
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, task: Task):
        self.db.delete(task)
        self.db.commit()
