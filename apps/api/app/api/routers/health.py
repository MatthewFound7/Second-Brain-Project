from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict:
    """Return simple health status."""
    return {"status": "ok"}
