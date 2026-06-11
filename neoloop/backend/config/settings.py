import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()


class Config:

    password = quote_plus(os.getenv("DB_PASSWORD"))

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg://"
        f"{os.getenv('DB_USER')}:"
        f"{password}@"
        f"{os.getenv('DB_HOST')}:"
        f"{os.getenv('DB_PORT')}/"
        f"{os.getenv('DB_NAME')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")