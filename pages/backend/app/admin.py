from django.contrib import admin

from .models import *

admin.site.register(Character)
admin.site.register(Artwork)
admin.site.register(CharacterArtwork)
