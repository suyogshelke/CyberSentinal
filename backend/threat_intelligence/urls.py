from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter()
router.register(r'', views.ThreatIntelligenceViewSet, basename='threat_intel')
urlpatterns = [path('', include(router.urls)), path('lookup/', views.ioc_lookup, name='ioc_lookup')]
