from django.db.models import Model, CharField, IntegerField, ManyToManyField, BooleanField, ForeignKey, SET_NULL, FloatField, DateField, TextField
from django.contrib.postgres.fields import ArrayField
import re
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MinValueValidator
from django.db.models.deletion import CASCADE
from django.utils.translation import gettext_lazy as _

__all__ = ["Student", "Course", "Degree", "CourseProgress", "DegreeRequirement"]

class Student(Model):

    def empty_array():
        return []

    def __str__(self):

        model = f'''
        Student ID - {self.id}
        Firstname - {self.firstname}
        Lastname - {self.lastname}
        Birthday - {self.birthday}
        Cohort - {self.cohort}
        Years given - {self.years_given}
        Years left - {self.years_left}
        Associated files - {self.associated_files}
        SSN - {self.ssn}
        '''    
        return re.sub('^\s+', '', model, flags = re.MULTILINE)
        
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
    
    def ssn_default():
        return "0000"

    firstname = CharField(max_length=32, blank=True)
    lastname = CharField(max_length=32, blank=True)
    birthday = DateField(null=True, blank=True)
    doc_num = CharField(max_length=32, validators=[
                               validate_doc_num], default=doc_default)
    tufts_num = CharField(max_length=7, validators=[
                                 MinLengthValidator(7)], default=tufts_default)
    bhcc_num = CharField(
        max_length=32, blank=True)  # validate this number
    ssn = CharField(max_length=4, validators=[
                                 MinLengthValidator(4)], default=ssn_default, blank=True)
    parole_status = TextField(max_length=256, blank=True)
    student_status = TextField(max_length=256, blank=True)
    additional_info = TextField(max_length=512, blank=True)

    validate_nonnegative = MinValueValidator(0)
    cohort = IntegerField(validators=[validate_nonnegative], null=True)
    years_given = IntegerField(
        validators=[validate_nonnegative], null=True)
    years_left = IntegerField(
        validators=[validate_nonnegative], null=True)
    associated_files = ArrayField(
        CharField(max_length=512), # TODO: validate this with specific service
        blank=True,
        default=empty_array,
    )

class Course(Model):
    # validators and cleaning
    validate_nonnegative = MinValueValidator(0)

    def empty_array():
        return []

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
        default=empty_array,
    )

    additional_info = TextField(max_length=512, blank=True)

    def __str__(self):

        model = f'''
        Course ID - {self.id}
        Course - {self.course_title}
        Tufts number - {self.course_number_tufts}
        BHCC number - {self.course_number_bhcc}
        Department - {self.department}
        Instructors - {self.instructors}
        '''
        return re.sub('^\s+', '', model, flags = re.MULTILINE)

class DegreeRequirement(Model):
    title = CharField(max_length=32, blank=False)
    fulfilled_by = ManyToManyField(Course, related_name='fulfills', blank=True)

    def __str__(self):
        return self.title

class Degree(Model):
    degree_name = CharField(max_length=32, blank=False, null=False)
    reqs = ManyToManyField(
        DegreeRequirement,
        blank=True,
        default=None,
    )
    active = BooleanField(default=False, blank=False, null=False)
    is_tufts = BooleanField(default=False, blank=False, null=False)
    additional_info = TextField(max_length=512, blank=True)

class CourseProgress(Model):
    def default_true():
        return True
    
    def default_semester():
        return 'Fall'

    validate_nonnegative = MinValueValidator(0)

    course = ForeignKey(Course, related_name='+', blank=False, null=True, on_delete=SET_NULL)
    student = ForeignKey(Student, related_name='courses', blank=False, null=True, on_delete=CASCADE)
    grade = IntegerField(validators=[validate_nonnegative], blank=True, null=True)
    year_taken = IntegerField(validators=[validate_nonnegative], blank=True, null=True)
    semester_taken = CharField(max_length=32, default=default_semester)
    in_progress = BooleanField(blank=True, default=default_true)
    additional_info = TextField(max_length=512, blank=True)

    def __str__(self):

        model = f'''
        CourseProgress ID - {self.id}
        Grade - {self.grade}
        Year taken - {self.year_taken}
        Relationship - {type(self.student)} 
        {self.student}
        '''
        return re.sub('^\s+', '', model, flags = re.MULTILINE)

