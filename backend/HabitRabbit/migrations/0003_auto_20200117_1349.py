#  0003_auto_20200117_1349.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

# Generated by Django 3.0.2 on 2020-01-17 13:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('HabitRabbit', '0002_auto_20200117_1225'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='end_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='habit',
            name='interval',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='habit',
            name='type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                    to='HabitRabbit.Type'),
        ),
        migrations.AlterField(
            model_name='type',
            name='duration',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
    ]
