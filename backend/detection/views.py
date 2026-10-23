from rest_framework import viewsets, permissions
from .models import DetectionRule, DetectionAlert
from rest_framework import serializers
class DetectionRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectionRule
        fields = '__all__'
class DetectionAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectionAlert
        fields = '__all__'
class DetectionRuleViewSet(viewsets.ModelViewSet):
    queryset = DetectionRule.objects.filter(is_active=True)
    serializer_class = DetectionRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
class DetectionAlertViewSet(viewsets.ModelViewSet):
    serializer_class = DetectionAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.organization:
            return DetectionAlert.objects.filter(organization=user.organization)
        return DetectionAlert.objects.none()
