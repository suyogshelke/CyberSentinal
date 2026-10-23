"""
Assets — web apps, APIs, servers, domains, IPs, repos, cloud resources
"""
from django.db import models
from django.conf import settings
import uuid


class AssetType(models.TextChoices):
    WEB_APPLICATION = 'WEB_APPLICATION', 'Web Application'
    REST_API = 'REST_API', 'REST API'
    SERVER = 'SERVER', 'Server'
    DOMAIN = 'DOMAIN', 'Domain'
    IP_ADDRESS = 'IP_ADDRESS', 'IP Address'
    REPOSITORY = 'REPOSITORY', 'Repository'
    CLOUD_RESOURCE = 'CLOUD_RESOURCE', 'Cloud Resource'
    CONTAINER = 'CONTAINER', 'Container'
    DATABASE = 'DATABASE', 'Database'


class Environment(models.TextChoices):
    PRODUCTION = 'production', 'Production'
    STAGING = 'staging', 'Staging'
    DEVELOPMENT = 'development', 'Development'
    TESTING = 'testing', 'Testing'


class RiskLevel(models.TextChoices):
    CRITICAL = 'critical', 'Critical'
    HIGH = 'high', 'High'
    MEDIUM = 'medium', 'Medium'
    LOW = 'low', 'Low'
    NONE = 'none', 'None'


class Asset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        'organizations.Organization', on_delete=models.CASCADE, related_name='assets'
    )
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=30, choices=AssetType.choices)
    url = models.URLField(blank=True)
    hostname = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    environment = models.CharField(max_length=30, choices=Environment.choices, default=Environment.PRODUCTION)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='owned_assets'
    )
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    risk_level = models.CharField(max_length=20, choices=RiskLevel.choices, default=RiskLevel.NONE)
    risk_score = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    last_scanned = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.asset_type})'
