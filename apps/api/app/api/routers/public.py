from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.models.page import Page
from app.schemas.page import PublicPageOut

router = APIRouter()


@router.get("/public/{slug}", response_model=PublicPageOut)
def get_public_page(slug: str, db: Session = Depends(get_db)) -> Page:
    """Fetch a public page by slug."""
    page = db.query(Page).filter(Page.slug == slug, Page.is_public.is_(True)).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Public page not found")

    return page