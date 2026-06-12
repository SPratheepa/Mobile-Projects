from datetime import timedelta
from functools import wraps
from collections import defaultdict
import time

import bcrypt

from flask import g

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from utils.exceptions import (
    ValidationException,
    PermissionDeniedException
)
from models.user import User    

class PasswordHelper:

    @staticmethod
    def hash_password(password: str) -> str:

        salt = bcrypt.gensalt(rounds=12)

        return bcrypt.hashpw(
            password.encode("utf-8"),
            salt
        ).decode("utf-8")

    @staticmethod
    def verify_password(
            password: str,
            password_hash: str
    ) -> bool:

        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8")
        )
    
class AuthHelper:

    @staticmethod
    def authenticate_user(
            email: str,
            password: str,
            device_info=None
    ):

        user = User.query.filter(
            User.email == email,
            User.is_deleted == False
        ).first()

        if not user:
            raise ValidationException(
                "Invalid email or password"
            )

        if not PasswordHelper.verify_password(
                password,
                user.password_hash
        ):
            raise ValidationException(
                "Invalid email or password"
            )

        return user
    
    @staticmethod
    def generate_user_tokens(
            user,
            device_info=None
    ):

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "email": user.email,
                "role_id": user.role_id,
                "role_code": user.role.code
            },
            expires_delta=timedelta(
                minutes=15
            )
        )

        refresh_token = create_refresh_token(
            identity=str(user.id),
            expires_delta=timedelta(
                days=30
            )
        )

        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.code
        }

        tokens = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer"
        }

        return {
            "user": user_data,
            "tokens": tokens
        }
    
def get_current_user():

    return getattr(
        g,
        "current_user",
        None
    )

def get_current_user_details():

    user = get_current_user()

    if not user:
        return {}

    return {
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role.code,
        "role_id": user.role_id
    }

def auth_required(fn):

    @wraps(fn)
    @jwt_required()
    def wrapper(
            *args,
            **kwargs
    ):

        user_id = get_jwt_identity()

        user = User.query.filter(
            User.id == int(user_id),
            User.is_deleted == False
        ).first()

        if not user:
            raise PermissionDeniedException(
                "Unauthorized"
            )

        g.current_user = user

        return fn(
            *args,
            **kwargs
        )

    return wrapper

def role_required(
        allowed_roles
):

    def decorator(fn):

        @wraps(fn)
        @jwt_required()
        def wrapper(
                *args,
                **kwargs
        ):

            user_id = get_jwt_identity()

            user = User.query.filter(
                User.id == int(user_id),
                User.is_deleted == False
            ).first()

            if not user:
                raise PermissionDeniedException(
                    "Unauthorized"
                )

            role_code = (
                user.role.code
                if user.role
                else None
            )

            if role_code not in allowed_roles:
                raise PermissionDeniedException(
                    "Permission denied"
                )

            g.current_user = user

            return fn(
                *args,
                **kwargs
            )

        return wrapper

    return decorator

def admin_required(fn):

    return role_required(
        ["ADMIN"]
    )(fn)


def creator_required(fn):

    return role_required(
        ["CREATOR"]
    )(fn)


def player_required(fn):

    return role_required(
        ["PLAYER"]
    )(fn)

_request_cache = defaultdict(list)

def rate_limit(
        max_requests,
        per_seconds
):

    def decorator(fn):

        @wraps(fn)
        def wrapper(
                *args,
                **kwargs
        ):

            now = time.time()

            key = fn.__name__

            _request_cache[key] = [
                ts
                for ts in _request_cache[key]
                if now - ts < per_seconds
            ]

            if (
                len(
                    _request_cache[key]
                )
                >= max_requests
            ):
                raise PermissionDeniedException(
                    "Rate limit exceeded"
                )

            _request_cache[key].append(
                now
            )

            return fn(
                *args,
                **kwargs
            )

        return wrapper

    return decorator