import random
from datetime import datetime, timedelta
import uuid

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from .permissions import *
from .redis import session_storage
from .serializers import *
from .utils import identity_user, get_session


def get_draft_artwork(request):
    user = identity_user(request)

    if user is None:
        return None

    artwork = Artwork.objects.filter(owner=user).filter(status=1).first()

    return artwork


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'character_name',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
def search_characters(request):
    character_name = request.GET.get("character_name", "")

    characters = Character.objects.filter(status=1)

    if character_name:
        characters = characters.filter(name__icontains=character_name)

    serializer = CharactersSerializer(characters, many=True)

    draft_artwork = get_draft_artwork(request)

    resp = {
        "characters": serializer.data,
        "characters_count": CharacterArtwork.objects.filter(artwork=draft_artwork).count() if draft_artwork else None,
        "draft_artwork_id": draft_artwork.pk if draft_artwork else None
    }

    return Response(resp)


@api_view(["GET"])
def get_character_by_id(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)
    serializer = CharacterSerializer(character)

    return Response(serializer.data)


@swagger_auto_schema(method='put', request_body=CharacterSerializer)
@api_view(["PUT"])
@permission_classes([IsModerator])
def update_character(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)

    serializer = CharacterSerializer(character, data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@swagger_auto_schema(method='POST', request_body=CharacterAddSerializer)
@api_view(["POST"])
@permission_classes([IsModerator])
@parser_classes((MultiPartParser,))
def create_character(request):
    serializer = CharacterAddSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)

    Character.objects.create(**serializer.validated_data)

    characters = Character.objects.filter(status=1)
    serializer = CharactersSerializer(characters, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsModerator])
def delete_character(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)
    character.status = 2
    character.save()

    character = Character.objects.filter(status=1)
    serializer = CharacterSerializer(character, many=True)

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_character_to_artwork(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)

    draft_artwork = get_draft_artwork(request)

    if draft_artwork is None:
        draft_artwork = Artwork.objects.create()
        draft_artwork.date_created = timezone.now()
        draft_artwork.owner = identity_user(request)
        draft_artwork.save()

    if CharacterArtwork.objects.filter(artwork=draft_artwork, character=character).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    item = CharacterArtwork.objects.create()
    item.artwork = draft_artwork
    item.character = character
    item.save()

    serializer = ArtworkSerializer(draft_artwork)
    return Response(serializer.data["characters"])


@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter('image', openapi.IN_FORM, type=openapi.TYPE_FILE),
    ]
)
@api_view(["POST"])
@permission_classes([IsModerator])
@parser_classes((MultiPartParser,))
def update_character_image(request, character_id):
    if not Character.objects.filter(pk=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    character = Character.objects.get(pk=character_id)

    image = request.data.get("image")

    if image is None:
        return Response(status.HTTP_400_BAD_REQUEST)

    character.image = image
    character.save()

    serializer = CharacterSerializer(character)

    return Response(serializer.data)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'status',
            openapi.IN_QUERY,
            type=openapi.TYPE_NUMBER
        ),
        openapi.Parameter(
            'date_formation_start',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            'date_formation_end',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_artworks(request):
    status_id = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    artworks = Artwork.objects.exclude(status__in=[1, 5])

    user = identity_user(request)
    if not user.is_superuser:
        artworks = artworks.filter(owner=user)

    if status_id > 0:
        artworks = artworks.filter(status=status_id)

    if date_formation_start and parse_datetime(date_formation_start):
        artworks = artworks.filter(date_formation__gte=parse_datetime(date_formation_start) - timedelta(days=1))

    if date_formation_end and parse_datetime(date_formation_end):
        artworks = artworks.filter(date_formation__lt=parse_datetime(date_formation_end) + timedelta(days=1))

    serializer = ArtworksSerializer(artworks, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_artwork_by_id(request, artwork_id):
    user = identity_user(request)

    if not Artwork.objects.filter(pk=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)

    if not user.is_superuser and artwork.owner != user:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ArtworkSerializer(artwork)

    return Response(serializer.data)


@swagger_auto_schema(method='put', request_body=ArtworkSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_artwork(request, artwork_id):
    user = identity_user(request)

    if not Artwork.objects.filter(pk=artwork_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)
    serializer = ArtworkSerializer(artwork, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_status_user(request, artwork_id):
    user = identity_user(request)

    if not Artwork.objects.filter(pk=artwork_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)

    if artwork.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    artwork.status = 2
    artwork.date_formation = timezone.now()
    artwork.save()

    serializer = ArtworkSerializer(artwork)

    return Response(serializer.data)


@swagger_auto_schema(method='put', request_body=UpdateArtworkStatusAdminSerializer)
@api_view(["PUT"])
@permission_classes([IsModerator])
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

    artwork.status = request_status
    artwork.date_complete = timezone.now()
    artwork.moderator = identity_user(request)
    artwork.save()

    serializer = ArtworkSerializer(artwork)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_artwork(request, artwork_id):
    user = identity_user(request)

    if not Artwork.objects.filter(pk=artwork_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    artwork = Artwork.objects.get(pk=artwork_id)

    if artwork.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    artwork.status = 5
    artwork.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_character_from_artwork(request, artwork_id, character_id):
    user = identity_user(request)

    if not Artwork.objects.filter(pk=artwork_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not CharacterArtwork.objects.filter(artwork_id=artwork_id, character_id=character_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = CharacterArtwork.objects.get(artwork_id=artwork_id, character_id=character_id)
    item.delete()

    artwork = Artwork.objects.get(pk=artwork_id)

    serializer = ArtworkSerializer(artwork)
    characters = serializer.data["characters"]

    return Response(characters)


@swagger_auto_schema(method='PUT', request_body=CharacterArtworkSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_character_in_artwork(request, artwork_id, character_id):
    user = identity_user(request)

    if not Artwork.objects.filter(pk=artwork_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not CharacterArtwork.objects.filter(character_id=character_id, artwork_id=artwork_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = CharacterArtwork.objects.get(character_id=character_id, artwork_id=artwork_id)

    serializer = CharacterArtworkSerializer(item, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@swagger_auto_schema(method='post', request_body=UserLoginSerializer)
@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    session_id = str(uuid.uuid4())
    session_storage.set(session_id, user.id)

    serializer = UserSerializer(user)
    response = Response(serializer.data, status=status.HTTP_200_OK)
    response.set_cookie("session_id", session_id, samesite="lax")

    return response


@swagger_auto_schema(method='post', request_body=UserRegisterSerializer)
@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    session_id = str(uuid.uuid4())
    session_storage.set(session_id, user.id)

    serializer = UserSerializer(user)
    response = Response(serializer.data, status=status.HTTP_201_CREATED)
    response.set_cookie("session_id", session_id, samesite="lax")

    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    session = get_session(request)
    session_storage.delete(session)

    response = Response(status=status.HTTP_200_OK)
    response.delete_cookie('session_id')

    return response


@swagger_auto_schema(method='PUT', request_body=UserProfileSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = identity_user(request)

    if user.pk != user_id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    password = request.data.get("password", None)
    if password is not None and not user.check_password(password):
        user.set_password(password)
        user.save()

    return Response(serializer.data, status=status.HTTP_200_OK)
