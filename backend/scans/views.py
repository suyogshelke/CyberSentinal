from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Scan, ScanFinding
from rest_framework import serializers
from django.utils import timezone
from .tasks import run_web_scan
class ScanFindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanFinding
        fields = '__all__'
class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = '__all__'
class ScanViewSet(viewsets.ModelViewSet):
    serializer_class = ScanSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return Scan.objects.filter(organization=user.organization)
        return Scan.objects.none()
    def perform_create(self, serializer):
        scan = serializer.save(initiated_by=self.request.user, organization=self.request.user.organization)
        run_web_scan.delay(str(scan.id))
    @action(detail=True, methods=['get'])
    def findings(self, request, pk=None):
        scan = self.get_object()
        findings = scan.findings.all()
        return Response(ScanFindingSerializer(findings, many=True).data)
