from pydantic import BaseModel
from datetime import datetime

class FavoriteCreate(BaseModel):
    car_id: int

class FavoriteOut(BaseModel):
    id: int
    user_id: int
    car_id: int
    created_at: datetime

    class Config:
        orm_mode = True
