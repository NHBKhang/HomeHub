from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate


class DeviceService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, device_type: str | None = None, skip: int = 0, limit: int = 100):
        query = select(Device).order_by(Device.id.desc())
        if device_type:
            query = query.where(Device.device_type == device_type)
        return self.db.scalars(query.offset(skip).limit(limit)).all()

    def get(self, device_id: int):
        return self.db.get(Device, device_id)

    def create(self, data: DeviceCreate):
        device = Device(**data.model_dump())
        self.db.add(device)
        self.db.commit()
        self.db.refresh(device)
        return device

    def update(self, device: Device, data: DeviceUpdate):
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(device, key, value)
        self.db.commit()
        self.db.refresh(device)
        return device

    def delete(self, device: Device):
        self.db.delete(device)
        self.db.commit()
