from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str | None = None
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    description: str | None = None
    priority: str | None = Field(default=None, pattern="^(low|medium|high)$")
    is_completed: bool | None = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: str | None
    priority: str
    is_completed: bool
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
