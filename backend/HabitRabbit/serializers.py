from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from HabitRabbit.models import Habit, Type, ProfilePicture, Message, User


class HabitSerializer(serializers.ModelSerializer):
    member_id = serializers.SerializerMethodField()
    type_id = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = '__all__'

    def get_member_id(self, obj):
        return obj.member.id if obj.member else ''

    def get_type_id(self, obj):
        return obj.type.id if obj.type else ''


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(min_length=8)
    first_name = serializers.CharField
    last_name = serializers.CharField

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'],
                                        password=validated_data['password'], first_name=validated_data['first_name'],
                                        last_name=validated_data['last_name'])
        return user

    class Meta:
        model = User
        fields = '__all__'


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']


class UserNumberSerializer(serializers.ModelSerializer):
    number = serializers.SerializerMethodField()
    count = 0

    class Meta:
        model = User
        fields = ['number']

    def get_number(self, obj):
        return obj.count()
