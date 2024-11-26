from django.urls import path
from .views import *

urlpatterns = [
    # Набор методов для услуг
    path('api/characters/', search_characters),  # GET
    path('api/characters/<int:character_id>/', get_character_by_id),  # GET
    path('api/characters/<int:character_id>/update/', update_character),  # PUT
    path('api/characters/<int:character_id>/update_image/', update_character_image),  # POST
    path('api/characters/<int:character_id>/delete/', delete_character),  # DELETE
    path('api/characters/create/', create_character),  # POST
    path('api/characters/<int:character_id>/add_to_artwork/', add_character_to_artwork),  # POST

    # Набор методов для заявок
    path('api/artworks/', search_artworks),  # GET
    path('api/artworks/<int:artwork_id>/', get_artwork_by_id),  # GET
    path('api/artworks/<int:artwork_id>/update/', update_artwork),  # PUT
    path('api/artworks/<int:artwork_id>/update_status_user/', update_status_user),  # PUT
    path('api/artworks/<int:artwork_id>/update_status_admin/', update_status_admin),  # PUT
    path('api/artworks/<int:artwork_id>/delete/', delete_artwork),  # DELETE

    # Набор методов для м-м
    path('api/artworks/<int:artwork_id>/update_character/<int:character_id>/', update_character_in_artwork),  # PUT
    path('api/artworks/<int:artwork_id>/delete_character/<int:character_id>/', delete_character_from_artwork),  # DELETE

    # Набор методов для аутентификации и авторизации
    path("api/users/register/", register),  # POST
    path("api/users/login/", login),  # POST
    path("api/users/logout/", logout),  # POST
    path("api/users/<int:user_id>/update/", update_user)  # PUT
]
