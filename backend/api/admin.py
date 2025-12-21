from django.contrib import admin
from .models import AIHistory, UserProfile


@admin.register(AIHistory)
class AIHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "topic", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__email", "topic")
    ordering = ("-created_at",)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    search_fields = ("user__email",)
