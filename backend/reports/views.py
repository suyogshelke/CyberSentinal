from rest_framework import viewsets, permissions
from rest_framework.response import Response


class ReportViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        data = [
            {'id': '1', 'title': 'Security Posture Report', 'report_type': 'executive', 'created_at': '2026-01-01'},
            {'id': '2', 'title': 'Vulnerability Report', 'report_type': 'technical', 'created_at': '2026-01-01'},
            {'id': '3', 'title': 'Incident Summary', 'report_type': 'incident', 'created_at': '2026-01-01'},
        ]
        return Response(data)
