from django.urls import path
from .views import (
    signup,
    login_user,
    google_login,
    save_ai_history,
    get_ai_history,
)

urlpatterns = [
    path("auth/signup/", signup, name="signup"),
    path("auth/login/", login_user, name="login"),
    path("auth/google/", google_login, name="google_login"),
    path("ai/history/save/", save_ai_history, name="save_ai_history"),
    path("ai/history/", get_ai_history, name="get_ai_history"),
]
