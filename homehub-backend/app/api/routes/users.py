from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.models.user import User
from app.db.session import get_db
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.user_service import create_user_service, get_current_user, update_user_profile

router = APIRouter()


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED, )
def create_user(user_data: UserCreate, db: Session = Depends(get_db), ):
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
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserRead, summary="Cập nhật hồ sơ cá nhân")
def update_my_profile(
        profile_data: UserUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return update_user_profile(
        db=db,
        current_user=current_user,
        profile_data=profile_data,
    )
