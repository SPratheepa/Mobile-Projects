from repositories.base_repository import BaseRepository

from models.user import User


class UserRepository(BaseRepository):

    def __init__(self):

        super().__init__(User)

    def get_by_email(
            self,
            email
    ):

        return User.query.filter(
            User.email == email,
            User.is_deleted == False
        ).first()

    def exists_by_email(
            self,
            email
    ):

        return (
            self.get_by_email(email)
            is not None
        )

    def get_active_user(
            self,
            user_id
    ):

        return User.query.filter(
            User.id == user_id,
            User.is_deleted == False,
            User.status == "ACTIVE"
        ).first()

    def update_password(
            self,
            user,
            password_hash
    ):

        user.password_hash = password_hash

        self.update()

        return user