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

    # TODO - Add authentication based filtering. I'm assuming only administration
    # should be able to see this view.

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # TODO - Not sure if this filter field would be necessary. From my
    # understanding, SearchFilter looks into all the fields provided which seem kind of silly.
    # filter_backends = [filters.SearchFilter]
    # search_fields = ['$course_title', '=course_number_tufts']

    # TODO - Get DjangoFilterBackend to be a default filter(?) in settings.py
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    # It is a good practice to include field that can be ordered by to prevent
    # information leakage. 
    ordering_fields = ('course_number_tufts', 'course_number_bhcc')
    filterset_class = CourseFilterSet

    def get_queryset(self):
        # This function overrides the default behaviour when a query is made 
        # My thoughts here to use order_by method is that we would probably have
        # an option to see which institution to choose and courses are usually
        # ordered in. 
        queryset = self.queryset

        # request is a dictionary with key being the parameter 
        if len(self.request.query_params) == 0:
            return queryset.order_by('course_number_tufts')
        
        # TODO - What to do if a parameter is not a valid field. By default, 
        # Django returns empty queryset

        return queryset.order_by('course_number_tufts')

class CourseProgressViewSet(viewsets.ModelViewSet):
    queryset = CourseProgress.objects.all()
    serializer_class = CourseProgressSerializer

    filter_backends = (DjangoFilterBackend, )
    filterset_class = CourseProgressFilterSet


class DegreeViewSet(viewsets.ModelViewSet):
    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer
