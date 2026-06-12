from marshmallow import Schema, fields


class SearchSchema(Schema):

    page = fields.Integer(
        load_default=1
    )

    per_page = fields.Integer(
        load_default=20
    )

    search = fields.String(
        load_default=""
    )

    sort_by = fields.String(
        load_default="cr_on"
    )

    sort_order = fields.String(
        load_default="desc"
    )

    filters = fields.Dict(
        load_default={}
    )