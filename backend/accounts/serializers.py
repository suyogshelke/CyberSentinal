"""
Accounts serializers — registration, login, JWT, user profile
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token with user data embedded"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role
        return token

    def validate(self, attrs):
        # Check lockout
        email = attrs.get('email', '')
        try:
            user = User.objects.get(email=email)
            if user.is_locked_out():
                raise serializers.ValidationError('Account is temporarily locked due to multiple failed login attempts.')
        except User.DoesNotExist:
            pass

        try:
            data = super().validate(attrs)
            # Reset failed attempts on success
            self.user.failed_login_attempts = 0
            self.user.lockout_until = None
            self.user.save(update_fields=['failed_login_attempts', 'lockout_until'])
            return data
        except Exception:
            # Increment failed attempts
            try:
                user = User.objects.get(email=email)
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= 5:
                    user.lockout_until = timezone.now() + timedelta(minutes=15)
                user.save(update_fields=['failed_login_attempts', 'lockout_until'])
            except User.DoesNotExist:
                pass
            raise


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=12)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'full_name', 'role', 'mfa_enabled', 'date_joined', 'avatar'
        ]
        read_only_fields = ['id', 'email', 'date_joined', 'role']

    def get_full_name(self, obj):
        return obj.full_name


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=12)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        return data
