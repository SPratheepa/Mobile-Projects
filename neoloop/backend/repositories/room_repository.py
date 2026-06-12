from repositories.base_repository import BaseRepository

from models.room import Room


class RoomRepository(BaseRepository):

    def __init__(self):

        super().__init__(Room)

    def get_by_id(
            self,
            room_id
    ):

        return Room.query.filter(
            Room.id == room_id,
            Room.is_deleted == False
        ).first()

    def get_by_name(
            self,
            name
    ):

        return Room.query.filter(
            Room.name == name,
            Room.is_deleted == False
        ).first()

    def search(
            self,
            page=1,
            per_page=20,
            search=None,
            sort_by="cr_on",
            sort_order="desc",
            filters=None
    ):

        #query = Room.query.filter(
        #    Room.is_deleted == False
        #)

        return self.paginate(
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            sort_order=sort_order,
            filters=filters,
            search_term=search,
            search_fields=[
                "name",
                "description",
                "story"
            ]
        )