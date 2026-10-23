from rest_framework import viewsets, permissions
from .models import Incident, IncidentTimeline
from rest_framework import serializers
class IncidentTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentTimeline
        fields = '__all__'
class IncidentSerializer(serializers.ModelSerializer):
    assigned_to = serializers.SerializerMethodField()
    def get_assigned_to(self, obj):
        return {'username': obj.assigned_to.username} if obj.assigned_to else None
    class Meta:
        model = Incident
        fields = '__all__'
class IncidentViewSet(viewsets.ModelViewSet):
    serializer_class = IncidentSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['title', 'description', 'incident_id']
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return Incident.objects.filter(organization=user.organization)
        return Incident.objects.none()
