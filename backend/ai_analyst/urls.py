from django.urls import path
from . import views
urlpatterns = [path('analyze/', views.analyze, name='ai_analyze'), path('chat/', views.chat, name='ai_chat')]
