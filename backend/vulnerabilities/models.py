"""
Vulnerabilities — full lifecycle vulnerability management
"""
from django.db import models
from django.conf import settings
import uuid


class VulnerabilitySeverity(models.TextChoices):
    CRITICAL = 'critical', 'Critical'
    HIGH = 'high', 'High'
    MEDIUM = 'medium', 'Medium'
    LOW = 'low', 'Low'
    INFORMATIONAL = 'informational', 'Informational'


class VulnerabilityStatus(models.TextChoices):
    OPEN = 'open', 'Open'
    INVESTIGATING = 'investigating', 'Investigating'
    ACCEPTED = 'accepted', 'Accepted Risk'
    FALSE_POSITIVE = 'false_positive', 'False Positive'
    RESOLVED = 'resolved', 'Resolved'
    REOPENED = 'reopened', 'Reopened'


class Vulnerability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, related_name='vulnerabilities'
    )
    title = models.CharField(max_length=500)
    severity = models.CharField(max_length=20, choices=VulnerabilitySeverity.choices)
    status = models.CharField(max_length=20, choices=VulnerabilityStatus.choices, default=VulnerabilityStatus.OPEN)
    asset = models.ForeignKey(
        'assets.Asset', on_delete=models.SET_NULL, null=True, blank=True, related_name='vulnerabilities'
    )
    scan = models.ForeignKey(
        'scans.ScanFinding', on_delete=models.SET_NULL, null=True, blank=True, related_name='vulnerabilities'
    )
    category = models.CharField(max_length=100, blank=True)
    cvss_score = models.FloatField(null=True, blank=True)
    cvss_vector = models.CharField(max_length=100, blank=True)
    cve_id = models.CharField(max_length=30, blank=True)
    cwe_id = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    evidence = models.TextField(blank=True)
    impact = models.TextField(blank=True)
    remediation = models.TextField(blank=True)
    references = models.JSONField(default=list, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_vulnerabilities'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='created_vulnerabilities'
    )
    due_date = models.DateField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.severity.upper()} — {self.title}'
