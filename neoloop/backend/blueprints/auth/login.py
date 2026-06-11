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

from utils.swagger_paths import SWAGGER_DIR
LOGIN_SWAGGER = os.path.join(SWAGGER_DIR, "auth", "login.yml")

login_bp = Blueprint(
    "login",
    __name__,
    url_prefix="/api/auth"
)

@login_bp.route(
    "/login",
    methods=["POST"]
)
@swag_from(LOGIN_SWAGGER)
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

    