from pydantic import BaseModel, Field


class PageCreate(BaseModel):
    title: str = Field(default="Untitled", max_length=200)
    content: dict = Field(default_factory=dict)


class PageUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    content: dict | None = None
    is_public: bool | None = None
    slug: str | None = Field(default=None, max_length=200)


class PageOut(BaseModel):
    id: int
    title: str
    slug: str | None
    is_public: bool
    content: dict

    model_config = {"from_attributes": True}
