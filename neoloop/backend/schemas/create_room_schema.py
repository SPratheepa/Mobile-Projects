from marshmallow import (
    Schema,
    fields,
    validate
)


class CreateRoomSchema(
    Schema
):

    name = fields.String(
        required=True,
        validate=validate.Length(
            min=3,
            max=255
        )
    )

    description = fields.String(
        required=True
    )

    story = fields.String(
        required=False,
        allow_none=True
    )

    room_type = fields.String(
        required=True
    )

    difficulty = fields.String(
        required=True,
        validate=validate.OneOf(
            [
                "EASY",
                "MEDIUM",
                "HARD"
            ]
        )
    )

    estimated_time = fields.Integer(
        required=True
    )

    max_loops = fields.Integer(
        load_default=1
    )

    thumbnail = fields.Dict(
        load_default={}
    )