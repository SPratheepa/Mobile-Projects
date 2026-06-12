from flask import Flask

from flask_migrate import Migrate

from flask_jwt_extended import JWTManager
from flasgger import Swagger
from config.swagger_config import (swagger_template)

from config.database import db
from config.settings import Config

import models
from flask_cors import CORS

from services.seed_service import SeedService

from blueprints.auth.registration import registration_bp
from blueprints.auth.login import login_bp
from blueprints.auth.profile import profile_bp
from blueprints.auth.password import password_bp
from blueprints.rooms.room import room_bp
from blueprints.public.role import role_bp

from middleware.error_handler import (
    register_error_handlers
)

migrate = Migrate()


def create_app():

    app = Flask(__name__)

    CORS(app)

    app.config.from_object(Config)

    db.init_app(app)

    migrate.init_app(app, db)

    JWTManager(app)

    Swagger(app, template=swagger_template)

    with app.app_context():
        SeedService.seed_roles()

    app.register_blueprint(registration_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(password_bp)
    app.register_blueprint(room_bp)
    app.register_blueprint(role_bp)
    
    register_error_handlers(app)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
