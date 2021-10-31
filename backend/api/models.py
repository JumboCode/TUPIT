from django.db import models
from django.contrib.postgres.fields import ArrayField
import re
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _


class Student(models.Model):
    def validate_doc_num(value):
        regex = re.compile('^W\d+$')
        if not regex.match(value):
            raise ValidationError(
                _('%(value)s does not match the format for a doc_num'),
                params={'value': value},
            )

    def doc_default():
        return "W1"

    def tufts_default():
        return "0000000"

    firstname = models.CharField(max_length=32, blank=True)
    lastname = models.CharField(max_length=32, blank=True)
    birthday = models.DateField(null=True, blank=True)
    doc_num = models.CharField(max_length=32, validators=[
                               validate_doc_num], default=doc_default)
    tufts_num = models.CharField(max_length=7, validators=[
                                 MinLengthValidator(7)], default=tufts_default)
    bhcc_num = models.CharField(
        max_length=32, blank=True)  # validate this number
    parole_status = models.TextField(max_length=256, blank=True)
    student_status = models.TextField(max_length=256, blank=True)

    validate_nonnegative = MinValueValidator(0)
    cohort = models.IntegerField(validators=[validate_nonnegative], null=True)
    years_given = models.IntegerField(
        validators=[validate_nonnegative], null=True)
    years_left = models.IntegerField(
        validators=[validate_nonnegative], null=True)
    # classes = models.ManyToManyField()
    # grades = models.ManyToManyField()
