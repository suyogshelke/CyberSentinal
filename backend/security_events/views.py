from rest_framework import viewsets, permissions
from .models import SecurityEvent
from .serializers import SecurityEventListSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
class SecurityEventViewSet(viewsets.ModelViewSet):
    serializer_class = SecurityEventListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['severity', 'category', 'event_type']
    search_fields = ['message', 'source', 'source_ip', 'event_type']
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return SecurityEvent.objects.filter(organization=user.organization)
        return SecurityEvent.objects.none()
    def perform_create(self, serializer):
        event = serializer.save(organization=self.request.user.organization, timestamp=timezone.now())
        channel_layer = get_channel_layer()
        if channel_layer:
            try:
                async_to_sync(channel_layer.group_send)(f'events_{str(event.organization_id)}', {'type': 'security_event', 'data': SecurityEventListSerializer(event).data})
            except Exception:
                pass
