from typing import Annotated
from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.services.user_service import get_current_user_service


CurrentUser = Annotated[User, Depends(get_current_user_service)]


def get_active_user(
    current_user: CurrentUser,
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa.",
        )

    return current_user


ActiveUser = Annotated[User, Depends(get_active_user)]


def require_admin(
    current_user: ActiveUser,
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện thao tác này.",
        )

    return current_user


AdminUser = Annotated[User, Depends(require_admin)]
