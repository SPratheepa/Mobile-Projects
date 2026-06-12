import os
from flask import Blueprint

from flask_jwt_extended import (
    get_jwt_identity
)

from flasgger import swag_from

from blueprints.auth import auth_service

from utils.auth_utils import (
    auth_required, get_current_user_details
)

from utils.responses import (
    success_response
)
from utils.swagger_docs import swag

profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api/auth"
)

@profile_bp.route(
    "/me",
    methods=["GET"]
)
@auth_required
@swag_from(swag("auth", "profile.yml"))
def me():
    return success_response(
        get_current_user_details()
    )