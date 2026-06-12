import os
from flask import Blueprint
from flask import request

from flasgger import swag_from

from blueprints.auth import auth_service

from utils.responses import (
    success_response,
    error_response
)

from schemas.login_schema import (
    LoginSchema
)

from utils.schema_validator import (
    SchemaValidator
)

from utils.auth_utils import (
    auth_required,
    get_current_user
)

from utils.swagger_docs import swag

login_bp = Blueprint(
    "login",
    __name__,
    url_prefix="/api/auth"
)

@login_bp.route(
    "/login",
    methods=["POST"]
)
@swag_from(swag("auth", "login.yml"))
def login():
    payload = SchemaValidator.validate(LoginSchema(),
        request.get_json()
    )

    tokens = (
        auth_service
        .authenticate_user(
            payload["email"],
            payload["password"]
        )
    )

    return success_response(
        tokens,
        "Login successful"
    )

    
@login_bp.route(
    "/logout",
    methods=["POST"]
)
@auth_required
def logout():

    current_user = get_current_user()

    auth_service.logout_user(
        current_user.id
    )

    return success_response(
        {},
        "Logout successful"
    )