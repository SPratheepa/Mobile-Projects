from config.database import db
from models.base_model import BaseModel


class PlayerInventory(BaseModel):

    __tablename__ = "player_inventory"

    session_id = db.Column(
        db.Integer,
        db.ForeignKey("game_sessions.id"),
        nullable=False
    )

    item_id = db.Column(
        db.Integer,
        db.ForeignKey("room_items.id"),
        nullable=False
    )

    is_used = db.Column(
        db.Boolean,
        default=False
    )

    collected_at = db.Column(
        db.DateTime(timezone=True)
    )

    session = db.relationship(
        "GameSession",
        backref="inventory"
    )

    item = db.relationship(
        "RoomItem"
    )