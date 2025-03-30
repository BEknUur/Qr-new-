from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BookingBase(BaseModel):
    car_id: int
    start_date: str  
    end_date: str  
    payment_method: str = Field(..., description="credit, debit, or cash")

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None   
    status: Optional[str] = None      
    payment_method: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    car_id: int
    user_id: int
    start_date: datetime
    end_date: datetime
    total_days: int
    price_per_day: float
    discount_percentage: float
    total_price: float
    payment_method: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class CarAvailabilityCheck(BaseModel):
    start_date: str
    end_date: str

class UnavailablePeriod(BaseModel):
    start_date: str
    end_date: str