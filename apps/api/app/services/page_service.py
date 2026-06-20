from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.page import Page
from app.models.user import User
from app.schemas.page import PageCreate, PageUpdate


class PageSlugConflictError(Exception):
    """Raised when a slug already exists."""


def create_page(db: Session, owner: User, payload: PageCreate) -> Page:
    """Create and persist a page."""
    page = Page(
        owner_id=owner.id,
        title=payload.title,
        content=payload.content.model_dump(),
    )

    db.add(page)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise PageSlugConflictError from error

    db.refresh(page)
    return page


def list_pages(db: Session, owner: User) -> list[Page]:
    """Return all owned pages ordered by update time."""
    return (
        db.query(Page)
        .filter(Page.owner_id == owner.id)
        .order_by(Page.updated_at.desc())
        .all()
    )


def get_page_by_id(db: Session, owner: User, page_id: int) -> Page | None:
    """Fetch owned page by id."""
    return (
        db.query(Page)
        .filter(Page.id == page_id, Page.owner_id == owner.id)
        .first()
    )


def update_page(db: Session, page: Page, payload: PageUpdate) -> Page:
    """Apply updates and persist a page."""
    if payload.title is not None:
        page.title = payload.title
    if payload.content is not None:
        page.content = payload.content.model_dump()
    if payload.is_public is not None:
        page.is_public = payload.is_public
    if payload.slug is not None:
        page.slug = payload.slug

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise PageSlugConflictError from error

    db.refresh(page)
    return page


def delete_page(db: Session, page: Page) -> None:
    """Delete a page from the database."""
    db.delete(page)
    db.commit()
