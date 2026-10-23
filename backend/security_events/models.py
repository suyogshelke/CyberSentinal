"""
Security Events — SIEM event ingestion and storage
"""
from django.db import models
import uuid


class EventSeverity(models.TextChoices):
    CRITICAL = 'critical', 'Critical'
    HIGH = 'high', 'High'
    MEDIUM = 'medium', 'Medium'
    LOW = 'low', 'Low'
    INFO = 'info', 'Info'


class EventCategory(models.TextChoices):
    AUTHENTICATION = 'authentication', 'Authentication'
    AUTHORIZATION = 'authorization', 'Authorization'
    NETWORK = 'network', 'Network'
    APPLICATION = 'application', 'Application'
    SYSTEM = 'system', 'System'
    THREAT = 'threat', 'Threat'
    ANOMALY = 'anomaly', 'Anomaly'
    COMPLIANCE = 'compliance', 'Compliance'


class SecurityEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, related_name='security_events'
    )
    event_type = models.CharField(max_length=100)
    category = models.CharField(max_length=30, choices=EventCategory.choices, default=EventCategory.APPLICATION)
    severity = models.CharField(max_length=20, choices=EventSeverity.choices, default=EventSeverity.INFO)
    source = models.CharField(max_length=255, blank=True)
    source_ip = models.GenericIPAddressField(null=True, blank=True)
    destination_ip = models.GenericIPAddressField(null=True, blank=True)
    user = models.ForeignKey(
        'accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='security_events'
    )
    asset = models.ForeignKey(
        'assets.Asset', on_delete=models.SET_NULL, null=True, blank=True, related_name='security_events'
    )
    message = models.TextField()
    raw_event = models.JSONField(default=dict, blank=True)
    risk_score = models.FloatField(default=0.0)
    is_processed = models.BooleanField(default=False)
    detection_rule = models.ForeignKey(
        'detection.DetectionRule', on_delete=models.SET_NULL, null=True, blank=True
    )
    incident = models.ForeignKey(
        'incidents.Incident', on_delete=models.SET_NULL, null=True, blank=True, related_name='events'
    )
    timestamp = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['organization', 'severity', 'timestamp']),
            models.Index(fields=['source_ip', 'timestamp']),
        ]

    def __str__(self):
        return f'{self.severity.upper()} — {self.event_type} @ {self.timestamp}'
