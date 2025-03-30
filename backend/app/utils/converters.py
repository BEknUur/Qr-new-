from app.models.car_model import Car
from app.schemas.car_schema import CarResponse

def car_to_response(car: Car) -> CarResponse:
    return CarResponse(
        id=car.id,
        owner_email=car.owner_email,
        name=car.name,
        price_per_day=car.price_per_day,
        location=car.location,
        car_type=car.car_type,
        description=car.description,
        image_url=car.image_url,
        created_at=car.created_at
    )
