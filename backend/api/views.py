from api.models import Student, Course, CourseProgress, Degree
from api.serializers import *
from api.filters import *

from django.db.models.base import ModelBase
from rest_framework import viewsets, filters 
from django_filters.rest_framework import DjangoFilterBackend

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter) 
    ordering_fields = ('firstname', 'lastname')
    filterset_class = StudentFilterSet

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)

    # It is a good practice to include field that can be ordered by to prevent
    # information leakage. 
    ordering_fields = ('course_number_tufts', 'course_number_bhcc')
    filterset_class = CourseFilterSet

    def get_queryset(self):
        queryset = self.queryset
        # request is a dictionary with key being the parameter 
        if len(self.request.query_params) == 0:
            return queryset.order_by('course_number_tufts')
        return queryset.order_by('course_number_tufts')

class CourseProgressViewSet(viewsets.ModelViewSet):
    queryset = CourseProgress.objects.all()
    serializer_class = CourseProgressSerializer

    filter_backends = (DjangoFilterBackend, )
    filterset_class = CourseProgressFilterSet


class DegreeViewSet(viewsets.ModelViewSet):
    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer
