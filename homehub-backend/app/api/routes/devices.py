from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.device import DeviceCreate, DeviceRead, DeviceUpdate
from app.services.device_service import DeviceService

router = APIRouter()


@router.post("/", response_model=DeviceRead, status_code=status.HTTP_201_CREATED)
def create_device(data: DeviceCreate, db: Session = Depends(get_db)):
    return DeviceService(db).create(data)


@router.get("/", response_model=list[DeviceRead])
def list_devices(
    device_type: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return DeviceService(db).list(device_type=device_type, skip=skip, limit=limit)


@router.get("/{device_id}", response_model=DeviceRead)
def get_device(device_id: int, db: Session = Depends(get_db)):
    device = DeviceService(db).get(device_id)
    if device is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị")
    return device


@router.patch("/{device_id}", response_model=DeviceRead)
def update_device(device_id: int, data: DeviceUpdate, db: Session = Depends(get_db)):
    service = DeviceService(db)
    device = service.get(device_id)
    if device is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị")
    return service.update(device, data)


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    service = DeviceService(db)
    device = service.get(device_id)
    if device is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị")
    service.delete(device)
