from rest_framework_json_api import serializers
from api.models import Student, TeamLeader

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ('name', 'age', 'courses')

class TeamLeaderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TeamLeader
        fields = ('first_name', 'last_name', 'age', 'year', 'fun_facts')