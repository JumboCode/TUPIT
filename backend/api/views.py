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

import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

def GetCSRFToken(request):
    response = JsonResponse({
        'info': 'Successfully set CSRF token',
        }, status=200)
    token = get_token(request)
    response['X-CSRFToken'] = token
    return response

def LoginUser(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username == '' or password == '':
        return JsonResponse({'info': 'Missing username or password'}, status=400)
    
    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({'info': 'Invalid credentials'}, status=401)
    
    login(request, user)
    response = JsonResponse({'info': 'Successfully authenticated'}, status=200)
    return response

@csrf_exempt
def LogoutUser(request):
    if request.user.is_authenticated:
        logout(request)
    return JsonResponse({'info': 'Successfully logged out'}, status=200)

@csrf_exempt
def ValidateLoggedIn(request):
    if request.user.is_authenticated:
        return JsonResponse({'is_logged_in': True}, status=200)
    else:
        return JsonResponse({'is_logged_in': False}, status=200)
