from django.urls import path
from . import views
urlpatterns = [path('overview/', views.risk_overview, name='risk_overview'), path('assets/', views.asset_risk, name='asset_risk')]
