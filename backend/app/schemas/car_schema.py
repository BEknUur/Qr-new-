from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CarCreate(BaseModel):
    name: Optional[str] = None
    price_per_day: float
    location: str
    car_type: str
    description: Optional[str] = None

class CarResponse(BaseModel):
    id: int
    owner_email: str
    name: Optional[str]
    price_per_day: float
    location: str
    car_type: str
    description: Optional[str]
    image_url: Optional[str]
    created_at: datetime
