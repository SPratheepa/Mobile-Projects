from marshmallow import (
    Schema,
    fields
)
class RoomResponseSchema(Schema):

    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    room_type = fields.Str()
    difficulty = fields.Str()
    estimated_time = fields.Int()
    status = fields.Str()
    is_published = fields.Bool()
    creator_id = fields.Int()