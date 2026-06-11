from config.database import db
from models.base_model import BaseModel


class GameSession(BaseModel):

    __tablename__ = "game_sessions"

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

    status = db.Column(
        db.String(20)
    )

    current_loop = db.Column(
        db.Integer,
        default=1
    )

    remaining_time = db.Column(
        db.Integer
    )

    score = db.Column(
        db.Integer,
        default=0
    )

    start_time = db.Column(
        db.DateTime(timezone=True)
    )

    end_time = db.Column(
        db.DateTime(timezone=True)
    )

    completed_at = db.Column(
        db.DateTime(timezone=True)
    )

    room = db.relationship(
        "Room"
    )

    user = db.relationship(
        "User"
    )