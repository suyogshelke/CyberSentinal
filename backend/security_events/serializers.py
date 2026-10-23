from rest_framework import serializers
from .models import SecurityEvent


class SecurityEventListSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True, default=None)

    class Meta:
        model = SecurityEvent
        fields = [
            'id', 'event_type', 'category', 'severity', 'source',
            'source_ip', 'message', 'risk_score', 'timestamp',
            'user_email', 'created_at'
        ]
