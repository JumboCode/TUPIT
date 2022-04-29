from api.models import *
from api.serializers import *
from api.filters import *

from django.db.models.base import ModelBase
from rest_framework import viewsets, filters 
from rest_framework.mixins import UpdateModelMixin
from django_filters.rest_framework import DjangoFilterBackend

class StudentViewSet(viewsets.ModelViewSet, UpdateModelMixin):
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

    def update(self, request, *args, **kwargs):
        data = json.loads(request.body).get('data')
        degree_id = data.get('id')
        if not degree_id:
            return JsonResponse({'info': 'Missing degree_id'}, status=400)

        ### FETCH DEGREE ###
        degree = Degree.objects.get(id=degree_id)
        if not degree:
            return JsonResponse({'info': 'Invalid degree_id'}, status=400)

        is_active = data.get('is_active')
        if is_active:
            SetDegreeGroupInactive(degree.is_tufts)

        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        is_tufts = 'is_tufts' in request.data and request.data['is_tufts'] == 'true'
        is_active = 'active' in request.data and request.data['active'] == 'true'
        
        if is_active:
            SetDegreeGroupInactive(is_tufts)
            
        return super().create(request, *args, **kwargs)

class DegreeRequirementViewSet(viewsets.ModelViewSet):
    queryset = DegreeRequirement.objects.all()
    serializer_class = DegreeRequirementSerializer

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_class = DegreeReqFilterSet
        
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

# Create a progress report comparing a student's course progress to the courses required by the active degrees
@csrf_exempt
def AuditStudentProgress(request):
    response = {
        'info': 'Successfully created progress report',
        'tufts': {},
        'bhcc': {},
    }

    data = json.loads(request.body)
    student_id = data.get('student_id')
    if student_id == '':
        return JsonResponse({'info': 'Missing student_id'}, status=400)

    ### FETCH STUDENT ###
    
    student = Student.objects.get(id=student_id)
    if student is None:
        return JsonResponse({'info': 'Invalid student_id'}, status=400)

    # IDs of the courses the student has completed
    completed_ids = [courseProg.course.id for courseProg in student.courses.all() if not courseProg.in_progress]
    # Remove duplicates
    completed_ids = list(set(completed_ids))

    # IDs of the courses the student is currently taking
    in_progress_ids = [courseProg.course.id for courseProg in student.courses.all() if courseProg.in_progress]
    # Remove duplicates
    in_progress_ids = list(set(in_progress_ids))
    # Remove IDs that are already completed
    in_progress_ids = [course_id for course_id in in_progress_ids if course_id not in completed_ids]

    ### FETCH DEGREES ###
    
    tufts_degree = Degree.objects.get(active=True, is_tufts=True)

    bhcc_degree = Degree.objects.get(active=True, is_tufts=False)

    ### COMPARE STUDENT PROGRESS AND REQUIREMENTS ###

    if tufts_degree:
        tufts_reqs = tufts_degree.reqs.all()
        
        # Degree requirements which the student has completed
        tufts_completed_req_ids = []
        for completed_id in completed_ids:
            for req in tufts_reqs:
                if completed_id in req.fulfilled_by.all().values_list('id', flat=True) and req.id not in tufts_completed_req_ids:
                    tufts_completed_req_ids.append(req.id)
            
        # Degree requirements which the student is currently taking
        tufts_in_progress_req_ids = []
        for in_progress_id in in_progress_ids:
            for req in tufts_reqs:
                if in_progress_id in req.fulfilled_by.all().values_list('id', flat=True) and req.id not in tufts_completed_req_ids and req.id not in tufts_in_progress_req_ids:
                    tufts_in_progress_req_ids.append(req.id)

        # Degree requirements which the student has not completed
        tufts_not_completed_req_ids = [req.id for req in tufts_reqs if req.id not in tufts_completed_req_ids and req.id not in tufts_in_progress_req_ids]

        # Export names of completed requirements
        response['tufts']['completed'] = [Course.objects.get(id=course_id).course_title for course_id in tufts_completed_req_ids]
        response['tufts']['in_progress'] = [Course.objects.get(id=course_id).course_title for course_id in tufts_in_progress_req_ids]
        response['tufts']['not_completed'] = [Course.objects.get(id=course_id).course_title for course_id in tufts_not_completed_req_ids]

    if bhcc_degree:
        bhcc_req = bhcc_degree.reqs.all()
    
        # Degree requirements which the student has completed
        bhcc_completed_req_ids = []
        for completed_id in completed_ids:
            for req in bhcc_req:
                if completed_id in req.fulfilled_by.all().values_list('id', flat=True) and req.id not in bhcc_completed_req_ids:
                    bhcc_completed_req_ids.append(req.id)
        
        # Degree requirements which the student is currently taking
        bhcc_in_progress_req_ids = []
        for in_progress_id in in_progress_ids:
            for req in bhcc_req:
                if in_progress_id in req.fulfilled_by.all().values_list('id', flat=True) and req.id not in bhcc_completed_req_ids and req.id not in bhcc_in_progress_req_ids:
                    bhcc_in_progress_req_ids.append(req.id)
        
        # Degree requirements which the student has not completed
        bhcc_not_completed_req_ids = [req.id for req in bhcc_req if req.id not in bhcc_completed_req_ids and req.id not in bhcc_in_progress_req_ids]

        # Export names of completed requirements
        response['bhcc']['completed'] = bhcc_completed_req_ids
        response['bhcc']['in_progress'] = bhcc_in_progress_req_ids
        response['bhcc']['not_completed'] = bhcc_not_completed_req_ids

    return JsonResponse(response, status=200)

