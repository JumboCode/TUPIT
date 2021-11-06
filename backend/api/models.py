from django.db.models import Model, CharField, IntegerField, ManyToManyField
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

class Student(Model):
    name = CharField(max_length=32)
    age = IntegerField()
    courses = ArrayField(
        CharField(max_length=16)
    )

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

    credits_tufts = IntegerField(validators=[validate_nonnegative], blank=True, null=True)
    credits_bhcc = IntegerField(validators=[validate_nonnegative], blank=True, null=True)

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
        null=True,
        symmetrical=False,
    )
    active = BooleanField(default=False, blank=False, null=False)

