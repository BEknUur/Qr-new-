from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.websocket_manager import ConnectionManager
from app.models.user_model import User
from app.models.message_model import Message
import json
from datetime import datetime

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/сhat/{user_email}")
async def websocket_endpoint(
    websocket: WebSocket, 
    user_email: str, 
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        await websocket.close(code=1008)  # Policy violation
        return
    
    await manager.connect(websocket, user_email)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Validate message data
            if "receiver_email" not in message_data or "text" not in message_data:
                await websocket.send_text(json.dumps({
                    "error": "Invalid message format"
                }))
                continue
            
            receiver_email = message_data["receiver_email"]
            text = message_data["text"]
            
            # Verify receiver exists
            receiver = db.query(User).filter(User.email == receiver_email).first()
            if not receiver:
                await websocket.send_text(json.dumps({
                    "error": f"User with email {receiver_email} not found"
                }))
                continue
            
            # Save message to database
            new_message = Message(
                sender_email=user_email,
                receiver_email=receiver_email,
                text=text,
                timestamp=datetime.now()
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)
            
            # Format message for sending
            message_response = {
                "id": new_message.id,
                "sender_email": new_message.sender_email,
                "receiver_email": new_message.receiver_email,
                "text": new_message.text,
                "timestamp": new_message.timestamp.isoformat()
            }
            
            # Send message to recipient if they're connected
            await manager.send_personal_message(message_response, receiver_email)
            
            # Send confirmation back to sender
            await websocket.send_text(json.dumps({
                "status": "delivered",
                "message": message_response
            }))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_email)
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket, user_email)