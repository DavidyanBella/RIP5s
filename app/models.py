from django.db import models
from django.utils import timezone

from django.contrib.auth.models import User


class Person(models.Model):
    STATUS_CHOICES = (
        (1, 'Действует'),
        (2, 'Удалена'),
    )

    name = models.CharField(max_length=100, verbose_name="Название", blank=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    image = models.ImageField(default="images/default.png", blank=True)
    description = models.TextField(verbose_name="Описание", blank=True)

    category = models.CharField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Артефакт"
        verbose_name_plural = "Артефакты"
        db_table = "persons"


class Artwork(models.Model):
    STATUS_CHOICES = (
        (1, 'Введён'),
        (2, 'В работе'),
        (3, 'Завершен'),
        (4, 'Отклонен'),
        (5, 'Удален')
    )

    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    date_created = models.DateTimeField(default=timezone.now(), verbose_name="Дата создания")
    date_formation = models.DateTimeField(verbose_name="Дата формирования", blank=True, null=True)
    date_complete = models.DateTimeField(verbose_name="Дата завершения", blank=True, null=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь", null=True, related_name='owner')
    moderator = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Модератор", null=True, related_name='moderator')

    name = models.CharField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)

    def __str__(self):
        return "Произведение №" + str(self.pk)

    def get_persons(self):
        return [
            setattr(item.person, "value", item.value) or item.person
            for item in PersonArtwork.objects.filter(artwork=self)
        ]

    class Meta:
        verbose_name = "Произведение"
        verbose_name_plural = "Произведения"
        ordering = ('-date_formation',)
        db_table = "artworks"


class PersonArtwork(models.Model):
    person = models.ForeignKey(Person, models.DO_NOTHING, blank=True, null=True)
    artwork = models.ForeignKey(Artwork, models.DO_NOTHING, blank=True, null=True)
    value = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return "м-м №" + str(self.pk)

    class Meta:
        verbose_name = "м-м"
        verbose_name_plural = "м-м"
        db_table = "person_artwork"
