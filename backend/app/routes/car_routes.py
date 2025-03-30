from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from app.core.database import get_db
from app.models.user_model import User
from app.models.car_model import Car
from app.schemas.car_schema import CarCreate, CarResponse
from app.utils.converters import car_to_response

router = APIRouter()

BASE_URL = "http://68.183.15.162/api"


@router.post("/cars", response_model=CarResponse)
async def create_car(
    email: str, 
    name: str = Form(...),
    price_per_day: float = Form(...),
    location: str = Form(...),
    car_type: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
  
    owner = db.query(User).filter(User.email == email).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    
    new_car = Car(
        owner_email=email,
        name=name,
        price_per_day=price_per_day,
        location=location,
        car_type=car_type,
        description=description or ""
    )
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    
    
    if file:
        os.makedirs("car_uploads", exist_ok=True)
        file_path = f"car_uploads/car_{new_car.id}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        new_car.image_url = f"{BASE_URL}/{file_path}"
        db.commit()
    
    return car_to_response(new_car)


@router.post("/cars/{car_id}/upload-image")
async def upload_car_image(car_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    os.makedirs("car_uploads", exist_ok=True)

    file_path = f"car_uploads/car_{car_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    car.image_url = f"{BASE_URL}/{file_path}"
    db.commit()

    return {"message": "Image uploaded successfully", "image_url": car.image_url}


@router.get("/cars", response_model=List[CarResponse])
def get_all_cars(db: Session = Depends(get_db)):
    cars = db.query(Car).all()
    return [car_to_response(c) for c in cars]


@router.get("/cars/search", response_model=List[CarResponse])
def search_cars(
    db: Session = Depends(get_db),
    location: Optional[str] = None,
    max_price: Optional[float] = None,
    car_type: Optional[str] = None
):
    query = db.query(Car)

    if location:
        query = query.filter(Car.location.ilike(f"%{location}%"))
    if max_price is not None:
        query = query.filter(Car.price_per_day <= max_price)
    if car_type:
        query = query.filter(Car.car_type.ilike(f"%{car_type}%"))

    return [car_to_response(c) for c in query.all()]

@router.get("/user-cars", response_model=List[CarResponse])
def get_user_cars(email: str, db: Session = Depends(get_db)):
    """
    Get all cars owned by a specific user based on their email
    """
    cars = db.query(Car).filter(Car.owner_email == email).all()
    return [car_to_response(c) for c in cars]

# Added edit car endpoint
@router.put("/cars/{car_id}", response_model=CarResponse)
async def update_car(
    car_id: int,
    email: str,
    name: str = Form(None),
    price_per_day: float = Form(None),
    location: str = Form(None),
    car_type: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """
    Update an existing car's details
    """
    # First check if car exists and belongs to the user
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    if car.owner_email != email:
        raise HTTPException(status_code=403, detail="Not authorized to edit this car")
    
    # Update car attributes if provided
    if name is not None:
        car.name = name
    if price_per_day is not None:
        car.price_per_day = price_per_day
    if location is not None:
        car.location = location
    if car_type is not None:
        car.car_type = car_type
    if description is not None:
        car.description = description
    
    # Handle image upload if provided
    if file:
        os.makedirs("car_uploads", exist_ok=True)
        file_path = f"car_uploads/car_{car_id}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        car.image_url = f"{BASE_URL}/{file_path}"
    
    db.commit()
    db.refresh(car)
    
    return car_to_response(car)

# Added endpoint to get a specific car by ID
@router.get("/cars/{car_id}", response_model=CarResponse)
def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    """
    Get a specific car by its ID
    """
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return car_to_response(car)

# Added endpoint to delete a car
@router.delete("/cars/{car_id}")
def delete_car(car_id: int, email: str, db: Session = Depends(get_db)):
    """
    Delete a car by its ID, ensuring the user is the owner
    """
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    if car.owner_email != email:
        raise HTTPException(status_code=403, detail="Not authorized to delete this car")
    
    # Delete the car's image file if it exists
    if car.image_url and car.image_url.startswith(BASE_URL):
        image_path = car.image_url.replace(BASE_URL + "/", "")
        if os.path.exists(image_path):
            os.remove(image_path)
    
    db.delete(car)
    db.commit()
    
    return {"message": "Car deleted successfully"}