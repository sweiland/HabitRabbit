#  views.py Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
from django.contrib.auth.decorators import permission_required
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from HabitRabbit.models import Habit, Type, Message, ProfilePicture, User, FAQ
from HabitRabbit.serializers import HabitSerializer, TypeSerializer, MessageSerializer, \
    ProfilePictureSerializer, UserSerializer, EmailSerializer, UserNumberSerializer, FaqSerializer, UniqueUserSerializer


# GETs for all
@swagger_auto_schema(method='GET', responses={200: UserSerializer(many=True)})
@api_view(['GET'])
@permission_required('HabitRabbit.view_user', raise_exception=True)
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: HabitSerializer(many=True)})
@api_view(['GET'])
@permission_required('HabitRabbit.view_habit', raise_exception=True)
def habit_list(request):
    habits = Habit.objects.all()
    serializer = HabitSerializer(habits, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: TypeSerializer(many=True)})
@api_view(['GET'])
@permission_required('HabitRabbit.view_type', raise_exception=True)
def type_list(request):
    types = Type.objects.all()
    serializer = TypeSerializer(types, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: MessageSerializer(many=True)})
@api_view(['GET'])
@permission_required('HabitRabbit.view_message', raise_exception=True)
def message_list(request):
    messages = Message.objects.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: ProfilePictureSerializer(many=True)})
@api_view(['GET'])
@permission_required('HabitRabbit.view_profilepicture', raise_exception=True)
def profilepicture_list(request):
    profilepictures = ProfilePicture.objects.all()
    serializer = ProfilePictureSerializer(profilepictures, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: FaqSerializer(many=True)})
@api_view(['GET'])
@permission_required('HabitRabbit.view_faq', raise_exception=True)
def get_faq(request):
    faq = FAQ.objects.all()
    serializer = FaqSerializer(faq, many=True)
    return Response(serializer.data)


# GETs for specific
@swagger_auto_schema(method='GET', responses={200: UserSerializer()})
@api_view(['GET'])
@permission_required('HabitRabbit.view_user', raise_exception=True)
def user_form_get(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: HabitSerializer()})
@api_view(['GET'])
@permission_required('HabitRabbit.view_habit', raise_exception=True)
def habit_form_get(request, pk):
    try:
        habit = Habit.objects.get(pk=pk)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    serializer = HabitSerializer(habit)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: TypeSerializer()})
@api_view(['GET'])
@permission_required('HabitRabbit.view_type', raise_exception=True)
def type_form_get(request, pk):
    try:
        type = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({'error': 'Type does not exist.'}, status=404)
    serializer = TypeSerializer(type)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: MessageSerializer()})
@api_view(['GET'])
@permission_required('HabitRabbit.view_get', raise_exception=True)
def message_form_get(request, pk):
    try:
        message = Message.objects.get(pk=pk)
    except Message.DoesNotExist:
        return Response({'error': 'Message does not exist.'}, status=404)
    serializer = MessageSerializer(message)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: ProfilePictureSerializer()})
@api_view(['GET'])
@permission_required('HabitRabbit.view_profilepicture', raise_exception=True)
def profilepicture_form_get(request, pk):
    try:
        profilepicture = ProfilePicture.objects.get(pk=pk)
    except ProfilePicture.DoesNotExist:
        return Response({'error': 'Profile Picture does not exist.'}, status=404)
    serializer = ProfilePictureSerializer(profilepicture)
    return Response(serializer.data)


# POSTs
@swagger_auto_schema(method='POST', request_body=UserSerializer, responses={200: UserSerializer()})
@api_view(['POST'])
@permission_classes([AllowAny])
def user_form_create(request):
    data = JSONParser().parse(request)
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=HabitSerializer, responses={200: HabitSerializer()})
@api_view(['POST'])
@permission_required('HabitRabbit.add_habit', raise_exception=True)
def habit_form_create(request):
    data = JSONParser().parse(request)
    serializer = HabitSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=TypeSerializer, responses={200: TypeSerializer()})
@api_view(['POST'])
@permission_required('HabitRabbit.add_type', raise_exception=True)
def type_create(request):
    data = JSONParser().parse(request)
    serializer = TypeSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=MessageSerializer, responses={200: MessageSerializer()})
@api_view(['POST'])
@permission_required('HabitRabbit.add_message', raise_exception=True)
def message_create(request):
    data = JSONParser().parse(request)
    serializer = MessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=ProfilePictureSerializer, responses={200: ProfilePictureSerializer()})
@api_view(['POST'])
@permission_required('HabitRabbit.add_profilepicture', raise_exception=True)
def profilepicture_create(request):
    data = JSONParser().parse(request)
    serializer = ProfilePictureSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=FaqSerializer, responses={200: FaqSerializer()})
@api_view(['POST'])
@permission_required('HabitRabbit.add_faq', raise_exception=True)
def add_faq(request):
    data = JSONParser().parse(request)
    serializer = FaqSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# PATCHs
