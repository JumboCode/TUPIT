from django.contrib import admin
from api.models import Student, Course, CourseProgress

admin.site.register(Student)
admin.site.register(Course)
admin.site.register(CourseProgress)
