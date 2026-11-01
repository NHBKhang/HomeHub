from datetime import datetime
from sqlalchemy import ForeignKey, String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class UserSetting(Base):
    __tablename__ = 'user_settings'

    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', onupdate='CASCADE', ondelete='CASCADE'),
        primary_key=True,
        nullable=False,
    )

    language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default='vi',
    )

    theme: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default='light',
    )

    timezone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default='UTC',
    )

    notification_enabled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.now(),
        onupdate=datetime.now(),
    )