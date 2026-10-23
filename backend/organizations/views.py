from rest_framework import viewsets, permissions
from .models import Organization
from rest_framework import serializers
class OrgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrgSerializer
    permission_classes = [permissions.IsAuthenticated]
