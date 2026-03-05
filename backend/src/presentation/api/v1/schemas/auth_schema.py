"""Auth request/response schemas."""
from marshmallow import Schema, fields, validate


class RegisterRequestSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    name = fields.Str(load_default=None)


class LoginRequestSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class UserResponseSchema(Schema):
    id = fields.Str()
    email = fields.Email()
    name = fields.Str(allow_none=True)
    created_at = fields.DateTime()


class AuthResponseSchema(Schema):
    user = fields.Nested(UserResponseSchema)
    access_token = fields.Str()
    refresh_token = fields.Str()
