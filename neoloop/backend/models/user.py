from config.database import db
from models.base_model import BaseModel


class User(BaseModel):

    __tablename__ = "users"

    role_id = db.Column(
        db.Integer,
        db.ForeignKey("roles.id"),
        nullable=False
    )

    name = db.Column(db.String(100))

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False
    )

    email_otp = db.Column(db.String(10))

    email_otp_expiry = db.Column(
        db.DateTime(timezone=True)
    )

    last_login = db.Column(
        db.DateTime(timezone=True)
    )

    image = db.Column(db.JSON)

    reset_token = db.Column(
        db.String(1024)
    )

    reset_token_expires = db.Column(
        db.DateTime(timezone=True)
    )

    role = db.relationship(
        "Role",
        lazy=True
    )