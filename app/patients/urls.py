from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("patients", views.PatientViewSet, basename="patient")
urlpatterns = router.urls
