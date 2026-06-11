import re

from marshmallow import ValidationError, validate



def validate_password_strength(password):

    pattern = (
        r"^(?=.*[a-z])"
        r"(?=.*[A-Z])"
        r"(?=.*\d)"
        r"(?=.*[@$!%*?&])"
    )

    if not re.match(pattern, password):

        raise ValidationError(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        )
    
PASSWORD_VALIDATORS = [
    validate.Length(min=8, max=100),
    validate_password_strength
]
