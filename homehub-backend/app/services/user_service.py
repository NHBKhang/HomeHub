from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pwdlib import PasswordHash
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from datetime import timedelta
from app.db.session import get_db
from jwt.exceptions import InvalidTokenError
import jwt

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def create_user_service(db: Session, user_data: UserCreate) -> User:
    username = user_data.username.strip()
    email = str(user_data.email).strip().lower()

    existing_user = (
        db.query(User)
        .filter(
            or_(
                User.username == username,
                User.email == email,
            )
        )
        .first()
    )

    if existing_user:
        if existing_user.username == username:
            raise ValueError("Tên đăng nhập đã tồn tại.")

        raise ValueError("Email đã được sử dụng.")

    user = User(
        username=username,
        email=email,
        hashed_password=password_hash.hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_active=True,
        is_superuser=False,
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except Exception:
        db.rollback()
        raise

    return user


def authenticate_user(db: Session, username: str, password: str, ):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        return None, None

    if not verify_password(password, user.hashed_password):
        return None, None

    if not user.is_active:
        return None, None

    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    return user, access_token


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None or not user.is_active:
        raise credentials_exception

    return user
