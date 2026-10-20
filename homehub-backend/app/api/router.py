from fastapi import APIRouter
from app.api.routes import devices, tasks, expenses, users, auth

api_router = APIRouter()
api_router.include_router(devices.router, prefix="/devices", tags=["Devices"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
