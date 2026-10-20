from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.core.cors import setup_cors

app = FastAPI(
    title=settings.APP_NAME,
    description="API quản lý thiết bị trong nhà, công việc và chi tiêu cá nhân.",
    version="0.1.0",
)

setup_cors(app)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {"message": "Welcome to HomeHub API"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}
