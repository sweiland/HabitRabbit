# Generated by Django 3.0.2 on 2020-01-14 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HabitRabbit', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profilepicture',
            name='color',
            field=models.TextField(choices=[('r', '#d4002d'), ('g', '#76b82a'), ('t', '#00afcb'), ('y', '#f8ff2e'), ('o', '#ec6608'), ('v', '#673ab7'), ('b', '#3876cf'), ('w', '#c49052')]),
        ),
    ]
