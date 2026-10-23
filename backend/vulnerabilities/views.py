from rest_framework import viewsets, permissions
from .models import Vulnerability
from rest_framework import serializers
class VulnerabilitySerializer(serializers.ModelSerializer):
    asset = serializers.SerializerMethodField()
    def get_asset(self, obj):
        return {'name': obj.asset.name} if obj.asset else None
    class Meta:
        model = Vulnerability
        fields = '__all__'
class VulnerabilityViewSet(viewsets.ModelViewSet):
    serializer_class = VulnerabilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['severity', 'status']
    search_fields = ['title', 'description', 'cve_id']
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return Vulnerability.objects.filter(organization=user.organization)
        return Vulnerability.objects.none()
