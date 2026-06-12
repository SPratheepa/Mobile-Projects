import os
from flask import Blueprint
from flask import request

from utils.responses import (
    success_response,
    error_response
)

from blueprints.auth import auth_service
from schemas.register_schema import (
    RegisterSchema
)

from utils.schema_validator import (
    SchemaValidator
)

from flasgger import swag_from
from utils.swagger_docs import swag

registration_bp = Blueprint("registration", __name__, url_prefix="/api/auth")

@registration_bp.route("/register", methods=["POST"])
@swag_from(swag("auth", "register.yml"))
def register():
    payload = SchemaValidator.validate(
        RegisterSchema(),
        request.get_json()
    )

    user = auth_service.register_user(
        payload
    )

    return success_response({"user_id": user.id},
        "User registered successfully",
        201
    )