from config.database import db


class BaseRepository:

    def __init__(self, model):
        self.model = model

    def get_by_id(self, id):

        return self.model.query.filter(
            self.model.id == id,
            self.model.is_deleted == False
        ).first()

    def create(self, obj):

        db.session.add(obj)

        db.session.commit()

        db.session.refresh(obj)

        return obj

    def update(self):

        db.session.commit()

    def delete(self, obj):

        obj.is_deleted = True

        db.session.commit()

    def get_all(self):

        return self.model.query.filter(
            self.model.is_deleted == False
        ).all()