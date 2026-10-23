"""
Incidents — SOC-style incident response workflow
"""
from django.db import models
from django.conf import settings
import uuid


class IncidentSeverity(models.TextChoices):
    CRITICAL = 'critical', 'Critical'
    HIGH = 'high', 'High'
    MEDIUM = 'medium', 'Medium'
    LOW = 'low', 'Low'


class IncidentStatus(models.TextChoices):
    NEW = 'new', 'New'
    INVESTIGATING = 'investigating', 'Investigating'
    CONTAINED = 'contained', 'Contained'
    ERADICATED = 'eradicated', 'Eradicated'
    RECOVERED = 'recovered', 'Recovered'
    RESOLVED = 'resolved', 'Resolved'
    CLOSED = 'closed', 'Closed'


class Incident(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, related_name='incidents'
    )
    incident_id = models.CharField(max_length=30, unique=True)  # INC-2026-00421
    title = models.CharField(max_length=500)
    severity = models.CharField(max_length=20, choices=IncidentSeverity.choices)
    status = models.CharField(max_length=20, choices=IncidentStatus.choices, default=IncidentStatus.NEW)
    source = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    affected_assets = models.ManyToManyField('assets.Asset', blank=True, related_name='incidents')
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_incidents'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='created_incidents'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.incident_id} — {self.title}'

    def save(self, *args, **kwargs):
        if not self.incident_id:
            from django.utils import timezone
            now = timezone.now()
            count = Incident.objects.filter(created_at__year=now.year).count() + 1
            self.incident_id = f'INC-{now.year}-{count:05d}'
        super().save(*args, **kwargs)


class IncidentTimeline(models.Model):
    TIMELINE_TYPE_CHOICES = [
        ('detection', 'Detection'),
        ('investigation', 'Investigation'),
        ('containment', 'Containment'),
        ('eradication', 'Eradication'),
        ('recovery', 'Recovery'),
        ('note', 'Analyst Note'),
        ('status_change', 'Status Change'),
        ('evidence', 'Evidence Added'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='timeline')
    event_type = models.CharField(max_length=20, choices=TIMELINE_TYPE_CHOICES)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
