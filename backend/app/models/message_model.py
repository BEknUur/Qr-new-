from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_email = Column(String, ForeignKey("users.email"))
    receiver_email = Column(String, ForeignKey("users.email"))
    text = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now())

    sender = relationship("User", foreign_keys=[sender_email])
    receiver = relationship("User", foreign_keys=[receiver_email])

