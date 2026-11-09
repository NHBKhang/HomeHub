from typing import Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")
S = TypeVar("S")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)
    kw: str | None = Field(default=None, max_length=100)


class PaginatedResponse(BaseModel, Generic[T, S]):
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    statistics: S | None = None