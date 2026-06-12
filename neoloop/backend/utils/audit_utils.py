# utils/audit_utils.py

from datetime import datetime, timezone
from flask_jwt_extended import get_jwt_identity


def _current_user():

    try:
        return str(get_jwt_identity())
    except Exception:
        return "SYSTEM"


def audit_on_create(obj):

    obj.cr_by = _current_user()
    obj.cr_on = datetime.now(timezone.utc)

    return obj


def audit_on_update(obj):

    obj.up_by = _current_user()
    obj.up_on = datetime.now(timezone.utc)

    return obj


def audit_on_soft_delete(obj):

    obj.is_deleted = True
    obj.del_by = _current_user()
    obj.del_on = datetime.now(timezone.utc)

    return obj