# Set the active degree to the degree with the given ID
# After this, only the degree with the given ID will be active
# All other degrees will be set to inactive
def SetDegreeGroupInactive(is_tufts):
    degree_group = Degree.objects.filter(is_tufts=is_tufts)
    degree_group.update(active=False)



def SetActiveDegree(request):
    data = json.loads(request.body)
    degree_id = data.get('degree_id')
    if degree_id == '':
        return JsonResponse({'info': 'Missing degree_id'}, status=400)

    ### FETCH DEGREE ###

    degree = Degree.objects.get(id=degree_id)
    if degree is None:
        return JsonResponse({'info': 'Invalid degree_id'}, status=400)

    SetDegreeGroupInactive(degree.is_tufts)

    ### SET DEGREE TO ACTIVE ###
    degree.active = True
    degree.save()

    return JsonResponse({'info': 'Successfully set active degree'}, status=200)

def ResetPassword(request):
    data = json.loads(reqest.body)
    print(data)


@csrf_exempt
def CalculateGpa(request):
    data = json.loads(request.body)

    ## somehow get the student id from request body
    student_id = data.get('student_id')

    # get all of the courses + course progress that a student took
    # IDs of the courses the student has completed
    student = Student.objects.get(id=student_id)
    if student is None:
        return JsonResponse({'info': 'Invalid student_id'}, status=400)
    courseProgresses = [courseProg for courseProg in student.courses.all() if not courseProg.in_progress]

    # scale each of the grades to like a letter grade (A - 4.0, A -3.66, ...)
    ranges = [
                [97, 4.0], 
                [93, 4.0], 
                [90, 3.66],
                [87, 3.33],
                [83, 3.0],
                [80, 2.66],
                [77, 2.33],
                [73, 2.0],
                [70, 1.66],
                [67, 1.33],
                [65, 1.0],
                [0, 0.0]
    ]

    total_credits_tufts = 0
    gpa_sum_tufts = 0.0
    total_credits_bhcc = 0
    gpa_sum_bhcc = 0
    for courseProgress in courseProgresses:
        for r in ranges:
            if (r[0] <= courseProgress.grade):
                gpa_sum_tufts += r[1] * courseProgress.course.credits_tufts
                total_credits_tufts += courseProgress.course.credits_tufts
                
                gpa_sum_bhcc += r[1] * courseProgress.course.credits_bhcc
                total_credits_bhcc += courseProgress.course.credits_bhcc
                break

    gpa_tufts = gpa_sum_tufts / total_credits_tufts
    gpa_bhcc = gpa_sum_bhcc / total_credits_bhcc
    # calculate a weighted average using ^ letter grade conversion and course credit

    # return 2 GPAs, one is tufts, is BHCC
    response = {
        'info': 'Successfully calculated GPA',
        'gpa_tufts': gpa_tufts,
        'gpa_bhcc': gpa_bhcc,
    }

    return JsonResponse(response, status=200)