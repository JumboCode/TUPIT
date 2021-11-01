from rest_framework_json_api import serializers
from api.models import Student, Course

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ('name', 'age', 'courses')

class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ('course_title', 'course_number_tufts', 'course_number_bhcc', 'credits_tufts', 'credits_bhcc', 'department', 'prereqs', 'instructors')