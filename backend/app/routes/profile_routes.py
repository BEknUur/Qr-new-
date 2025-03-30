from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
import time
from fastapi.staticfiles import StaticFiles

from app.core.database import get_db
from app.models.user_model import User
from app.schemas.user_schema import UpdateProfileRequest
from app.utils.security import decode_access_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# This line should be added in your main.py file to serve static files
# app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")


@router.get("/profile")
def get_profile(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Получить данные профиля текущего пользователя.
    """

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain user email."
        )

    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

  
    return {
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "profile_image": user.profile_image,
    }


@router.put("/profile")
def update_profile(
    profile_data: UpdateProfileRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Обновить данные профиля: username, bio, profile_image (если нужно).
    """
    # Декодируем токен
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain user email."
        )

    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    
    if profile_data.username is not None:
        user.username = profile_data.username
    if profile_data.bio is not None:
        user.bio = profile_data.bio
    if profile_data.profile_image is not None:
        user.profile_image = profile_data.profile_image

    db.commit()
    db.refresh(user)

    return {
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "profile_image": user.profile_image,
    }

@router.post("/profile/upload-image")
def upload_profile_image(
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain user email."
        )

    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Генерируем уникальное имя файла, например, с текущей датой
    filename = f"{int(time.time())}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Сохраняем путь к файлу в БД (без leading slash)
    user.profile_image = f"uploaded_images/{filename}"
    db.commit()
    db.refresh(user)

    return {
        "message": "File uploaded successfully",
        "profile_image": user.profile_image,
    }