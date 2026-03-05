"""Diagnosis request/response schemas."""
from marshmallow import Schema, fields


class GenerateDiagnosisRequestSchema(Schema):
    session_token = fields.Str(required=True)


class DiagnosisResponseSchema(Schema):
    id = fields.Str()
    diagnosis_text = fields.Str()
    favorable_days = fields.Int()
    blocked_area = fields.Str()
    blockage_level = fields.Int()
    created_at = fields.DateTime()


class CaptureEmailRequestSchema(Schema):
    email = fields.Email(required=True)
    session_token = fields.Str(required=True)
    quiz_data = fields.Dict(load_default=None)
