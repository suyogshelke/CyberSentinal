from rest_framework import viewsets, permissions
from rest_framework.response import Response


class NotificationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        return Response([])
