"""
URL Configuration for CyberSentinel API
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/', include([
        # Auth
        path('auth/', include('accounts.urls')),

        # Core modules
        path('organizations/', include('organizations.urls')),
        path('assets/', include('assets.urls')),
        path('scans/', include('scans.urls')),
        path('vulnerabilities/', include('vulnerabilities.urls')),
        path('events/', include('security_events.urls')),
        path('detection/', include('detection.urls')),
        path('incidents/', include('incidents.urls')),
        path('threat-intelligence/', include('threat_intelligence.urls')),
        path('risk/', include('risk.urls')),
        path('reports/', include('reports.urls')),
        path('devsecops/', include('devsecops.urls')),
        path('ai-analyst/', include('ai_analyst.urls')),
        path('audit/', include('audit.urls')),
        path('notifications/', include('notifications.urls')),
        path('dashboard/', include('accounts.dashboard_urls')),

        # Health check
        path('health/', include('accounts.health_urls')),

        # API Schema
        path('schema/', SpectacularAPIView.as_view(), name='schema'),
        path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
        path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
