#  0013_auto_20200121_1105.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

# Generated by Django 3.0.2 on 2020-01-21 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HabitRabbit', '0012_merge_20200121_1044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='interval',
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
