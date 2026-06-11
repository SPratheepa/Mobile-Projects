swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "NeoLoop API",
        "description": "NeoLoop Escape Room Platform APIs",
        "version": "1.0.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Authorization Header. Example: Bearer <token>"
        }
    }
}