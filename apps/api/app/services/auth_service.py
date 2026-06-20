from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin


class AuthError(Exception):
    """Raised for invalid authentication."""


class UserAlreadyExistsError(Exception):
    """Raised when registration email already exists."""

class UserNotFoundError(Exception):
    """Raised when user is not found."""


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def register_user(db: Session, payload: UserCreate) -> User:
    existing_user = get_user_by_email(db, payload.email)

    if existing_user is not None:
        raise UserAlreadyExistsError

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(db: Session, payload: UserLogin) -> tuple[User, str]:
    user = get_user_by_email(db, payload.email)

    if user is None:
        raise UserNotFoundError

    if not verify_password(payload.password, user.password_hash):
        raise AuthError

    token = create_access_token(user.id)

    return user, token
