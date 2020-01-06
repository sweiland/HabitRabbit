# Generated by Django 3.0.2 on 2020-01-06 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HabitRabbit', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='habit',
            name='priority',
            field=models.PositiveSmallIntegerField(choices=[(1, 'low'), (2, 'medium'), (3, 'high')], default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='type',
            name='helpful_links',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='member',
            name='level',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='member',
            name='score',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='type',
            name='duration',
            field=models.PositiveSmallIntegerField(null=True),
        ),
    ]
