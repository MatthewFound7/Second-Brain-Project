from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers.health import router as health_router
from app.api.routers.pages import router as pages_router
from app.core.settings import get_settings


def create_app() -> FastAPI:
    """Create configured FastAPI application."""
    settings = get_settings()
    application = FastAPI(title="Second Brain API", version="0.2.0")

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(health_router)
    application.include_router(pages_router, prefix="/pages", tags=["pages"])
    return application


app = create_app()
