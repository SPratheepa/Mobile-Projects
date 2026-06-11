from config.database import db
from models.base_model import BaseModel


class Leaderboard(BaseModel):

    __tablename__ = "leaderboard"

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    score = db.Column(
        db.Integer,
        default=0
    )

    completion_time = db.Column(
        db.Integer
    )

    room = db.relationship(
        "Room"
    )

    user = db.relationship(
        "User"
    )