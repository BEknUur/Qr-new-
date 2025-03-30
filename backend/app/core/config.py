import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALLOWED_ORIGINS = [
        "http://localhost:5173",
         "http://127.0.0.1:5173"
    ]

settings = Settings()
