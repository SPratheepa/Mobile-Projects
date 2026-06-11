from config.database import db
from models.base_model import BaseModel


class Role(BaseModel):

    __tablename__ = "roles"

    code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.String(255)
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )