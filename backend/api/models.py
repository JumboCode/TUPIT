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

    course_number_tufts = CharField(max_length=32)
    course_number_bhcc = CharField(max_length=32)

    credits_tufts = IntegerField(validators=[validate_nonnegative])
    credits_bhcc = IntegerField(validators=[validate_nonnegative])

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
        default=None
    )

    prereqs = ManyToManyField(
        "self",
        related_name='+',
    )

    instructors = ArrayField(
        CharField(max_length=32, blank=False),
    )
