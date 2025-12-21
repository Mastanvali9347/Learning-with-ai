from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status


class AuthAndAIHistoryTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.signup_url = "/api/signup/"
        self.login_url = "/api/login/"
        self.history_url = "/api/history/"
        self.save_history_url = "/api/history/save/"

        self.user_data = {
            "full_name": "Test User",
            "email": "testuser@gmail.com",
            "password": "testpassword123"
        }

    def test_user_signup(self):
        response = self.client.post(
            self.signup_url,
            self.user_data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(username=self.user_data["email"]).exists())
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_user_login(self):
        # Create user first
        User.objects.create_user(
            username=self.user_data["email"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )

        response = self.client.post(
            self.login_url,
            {
                "email": self.user_data["email"],
                "password": self.user_data["password"]
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_get_history_without_token(self):
        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_save_and_get_ai_history(self):
        # Signup user
        signup_response = self.client.post(
            self.signup_url,
            self.user_data,
            format="json"
        )

        access_token = signup_response.data["access"]

        # Set Authorization header
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        # Save AI history
        save_response = self.client.post(
            self.save_history_url,
            {
                "topic": "Artificial Intelligence",
                "response": "AI is the simulation of human intelligence."
            },
            format="json"
        )

        self.assertEqual(save_response.status_code, status.HTTP_200_OK)

        history_response = self.client.get(self.history_url)

        self.assertEqual(history_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(history_response.data), 1)
        self.assertEqual(
            history_response.data[0]["topic"],
            "Artificial Intelligence"
        )
