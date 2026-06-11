from config.database import db
from models.base_model import BaseModel


class PuzzleDependency(BaseModel):

    __tablename__ = "puzzle_dependency"

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )

    parent_puzzle_id = db.Column(
        db.Integer,
        db.ForeignKey("puzzles.id"),
        nullable=False
    )

    child_puzzle_id = db.Column(
        db.Integer,
        db.ForeignKey("puzzles.id"),
        nullable=False
    )

    room = db.relationship(
        "Room"
    )

    parent_puzzle = db.relationship(
        "Puzzle",
        foreign_keys=[parent_puzzle_id]
    )

    child_puzzle = db.relationship(
        "Puzzle",
        foreign_keys=[child_puzzle_id]
    )