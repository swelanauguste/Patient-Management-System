import django_filters

from .models import PatientRecord


class PatientRecordFilter(django_filters.FilterSet):
    first_name = django_filters.CharFilter(lookup_expr="icontains")
    last_name = django_filters.CharFilter(lookup_expr="icontains")
    # gender = django_filters.CharFilter(lookup_expr="icontains")
    age__gt = django_filters.NumberFilter(field_name="age", lookup_expr="gt")
    age__lt = django_filters.NumberFilter(field_name="age", lookup_expr="lt")

    class Meta:
        model = PatientRecord
        fields = ["first_name", "last_name", "gender", "age__gt", "age__lt"]
