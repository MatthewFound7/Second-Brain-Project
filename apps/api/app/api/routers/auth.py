from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.auth_dependencies import get_current_user
from app.api.dependencies import get_db
from app.core.settings import get_settings
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserOut
from app.services.auth_service import (
    AuthError,
    UserAlreadyExistsError,
    authenticate_user,
    register_user,
)

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
) -> UserOut:
    """Register a new user."""
    try:
        user = register_user(db, payload)
    except UserAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")

    return user


@router.post("/login", response_model=UserOut)
def login(
    payload: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
) -> UserOut:
    """Authenticate user and set session cookie."""
    settings = get_settings()

    try:
        user, token = authenticate_user(db, payload)
    except AuthError:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.access_token_expire_minutes * 60,
    )

    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> Response:
    """Clear the session cookie."""
    settings = get_settings()

    response.delete_cookie(key=settings.auth_cookie_name)
    response.status_code = status.HTTP_204_NO_CONTENT

    return response


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> UserOut:
    """Return the authenticated user."""
    return current_user
