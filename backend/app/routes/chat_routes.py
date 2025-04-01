from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user_model import User
from app.models.message_model import Message
from app.schemas.message_schema import UserSearchResponse, MessageResponse, MessageCreate
from datetime import datetime

router = APIRouter()

@router.get("/messages/{sender_email}/{receiver_username}", response_model=List[MessageResponse])
def get_messages(
    sender_email: str, 
    receiver_username: str, 
    db: Session = Depends(get_db)
):
   
    receiver = db.query(User).filter(User.username == receiver_username).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    receiver_email = receiver.email
    
  
    messages = db.query(Message).filter(
        (
            (Message.sender_email == sender_email) & 
            (Message.receiver_email == receiver_email)
        ) | (
            (Message.sender_email == receiver_email) & 
            (Message.receiver_email == sender_email)
        )
    ).order_by(Message.timestamp).all()
    
    return messages

@router.post("/send", response_model=MessageResponse)
def send_message(message: MessageCreate, db: Session = Depends(get_db)):
    
    receiver = db.query(User).filter(User.username == message.receiver_username).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
   
    new_message = Message(
        sender_email=message.sender_email,
        receiver_email=receiver.email,
        text=message.text,
        timestamp=datetime.now()
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message

@router.get("/search-users", response_model=List[UserSearchResponse])
def search_users(query: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """
    Search for users by username or email
    """
    users = db.query(User).filter(
        (User.username.ilike(f"%{query}%")) | (User.email.ilike(f"%{query}%"))
    ).limit(10).all()
    
    return [
        UserSearchResponse(
            username=user.username,
            email=user.email,
        ) for user in users
    ]