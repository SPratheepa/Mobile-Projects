from repositories.room_repository import (
    RoomRepository
)

from models.room import Room

from utils.audit_utils import (
    audit_on_create,
    audit_on_update,
    audit_on_soft_delete
)

from utils.exceptions import (
    ValidationException,
    NotFoundException,
    PermissionDeniedException
)

from config.database import db


class RoomService:

    def __init__(self):

        self.repo = RoomRepository()

    def create_room(
            self,
            payload,
            current_user
    ):

        existing = self.repo.get_by_name(
            payload["name"]
        )

        if existing:

            raise ValidationException(
                "Room name already exists"
            )

        room = Room(
            name=payload["name"],
            description=payload.get(
                "description"
            ),
            story=payload.get(
                "story"
            ),
            room_type=payload.get(
                "room_type"
            ),
            difficulty=payload.get(
                "difficulty"
            ),
            estimated_time=payload.get(
                "estimated_time"
            ),
            max_loops=payload.get(
                "max_loops",
                1
            ),
            thumbnail=payload.get(
                "thumbnail",
                {}
            ),
            creator_id=current_user.id,
            status="DRAFT",
            is_published=False
        )

        audit_on_create(room)

        db.session.add(room)

        db.session.commit()

        return room
    
    def update_room(self, room_id, payload, current_user):

        room = self.repo.get_by_id(
            room_id
        )

        if not room:

            raise NotFoundException(
                "Room not found"
            )

        if (
            room.creator_id
            != current_user.id
        ):
            raise PermissionDeniedException(
                "You do not own this room"
            )
        
        if "name" in payload:

            existing = self.repo.get_by_name(
                payload["name"]
            )

            if (
                existing
                and existing.id != room.id
            ):
                raise ValidationException(
                    "Room name already exists"
                )

        for key, value in payload.items():

            setattr(
                room,
                key,
                value
            )

        audit_on_update(room)

        db.session.commit()

        return room
    
    def delete_room(
            self,
            room_id,
            current_user
    ):

        room = self.repo.get_by_id(
            room_id
        )

        if not room:

            raise NotFoundException(
                "Room not found"
            )

        if (
            room.creator_id
            != current_user.id
        ):
            raise PermissionDeniedException(
                "You do not own this room"
            )

        audit_on_soft_delete(
            room
        )

        db.session.commit()

        return True
    
    def publish_room(
            self,
            room_id,
            current_user
    ):

        room = self.repo.get_by_id(
            room_id
        )

        if not room:

            raise NotFoundException(
                "Room not found"
            )

        if (
            room.creator_id
            != current_user.id
        ):
            raise PermissionDeniedException(
                "You do not own this room"
            )

        room.is_published = True

        room.status = "PUBLISHED"

        audit_on_update(room)

        db.session.commit()

        return room
    
    def get_room(
            self,
            room_id
    ):

        room = self.repo.get_by_id(
            room_id
        )

        if not room:

            raise NotFoundException(
                "Room not found"
            )

        return room
    
    def search_rooms(
            self,
            page,
            per_page,
            search,
            sort_by,
            sort_order,
            filters
    ):

        return self.repo.search(
            page=page,
            per_page=per_page,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            filters=filters
        )
    
    def unpublish_room(
            self,
            room_id,
            current_user
    ):

        room = self.repo.get_by_id(
            room_id
        )

        if not room:
            raise NotFoundException(
                "Room not found"
            )

        if room.creator_id != current_user.id:
            raise PermissionDeniedException(
                "You do not own this room"
            )

        room.is_published = False
        room.status = "DRAFT"

        audit_on_update(room)

        db.session.commit()

        return room