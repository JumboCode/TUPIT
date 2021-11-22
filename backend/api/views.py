from api.models import Student, Course, CourseProgress, Degree
from api.serializers import StudentSerializer, CourseSerializer, CourseProgressSerializer, DegreeSerializer
from rest_framework import viewsets

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseProgressViewSet(viewsets.ModelViewSet):
    queryset = CourseProgress.objects.all()
    serializer_class = CourseProgressSerializer

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

def ChangePassword(request):
    if not request.user.is_authenticated:
        return JsonResponse({'info': 'Not authenticated'}, status=401)

    data = json.loads(request.body)
    username = request.user.username
    current_password = data.get('old_password')
    new_password = data.get('new_password')
    user = authenticate(request, username=username, password=current_password)

    if user is None:
        return JsonResponse({'info': 'Invalid credentials'}, status=401)

    user.set_password(new_password)
    user.save()
    login(request, user)
    
    return JsonResponse({'info': 'Successfully changed password'}, status=200)
