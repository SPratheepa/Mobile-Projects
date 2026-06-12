# utils/swagger_docs.py

import os

SWAGGER_DIR = os.path.join(
    os.getcwd(),
    "swagger"
)

def swag(*paths):

    return os.path.join(
        SWAGGER_DIR,
        *paths
    )