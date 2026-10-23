"""
Scans — Web & API security scanning with OWASP ZAP integration
"""
from django.db import models
from django.conf import settings
import uuid


class ScanType(models.TextChoices):
    WEB_SCAN = 'web', 'Web Security Scan'
    API_SCAN = 'api', 'API Security Scan'
    HEADER_SCAN = 'headers', 'Security Headers Scan'
    FULL_SCAN = 'full', 'Full Security Scan'


class ScanStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    QUEUED = 'queued', 'Queued'
    RUNNING = 'running', 'Running'
    COMPLETED = 'completed', 'Completed'
    FAILED = 'failed', 'Failed'
    CANCELLED = 'cancelled', 'Cancelled'


class Scan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, related_name='scans'
    )
    asset = models.ForeignKey(
        'assets.Asset', on_delete=models.SET_NULL, null=True, blank=True, related_name='scans'
    )
    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='scans'
    )
    scan_type = models.CharField(max_length=20, choices=ScanType.choices)
    target_url = models.URLField()
    status = models.CharField(max_length=20, choices=ScanStatus.choices, default=ScanStatus.PENDING)
    progress = models.IntegerField(default=0)
    celery_task_id = models.CharField(max_length=255, blank=True)
    security_score = models.IntegerField(null=True, blank=True)
    findings_count = models.JSONField(default=dict)
    zap_scan_id = models.CharField(max_length=255, blank=True)
    scan_config = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Scan {self.id} — {self.target_url} ({self.status})'

    @property
    def duration_seconds(self):
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return None


class ScanFinding(models.Model):
    """Individual finding from a scan"""
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('informational', 'Informational'),
    ]
    CONFIDENCE_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('false_positive', 'False Positive'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE, related_name='findings')
    title = models.CharField(max_length=500)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    confidence = models.CharField(max_length=20, choices=CONFIDENCE_CHOICES, default='medium')
    category = models.CharField(max_length=100, blank=True)
    url = models.URLField(blank=True)
    parameter = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    evidence = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    reference = models.TextField(blank=True)
    cwe_id = models.IntegerField(null=True, blank=True)
    wasc_id = models.IntegerField(null=True, blank=True)
    zap_alert_id = models.CharField(max_length=100, blank=True)
    raw_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.severity.upper()} — {self.title}'
