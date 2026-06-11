from marshmallow import (
    Schema,
    fields,
    validate
)

from schemas.common_validators import PASSWORD_VALIDATORS


class ChangePasswordSchema(Schema):

    current_password = fields.String(
        required=True
    )

    new_password = fields.String(
        required=True,
        validate=PASSWORD_VALIDATORS
    )