import re
from typing import Annotated, Literal

from pydantic import BaseModel, Field, field_validator

from apps.api.app.core.slug import normalize_slug


SlugStr = Annotated[str, Field(min_length=1, max_length=200)]


class ParagraphBlock(BaseModel):
    """Validate paragraph content block."""
    type: Literal["paragraph"]
    text: str = Field(default="", max_length=10000)


class HeadingBlock(BaseModel):
    """Validate heading content block."""
    type: Literal["heading"]
    level: Literal[1, 2, 3]
    text: str = Field(default="", max_length=1000)


PageBlock = ParagraphBlock | HeadingBlock


class PageContent(BaseModel):
    """Validate structured page document."""
    type: Literal["doc"]
    blocks: list[PageBlock] = Field(default_factory=list)


class PageCreate(BaseModel):
    """Validate payload to create pages."""
    title: str = Field(default="Untitled", max_length=200)
    content: PageContent = Field(default_factory=lambda: PageContent(type="doc", blocks=[]))


class PageUpdate(BaseModel):
    """Validate payload to update pages."""
    title: str | None = Field(default=None, max_length=200)
    content: PageContent | None = None
    is_public: bool | None = None
    slug: str | None = Field(default=None, max_length=200)

    @field_validator("slug", mode="before")
    @classmethod
    def normalize_slug_value(cls, value: str | None) -> str | None:
        """Normalize slug before validation."""
        if value is None:
            return value

        if not isinstance(value, str):
            raise ValueError("Slug must be a string or null")

        normalized = normalize_slug(value)

        return normalized or None

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, value: str | None) -> str | None:
        """Validate URL-safe slug format."""
        if value is None:
            return value

        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value):
            raise ValueError(
                "Slug must contain only lowercase letters, numbers, and hyphens",
            )

        return value


class PageOut(BaseModel):
    """Serialize editable page data."""
    id: int
    title: str
    slug: str | None
    is_public: bool
    content: PageContent

    model_config = {"from_attributes": True}


class PublicPageOut(BaseModel):
    """Serialize public page data."""
    title: str
    slug: SlugStr
    content: PageContent

    model_config = {"from_attributes": True}