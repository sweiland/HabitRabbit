# Generated by Django 3.0.2 on 2020-01-20 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HabitRabbit', '0005_merge_20200120_1616'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='streak',
            field=models.PositiveSmallIntegerField(default=0),
            preserve_default=False,
        ),
    ]