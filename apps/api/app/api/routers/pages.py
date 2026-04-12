from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.models.page import Page
from app.schemas.page import PageCreate, PageOut, PageUpdate

router = APIRouter()


@router.post("", response_model=PageOut)
def create_page(payload: PageCreate, db: Session = Depends(get_db)) -> Page:
    """Create a new page."""
    page = Page(title=payload.title, content=payload.content)
    db.add(page)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Slug already exists")

    db.refresh(page)
    return page


@router.get("", response_model=list[PageOut])
def list_pages(db: Session = Depends(get_db)) -> list[Page]:
    """List all pages."""
    return db.query(Page).order_by(Page.updated_at.desc()).all()


@router.get("/{page_id}", response_model=PageOut)
def get_page(page_id: int, db: Session = Depends(get_db)) -> Page:
    """Fetch page by id."""
    page = db.get(Page, page_id)
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.put("/{page_id}", response_model=PageOut)
def update_page(page_id: int, payload: PageUpdate, db: Session = Depends(get_db)) -> Page:
    """Update an existing page."""
    page = db.get(Page, page_id)
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")

    if payload.title is not None:
        page.title = payload.title
    if payload.content is not None:
        page.content = payload.content
    if payload.is_public is not None:
        page.is_public = payload.is_public
    if payload.slug is not None:
        page.slug = payload.slug

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Slug already exists")

    db.refresh(page)
    return page


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page(page_id: int, db: Session = Depends(get_db)) -> Response:
    """Delete a page by id."""
    page = db.get(Page, page_id)
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")

    db.delete(page)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)