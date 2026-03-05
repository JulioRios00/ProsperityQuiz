"""Quiz request/response schemas."""
from marshmallow import Schema, fields, validate


class StartQuizResponseSchema(Schema):
    session_token = fields.Str()
    quiz_id = fields.Str()


class SaveStepRequestSchema(Schema):
    session_token = fields.Str(required=True)
    step = fields.Int(required=True, validate=validate.Range(min=1, max=16))
    response = fields.Raw(required=True)


class SaveStepResponseSchema(Schema):
    session_token = fields.Str()
    current_step = fields.Int()
    next_step = fields.Int()
    progress = fields.Float()
    is_completed = fields.Bool()


class QuizSessionResponseSchema(Schema):
    session_token = fields.Str()
    current_step = fields.Int()
    responses = fields.Dict()
    is_completed = fields.Bool()
    started_at = fields.DateTime()
