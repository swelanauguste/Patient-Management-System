from rest_framework import serializers

from .models import PatientRecord


class PatientRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientRecord
        fields = ["id", "first_name", "last_name", "middle_name", "gender", "age", "created_at", "updated_at"]

    def validate_age(self, value):
        if value <= 0:
            raise serializers.ValidationError("Age must be a positive integer.")
        return value
