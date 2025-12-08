import os
import tempfile
import requests
from openai import OpenAI
from PIL import Image, ImageDraw, ImageFont


class ImageService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    # -------------------------------------------------------
    # OPENAI IMAGE GENERATION
    # -------------------------------------------------------
    def generate_image(self, prompt: str, output_path=None, size="1024x1024"):
        if not self.client:
            return self.create_placeholder_image(prompt, output_path)

        try:
            response = self.client.images.generate(
                model="gpt-image-1",
                prompt=f"Educational illustration. Clean, professional.\n{prompt}",
                size=size,
                n=1,
                response_format="url",
            )

            image_url = response.data[0].url

            if not output_path:
                output_path = tempfile.mktemp(suffix=".png")

            img_data = requests.get(image_url).content
            with open(output_path, "wb") as f:
                f.write(img_data)

            return output_path

        except Exception:
            return self.create_placeholder_image(prompt, output_path)

    # -------------------------------------------------------
    # PLACEHOLDER IMAGE
    # -------------------------------------------------------
    def create_placeholder_image(self, text, output_path=None):
        if not output_path:
            output_path = tempfile.mktemp(suffix=".png")

        img = Image.new("RGB", (1024, 1024), color=(41, 128, 185))
        draw = ImageDraw.Draw(img)

        try:
            font = ImageFont.truetype("DejaVuSans.ttf", 40)
        except:
            font = ImageFont.load_default()

        words = text.split()
        lines = []
        line = []

        for w in words[:25]:
            line.append(w)
            if len(" ".join(line)) > 25:
                lines.append(" ".join(line[:-1]))
                line = [w]

        if line:
            lines.append(" ".join(line))

        y = 400
        for ln in lines[:5]:
            w, h = draw.textsize(ln, font=font)
            x = (1024 - w) // 2
            draw.text((x, y), ln, fill="white", font=font)
            y += 50

        img.save(output_path)
        return output_path

    # -------------------------------------------------------
    def resize_image(self, input_path, output_path, size=(1920, 1080)):
        img = Image.open(input_path)
        img = img.resize(size, Image.Resampling.LANCZOS)
        img.save(output_path)
        return output_path
