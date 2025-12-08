import os
import tempfile
import requests
from openai import OpenAI


class TTSService:
    """
    Supports:
    - OpenAI TTS (gpt-4o-mini-tts)
    - ElevenLabs TTS
    """

    def __init__(self):
        # --- ElevenLabs ---
        self.eleven_key = os.getenv("ELEVENLABS_API_KEY")
        self.eleven_voice = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")

        # --- OpenAI ---
        api_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = OpenAI(api_key=api_key) if api_key else None

    # ---------------------------------------------------
    # ELEVENLABS
    # ---------------------------------------------------
    def generate_audio_elevenlabs(self, text: str, output_path=None):
        if not self.eleven_key:
            raise Exception("Missing ELEVENLABS_API_KEY")

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.eleven_voice}"

        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.eleven_key
        }

        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.6,
                "similarity_boost": 0.8
            }
        }

        resp = requests.post(url, headers=headers, json=payload, stream=True)

        if resp.status_code != 200:
            raise Exception(f"ElevenLabs Error: {resp.text}")

        if not output_path:
            output_path = tempfile.mktemp(suffix=".mp3")

        with open(output_path, "wb") as f:
            for chunk in resp.iter_content(1024):
                f.write(chunk)

        return output_path

    # ---------------------------------------------------
    # OPENAI TTS
    # ---------------------------------------------------
    def generate_audio_openai(self, text: str, output_path=None):
        if not self.openai_client:
            raise Exception("OpenAI TTS not configured (OPENAI_API_KEY missing)")

        if not output_path:
            output_path = tempfile.mktemp(suffix=".mp3")

        response = self.openai_client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice="alloy",
            input=text
        )

        response.stream_to_file(output_path)
        return output_path

    # ---------------------------------------------------
    # PUBLIC METHOD
    # ---------------------------------------------------
    def generate_audio(self, text: str, output_path=None, provider="openai"):
        text = text.strip()
        if not text:
            raise Exception("Cannot generate TTS from empty text")

        if provider == "elevenlabs" and self.eleven_key:
            return self.generate_audio_elevenlabs(text, output_path)

        return self.generate_audio_openai(text, output_path)
