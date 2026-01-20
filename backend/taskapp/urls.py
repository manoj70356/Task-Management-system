from django.urls import path
from .views import RegisterView, TaskListCreateView, TaskUpdateDeleteView,LoginView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),

    path('tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskUpdateDeleteView.as_view()),
]
