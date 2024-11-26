import random
from datetime import datetime, timedelta

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *


def get_draft_artwork():
    return Artwork.objects.filter(status=1).first()


def get_user():
    return User.objects.filter(is_superuser=False).first()


def get_moderator():
    return User.objects.filter(is_superuser=True).first()


@api_view(["GET"])
def search_characters(request):
    character_name = request.GET.get("character_name", "")

    characters = Character.objects.filter(status=1)

    if character_name:
        characters = characters.filter(name__icontains=character_name)

    serializer = CharactersSerializer(characters, many=True)
    
    draft_artwork = get_draft_artwork()

    resp = {
        "characters": serializer.data,
        "characters_count": CharacterArtwork.objects.filter(artwork=draft_artwork).count() if draft_artwork else None,
        "draft_artwork": draft_artwork.pk if draft_artwork else None
    }

    return Response(resp)


@api_view(["GET"])
def get_character_by_id(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)
    serializer = CharacterSerializer(character)

    return Response(serializer.data)


@api_view(["PUT"])
def update_character(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)

    serializer = CharacterSerializer(character, data=request.data, partial=True)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def create_character(request):
    serializer = CharacterSerializer(data=request.data, partial=False)

    serializer.is_valid(raise_exception=True)

    Character.objects.create(**serializer.validated_data)

    characters = Character.objects.filter(status=1)
    serializer = CharacterSerializer(characters, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_character(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)
    character.status = 2
    character.save()

    characters = Character.objects.filter(status=1)
    serializer = CharacterSerializer(characters, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def add_character_to_artwork(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)

    draft_artwork = get_draft_artwork()

    if draft_artwork is None:
        draft_artwork = Artwork.objects.create()
        draft_artwork.owner = get_user()
        draft_artwork.date_created = timezone.now()
        draft_artwork.save()

    if CharacterArtwork.objects.filter(artwork=draft_artwork, character=character).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    item = CharacterArtwork.objects.create()
    item.artwork = draft_artwork
    item.character = character
    item.save()

    serializer = ArtworkSerializer(draft_artwork)
    return Response(serializer.data["characters"])


@api_view(["POST"])
def update_character_image(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)

    image = request.data.get("image")
    if image is not None:
        character.image = image
        character.save()

    serializer = CharacterSerializer(character)

    return Response(serializer.data)


@api_view(["GET"])
def search_artworks(request):
    status = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    artworks = Artwork.objects.exclude(status__in=[1, 5])

    if status > 0:
        artworks = artworks.filter(status=status)

    if date_formation_start and parse_datetime(date_formation_start):
        artworks = artworks.filter(date_formation__gte=parse_datetime(date_formation_start))

    if date_formation_end and parse_datetime(date_formation_end):
        artworks = artworks.filter(date_formation__lt=parse_datetime(date_formation_end))

    serializer = ArtworksSerializer(artworks, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_artwork_by_id(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)
    serializer = ArtworkSerializer(artwork, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_artwork(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)
    serializer = ArtworkSerializer(artwork, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_user(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)

    if artwork.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    artwork.status = 2
    artwork.date_formation = timezone.now()
    artwork.save()

    serializer = ArtworkSerializer(artwork, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_admin(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    request_status = int(request.data["status"])

    if request_status not in [3, 4]:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    artwork = Artwork.objects.get(pk=artwork_id)

    if artwork.status != 2:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if request_status == 3:
        artwork.count = random.randint(100, 1000)

    artwork.date_complete = timezone.now()
    artwork.status = request_status
    artwork.moderator = get_moderator()
    artwork.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_artwork(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)

    if artwork.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    artwork.status = 5
    artwork.save()

    serializer = ArtworkSerializer(artwork, many=False)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_character_from_artwork(request, artwork_id, character_id):
    if not CharacterArtwork.objects.filter(artwork_id=artwork_id, character_id=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = CharacterArtwork.objects.get(artwork_id=artwork_id, character_id=character_id)
    item.delete()

    items = CharacterArtwork.objects.filter(artwork_id=artwork_id)
    data = [CharacterItemSerializer(item.character, context={"comment": item.comment}).data for item in items]

    return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_character_in_artwork(request, artwork_id, character_id):
    if not CharacterArtwork.objects.filter(character_id=character_id, artwork_id=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = CharacterArtwork.objects.get(character_id=character_id, artwork_id=artwork_id)

    serializer = CharacterArtworkSerializer(item, data=request.data,  partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = User.objects.get(pk=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    return Response(serializer.data)