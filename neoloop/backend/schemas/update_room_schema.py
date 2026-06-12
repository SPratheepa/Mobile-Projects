from marshmallow import (
    Schema,
    fields
)


class UpdateRoomSchema(
    Schema
):

    name = fields.String()

    description = fields.String()

    story = fields.String()

    room_type = fields.String()

    difficulty = fields.String()

    estimated_time = fields.Integer()

    max_loops = fields.Integer()

    thumbnail = fields.Dict()