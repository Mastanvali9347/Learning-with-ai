from django.db import models
from django.contrib.auth.models import User


class AIHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ai_histories"
    )
    topic = models.CharField(max_length=255)
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.topic}"


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.email
