# Generated by Django 4.2.7 on 2024-10-01 10:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_alter_artwork_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artwork',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 1, 10, 10, 59, 694077, tzinfo=datetime.timezone.utc), verbose_name='Дата создания'),
        ),
    ]
