from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('artifacts/<int:artifact_id>/', artifact),
    path('artworks/<int:artwork_id>/', artwork),
]