"""
Audit middleware — automatically logs all API requests
"""
import json
import logging
from .models import AuditLog

logger = logging.getLogger('cybersentinel')

SKIP_PATHS = ['/api/health/', '/admin/jsi18n/', '/static/']


class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Skip non-API and health check paths
        if not request.path.startswith('/api/') or any(request.path.startswith(p) for p in SKIP_PATHS):
            return response

        # Only log mutating requests
        if request.method in ('POST', 'PUT', 'PATCH', 'DELETE'):
            try:
                user = request.user if request.user.is_authenticated else None
                org = user.organization if user and user.organization else None

                action_map = {'POST': 'CREATE', 'PUT': 'UPDATE', 'PATCH': 'UPDATE', 'DELETE': 'DELETE'}
                action = action_map.get(request.method, 'SYSTEM')

                AuditLog.objects.create(
                    user=user,
                    organization=org,
                    action=action,
                    resource_type=request.path.split('/')[2] if len(request.path.split('/')) > 2 else '',
                    resource_id='',
                    description=f'{request.method} {request.path}',
                    ip_address=self._get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                    request_method=request.method,
                    request_path=request.path,
                    response_status=response.status_code,
                )
            except Exception as e:
                logger.warning(f'Audit log failed: {e}')

        return response

    def _get_client_ip(self, request):
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            return x_forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
