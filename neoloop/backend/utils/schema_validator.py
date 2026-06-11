from marshmallow import ValidationError

from utils.exceptions import (
    ValidationException
)

class SchemaValidator:

    @staticmethod
    def validate(
            schema,
            payload
    ):

        try:

            return schema.load(
                payload
            )

        except ValidationError as ex:

            raise ValidationException(ex.messages)