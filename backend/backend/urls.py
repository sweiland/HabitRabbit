"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#  urls.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).

from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_jwt.views import obtain_jwt_token

from HabitRabbit import views

schema_view = get_schema_view(
    openapi.Info(
        title="HabitRabbit API",
        default_version='v1',
        description="The API for HabitRabbit",
        contact=openapi.Contact(email="hello@sweiland.at"),
        license=openapi.License(name="AGPL License"),
    ),
    public=True,
    permission_classes=(permissions.DjangoModelPermissions,)
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('habit/list', views.habit_list),
    path('habit/create', views.habit_form_create),
    path('habit/<int:pk>/get', views.habit_form_get),
    path('habit/<int:pk>/update', views.habit_form_update),
    path('habit/<int:pk>/delete', views.habit_delete),
    path('type/list', views.type_list),
    path('type/create', views.type_create),
    path('type/<int:pk>/get', views.type_form_get),
    path('type/<int:pk>/update', views.type_form_update),
    path('type/<int:pk>/delete', views.type_delete),
    path('message/list', views.message_list),
    path('message/create', views.message_create),
    path('message/<int:pk>/get', views.message_form_get),
    path('message/<int:pk>/update', views.message_form_update),
    path('message/<int:pk>/delete', views.message_delete),
    path('profilepicture/list', views.profilepicture_list),
    path('profilepicture/create', views.profilepicture_create),
    path('profilepicture/<int:pk>/get', views.profilepicture_form_get),
    path('profilepicture/<int:pk>/update', views.profilepicture_form_update),
    path('profilepicture/<int:pk>/delete', views.profilepicture_delete),
    path('user/list', views.user_list),
    path('user/create', views.user_form_create),
    path('user/<int:pk>/get', views.user_form_get),
    path('user/<str:email>/get', views.get_user_from_email),
    path('user/<int:pk>/update', views.user_form_update),
    path('user/<int:pk>/delete', views.user_delete),
    path('faq/list', views.get_faq),
    path('faq/create', views.add_faq),
    path('faq/<int:pk>/update', views.update_faq),
    path('faq/<int:pk>/delete', views.remove_faq),
    path('email/<str:username>/get', views.get_email_from_username),
    path('users/number', views.get_number_of_users),
    path('user/unique', views.get_user_for_unique_validator),

    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    url(r'^api-token-auth/', obtain_jwt_token),
]
