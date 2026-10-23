"""
Dashboard metrics endpoint
"""
from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    """Aggregate security metrics for the command center dashboard"""
    from vulnerabilities.models import Vulnerability, VulnerabilityStatus
    from security_events.models import SecurityEvent
    from incidents.models import Incident, IncidentStatus
    from assets.models import Asset
    from scans.models import Scan, ScanStatus

    org = request.user.organization
    now = timezone.now()
    last_24h = now - timedelta(hours=24)

    # Filter by org if available
    q_org = Q(organization=org) if org else Q()

    vuln_counts = Vulnerability.objects.filter(q_org).exclude(
        status=VulnerabilityStatus.RESOLVED
    ).values('severity').annotate(count=Count('id'))
    vuln_by_severity = {item['severity']: item['count'] for item in vuln_counts}

    open_incidents = Incident.objects.filter(q_org).exclude(
        status__in=['resolved', 'closed']
    ).count()

    total_assets = Asset.objects.filter(q_org, is_active=True).count()
    active_scans = Scan.objects.filter(q_org, status=ScanStatus.RUNNING).count()

    events_24h = SecurityEvent.objects.filter(
        q_org, timestamp__gte=last_24h
    ).count()

    critical_events_24h = SecurityEvent.objects.filter(
        q_org, timestamp__gte=last_24h, severity='critical'
    ).count()

    # Simple risk score calculation
    critical_count = vuln_by_severity.get('critical', 0)
    high_count = vuln_by_severity.get('high', 0)
    medium_count = vuln_by_severity.get('medium', 0)
    max_score = 100
    penalty = (critical_count * 15) + (high_count * 5) + (medium_count * 2) + (open_incidents * 3)
    security_score = max(0, min(max_score, max_score - penalty))

    recent_events = SecurityEvent.objects.filter(q_org).order_by('-timestamp')[:10]
    from security_events.serializers import SecurityEventListSerializer
    events_data = SecurityEventListSerializer(recent_events, many=True).data

    return Response({
        'security_score': security_score,
        'vulnerabilities': {
            'critical': vuln_by_severity.get('critical', 0),
            'high': vuln_by_severity.get('high', 0),
            'medium': vuln_by_severity.get('medium', 0),
            'low': vuln_by_severity.get('low', 0),
            'informational': vuln_by_severity.get('informational', 0),
        },
        'open_incidents': open_incidents,
        'total_assets': total_assets,
        'active_scans': active_scans,
        'events_24h': events_24h,
        'critical_events_24h': critical_events_24h,
        'recent_events': events_data,
        'system_status': 'operational',
        'generated_at': now.isoformat(),
    })


urlpatterns = [
    path('metrics/', dashboard_metrics, name='dashboard_metrics'),
]
