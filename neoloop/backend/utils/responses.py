from flask import jsonify


def success_response(
        data=None,
        message="Success",
        status_code=200
):

    return jsonify({
        "success": True,
        "status": "success",
        "status_code": status_code,
        "message": message,
        "data": data
    }), status_code


def error_response(
        message="Error",
        errors=None,
        status_code=400
):

    return jsonify({
        "success": False,
        "status": "failure",
        "status_code": status_code,
        "message": message,
        "errors": errors
    }), status_code