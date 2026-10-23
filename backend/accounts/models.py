"""
CyberSentinel Accounts — Custom User model with RBAC
"""
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
import uuid


class UserRole(models.TextChoices):
    SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
    SECURITY_ADMIN = 'SECURITY_ADMIN', 'Security Admin'
    SECURITY_ANALYST = 'SECURITY_ANALYST', 'Security Analyst'
    DEVELOPER = 'DEVELOPER', 'Developer'
    VIEWER = 'VIEWER', 'Viewer'


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.SUPER_ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=30, choices=UserRole.choices, default=UserRole.VIEWER)
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='members'
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=32, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    lockout_until = models.DateTimeField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        db_table = 'accounts_user'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.email

    def is_locked_out(self):
        if self.lockout_until and self.lockout_until > timezone.now():
            return True
        return False

    def has_role(self, *roles):
        return self.role in roles

    def can_manage_security(self):
        return self.role in [UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN]

    def can_analyze(self):
        return self.role in [UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.SECURITY_ANALYST]

    def can_develop(self):
        return self.role in [UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.SECURITY_ANALYST, UserRole.DEVELOPER]
