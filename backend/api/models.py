from django.db.models import Model, CharField, IntegerField, ManyToManyField, BooleanField, ForeignKey, SET_NULL, FloatField, DateField, TextField
from django.contrib.postgres.fields import ArrayField
import re
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _


class Student(Model):
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

    firstname = CharField(max_length=32, blank=True)
    lastname = CharField(max_length=32, blank=True)
    birthday = DateField(null=True, blank=True)
    doc_num = CharField(max_length=32, validators=[
                               validate_doc_num], default=doc_default)
    tufts_num = CharField(max_length=7, validators=[
                                 MinLengthValidator(7)], default=tufts_default)
    bhcc_num = CharField(
        max_length=32, blank=True)  # validate this number
    parole_status = TextField(max_length=256, blank=True)
    student_status = TextField(max_length=256, blank=True)

    validate_nonnegative = MinValueValidator(0)
    cohort = IntegerField(validators=[validate_nonnegative], null=True)
    years_given = IntegerField(
        validators=[validate_nonnegative], null=True)
    years_left = IntegerField(
        validators=[validate_nonnegative], null=True)
    # classes = ManyToManyField()
    # grades = ManyToManyField()


class Course(Model):
    # validators and cleaning
    validate_nonnegative = MinValueValidator(0)

    def clean(self):
        super(Course, self).clean()
        if self.course_number_tufts == "" and self.course_number_bhcc == "":
            raise ValidationError('Both course numbers cannot be None')

    course_title = CharField(max_length=32, blank=False)

    course_number_tufts = CharField(max_length=32, blank=True, null=True)
    course_number_bhcc = CharField(max_length=32, blank=True, null=True)

    credits_tufts = IntegerField(
        validators=[validate_nonnegative], blank=True, null=True)
    credits_bhcc = IntegerField(
        validators=[validate_nonnegative], blank=True, null=True)

    # department field of many
    COMPUTER_SCIENCE = 'COMP'
    COGNITIVE_STUDIES = 'COGS'
    MATH = 'MATH'
    PSYCHOLOGY = 'PSYC'
    DEPARTMENTS = [
        (COMPUTER_SCIENCE, 'Computer Science'),
        (COGNITIVE_STUDIES, 'Cognitive Studies'),
        (MATH, 'Math'),
        (PSYCHOLOGY, 'Psychology'),
    ]
    department = CharField(
        max_length=4,
        choices=DEPARTMENTS,
        blank=True,
        null=True,
    )

    prereqs = ManyToManyField(
        "self",
        related_name='+',
        symmetrical=False,
        blank=True,
        default=None,
    )

    instructors = ArrayField(
        CharField(max_length=32, blank=False),
        blank=True,
        null=True,
    )

class Degree(Model):
    degree_name = CharField(max_length=32, blank=False, null=False)
    reqs = ManyToManyField(
        Course,
        blank=True,
        default=None,
        symmetrical=False,
    )
    active = BooleanField(default=False, blank=False, null=False)

class CourseProgress(Model):
	validate_nonnegative = MinValueValidator(0)

	course = ForeignKey(Course, null=True, on_delete=SET_NULL)
	grade = IntegerField(validators=[validate_nonnegative], blank=True, null=True)
	year_taken = IntegerField(validators=[validate_nonnegative], blank=True, null=True)
	in_progress = BooleanField(blank=True, null=True)
