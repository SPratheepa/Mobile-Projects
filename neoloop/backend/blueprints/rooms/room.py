from flask import (
    Blueprint,
    request
)

from flasgger import (
    swag_from
)

from blueprints.rooms import (
    room_service
)

from schemas.create_room_schema import (
    CreateRoomSchema
)

from schemas.update_room_schema import (
    UpdateRoomSchema
)

from schemas.search_schema import (
    SearchSchema
)

from utils.auth_utils import (
    creator_required,
    auth_required,
    get_current_user
)
from utils.search_utils import parse_search_req
from utils.responses import (
    success_response
)

from utils.schema_validator import (
    SchemaValidator
)
from utils.swagger_docs import swag

room_bp = Blueprint(
    "room",
    __name__,
    url_prefix="/api/rooms"
)


@room_bp.route(
    "",
    methods=["POST"]
)
@creator_required
@swag_from(swag("rooms", "create_room.yml"))
def create_room():

    payload = SchemaValidator.validate(
        CreateRoomSchema(),
        request.get_json()
    )

    room = room_service.create_room(
        payload,
        get_current_user()
    )

    return success_response(
        {
            "id": room.id
        },
        "Room created successfully",
        201
    )

@room_bp.route(
    "/<int:room_id>",
    methods=["PUT"]
)
@creator_required
@swag_from(swag("rooms", "update_room.yml"))
def update_room(
        room_id
):

    payload = SchemaValidator.validate(
        UpdateRoomSchema(),
        request.get_json()
    )

    room_service.update_room(
        room_id,
        payload,
        get_current_user()
    )

    return success_response(
        message="Room updated successfully"
    )

@room_bp.route(
    "/<int:room_id>",
    methods=["DELETE"]
)
@creator_required
@swag_from(swag("rooms", "delete_room.yml"))
def delete_room(
        room_id
):

    room_service.delete_room(
        room_id,
        get_current_user()
    )

    return success_response(
        message="Room deleted successfully"
    )

@room_bp.route(
    "/<int:room_id>/publish",
    methods=["POST"]
)
@creator_required
@swag_from(swag("rooms", "publish_room.yml"))
def publish_room(
        room_id
):

    room_service.publish_room(
        room_id,
        get_current_user()
    )

    return success_response(
        message="Room published successfully"
    )

@room_bp.route(
    "/<int:room_id>/unpublish",
    methods=["POST"]
)
@creator_required
@swag_from(
    swag(
        "rooms",
        "unpublish_room.yml"
    )
)
def unpublish_room(room_id):

    room_service.unpublish_room(
        room_id,
        get_current_user()
    )

    return success_response(
        message="Room unpublished successfully"
    )

@room_bp.route(
    "/<int:room_id>",
    methods=["GET"]
)
@auth_required
@swag_from(swag("rooms", "get_room.yml"))
def get_room(
        room_id
):

    room = room_service.get_room(
        room_id
    )

    return success_response(
        {
            "id": room.id,
            "name": room.name,
            "description": room.description,
            "story": room.story,
            "room_type": room.room_type,
            "difficulty": room.difficulty,
            "estimated_time": room.estimated_time,
            "max_loops": room.max_loops,
            "is_published": room.is_published,
            "status": room.status,
            "creator_id": room.creator_id
        }
    )

@room_bp.route(
    "/search",
    methods=["POST"]
)
@auth_required
@swag_from(
    swag(
        "rooms",
        "search_rooms.yml"
    )
)
def search_rooms():

    payload = SchemaValidator.validate(
        SearchSchema(),
        request.get_json()
    )
    page, per_page, search, sort_by, sort_order, filters = parse_search_req(payload)
    items, pagination = (
        room_service.search_rooms(
            page=page,
            per_page=per_page,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            filters=filters
        )
    )

    return success_response(
        {
            "items": items,
            "pagination": pagination
        }
    )

@room_bp.route("/my-rooms", methods=["POST"])
@creator_required
@swag_from(swag("rooms", "my_rooms.yml"))
def my_rooms():

    payload = SchemaValidator.validate(
        SearchSchema(),
        request.get_json()
    )

    page, per_page, search, sort_by, sort_order, filters = parse_search_req(payload, get_current_user())

    items, pagination = (
        room_service.search_rooms(
            page=page,
            per_page=per_page,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            filters=filters
        )
    )

    return success_response(
        {
            "items": items,
            "pagination": pagination
        }
    )

@room_bp.route(
    "/public",
    methods=["POST"]
)
@auth_required
def public_rooms():

    payload = SchemaValidator.validate(
        SearchSchema(),
        request.get_json()
    )

    page, per_page, search, sort_by, sort_order, filters = parse_search_req(payload)

    filters["is_published"] = True

    items, pagination = (
        room_service.search_rooms(
            page=page,
            per_page=per_page,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            filters=filters
        )
    )

    return success_response(
        {
            "items": items,
            "pagination": pagination
        }
    )