from django.db.models.query import QuerySet
from api.models import Student, TeamLeader
from api.serializers import StudentSerializer, TeamLeaderSerializer
from rest_framework import viewsets

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class TeamLeaderViewSet(viewsets.ModelViewSet):
    queryset = TeamLeader.objects.all()
    serializer_class = TeamLeaderSerializer