@swagger_auto_schema(method='PATCH', request_body=UserSerializer, responses={200: UserSerializer()})
@api_view(['PATCH'])
@permission_required('HabitRabbit.change_user', raise_exception=True)
def user_form_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)

    data = JSONParser().parse(request)
    if data.get('old_password') is not None:
        if user.check_password(data.get('old_password')):
            user.set_password(data.get('password'))
            user.save()
            return Response(status=200)
        else:
            return Response({'old_password': ['Wrong password']}, status=409)
    serializer = UserSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=HabitSerializer, responses={200: HabitSerializer()})
@api_view(['PATCH'])
@permission_required('HabitRabbit.change_habit', raise_exception=True)
def habit_form_update(request, pk):
    try:
        habit = Habit.objects.get(pk=pk)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = HabitSerializer(habit, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=TypeSerializer, responses={200: TypeSerializer()})
@api_view(['PATCH'])
@permission_required('HabitRabbit.change_type', raise_exception=True)
def type_form_update(request, pk):
    try:
        type = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = TypeSerializer(type, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=MessageSerializer, responses={200: MessageSerializer()})
@api_view(['PATCH'])
@permission_required('HabitRabbit.change_message', raise_exception=True)
def message_form_update(request, pk):
    try:
        message = Message.objects.get(pk=pk)
    except Message.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = MessageSerializer(message, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=ProfilePictureSerializer, responses={200: ProfilePictureSerializer()})
@api_view(['PATCH'])
@permission_required('HabitRabbit.change_profilepicture', raise_exception=True)
def profilepicture_form_update(request, pk):
    try:
        profilepicture = ProfilePicture.objects.get(pk=pk)
    except ProfilePicture.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = ProfilePictureSerializer(profilepicture, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=FaqSerializer, responses={200: FaqSerializer()})
@api_view(['PATCH'])
@permission_required('HabitRabbit.change_faq', raise_exception=True)
def update_faq(request, pk):
    try:
        faq = FAQ.objects.get(pk=pk)
    except FAQ.DoesNotExist:
        return Response({'error': 'FAQ does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = FaqSerializer(faq, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# DELETEs
@swagger_auto_schema(method='DELETE', responses={204: UserSerializer()})
@api_view(['DELETE'])
@permission_required('HabitRabbit.delete_user', raise_exception=True)
def user_delete(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)
    user.is_active = False
    serializer = UserSerializer(user, data=user.__dict__)
    if serializer.is_valid():
        serializer.save()
        return Response(status=204)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='DELETE', responses={204: HabitSerializer()})
@api_view(['DELETE'])
@permission_required('HabitRabbit.delete_habit', raise_exception=True)
def habit_delete(request, pk):
    try:
        habit = Habit.objects.get(pk=pk)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    habit.delete()
    return Response(status=204)


@swagger_auto_schema(method='DELETE', responses={204: TypeSerializer()})
@api_view(['DELETE'])
@permission_required('HabitRabbit.delete_type', raise_exception=True)
def type_delete(request, pk):
    try:
        type = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({'error': 'Type does not exist.'}, status=404)

    type.delete()
    return Response(status=204)


@swagger_auto_schema(method='DELETE', responses={204: MessageSerializer()})
@api_view(['DELETE'])
@permission_required('HabitRabbit.delete_message', raise_exception=True)
def message_delete(request, pk):
    try:
        message = Message.objects.get(pk=pk)
    except Message.DoesNotExist:
        return Response({'error': 'Message does not exist.'}, status=404)

    message.delete()
    return Response(status=204)


@swagger_auto_schema(method='DELETE', responses={204: ProfilePictureSerializer()})
@api_view(['DELETE'])
@permission_required('HabitRabbit.delete_profilepicture', raise_exception=True)
def profilepicture_delete(request, pk):
    try:
        profilepicture = ProfilePicture.objects.get(pk=pk)
    except ProfilePicture.DoesNotExist:
        return Response({'error': 'Profile Picture does not exist.'}, status=404)

    profilepicture.delete()
    return Response(status=204)


@swagger_auto_schema(method='DELETE', responses={204: FaqSerializer()})
@api_view(['DELETE'])
@permission_required('HabitRabbit.delete_faq', raise_exception=True)
def remove_faq(request, pk):
    try:
        faq = FAQ.objects.get(pk=pk)
    except FAQ.DoesNotExist:
        return Response({'error': 'FAQ does not exist.'}, status=404)

    faq.delete()
    return Response(status=204)


# Purpose built views
@swagger_auto_schema(method='GET', responses={200: EmailSerializer()})
@api_view(['GET'])
@permission_classes([AllowAny])
def get_email_from_username(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)

    serializer = EmailSerializer(user)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: UserNumberSerializer()})
@api_view(['GET'])
@permission_classes([AllowAny])
def get_number_of_users(request):
    user = User.objects.all()

    serializer = UserNumberSerializer(user)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: UserSerializer()})
@api_view(['GET'])
@permission_required('HabitRabbit.view_user', raise_exception=True)
def get_user_from_email(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: UniqueUserSerializer(many=True)})
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_for_unique_validator(request):
    user = User.objects.all()

    serializer = UniqueUserSerializer(user, many=True)
    return Response(serializer.data)
