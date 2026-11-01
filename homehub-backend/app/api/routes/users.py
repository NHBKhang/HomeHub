from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.api.deps import ActiveUser, AdminUser
from app.db.session import get_db
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.user_service import (
    create_user_service,
    update_user_service,
    get_users_service,
)

router = APIRouter()
DbSession = Annotated[Session, Depends(get_db)]

@router.post(
    "/",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_data: UserCreate,
    db: DbSession,
):
    try:
        return create_user_service(db, user_data)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username hoặc email đã tồn tại.",
        ) from error


@router.get("/me", response_model=UserRead)
def get_my_profile(current_user: ActiveUser):
    return current_user


@router.patch(
    "/me",
    response_model=UserRead,
    summary="Cập nhật hồ sơ cá nhân",
)
def update_my_profile(
    profile_data: UserUpdate,
    db: DbSession,
    current_user: ActiveUser,
):
    return update_user_service(
        db=db,
        current_user=current_user,
        profile_data=profile_data,
    )


@router.get(
    "/",
    response_model=list[UserRead],
    summary="Lấy danh sách người dùng",
)
def get_users(
    admin: AdminUser,
    db: DbSession,
):
    return get_users_service(db)
