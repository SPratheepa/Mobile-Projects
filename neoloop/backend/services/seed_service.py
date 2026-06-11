from config.database import db
from models.role import Role


class SeedService:

    @staticmethod
    def seed_roles():

        roles = [
            {
                "code": "ADMIN",
                "name": "Administrator"
            },
            {
                "code": "CREATOR",
                "name": "Creator"
            },
            {
                "code": "PLAYER",
                "name": "Player"
            }
        ]

        for role_data in roles:

            role = Role.query.filter_by(
                code=role_data["code"],
                is_deleted=False
            ).first()

            if not role:

                db.session.add(
                    Role(
                        code=role_data["code"],
                        name=role_data["name"],
                        description=f'{role_data["name"]} Role',
                        is_active=True,
                        is_deleted=False
                    )
                )

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise