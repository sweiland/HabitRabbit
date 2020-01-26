#  admin.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

from django.contrib import admin

# Register your models here.
from HabitRabbit.models import User, UserAdmin

admin.site.register(User, UserAdmin)
