from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError, PyJWTError
from pwdlib import PasswordHash
from sqlalchemy import or_, func, case
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserCreate, UserUpdate
from app.services.common.filter_service import apply_filters
from app.core.security import verify_password, create_access_token, create_refresh_token, hash_refresh_token
from app.core.config import settings
from app.db.session import get_db
from math import ceil

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


def authenticate_user_service(db: Session,username: str,password: str):
    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(password, user.hashed_password) or not user.is_active:
        return None, None, None

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    refresh_token_record = RefreshToken(
        user_id=user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_in=(
            datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        ),
    )

    db.add(refresh_token_record)
    db.commit()

    return user, access_token, refresh_token


def refresh_access_token_service(db: Session, token: str) -> str:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")

        user_id = int(payload["sub"])

    except (PyJWTError, ValueError, TypeError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token không hợp lệ hoặc đã hết hạn.",
        )

    token_hash = hash_refresh_token(token)

    token_record = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.user_id == user_id,
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at.is_(None),
        ).first()
    )

    if not token_record or token_record.expires_in <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token đã hết hạn hoặc bị thu hồi.",
        )

    user = db.get(User, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.",
        )

    return create_access_token(user.id)


def get_current_user_service(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> type[User]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn.",
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

        user_id = int(user_id)

    except (InvalidTokenError, TypeError, ValueError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()

    if user is None or not user.is_active:
        raise credentials_exception

    return user


def update_user_service(
    db: Session,
    current_user: User,
    profile_data: UserUpdate,
) -> User:
    update_data = profile_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn chưa cung cấp thông tin cần cập nhật.",
        )

    if "email" in update_data:
        email = update_data["email"]

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Email không được để trống.",
            )

        email = str(email).strip().lower()

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != current_user.id,
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email này đã được sử dụng bởi tài khoản khác.",
            )

        update_data["email"] = email

    allowed_fields = {"first_name", "last_name", "email"}

    for field, value in update_data.items():
        if field in allowed_fields:
            setattr(current_user, field, value)

    try:
        db.commit()
        db.refresh(current_user)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể cập nhật hồ sơ. Vui lòng thử lại.",
        )

    return current_user


def get_users_service(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    kw: str | None = None,
    filters: dict | None = None,
):
    base_query = db.query(User)
    query = base_query

    if kw and kw.strip():
        keyword = f"%{kw.strip()}%"

        query = query.filter(
            or_(
                User.username.ilike(keyword),
                User.email.ilike(keyword),
                User.first_name.ilike(keyword),
                User.last_name.ilike(keyword),
            )
        )

    allowed_filters = {
        "is_active": User.is_active,
        "is_superuser": User.is_superuser,
    }

    query = apply_filters(
        query=query,
        filters=filters,
        allowed_filters=allowed_filters,
    )

    total = query.count()

    statistics = base_query.with_entities(
        func.count(User.id).label("total"),
        func.sum(
            case((User.is_active.is_(True), 1), else_=0)
        ).label("active"),
        func.sum(
            case((User.is_active.is_(False), 1), else_=0)
        ).label("inactive"),
        func.sum(
            case((User.is_superuser.is_(True), 1), else_=0)
        ).label("admins"),
    ).first()

    users = (
        query
        .order_by(User.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": users,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": ceil(total / page_size) if total else 0,
        "statistics": {
            "total": statistics.total or 0,
            "active": statistics.active or 0,
            "inactive": statistics.inactive or 0,
            "admins": statistics.admins or 0,
        },
    }