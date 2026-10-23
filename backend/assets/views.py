from rest_framework import viewsets, permissions
from .models import Asset
from rest_framework import serializers
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'
class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return Asset.objects.filter(organization=user.organization)
        return Asset.objects.none()
