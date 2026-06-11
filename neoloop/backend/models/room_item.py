from config.database import db
from models.base_model import BaseModel


class RoomItem(BaseModel):

    __tablename__ = "room_items"

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )

    item_code = db.Column(
        db.String(100)
    )

    name = db.Column(
        db.String(255)
    )

    description = db.Column(
        db.Text
    )

    item_category = db.Column(
        db.String(50)
    )

    room = db.relationship(
        "Room",
        backref="items"
    )