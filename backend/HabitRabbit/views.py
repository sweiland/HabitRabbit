from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from HabitRabbit.models import Member, Habit, Type, Message, ProfilePicture, User
from HabitRabbit.serializers import MemberSerializer, HabitSerializer, TypeSerializer, MessageSerializer, \
    ProfilePictureSerializer, UserSerializer


# GETs for all
@swagger_auto_schema(method='GET', responses={200: MemberSerializer(many=True)})
@api_view(['GET'])
def member_list(request):
    members = Member.objects.all()
    serializer = MemberSerializer(members, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: UserSerializer(many=True)})
@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: HabitSerializer(many=True)})
@api_view(['GET'])
def habit_list(request):
    habits = Habit.objects.all()
    serializer = HabitSerializer(habits, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: TypeSerializer(many=True)})
@api_view(['GET'])
def type_list(request):
    types = Type.objects.all()
    serializer = TypeSerializer(types, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: MessageSerializer(many=True)})
@api_view(['GET'])
def message_list(request):
    messages = Message.objects.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: ProfilePictureSerializer(many=True)})
@api_view(['GET'])
def profilepicture_list(request):
    profilepictures = ProfilePicture.objects.all()
    serializer = ProfilePictureSerializer(profilepictures, many=True)
    return Response(serializer.data)


# GETs for specific
@swagger_auto_schema(method='GET', responses={200: MemberSerializer()})
@api_view(['GET'])
def member_form_get(request, pk):
    try:
        member = Member.objects.get(pk=pk)
    except Member.DoesNotExist:
        return Response({'error': 'Member does not exist.'}, status=404)

    serializer = MemberSerializer(member)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: UserSerializer()})
@api_view(['GET'])
def user_form_get(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: HabitSerializer()})
@api_view(['GET'])
def habit_form_get(request, pk):
    try:
        habit = Habit.objects.get(pk=pk)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    serializer = HabitSerializer(habit)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: TypeSerializer()})
@api_view(['GET'])
def type_form_get(request, pk):
    try:
        type = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({'error': 'Type does not exist.'}, status=404)
    serializer = TypeSerializer(type)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: MessageSerializer()})
@api_view(['GET'])
def message_form_get(request, pk):
    try:
        message = Message.objects.get(pk=pk)
    except Message.DoesNotExist:
        return Response({'error': 'Message does not exist.'}, status=404)
    serializer = MessageSerializer(message)
    return Response(serializer.data)


@swagger_auto_schema(method='GET', responses={200: ProfilePictureSerializer()})
@api_view(['GET'])
def profilepicture_form_get(request, pk):
    try:
        profilepicture = ProfilePicture.objects.get(pk=pk)
    except ProfilePicture.DoesNotExist:
        return Response({'error': 'Profile Picture does not exist.'}, status=404)
    serializer = ProfilePictureSerializer(profilepicture)
    return Response(serializer.data)


# POSTs
@swagger_auto_schema(method='POST', request_body=MemberSerializer, responses={200: MemberSerializer()})
@api_view(['POST'])
def member_form_create(request):
    data = JSONParser().parse(request)
    serializer = MemberSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=UserSerializer, responses={200: UserSerializer()})
@api_view(['POST'])
def user_form_create(request):
    data = JSONParser().parse(request)
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=HabitSerializer, responses={200: HabitSerializer()})
@api_view(['POST'])
def habit_form_create(request):
    data = JSONParser().parse(request)
    serializer = HabitSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=TypeSerializer, responses={200: TypeSerializer()})
@api_view(['POST'])
def type_create(request):
    data = JSONParser().parse(request)
    serializer = TypeSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=MessageSerializer, responses={200: MessageSerializer()})
@api_view(['POST'])
def message_create(request):
    data = JSONParser().parse(request)
    serializer = MessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='POST', request_body=ProfilePictureSerializer, responses={200: ProfilePictureSerializer()})
@api_view(['POST'])
def profilepicture_create(request):
    data = JSONParser().parse(request)
    serializer = ProfilePictureSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# PATCHs
@swagger_auto_schema(method='PATCH', request_body=MemberSerializer, responses={200: MemberSerializer()})
@api_view(['PATCH'])
def member_form_update(request, pk):
    try:
        member = Member.objects.get(pk=pk)
    except Member.DoesNotExist:
        return Response({'error': 'Member does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = MemberSerializer(member, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=UserSerializer, responses={200: UserSerializer()})
@api_view(['PATCH'])
def user_form_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = UserSerializer(user, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=HabitSerializer, responses={200: HabitSerializer()})
@api_view(['PATCH'])
def habit_form_update(request, pk):
    try:
        habit = Habit.objects.get(pk=pk)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = HabitSerializer(habit, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=TypeSerializer, responses={200: TypeSerializer()})
@api_view(['PATCH'])
def type_form_update(request, pk):
    try:
        type = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = TypeSerializer(type, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=MessageSerializer, responses={200: MessageSerializer()})
@api_view(['PATCH'])
def message_form_update(request, pk):
    try:
        message = Message.objects.get(pk=pk)
    except Message.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = MessageSerializer(message, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='PATCH', request_body=ProfilePictureSerializer, responses={200: ProfilePictureSerializer()})
@api_view(['PATCH'])
def profilepicture_form_update(request, pk):
    try:
        profilepicture = ProfilePicture.objects.get(pk=pk)
    except ProfilePicture.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    data = JSONParser().parse(request)
    serializer = ProfilePictureSerializer(profilepicture, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# DELETEs
@api_view(['DELETE'])
def member_delete(request, pk):
    try:
        member = Member.objects.get(pk=pk)
    except Member.DoesNotExist:
        return Response({'error': 'Member does not exist.'}, status=404)
    member.delete()
    return Response(status=204)


@api_view(['DELETE'])
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


@api_view(['DELETE'])
def habit_delete(request, pk):
    try:
        habit = Habit.objects.get(pk=pk)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    habit.delete()
    return Response(status=204)


@api_view(['DELETE'])
def type_delete(request, pk):
    try:
        type = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    type.delete()
    return Response(status=204)


@api_view(['DELETE'])
def message_delete(request, pk):
    try:
        message = Message.objects.get(pk=pk)
    except Message.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    message.delete()
    return Response(status=204)


@api_view(['DELETE'])
def profilepicture_delete(request, pk):
    try:
        profilepicture = ProfilePicture.objects.get(pk=pk)
    except ProfilePicture.DoesNotExist:
        return Response({'error': 'Habit does not exist.'}, status=404)

    profilepicture.delete()
    return Response(status=204)
