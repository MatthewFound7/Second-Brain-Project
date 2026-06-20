from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Validate user registration payload."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Validate user login payload."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    """Serialize authenticated user data."""
    id: int
    email: EmailStr

    model_config = {"from_attributes": True}
