#  0011_auto_20200120_1648.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

# Generated by Django 3.0.2 on 2020-01-20 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HabitRabbit', '0010_auto_20200120_1647'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='last_click',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
