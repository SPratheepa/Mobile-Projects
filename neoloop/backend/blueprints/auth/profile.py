import os
from flask import Blueprint

from flask_jwt_extended import (
    get_jwt_identity
)

from flasgger import swag_from

from blueprints.auth import auth_service

from utils.auth_utils import (
    auth_required
)

from utils.responses import (
    success_response
)
from utils.swagger_paths import SWAGGER_DIR
PROFILE_SWAGGER = os.path.join(SWAGGER_DIR, "auth", "profile.yml")

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
@swag_from(PROFILE_SWAGGER)
def me():
    profile = (
        auth_service
        .get_profile(
            int(
                get_jwt_identity()
            )
        )
    )

    return success_response(
        profile
    )