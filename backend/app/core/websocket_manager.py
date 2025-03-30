from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
       
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_email: str):
        await websocket.accept()
        if user_email not in self.active_connections:
            self.active_connections[user_email] = []
        self.active_connections[user_email].append(websocket)

    def disconnect(self, websocket: WebSocket, user_email: str):
        if user_email in self.active_connections:
            if websocket in self.active_connections[user_email]:
                self.active_connections[user_email].remove(websocket)
            if not self.active_connections[user_email]:
                del self.active_connections[user_email]

    async def send_personal_message(self, message: dict, recipient_email: str):
        if recipient_email in self.active_connections:
            for connection in self.active_connections[recipient_email]:
                await connection.send_text(json.dumps({
                    "message": message
                }))

    def get_connected_users(self):
        return list(self.active_connections.keys())