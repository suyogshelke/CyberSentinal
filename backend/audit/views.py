from rest_framework import viewsets, permissions
from .models import AuditLog
from rest_framework import serializers
class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True, default=None)
    class Meta:
        model = AuditLog
        fields = ['id','action','resource_type','description','ip_address','request_method','request_path','response_status','timestamp','user_email']
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['action']
    search_fields = ['description', 'resource_type']
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return AuditLog.objects.filter(organization=user.organization)
        return AuditLog.objects.none()
