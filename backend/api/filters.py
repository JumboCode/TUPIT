'''
Resources
* Filtering basics: https://www.django-rest-framework.org/api-guide/filtering/
* Django-filter: https://django-filter.readthedocs.io/en/stable/
* Filtering ArrayField: https://docs.djangoproject.com/en/3.2/ref/contrib/postgres/fields/
'''

from api.models import Course, Student, CourseProgress

import django_filters

__all__ = ['CourseFilterSet', 'StudentFilterSet', 'CourseProgressFilterSet']


class CourseFilterSet(django_filters.FilterSet):
    # TODO - Add a filter for keyword. Most likely will be regexp

    # NOTE - If field_name is not provided in CharFilter, variable name must 
    # match the one declared in fields.
    instructors = django_filters.CharFilter(method = 'instructors__contains')

    class Meta:
        model = Course 
        fields = (
            'course_title', 
            'course_number_tufts', 
            'course_number_bhcc',
            'credits_tufts', 
            'credits_bhcc', 
            'department', 
            'prereqs',
            'instructors'
        )
    
    def instructors__contains(self, queryset, name, value):
        '''
        Support ArrayField type and overrides the default endpoint for querying
        instructors. Name of instructors must match the database.

        NOTE - This function cannot be made as a private by adding __ at the 
        start. Django will try to access it and raise an error.

        >>> api/course?course_title=Algorithm&instructors=Karen,Dianne
        Returns successful match

        >>> api/course?course_title=Algorithm&instructors=Karen
        Returns successful match

        >>> api/course?course_title=Algorithm&instructors=Karen,Mark
        Returns empty queryset
        '''

        return queryset.filter(
            **{f'{name}__contains': value.split(',')}
        )
    
class StudentFilterSet(django_filters.FilterSet):

    # Format - YYYY-MM-DD
    birthday = django_filters.DateFilter(field_name = 'birthday')

    class Meta:
        model = Student
        fields = (
            'firstname',
            'lastname',
            'cohort'
        )

class CourseProgressFilterSet(django_filters.FilterSet):

    student = django_filters.NumberFilter(method = 'student_id_exact')

    class Meta:
        model = CourseProgress 
        fields = (
            'student',
        )

    def student_id_exact(self, queryset, name, value):
        '''
        Lookup the corresponding Student ID.
        '''
        return queryset.filter(
            **{f'{name}__pk': value}
        )
