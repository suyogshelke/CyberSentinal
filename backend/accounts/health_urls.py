"""
Health check endpoints
"""
from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import redis
from django.conf import settings
from django.db import connection


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """System health check endpoint"""
    health = {
        'status': 'healthy',
        'services': {}
    }

    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        health['services']['database'] = 'healthy'
    except Exception as e:
        health['services']['database'] = f'unhealthy: {str(e)}'
        health['status'] = 'degraded'

    # Redis check
    try:
        r = redis.from_url(settings.REDIS_URL if hasattr(settings, 'REDIS_URL') else 'redis://localhost:6379/0')
        r.ping()
        health['services']['redis'] = 'healthy'
    except Exception as e:
        health['services']['redis'] = f'unhealthy: {str(e)}'
        health['status'] = 'degraded'

    health['services']['api'] = 'healthy'
    return Response(health)


urlpatterns = [
    path('', health_check, name='health_check'),
]
