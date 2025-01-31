from django.conf import settings
from django.core.management.base import BaseCommand
from minio import Minio

from .utils import *
from app.models import *


def add_users():
    User.objects.create_user("user", "user@user.com", "1234", first_name="user", last_name="user")
    User.objects.create_superuser("root", "root@root.com", "1234", first_name="root", last_name="root")

    for i in range(1, 10):
        User.objects.create_user(f"user{i}", f"user{i}@user.com", "1234", first_name=f"user{i}", last_name=f"user{i}")
        User.objects.create_superuser(f"root{i}", f"root{i}@root.com", "1234", first_name=f"user{i}", last_name=f"user{i}")


def add_characters():
    Character.objects.create(
        name="Ахмес",
        description="Ахмес — eгипетский жрец и писарь. Возможно, первый математик, имя которого известно. Переписчик папируса Ахмеса — памятника древнеегипетской математики, который датируется примерно 1550 г. до нашей эры.",
        category="Люди",
        image="1.png"
    )

    Character.objects.create(
        name="Эхнатон",
        description="Эхнато́н — древнеегипетский фараон-реформатор из XVIII династии, известный до 5-го года своего правления как Аменхоте́п IV. Он правил 17 лет и скончался приблизительно между 1353 и 1336 годами до н. э.",
        category="Люди",
        image="2.png"
    )

    Character.objects.create(
        name="Нефертити",
        description="Неферти́ти — «главная супруга» древнеегипетского фараона XVIII династии Нового царства Эхнатона. Время правления Эхнатона и Нефертити, известное как «амарнский период», ознаменовалось религиозной реформой, когда главным божеством провозгласили бога Атона.",
        category="Люди",
        image="3.png"
    )

    Character.objects.create(
        name="Анубис",
        description="Анубис — древнеегипетский бог погребальных ритуалов и мумификации (бальзамирования), «страж весов» на суде Осириса в царстве мёртвых, знаток целебных трав.",
        category="Боги",
        image="4.png"
    )

    Character.objects.create(
        name="Исида",
        description="Воплощение женственности и царственности, Исида почиталась в Египте, а позже и на территории Римской империи на протяжении нескольких тысячелетий. На голове богини – убор в виде священных змей-защитниц, рога коровы – подательницы молока бессмертия и солнечный диск – символ возрождения и бесконечности жизни.",
        category="Боги",
        image="5.png"
    )

    Character.objects.create(
        name="Месхенет",
        description="В древнеегипетской мифологии Месхенет (также писалась как Месенет, Мескент и Мешкент) была богиней деторождения и создательницей Ка каждого ребенка — части его души, которую она вдыхала в него в момент рождения.",
        category="Боги",
        image="6.png"
    )

    client = Minio(settings.MINIO_ENDPOINT,
                   settings.MINIO_ACCESS_KEY,
                   settings.MINIO_SECRET_KEY,
                   secure=settings.MINIO_USE_HTTPS)

    for i in range(1, 7):
        client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, f'{i}.png', f"app/static/images/{i}.png")

    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'default.png', "app/static/images/default.png")


def add_artworks():
    users = User.objects.filter(is_staff=False)
    moderators = User.objects.filter(is_staff=True)
    characters = Character.objects.all()

    for _ in range(30):
        status = random.randint(2, 5)
        owner = random.choice(users)
        add_artwork(status, characters, owner, moderators)

    add_artwork(1, characters, users[0], moderators)
    add_artwork(2, characters, users[0], moderators)
    add_artwork(3, characters, users[0], moderators)
    add_artwork(4, characters, users[0], moderators)
    add_artwork(5, characters, users[0], moderators)


def add_artwork(status, characters, owner, moderators):
    artwork = Artwork.objects.create()
    artwork.status = status

    if status in [3, 4]:
        artwork.moderator = random.choice(moderators)
        artwork.date_complete = random_date()
        artwork.date_formation = artwork.date_complete - random_timedelta()
        artwork.date_created = artwork.date_formation - random_timedelta()
    else:
        artwork.date_formation = random_date()
        artwork.date_created = artwork.date_formation - random_timedelta()

    if status == 3:
        artwork.count = random.randint(100, 1000)

    artwork.name = "Гробница Ахмеса"

    artwork.owner = owner

    for character in random.sample(list(characters), 3):
        item = CharacterArtwork(
            artwork=artwork,
            character=character,
            comment="Комментарий"
        )
        item.save()

    artwork.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_characters()
        add_artworks()
