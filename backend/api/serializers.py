from rest_framework_json_api import serializers
from api.models import Student

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ('name', 'age', 'courses')
