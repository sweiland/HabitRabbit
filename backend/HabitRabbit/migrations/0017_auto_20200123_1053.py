#  0017_auto_20200123_1053.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

# Generated by Django 3.0.2 on 2020-01-23 10:53

import django.core.validators
from django.db import migrations, models
import re


class Migration(migrations.Migration):

    dependencies = [
        ('HabitRabbit', '0016_auto_20200123_1042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='score',
            field=models.CharField(default=[0], max_length=65535, validators=[django.core.validators.RegexValidator(re.compile('^\\d+(?:,\\d+)*\\Z'), code='invalid', message='Enter only digits separated by commas.')]),
        ),
    ]
