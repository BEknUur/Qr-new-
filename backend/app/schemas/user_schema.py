from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    username: str

class UpdateProfileRequest(BaseModel):
    username: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None
