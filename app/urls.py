from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('persons/<int:person_id>/', person_details, name="person_details"),
    path('persons/<int:person_id>/add_to_artwork/', add_person_to_draft_artwork, name="add_person_to_draft_artwork"),
    path('artworks/<int:artwork_id>/delete/', delete_artwork, name="delete_artwork"),
    path('artworks/<int:artwork_id>/', artwork)
]
