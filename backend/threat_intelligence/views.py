from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import ThreatIntelligence
from rest_framework import serializers
import requests
from django.conf import settings
class ThreatIntelligenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreatIntelligence
        fields = '__all__'
class ThreatIntelligenceViewSet(viewsets.ModelViewSet):
    serializer_class = ThreatIntelligenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return ThreatIntelligence.objects.filter(organization=user.organization)
        return ThreatIntelligence.objects.none()
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def ioc_lookup(request):
    indicator = request.data.get('indicator', '')
    ioc_type = request.data.get('ioc_type', 'ip')
    if not indicator:
        return Response({'error': 'indicator required'}, status=400)
    obj, created = ThreatIntelligence.objects.get_or_create(
        indicator=indicator, ioc_type=ioc_type,
        defaults={'organization': request.user.organization}
    )
    return Response(ThreatIntelligenceSerializer(obj).data)
