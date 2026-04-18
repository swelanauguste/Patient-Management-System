from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import api_view
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .filters import PatientRecordFilter
from .models import PatientRecord
from .serializers import PatientRecordSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for listing or retrieving patients.
    """

    queryset = PatientRecord.objects.all()
    serializer_class = PatientRecordSerializer
    filterset_class = PatientRecordFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    ordering_fields = [
        "first_name",
        "last_name",
        "age",
        "id",
    ]  # Enable ordering by these fields
    search_fields = [
        "first_name",
        "last_name",
        "gender",
    ]  # Enable search by these fields
    permission_classes = [AllowAny]  # Allow unrestricted access to this viewset

    # filterset_fields = [
    #     "first_name",
    #     "last_name",
    #     "gender",
    #     "age",
    # ]  # Enable filtering by these fields

    
    # def list(self, request):
    #     queryset = PatientRecord.objects.all()
    #     serializer = PatientRecordSerializer(queryset, many=True)
    #     return Response(serializer.data)

    # def retrieve(self, request, pk=None):
    #     queryset = PatientRecord.objects.all()
    #     patient = get_object_or_404(queryset, pk=pk)
    #     serializer = PatientRecordSerializer(patient)
    #     return Response(serializer.data)

    # permission_classes = [AllowAny]  # Allow unrestricted access to this viewset


# class PatientListCreateAPIView(ListCreateAPIView):
#     queryset = PatientRecord.objects.all()
#     serializer_class = PatientRecordSerializer


# class PatientRetrieveUpdateAPIView(RetrieveUpdateAPIView):
#     queryset = PatientRecord.objects.all()
#     serializer_class = PatientRecordSerializer


# class PatientRetrieveDestroyAPIView(RetrieveDestroyAPIView):
#     queryset = PatientRecord.objects.all()
#     serializer_class = PatientRecordSerializer
