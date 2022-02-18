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
        fields = ('firstname', 'lastname', 'birthday', 'doc_num', 'tufts_num', 'bhcc_num', 'parole_status', 'student_status', 'cohort', 'years_given', 'years_left', 'associated_files')
    
    def validate_associated_files(self, associated_files):
        existing_associated_files = []
        if self.instance and self.instance.v:
            # Patch or Put request
            existing_associated_files = self.instance.associated_files
        return existing_associated_files + associated_files

class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ('course_title', 'course_number_tufts', 'course_number_bhcc', 'credits_tufts', 'credits_bhcc', 'department', 'prereqs', 'instructors')

class CourseProgressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CourseProgress
        fields = ('student', 'course', 'grade', 'year_taken', 'in_progress')

class DegreeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Degree 
        fields = ('degree_name', 'reqs', 'active')
