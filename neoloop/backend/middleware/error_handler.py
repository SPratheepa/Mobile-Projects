import traceback

from utils.responses import (
    error_response
)

from utils.exceptions import (
    ValidationException,
    PermissionDeniedException,
    NotFoundException,
    ServiceException
)

def handle_validation_error(error):

    return error_response(
        message=str(error),
        status_code=400
    )

def handle_permission_error(error):

    return error_response(
        message=str(error),
        status_code=403
    )

def handle_not_found(error):

    return error_response(
        message=str(error),
        status_code=404
    )

def handle_service_error(error):

    return error_response(
        message=str(error),
        status_code=500
    )

def handle_unexpected_error(error):

    traceback.print_exc()

    return error_response(
        message="Internal Server Error",
        status_code=500
    )

def register_error_handlers(app):

    app.register_error_handler(
        ValidationException,
        handle_validation_error
    )

    app.register_error_handler(
        PermissionDeniedException,
        handle_permission_error
    )

    app.register_error_handler(
        NotFoundException,
        handle_not_found
    )

    app.register_error_handler(
        ServiceException,
        handle_service_error
    )

    app.register_error_handler(
        Exception,
        handle_unexpected_error
    )