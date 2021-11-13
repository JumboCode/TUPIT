from rest_framework_json_api import serializers
from api.models import Student, Course, CourseProgress

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ('firstname', 'lastname', 'birthday', 'doc_num', 'tufts_num', 'bhcc_num', 'parole_status', 'student_status', 'cohort', 'years_given', 'years_left')

class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ('course_title', 'course_number_tufts', 'course_number_bhcc', 'credits_tufts', 'credits_bhcc', 'department', 'prereqs', 'instructors')

class CourseProgressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CourseProgress
        fields = ('student', 'course', 'grade', 'year_taken', 'in_progress')