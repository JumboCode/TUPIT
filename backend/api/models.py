from django.db import models
from django.contrib.postgres.fields import ArrayField

class Student(models.Model):
    name = models.CharField(max_length=32)
    age = models.IntegerField()
    courses = ArrayField(
        models.CharField(max_length=16)
    )

class TeamLeader(models.Model):
    first_name = models.CharField(max_length=16)
    last_name = models.CharField(max_length=16)
    age = models.IntegerField()
    year = models.IntegerField()
    fun_facts = ArrayField(
        models.CharField(max_length=128)
    )