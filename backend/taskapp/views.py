from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.contrib.auth.models import User
from .models import Task
from .serializers import RegisterSerializer, TaskSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        if User.objects.filter(username=data.get("username")).exists():
            return Response({"error": "User already registered"}, status=400)
        if User.objects.filter(email=data.get("email")).exists():
            return Response({"error": "Email already registered"}, status=400)

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "User registered successfully"}, status=201)
        errors = {}
        for key, value in serializer.errors.items():
            errors[key] = " ".join(value)
        return Response({"error": errors}, status=400)
    


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(username=user_obj.username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "msg": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        else:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

# -------- TASK CRUD --------

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.all()
