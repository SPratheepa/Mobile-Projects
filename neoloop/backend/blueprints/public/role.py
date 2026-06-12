from flask import Blueprint

from services.role_service import (
    RoleService
)

from utils.responses import (
    success_response
)

role_bp = Blueprint(
    "roles",
    __name__,
    url_prefix="/api/public"
)

role_service = RoleService()


@role_bp.route(
    "/roles",
    methods=["GET"]
)
def get_roles():

    return success_response(
        role_service.get_active_roles()
    )

@role_bp.route(
    "/non-admin-roles",
    methods=["GET"]
)
def get_non_admin_roles():

    return success_response(
        role_service.get_active_non_admin_roles()
    )