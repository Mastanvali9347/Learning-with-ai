from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import AIHistory


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@csrf_exempt
@api_view(["POST"])
def signup(request):
    full_name = request.data.get("full_name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not full_name or not email or not password:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name
    )

    tokens = get_tokens_for_user(user)

    return Response(
        {"success": True, **tokens},
        status=status.HTTP_201_CREATED
    )


@csrf_exempt
@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)

    if not user:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    tokens = get_tokens_for_user(user)

    return Response(
        {"success": True, **tokens},
        status=status.HTTP_200_OK
    )



@csrf_exempt
@api_view(["POST"])
def google_login(request):
    token = request.data.get("token")

    if not token:
        return Response(
            {"error": "Token is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            audience=None  # add GOOGLE_CLIENT_ID for production
        )

        email = info.get("email")
        name = info.get("name", "")

        if not email:
            return Response(
                {"error": "Email not found in Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": name
            }
        )

        tokens = get_tokens_for_user(user)

        return Response(
            {"success": True, **tokens},
            status=status.HTTP_200_OK
        )

    except ValueError:
        return Response(
            {"error": "Invalid Google token"},
            status=status.HTTP_400_BAD_REQUEST
        )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_ai_history(request):
    topic = request.data.get("topic")
    response_text = request.data.get("response")

    if not topic or not response_text:
        return Response(
            {"error": "Topic and response are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    AIHistory.objects.create(
        user=request.user,
        topic=topic,
        response=response_text
    )

    return Response(
        {"success": True},
        status=status.HTTP_201_CREATED
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_ai_history(request):
    history = AIHistory.objects.filter(user=request.user).values(
        "id", "topic", "response", "created_at"
    )

    return Response(history, status=status.HTTP_200_OK)
