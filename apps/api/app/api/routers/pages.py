from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.auth_dependencies import get_current_user
from app.api.dependencies import get_db
from app.models.user import User
from app.schemas.page import PageCreate, PageOut, PageUpdate
from app.services.page_service import (
    PageSlugConflictError,
    create_page,
    delete_page,
    get_page_by_id,
    list_pages,
    update_page,
)

router = APIRouter()


@router.post("", response_model=PageOut)
def create_page_route(
    payload: PageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PageOut:
    """Create a new owned page."""
    try:
        page = create_page(db, current_user, payload)
    except PageSlugConflictError:
        raise HTTPException(status_code=400, detail="Slug already exists")

    return page


@router.get("", response_model=list[PageOut])
def list_pages_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[PageOut]:
    """List owned pages."""
    return list_pages(db, current_user)


@router.get("/{page_id}", response_model=PageOut)
def get_page_route(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PageOut:
    """Fetch owned page by id."""
    page = get_page_by_id(db, current_user, page_id)

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")

    return page


@router.put("/{page_id}", response_model=PageOut)
def update_page_route(
    page_id: int,
    payload: PageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PageOut:
    """Update an owned page."""
    page = get_page_by_id(db, current_user, page_id)

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")

    try:
        return update_page(db, page, payload)
    except PageSlugConflictError:
        raise HTTPException(status_code=400, detail="Slug already exists")


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page_route(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete an owned page."""
    page = get_page_by_id(db, current_user, page_id)

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")

    delete_page(db, page)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
