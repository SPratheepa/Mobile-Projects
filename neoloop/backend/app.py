from flask import Flask

from flask_migrate import Migrate

from flask_jwt_extended import JWTManager

from config.database import db
from config.settings import Config

# IMPORTANT
import models

migrate = Migrate()


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)

    migrate.init_app(app, db)

    JWTManager(app)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)