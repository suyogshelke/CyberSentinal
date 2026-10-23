"""
Threat Intelligence — IOC lookup and enrichment
"""
from django.db import models
import uuid


class IOCType(models.TextChoices):
    IP = 'ip', 'IP Address'
    DOMAIN = 'domain', 'Domain'
    URL = 'url', 'URL'
    HASH_MD5 = 'md5', 'MD5 Hash'
    HASH_SHA1 = 'sha1', 'SHA1 Hash'
    HASH_SHA256 = 'sha256', 'SHA256 Hash'
    EMAIL = 'email', 'Email'
    CVE = 'cve', 'CVE'


class ThreatLevel(models.TextChoices):
    CRITICAL = 'critical', 'Critical'
    HIGH = 'high', 'High'
    MEDIUM = 'medium', 'Medium'
    LOW = 'low', 'Low'
    UNKNOWN = 'unknown', 'Unknown'
    SAFE = 'safe', 'Safe'


class ThreatIntelligence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, null=True, blank=True,
        related_name='threat_intelligence'
    )
    indicator = models.CharField(max_length=512, db_index=True)
    ioc_type = models.CharField(max_length=20, choices=IOCType.choices)
    threat_level = models.CharField(max_length=20, choices=ThreatLevel.choices, default=ThreatLevel.UNKNOWN)
    confidence = models.IntegerField(default=0)  # 0-100
    tags = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    related_campaigns = models.JSONField(default=list, blank=True)
    virustotal_data = models.JSONField(default=dict, blank=True)
    alienvault_data = models.JSONField(default=dict, blank=True)
    abuseipdb_data = models.JSONField(default=dict, blank=True)
    sources = models.JSONField(default=list, blank=True)
    malicious_count = models.IntegerField(default=0)
    total_engines = models.IntegerField(default=0)
    first_seen = models.DateTimeField(null=True, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    last_checked = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_checked']
        unique_together = ['indicator', 'ioc_type']

    def __str__(self):
        return f'{self.ioc_type.upper()} — {self.indicator} ({self.threat_level})'
