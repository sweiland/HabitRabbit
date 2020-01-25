#  models.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

from django.contrib import admin
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_comma_separated_integer_list
from django.db import models
from django.utils import timezone


class ProfilePicture(models.Model):
    class ColorChoices(models.TextChoices):
        RED = 'r', '#d4002d'
        GREEN = 'g', '#76b82a'
        TURQUOISE = 't', '#00afcb'
        YELLOW = 'y', '#f8ff2e'
        ORANGE = 'o', '#ec6608'
        VIOLET = 'v', '#673ab7'
        BLUE = 'b', '#3876cf'
        BROWN = 'w', '#c49052'

    color = models.TextField(choices=ColorChoices.choices, null=True, blank=True)
    picture = models.PositiveSmallIntegerField(null=True, blank=True)

    def __str__(self):
        return self.color


class User(AbstractUser):
    username = models.TextField(unique=True)
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.EmailField(unique=True)
    level = models.PositiveSmallIntegerField(default=1)
    score = models.CharField(validators=[validate_comma_separated_integer_list], default=[0], max_length=65535)
    friends = models.ManyToManyField('self', blank=True, null=True)
    streak = models.PositiveSmallIntegerField(default=0)

    profile_picture = models.ForeignKey(ProfilePicture, on_delete=models.CASCADE, null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.username


class UserAdmin(admin.ModelAdmin):
    pass


class Type(models.Model):
    is_custom = models.BooleanField(default=False)
    name = models.TextField()
    duration = models.PositiveSmallIntegerField(null=True, blank=True)
    helpful_link = models.URLField(null=True, blank=True)

    def __str__(self):
        return '%s (%s)' % (self.name, self.duration)


class Habit(models.Model):
    class PrioChoices(models.IntegerChoices):
        LOW = 1, 'low'
        MEDIUM = 2, 'medium'
        HIGH = 3, 'high'

    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    name = models.TextField()
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    interval = models.PositiveSmallIntegerField(default=1)
    priority = models.PositiveSmallIntegerField(choices=PrioChoices.choices)
    last_click = models.DateTimeField(null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    clicked = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return '%s (since %s)' % (self.name, self.start_date)


class Message(models.Model):
    message = models.TextField()
    title = models.TextField()
    type = models.ForeignKey(Type, on_delete=models.CASCADE)

    def __str__(self):
        return self.message


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return "%s: %s" % (self.question, self.answer)
