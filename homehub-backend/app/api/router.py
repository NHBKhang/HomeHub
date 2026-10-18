from fastapi import APIRouter

from app.api.routes import devices, tasks, expenses

api_router = APIRouter()
api_router.include_router(devices.router, prefix="/devices", tags=["Devices"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
