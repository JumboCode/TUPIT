from rest_framework_json_api import serializers
from api.models import Student, Course, CourseProgress, Degree

__all__ = [
    "StudentSerializer", 
    "CourseSerializer", 
    "CourseProgressSerializer",
    "DegreeSerializer"
]
    
class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ('firstname', 'lastname', 'birthday', 'doc_num', 'tufts_num', 'bhcc_num', 'parole_status', 'student_status', 'additional_info', 'cohort', 'years_given', 'years_left', 'associated_files', 'ssn')

class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ('course_title', 'course_number_tufts', 'course_number_bhcc', 'credits_tufts', 'credits_bhcc', 'department', 'prereqs', 'instructors', 'additional_info')

class CourseProgressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CourseProgress
        fields = ('student', 'course', 'grade', 'year_taken', 'semester_taken', 'in_progress', 'additional_info')

class DegreeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Degree 
        fields = ('degree_name', 'reqs', 'active', 'is_tufts', 'additional_info')
