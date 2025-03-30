from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.base import Base
from sqlalchemy.orm import relationship


class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    owner_email = Column(String, ForeignKey("users.email"))
    name = Column(String, nullable=True)
    price_per_day = Column(Float, nullable=False)
    location = Column(String, nullable=False)
    car_type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    favorited_by = relationship("Favorite", back_populates="favorited_car", cascade="all, delete-orphan")