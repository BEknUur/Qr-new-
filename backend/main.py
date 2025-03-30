from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from app.core.config import settings
import os
from app.core.database import Base, engine
from app.routes import auth_routes, profile_routes, chat_routes, car_routes,chat_websocket
from app.routes.favorite_routes import router as favorite_router

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/car_uploads", StaticFiles(directory="car_uploads"), name="car_uploads")
app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")


app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(profile_routes.router, prefix="/profile", tags=["profile"])
app.include_router(chat_routes.router, prefix="/chat", tags=["chat"])  
app.include_router(car_routes.router, prefix="/car", tags=["car"])
app.include_router(chat_websocket.router)  
app.include_router(favorite_router)
