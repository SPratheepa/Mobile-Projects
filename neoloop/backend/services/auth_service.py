from datetime import datetime, timedelta, timezone
import secrets

from config.database import db

from models.user import User

from repositories.user_repository import UserRepository

from utils.exceptions import (
    ValidationException,
    NotFoundException,
    ServiceException  
)

from utils.auth_utils import (
    PasswordHelper,
    AuthHelper
)

class AuthService:

    def __init__(self):

        self.user_repo = UserRepository()

    def register_user(self, payload):

        email = payload["email"]

        existing_user = (self.user_repo.get_by_email(email))

        if existing_user:

            raise ValidationException("Email already exists")

        user = User(
            role_id=payload["role_id"],
            name=payload["name"],
            email=email,
            password_hash=PasswordHelper.hash_password(
                payload["password"]
            ),
            status="ACTIVE",
            is_deleted=False
        )

        return self.user_repo.create(user)
    
    def authenticate_user(
            self,
            email,
            password,
            device_info=None
    ):

        user = AuthHelper.authenticate_user(
            email,
            password,
            device_info
        )

        user.last_login = datetime.now(
            timezone.utc
        )

        db.session.commit()

        tokens = AuthHelper.generate_user_tokens(user)
        return {
            **tokens,
            "device_info": device_info
        }
        
    def get_profile(self, user_id):

        user = (self.user_repo.get_active_user(user_id))

        if not user:
            raise NotFoundException("User not found")

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": user.status,
            "role": user.role.code
        }
    
    def request_password_reset(self, email):

        user = (self.user_repo.get_by_email(email))

        if not user:

            return True

        token = secrets.token_urlsafe(32)

        user.reset_token = token

        user.reset_token_expires = (datetime.now(timezone.utc) + timedelta(hours=1))

        db.session.commit()

        return token
    
    def reset_password(self, token, new_password):

        user = User.query.filter(User.reset_token == token, User.is_deleted == False).first()

        if not user:

            raise ValidationException("Invalid token")

        if (user.reset_token_expires < datetime.now(timezone.utc)):

            raise ValidationException("Token expired")

        user.password_hash = (PasswordHelper.hash_password(new_password))

        user.reset_token = None
        user.reset_token_expires = None

        db.session.commit()

        return True
    
    def change_password(self, user_id, current_password, new_password):

        user = (self.user_repo.get_active_user(user_id))

        if not user:

            raise NotFoundException("User not found")

        if not PasswordHelper.verify_password(current_password, user.password_hash):

            raise ValidationException("Current password incorrect")

        user.password_hash = (PasswordHelper.hash_password(new_password))

        db.session.commit()

        return True
    
    def logout_user(self, user_id):
        return True