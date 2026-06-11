from marshmallow import (
    Schema,
    fields,
    validate
)

from schemas.common_validators import PASSWORD_VALIDATORS

class RegisterSchema(Schema):

    role_id = fields.Integer(required=True)

    name = fields.String(required=True,validate=validate.Length(min=2, max=100))

    email = fields.Email(required=True)

    password = fields.String(
        required=True,
        validate=PASSWORD_VALIDATORS
    )