from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from schemas.booking_schema import BookingCreate, BookingResponse, BookingUpdate
from schemas.car_schema import CarResponse
from core.database import get_db
from  models.booking_model import Booking
from models.car_model import Car
from models.user_model import User
from utils.security import get_current_user

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new car booking"""
   
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
 
    start_date = datetime.fromisoformat(booking.start_date)
    end_date = datetime.fromisoformat(booking.end_date)
    
    if start_date >= end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    if start_date < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be in the past"
        )
    
   
    existing_bookings = db.query(Booking).filter(
        Booking.car_id == booking.car_id,
        Booking.status.in_(["pending", "confirmed"]),
        or_(
            and_(Booking.start_date <= start_date, Booking.end_date > start_date),
            and_(Booking.start_date < end_date, Booking.end_date >= end_date),
            and_(Booking.start_date >= start_date, Booking.end_date <= end_date)
        )
    ).all()
    
    if existing_bookings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Car is not available for selected dates"
        )
    
    
    delta = end_date - start_date
    days = delta.days or 1  
    
    base_price = car.price_per_day * days
    

    if days >= 7:
        discount = 0.15
        total_price = base_price * (1 - discount)
    else:
        discount = 0
        total_price = base_price
    
    new_booking = Booking(
        car_id=booking.car_id,
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        total_days=days,
        price_per_day=car.price_per_day,
        discount_percentage=discount * 100,
        total_price=total_price,
        payment_method=booking.payment_method,
        status="pending"
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking

@router.get("/", response_model=List[BookingResponse])
async def get_user_bookings(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all bookings for the current user"""
    query = db.query(Booking).filter(Booking.user_id == current_user.id)
    
    if status:
        query = query.filter(Booking.status == status)
    
    bookings = query.order_by(Booking.created_at.desc()).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific booking by ID"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
   
    if booking.user_id != current_user.id and booking.car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this booking"
        )
    
    return booking

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a booking (only status for car owners, dates for booking user)"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
 
    if booking_update.status and booking.car.owner_id == current_user.id:
        if booking.status == "completed" or booking.status == "cancelled":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update a completed or cancelled booking"
            )
        
        booking.status = booking_update.status
    
    
    if (booking_update.start_date or booking_update.end_date) and booking.user_id == current_user.id:
        if booking.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only modify dates for pending bookings"
            )
        
        start_date = datetime.fromisoformat(booking_update.start_date) if booking_update.start_date else booking.start_date
        end_date = datetime.fromisoformat(booking_update.end_date) if booking_update.end_date else booking.end_date
        
        if start_date >= end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )
        
        if start_date < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date cannot be in the past"
            )
        
      
        existing_bookings = db.query(Booking).filter(
            Booking.car_id == booking.car_id,
            Booking.id != booking_id,
            Booking.status.in_(["pending", "confirmed"]),
            or_(
                and_(Booking.start_date <= start_date, Booking.end_date > start_date),
                and_(Booking.start_date < end_date, Booking.end_date >= end_date),
                and_(Booking.start_date >= start_date, Booking.end_date <= end_date)
            )
        ).all()
        
        if existing_bookings:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Car is not available for selected dates"
            )
        
        booking.start_date = start_date
        booking.end_date = end_date
        
    
        delta = end_date - start_date
        days = delta.days or 1
        
        base_price = booking.price_per_day * days
        
        if days >= 7:
            discount = 0.15
            total_price = base_price * (1 - discount)
        else:
            discount = 0
            total_price = base_price
        
        booking.total_days = days
        booking.discount_percentage = discount * 100
        booking.total_price = total_price
    
    if booking_update.payment_method and booking.user_id == current_user.id:
        if booking.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only modify payment method for pending bookings"
            )
        
        booking.payment_method = booking_update.payment_method
    
    db.commit()
    db.refresh(booking)
    
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel a booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
 
    if booking.user_id != current_user.id and booking.car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this booking"
        )
    
    if booking.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a completed booking"
        )
    
   
    time_until_start = booking.start_date - datetime.now()
    if time_until_start < timedelta(hours=24) and booking.start_date > datetime.now():
  
        pass
    
    booking.status = "cancelled"
    db.commit()
    
    return None

@router.get("/car/{car_id}/availability", response_model=List[dict])
async def check_car_availability(
    car_id: int,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """Check if a car is available for specific dates"""
    car = db.query(Car).filter(Car.id == car_id).first()
    
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found"
        )
    
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use ISO format (YYYY-MM-DD)"
        )
    

    bookings = db.query(Booking).filter(
        Booking.car_id == car_id,
        Booking.status.in_(["pending", "confirmed"]),
        or_(
            and_(Booking.start_date <= start, Booking.end_date > start),
            and_(Booking.start_date < end, Booking.end_date >= end),
            and_(Booking.start_date >= start, Booking.end_date <= end)
        )
    ).all()
    
 
    unavailable_periods = [
        {
            "start_date": b.start_date.isoformat(),
            "end_date": b.end_date.isoformat(),
        }
        for b in bookings
    ]
    
    return unavailable_periods

@router.get("/owner/requests", response_model=List[BookingResponse])
async def get_booking_requests(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all booking requests for cars owned by the current user"""

    owned_cars = db.query(Car.id).filter(Car.owner_id == current_user.id).all()
    car_ids = [car.id for car in owned_cars]
    
    if not car_ids:
        return []
    

    query = db.query(Booking).filter(Booking.car_id.in_(car_ids))
    
    if status:
        query = query.filter(Booking.status == status)
    
    bookings = query.order_by(Booking.created_at.desc()).all()
    return bookings
