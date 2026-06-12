from config.database import db
from models.base_model import BaseModel


class Room(BaseModel):

    __tablename__ = "rooms"

    name = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(db.Text)

    story = db.Column(db.Text)

    room_type = db.Column(
        db.String(50)
    )

    difficulty = db.Column(
        db.String(20)
    )

    estimated_time = db.Column(
        db.Integer
    )

    max_loops = db.Column(
        db.Integer,
        default=1
    )

    thumbnail = db.Column(
        db.JSON
    )

    creator_id = db.Column(
    db.Integer,
    db.ForeignKey("users.id"),
    nullable=False
) 

    is_published = db.Column(
        db.Boolean,
        default=False
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="DRAFT"
    )

    creator = db.relationship(
        "User",
        backref="rooms"
    )