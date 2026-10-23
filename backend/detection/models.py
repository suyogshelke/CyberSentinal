"""
Detection Engine — rules-based threat detection
"""
from django.db import models
import uuid


class DetectionRule(models.Model):
    RULE_TYPE_CHOICES = [
        ('threshold', 'Threshold'),
        ('pattern', 'Pattern Match'),
        ('anomaly', 'Anomaly'),
        ('correlation', 'Correlation'),
        ('ioc', 'IOC Match'),
    ]
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, null=True, blank=True, related_name='detection_rules'
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    category = models.CharField(max_length=100, blank=True)
    conditions = models.JSONField(default=dict)
    # e.g. {"event_type": "authentication_failure", "threshold": 5, "window_seconds": 120}
    actions = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    is_system_rule = models.BooleanField(default=False)
    false_positive_rate = models.FloatField(default=0.0)
    trigger_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.severity})'


class DetectionAlert(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('acknowledged', 'Acknowledged'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('false_positive', 'False Positive'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, related_name='detection_alerts'
    )
    rule = models.ForeignKey(DetectionRule, on_delete=models.SET_NULL, null=True, related_name='alerts')
    title = models.CharField(max_length=500)
    severity = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    source_ip = models.GenericIPAddressField(null=True, blank=True)
    affected_asset = models.ForeignKey(
        'assets.Asset', on_delete=models.SET_NULL, null=True, blank=True
    )
    context = models.JSONField(default=dict)
    risk_score = models.FloatField(default=0.0)
    incident = models.ForeignKey(
        'incidents.Incident', on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts'
    )
    triggered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-triggered_at']

    def __str__(self):
        return f'ALERT: {self.title} ({self.severity})'
