from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class DeviceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    device_type: str = Field(min_length=1, max_length=40)
    location: str | None = Field(default=None, max_length=120)
    ip_address: str | None = Field(default=None, max_length=45)
    is_online: bool = False


class DeviceUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    device_type: str | None = Field(default=None, min_length=1, max_length=40)
    location: str | None = Field(default=None, max_length=120)
    ip_address: str | None = Field(default=None, max_length=45)
    is_online: bool | None = None


class DeviceRead(BaseModel):
    id: int
    name: str
    device_type: str
    location: str | None
    ip_address: str | None
    is_online: bool
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
