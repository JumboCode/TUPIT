"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'students', views.StudentViewSet)
router.register(r'course', views.CourseViewSet)
router.register(r'courseprogress', views.CourseProgressViewSet)
router.register(r'degree', views.DegreeViewSet)
router.register(r'degreerequirement', views.DegreeRequirementViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
	path('', RedirectView.as_view(url='api/')),
    path('get-csrf-token/', views.GetCSRFToken),
    path('login/', views.LoginUser),
    path('logout/', views.LogoutUser),
    path('validate-logged-in/', views.ValidateLoggedIn),
    path('change-password/', views.ChangePassword),
    path('audit-student/', views.AuditStudentProgress),
    path('set-active-degree/', views.SetActiveDegree),
    path('reset-password/', views.ResetPassword),
    path('calculate-gpa/', views.CalculateGpa)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
