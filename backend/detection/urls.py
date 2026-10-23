from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter()
router.register(r'rules', views.DetectionRuleViewSet, basename='detection_rule')
router.register(r'alerts', views.DetectionAlertViewSet, basename='detection_alert')
urlpatterns = [path('', include(router.urls))]
