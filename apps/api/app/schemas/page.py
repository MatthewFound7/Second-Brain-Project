from pydantic import BaseModel, Field


class PageCreate(BaseModel):
    """Validate payload to create pages."""
    title: str = Field(default="Untitled", max_length=200)
    content: dict = Field(default_factory=dict)


class PageUpdate(BaseModel):
    """Validate payload to update pages."""
    title: str | None = Field(default=None, max_length=200)
    content: dict | None = None
    is_public: bool | None = None
    slug: str | None = Field(default=None, max_length=200)


class PageOut(BaseModel):
    """Serialize editable page data."""
    id: int
    title: str
    slug: str | None
    is_public: bool
    content: dict

    model_config = {"from_attributes": True}


class PublicPageOut(BaseModel):
    """Serialize public page data."""
    title: str
    slug: str
    content: dict

    model_config = {"from_attributes": True}