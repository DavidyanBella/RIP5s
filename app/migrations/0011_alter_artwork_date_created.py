# Generated by Django 4.2.7 on 2024-10-01 11:17

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_alter_artwork_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artwork',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 1, 11, 17, 42, 967969, tzinfo=datetime.timezone.utc), verbose_name='Дата создания'),
        ),
    ]
