from rest_framework import serializers

from HabitRabbit.models import Member, Habit, Type, ProfilePicture, Message


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


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