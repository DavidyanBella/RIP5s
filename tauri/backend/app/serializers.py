from rest_framework import serializers

from .models import *


class CharactersSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, character):
        if character.image:
            return character.image.url.replace("minio", "localhost", 1)

        return "http://localhost:9000/images/default.png"

    class Meta:
        model = Character
        fields = ("id", "name", "status", "category", "image")


class CharacterSerializer(CharactersSerializer):
    class Meta(CharactersSerializer.Meta):
        fields = "__all__"


class ArtworksSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    moderator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Artwork
        fields = "__all__"


class ArtworkSerializer(ArtworksSerializer):
    characters = serializers.SerializerMethodField()
            
    def get_characters(self, artwork):
        items = CharacterArtwork.objects.filter(artwork=artwork)
        return [CharacterItemSerializer(item.character, context={"comment": item.comment}).data for item in items]


class CharacterItemSerializer(CharacterSerializer):
    comment = serializers.SerializerMethodField()

    def get_comment(self, _):
        return self.context.get("comment")

    class Meta:
        model = Character
        fields = ("id", "name", "status", "category", "image", "comment")


class CharacterArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterArtwork
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
