import random

from django.core.management.base import BaseCommand
from minio import Minio

from ...models import *
from .utils import random_date, random_timedelta


def add_users():
    User.objects.create_user("user", "user@user.com", "1234")
    User.objects.create_superuser("root", "root@root.com", "1234")

    for i in range(1, 10):
        User.objects.create_user(f"user{i}", f"user{i}@user.com", "1234")
        User.objects.create_superuser(f"root{i}", f"root{i}@root.com", "1234")

    print("Пользователи созданы")


def add_persons():
    Person.objects.create(
        name="Ахмес",
        description="Ахмес — eгипетский жрец и писарь. Возможно, первый математик, имя которого известно. Переписчик папируса Ахмеса — памятника древнеегипетской математики, который датируется примерно 1550 г. до нашей эры.",
        category="Люди",
        image="images/1.png"
    )

    Person.objects.create(
        name="Эхнатон",
        description="Эхнато́н — древнеегипетский фараон-реформатор из XVIII династии, известный до 5-го года своего правления как Аменхоте́п IV. Он правил 17 лет и скончался приблизительно между 1353 и 1336 годами до н. э.",
        category="Люди",
        image="images/2.png"
    )

    Person.objects.create(
        name="Нефертити",
        description="Неферти́ти — «главная супруга» древнеегипетского фараона XVIII династии Нового царства Эхнатона. Время правления Эхнатона и Нефертити, известное как «амарнский период», ознаменовалось религиозной реформой, когда главным божеством провозгласили бога Атона.",
        category="Люди",
        image="images/3.png"
    )

    Person.objects.create(
        name="Анубис",
        description="Анубис — древнеегипетский бог погребальных ритуалов и мумификации (бальзамирования), «страж весов» на суде Осириса в царстве мёртвых, знаток целебных трав.",
        category="Боги",
        image="images/4.png"
    )

    Person.objects.create(
        name="Исида",
        description="Воплощение женственности и царственности, Исида почиталась в Египте, а позже и на территории Римской империи на протяжении нескольких тысячелетий. На голове богини – убор в виде священных змей-защитниц, рога коровы – подательницы молока бессмертия и солнечный диск – символ возрождения и бесконечности жизни.",
        category="Боги",
        image="images/5.png"
    )

    Person.objects.create(
        name="Месхенет",
        description="В древнеегипетской мифологии Месхенет (также писалась как Месенет, Мескент и Мешкент) была богиней деторождения и создательницей Ка каждого ребенка — части его души, которую она вдыхала в него в момент рождения.",
        category="Боги",
        image="images/6.png"
    )

    client = Minio("minio:9000", "minio", "minio123", secure=False)
    client.fput_object('images', '1.png', "app/static/images/1.png")
    client.fput_object('images', '2.png', "app/static/images/2.png")
    client.fput_object('images', '3.png', "app/static/images/3.png")
    client.fput_object('images', '4.png', "app/static/images/4.png")
    client.fput_object('images', '5.png', "app/static/images/5.png")
    client.fput_object('images', '6.png', "app/static/images/6.png")
    client.fput_object('images', 'default.png', "app/static/images/default.png")

    print("Услуги добавлены")


def add_artworks():
    users = User.objects.filter(is_superuser=False)
    moderators = User.objects.filter(is_superuser=True)

    if len(users) == 0 or len(moderators) == 0:
        print("Заявки не могут быть добавлены. Сначала добавьте пользователей с помощью команды add_users")
        return

    persons = Person.objects.all()

    for _ in range(30):
        status = random.randint(2, 5)
        add_artwork(status, persons, users, moderators)

    add_artwork(1, persons, users, moderators)

    print("Заявки добавлены")


def add_artwork(status, persons, users, moderators):
    artwork = Artwork.objects.create()
    artwork.status = status

    if artwork.status in [3, 4]:
        artwork.date_complete = random_date()
        artwork.date_formation = artwork.date_complete - random_timedelta()
        artwork.date_created = artwork.date_formation - random_timedelta()
    else:
        artwork.date_formation = random_date()
        artwork.date_created = artwork.date_formation - random_timedelta()

    artwork.owner = random.choice(users)
    artwork.moderator = random.choice(moderators)

    artwork.name = "Гробница Ахмеса"
    artwork.date = random_date()

    for person in random.sample(list(persons), 3):
        item = PersonArtwork(
            artwork=artwork,
            person=person,
            value="Важный комментарий"
        )
        item.save()

    artwork.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_persons()
        add_artworks()



















