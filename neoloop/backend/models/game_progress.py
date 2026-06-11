from config.database import db
from models.base_model import BaseModel


class GameProgress(BaseModel):

    __tablename__ = "game_progress"

    session_id = db.Column(
        db.Integer,
        db.ForeignKey("game_sessions.id"),
        nullable=False
    )

    puzzle_id = db.Column(
        db.Integer,
        db.ForeignKey("puzzles.id"),
        nullable=False
    )

    status = db.Column(
        db.String(20)
    )

    solved_at = db.Column(
        db.DateTime(timezone=True)
    )

    session = db.relationship(
        "GameSession",
        backref="progress"
    )

    puzzle = db.relationship(
        "Puzzle"
    )