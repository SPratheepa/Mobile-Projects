from config.database import db
from models.base_model import BaseModel


class RoomObject(BaseModel):

    __tablename__ = "room_objects"

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )

    object_code = db.Column(
        db.String(100)
    )

    object_name = db.Column(
        db.String(255)
    )

    object_type = db.Column(
        db.String(100)
    )

    position_x = db.Column(
        db.Numeric(10, 2)
    )

    position_y = db.Column(
        db.Numeric(10, 2)
    )

    position_z = db.Column(
        db.Numeric(10, 2)
    )

    is_interactable = db.Column(
        db.Boolean,
        default=True
    )

    object_metadata = db.Column(
        db.JSON
    )

    room = db.relationship(
        "Room",
        backref="objects"
    )