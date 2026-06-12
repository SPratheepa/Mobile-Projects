from repositories.base_repository import BaseRepository

from models.role import Role


class RoleRepository(BaseRepository):

    def __init__(self):

        super().__init__(Role)

    def get_by_code(self, code):

        return Role.query.filter(
            Role.code == code,
            Role.is_deleted == False
        ).first()
    
    def get_all_active(self):

        return Role.query.filter(
            Role.is_deleted == False,
            Role.is_active == True
        ).all()