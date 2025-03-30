from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.favorite_model import Favorite
from app.models.car_model import Car
from app.models.user_model import User
from app.schemas.favorite_schema import FavoriteCreate, FavoriteOut

router = APIRouter(prefix="/favorites", tags=["Favorites"])


class FavoriteCreateRequest(BaseModel):
    car_id: int

@router.get("/", response_model=List[dict])
def get_favorites(
    userEmail: str = Query(..., description="Email of the user"),
    db: Session = Depends(get_db)
):
    
    user = db.query(User).filter(User.email == userEmail).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

   
    favorites = db.query(Favorite).filter(Favorite.user_id == user.id).all()
    
   
    result = []
    for fav in favorites:
        car = db.query(Car).filter(Car.id == fav.car_id).first()
        if car:
           
            car_dict = {c.name: getattr(car, c.name) for c in car.__table__.columns}
            result.append(car_dict)
    
    return result

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_favorite(
    fav_data: FavoriteCreateRequest,
    userEmail: str = Query(..., description="Email of the user"),
    db: Session = Depends(get_db)
):
   
    user = db.query(User).filter(User.email == userEmail).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

   
    car = db.query(Car).filter(Car.id == fav_data.car_id).first()
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Car not found")

   
    existing_fav = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.car_id == fav_data.car_id
    ).first()

    if existing_fav:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Car is already in favourites."
        )

    new_fav = Favorite(user_id=user.id, car_id=fav_data.car_id)
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    
    
    return {
        "id": new_fav.id,
        "user_id": new_fav.user_id,
        "car_id": new_fav.car_id
    }

@router.delete("/", status_code=status.HTTP_200_OK)
def remove_favorite(
    userEmail: str = Query(..., description="Email of the user"),
    car_id: int = Query(..., description="ID of the car to remove"),
    db: Session = Depends(get_db)
):
    
    user = db.query(User).filter(User.email == userEmail).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

   
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.car_id == car_id
    ).first()

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite record not found"
        )

    db.delete(favorite)
    db.commit()
    return {"detail": "Car removed from favourites"}