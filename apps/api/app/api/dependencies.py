from collections.abc import Generator

from sqlalchemy.orm import Session

from app.core.db import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Yield request-scoped database session."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()