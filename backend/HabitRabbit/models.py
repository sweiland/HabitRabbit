from django.db import models
from django.utils import timezone


class ProfilePicture(models.Model):
    class ColorChoices(models.TextChoices):
        RED = 'r', '#d4002d'
        GREEN = 'g', '#76b82a'
        TURQUOISE = 't', '#00afcb'
        YELLOW = 'y', '#f7a600'
        ORANGE = 'o', '#ec6608'
        VIOLET = 'v', '#af1280'
        BLUE = 'b', '#005ca9'

    color = models.TextField(choices=ColorChoices.choices)
    picture = models.BinaryField()

    def __str__(self):
        return self.color


class Member(models.Model):
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.EmailField(null=True)
    level = models.PositiveIntegerField(default=1)
    score = models.PositiveIntegerField(default=0)
    friends = models.ManyToManyField('self')

    profile_picture = models.ForeignKey(ProfilePicture, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return '%s %s Level %s' % (self.first_name, self.last_name, self.level)


class Type(models.Model):
    is_custom = models.BooleanField(default=False)
    name = models.TextField()
    duration = models.PositiveIntegerField(null=True)

    def __str__(self):
        return '%s (%s)' % (self.name, self.duration)


class Habit(models.Model):
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True)
    name = models.TextField()
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    type = models.ForeignKey(Type, on_delete=models.CASCADE, null=True)
    interval = models.PositiveSmallIntegerField(null=True)

    def __str__(self):
        return '%s (since %s)' % (self.name, self.start_date)

class Message(models.Model):
    message = models.TextField()
    type = models.ForeignKey(Type, on_delete=models.CASCADE)

    def __str__(self):
        return self.message
