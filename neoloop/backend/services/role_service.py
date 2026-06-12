from repositories.role_repository import RoleRepository


class RoleService:

    def __init__(self):

        self.role_repo = RoleRepository()

    def get_active_roles(self):

        roles = self.role_repo.get_all_active()

        return [
            {
                "id": role.id,
                "code": role.code,
                "name": role.name
            }
            for role in roles
        ]
    
    def get_active_non_admin_roles(self):

        roles = self.role_repo.get_all_active()

        return [
            {
                "id": role.id,
                "code": role.code,
                "name": role.name
            }
            for role in roles
            if role.code != "ADMIN"
        ]