from config.database import db
from models.base_model import BaseModel


class Puzzle(BaseModel):

    __tablename__ = "puzzles"

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )

    title = db.Column(
        db.String(255)
    )

    type = db.Column(
        db.String(50)
    )

    difficulty = db.Column(
        db.String(20)
    )

    description = db.Column(
        db.Text
    )

    answer = db.Column(
        db.String(255)
    )

    answer_type = db.Column(
        db.String(50)
    )

    hint_1 = db.Column(db.Text)

    hint_2 = db.Column(db.Text)

    hint_3 = db.Column(db.Text)

    sequence_order = db.Column(
        db.Integer
    )

    reward_item_id = db.Column(
        db.Integer,
        db.ForeignKey("room_items.id")
    )

    room = db.relationship(
        "Room",
        backref="puzzles"
    )

    reward_item = db.relationship(
        "RoomItem"
    )