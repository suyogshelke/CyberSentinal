from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def risk_overview(request):
    user = request.user
    q = Q(organization=user.organization) if user.organization else Q()
    from assets.models import Asset
    assets = Asset.objects.filter(q, is_active=True)
    high_risk = assets.filter(risk_level__in=['critical', 'high']).count()
    return Response({
        'total_assets': assets.count(),
        'avg_risk_score': 0.0,
        'high_risk_count': high_risk,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def asset_risk(request):
    user = request.user
    q = Q(organization=user.organization) if user.organization else Q()
    from assets.models import Asset
    from rest_framework import serializers

    class AssetRiskSerializer(serializers.ModelSerializer):
        class Meta:
            model = Asset
            fields = ['id', 'name', 'asset_type', 'risk_level', 'risk_score']

    return Response(AssetRiskSerializer(Asset.objects.filter(q, is_active=True), many=True).data)
