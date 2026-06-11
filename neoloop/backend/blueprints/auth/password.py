import os
from flask import Blueprint
from flask import request

from flask_jwt_extended import (
    get_jwt_identity
)

from flasgger import swag_from

from blueprints.auth import auth_service

from utils.auth_utils import (
    auth_required
)

from utils.responses import (
    success_response,
    error_response
)
from schemas.forgot_password_schema import (
    ForgotPasswordSchema
)
from schemas.reset_password_schema import (
    ResetPasswordSchema
)
from schemas.change_password_schema import (
    ChangePasswordSchema
)
from utils.schema_validator import (
    SchemaValidator
)
from utils.swagger_paths import SWAGGER_DIR

REQUEST_PASSWORD_RESET_SWAGGER = os.path.join(SWAGGER_DIR, "auth", "request_password_reset.yml")
RESET_PASSWORD_SWAGGER = os.path.join(SWAGGER_DIR, "auth", "reset_password.yml")
CHANGE_PASSWORD_SWAGGER = os.path.join(SWAGGER_DIR, "auth", "change_password.yml")

password_bp = Blueprint(
    "password",
    __name__,
    url_prefix="/api/auth"
)

@password_bp.route("/request-password-reset", methods=["POST"])
@swag_from(REQUEST_PASSWORD_RESET_SWAGGER)
def request_password_reset():
    payload = SchemaValidator.validate(
        ForgotPasswordSchema(),
        request.get_json()
    )

    token = (
        auth_service
        .request_password_reset(
            payload["email"]
        )
    )

    return success_response(
        {
            "reset_token": token
        }
    )
    

@password_bp.route("/reset-password", methods=["POST"])
@swag_from(RESET_PASSWORD_SWAGGER)
def reset_password():
    payload = SchemaValidator.validate(
        ResetPasswordSchema(),
        request.get_json()
    )
    auth_service.reset_password(
        payload["token"],
        payload["new_password"]
    )

    return success_response(
        message="Password reset successful"
    )
    
@password_bp.route("/change-password", methods=["POST"])
@swag_from(CHANGE_PASSWORD_SWAGGER)
@auth_required
def change_password():
    payload = SchemaValidator.validate(
        ChangePasswordSchema(),
        request.get_json()
    )

    auth_service.change_password(
        int(
            get_jwt_identity()
        ),
        payload["current_password"],
        payload["new_password"]
    )

    return success_response(
        message="Password changed successfully"
    )

