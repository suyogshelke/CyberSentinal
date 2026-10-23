from django.urls import re_path

# Import consumers lazily to avoid startup errors if channels isn't configured
try:
    from security_events import consumers as event_consumers
    from scans import consumers as scan_consumers

    websocket_urlpatterns = [
        re_path(r'ws/events/$', event_consumers.SecurityEventConsumer.as_asgi()),
        re_path(r'ws/scans/(?P<scan_id>[^/]+)/$', scan_consumers.ScanProgressConsumer.as_asgi()),
        re_path(r'ws/dashboard/$', event_consumers.DashboardConsumer.as_asgi()),
    ]
except Exception:
    websocket_urlpatterns = []
