import os

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

SWAGGER_DIR = os.path.join(
    PROJECT_ROOT,
    "swagger"
)