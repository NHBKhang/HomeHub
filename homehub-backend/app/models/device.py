from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel


class Device(BaseModel):
    __tablename__ = "devices"

    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    device_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    is_online: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
