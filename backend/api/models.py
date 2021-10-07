from django.db import models
from django.contrib.postgres.fields import ArrayField

class Student(models.Model):
    name = models.CharField(max_length=32)
    age = models.IntegerField()
    courses = ArrayField(
        models.CharField(max_length=16)
    )