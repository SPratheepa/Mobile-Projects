from config.database import db

from sqlalchemy.sql import func


class BaseModel(db.Model):

    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)

    cr_on = db.Column(
        db.DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    cr_by = db.Column(db.String(255))

    up_on = db.Column(
        db.DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    up_by = db.Column(db.String(255))

    del_on = db.Column(db.DateTime(timezone=True))

    del_by = db.Column(db.String(255))

    is_deleted = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )