from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSearchResponse(BaseModel):
    username: str
    email: str
    
    class Config:
        orm_mode = True

class MessageBase(BaseModel):
    text: str

class MessageCreate(MessageBase):
    sender_email: str
    receiver_username: str

class MessageResponse(MessageBase):
    id: int
    sender_email: str
    receiver_email: str
    text: str
    timestamp: datetime
    
    class Config:
        orm_mode = True