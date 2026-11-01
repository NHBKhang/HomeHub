from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.user_service import authenticate_user_service, refresh_access_token_service
from app.schemas.refresh_token import RefreshTokenRequest

router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]


@router.post("/login")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DbSession,
):
    user, access_token, refresh_token = authenticate_user_service(
        db=db,
        username=form_data.username,
        password=form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không đúng.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@router.post("/refresh")
def refresh(
    body: RefreshTokenRequest,
    db: DbSession,
):
    access_token = refresh_access_token_service(
        db=db,
        token=body.refresh_token,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

# @router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
# def logout(
#     body: RefreshTokenRequest,
#     db: DbSession,
# ):
#     revoke_refresh_token_service(
#         db=db,
#         token=body.refresh_token,
#     )
#
#     return None