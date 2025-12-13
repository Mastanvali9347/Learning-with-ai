import os
import json
import re
from typing import List, Dict, Optional
from openai import OpenAI


class LLMService:
    """
    Small wrapper around the OpenAI Chat API with robust JSON extraction.

    - Reads OPENAI_API_KEY from environment (no hardcoded fallback).
    - Provides suggest_types, suggest_languages and generate_script.
    - Attempts to extract JSON from model output even if wrapped in code fences
      or extra explanatory text.
    """

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")  # DO NOT hardcode keys here
        if not api_key:
            # No key available: run in fallback mode (client=None)
            self.client: Optional[OpenAI] = None
        else:
            # Create client using provided key
            self.client = OpenAI(api_key=api_key)

        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # -----------------------
    # Utility helpers
    # -----------------------
    @staticmethod
    def _strip_code_fence(text: str) -> str:
        """
        Remove a single outer ```lang\n...\n``` block if present.
        """
        if text.strip().startswith("```") and "```" in text.strip()[3:]:
            parts = text.split("```")
            # parts like ['', 'json\n{...}', '']
            # join the middle parts (in case there are multiple fences)
            inner = "```".join(parts[1:-1]) if len(parts) > 2 else parts[1]
            # if leading language token like 'json\n', drop first line
            if inner.lstrip().startswith(("json", "json\n", "json\r\n")):
                inner = inner.split("\n", 1)[1] if "\n" in inner else ""
            return inner.strip()
        return text.strip()

    @staticmethod
    def _extract_json_substring(text: str) -> Optional[str]:
        """
        Find the first JSON array/object in text and return it as a substring.
        Uses a simple bracket-matching approach to support nested structures.
        Returns None if nothing found.
        """
        text = text.strip()
        # find start index of first { or [
        start = None
        for i, ch in enumerate(text):
            if ch in ("{", "["):
                start = i
                opening = ch
                break
        if start is None:
            return None

        # choose matching bracket
        closing_bracket = "}" if opening == "{" else "]"

        depth = 0
        for j in range(start, len(text)):
            if text[j] == opening:
                depth += 1
            elif text[j] == closing_bracket:
                depth -= 1
                if depth == 0:
                    return text[start : j + 1]
        return None

    @staticmethod
    def _parse_json_from_model(text: str):
        """
        Try to parse JSON from the model text using multiple strategies.
        Raises ValueError if parsing fails.
        """
        # 1) strip code fences if present
        candidate = LLMService._strip_code_fence(text)

        # 2) attempt direct parse
        try:
            return json.loads(candidate)
        except Exception:
            pass

        # 3) try to locate a JSON substring and parse it
        substring = LLMService._extract_json_substring(candidate)
        if substring:
            try:
                return json.loads(substring)
            except Exception:
                pass

        # 4) as a last resort, try to salvage using regex to pick a large {...} or [...]
        # This is more permissive but still may fail.
        match = re.search(r"(\{.*\}|\[.*\])", candidate, flags=re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass

        raise ValueError("Could not extract valid JSON from model output")

    # -----------------------
    # API methods
    # -----------------------
    def suggest_types(self, topic: str) -> List[Dict]:
        """
        Ask the model to suggest 6 different video content types for a topic.
        Returns a list of dicts with keys: id, name, description, icon.
        If the client is not configured, returns a sensible default list.
        """
        prompt = f"""
Given the learning topic: "{topic}"

Suggest 6 different video content types.
Return ONLY a JSON array where each element has: id, name, description, icon.
Example:
[
  {{ "id": 1, "name": "Simple Explanation", "description": "...", "icon": "📘" }},
  ...
]
"""
        # fallback/default when no API key
        if self.client is None:
            return [
                {"id": 1, "name": "Simple Explanation", "description": "Clear explanation", "icon": "📘"},
                {"id": 2, "name": "Diagram Walkthrough", "description": "Visual diagrams", "icon": "📊"},
                {"id": 3, "name": "Flowchart Animation", "description": "Process visuals", "icon": "🔄"},
                {"id": 4, "name": "3D Visualization", "description": "Concept animations", "icon": "🎬"},
                {"id": 5, "name": "Tutorial", "description": "Step-by-step guide", "icon": "📝"},
                {"id": 6, "name": "Infographic", "description": "Data visuals", "icon": "📈"},
                {"id": 7, "name": "Case Study", "description": "Real-world examples", "icon": "🏛️"},
                {"id": 8, "name": "Interview", "description": "Expert insights", "icon": "🎤"},
                {"id": 9, "name": "Storytelling", "description": "Narrative approach", "icon": "📖"},
                {"id": 10, "name": "Whiteboard Animation", "description": "Sketch-style visuals", "icon": "🖊️"},
                {"id": 11, "name": "Animated Explainer", "description": "Engaging animations", "icon": "🎨"},
                {"id": 12, "name": "Virtual Tour", "description": "Immersive experience", "icon": "🌐"},
                {"id": 13, "name": "Simulation", "description": "Interactive learning", "icon": "🕹️"},
                {"id": 14, "name": "Podcast Style", "description": "Audio-focused content", "icon": "🎧"},
                {"id": 15, "name": "Debate", "description": "Multiple perspectives", "icon": "⚖️"},
            ]

        try:
            resp = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7,
            )
            # support different response shapes defensively
            content = ""
            if resp.choices and hasattr(resp.choices[0], "message"):
                # modern SDK object style
                content = resp.choices[0].message.content
            elif resp.choices and isinstance(resp.choices[0], dict) and "message" in resp.choices[0]:
                content = resp.choices[0]["message"]["content"]
            else:
                content = str(resp)

            json_obj = self._parse_json_from_model(content)
            # ensure list
            if isinstance(json_obj, list):
                return json_obj
            # If model returned object with a field containing the array, try to find it:
            if isinstance(json_obj, dict):
                for v in json_obj.values():
                    if isinstance(v, list):
                        return v
            raise ValueError("Model did not return an array of types")
        except Exception as e:
            # log error and return an empty list to allow the caller to continue
            print("⚠️ LLMService.suggest_types error:", e)
            return []

    # ---------------------------------------------
    # 2. LANGUAGES
    # ---------------------------------------------
    def suggest_languages(self, topic: str, video_type: str) -> List[Dict]:
        """
        Returns a list of supported language entries.
        This is currently static but could be made dynamic via LLM if needed.
        """
        return [
            {"code": "hi", "name": "Hindi", "native_name": "हिन्दी"},
            {"code": "te", "name": "Telugu", "native_name": "తెలుగు"},
            {"code": "ta", "name": "Tamil", "native_name": "தமிழ்"},
            {"code": "ml", "name": "Malayalam", "native_name": "മലയാളം"},
            {"code": "kn", "name": "Kannada", "native_name": "ಕನ್ನಡ"},
            {"code": "mr", "name": "Marathi", "native_name": "मराठी"},
            {"code": "bn", "name": "Bengali", "native_name": "বাংলা"},
            {"code": "gu", "name": "Gujarati", "native_name": "ગુજરાતી"},
            {"code": "pa", "name": "Punjabi", "native_name": "ਪੰਜਾਬੀ"},
            {"code": "or", "name": "Odia", "native_name": "ଓଡ଼ିଆ"},
            {"code": "as", "name": "Assamese", "native_name": "অসমীয়া"},
            {"code": "en", "name": "English", "native_name": "English"},
            {"code": "fr", "name": "French", "native_name": "Français"},
            {"code": "de", "name": "German", "native_name": "Deutsch"},
            {"code": "es", "name": "Spanish", "native_name": "Español"},
            {"code": "zh", "name": "Chinese", "native_name": "中文"},
            {"code": "ja", "name": "Japanese", "native_name": "日本語"},
            {"code": "ru", "name": "Russian", "native_name": "Русский"},
            {"code": "ar", "name": "Arabic", "native_name": "العربية"},
            {"code": "pt", "name": "Portuguese", "native_name": "Português"},
            {"code": "it", "name": "Italian", "native_name": "Italiano"},
            {"code": "nl", "name": "Dutch", "native_name": "Nederlands"},
            {"code": "sv", "name": "Swedish", "native_name": "Svenska"},
            {"code": "ko", "name": "Korean", "native_name": "한국어"},
            {"code": "tr", "name": "Turkish", "native_name": "Türkçe"},
            {"code": "vi", "name": "Vietnamese", "native_name": "Tiếng Việt"},
            {"code": "id", "name": "Indonesian", "native_name": "Bahasa Indonesia"},
            {"code": "th", "name": "Thai", "native_name": "ไทย"},
            {"code": "pl", "name": "Polish", "native_name": "Polski"},
            {"code": "uk", "name": "Ukrainian", "native_name": "Українська"},
            {"code": "fa", "name": "Persian", "native_name": "فارسی"},
            {"code": "he", "name": "Hebrew", "native_name": "עברית"},
            {"code": "el", "name": "Greek", "native_name": "Ελληνικά"},
            {"code": "ro", "name": "Romanian", "native_name": "Română"},
            {"code": "hu", "name": "Hungarian", "native_name": "Magyar"},
            {"code": "cs", "name": "Czech", "native_name": "Čeština"},
            {"code": "da", "name": "Danish", "native_name": "Dansk"},
            {"code": "fi", "name": "Finnish", "native_name": "Suomi"},
            {"code": "no", "name": "Norwegian", "native_name": "Norsk"},
            {"code": "sk", "name": "Slovak", "native_name": "Slovenčina"},
            {"code": "sl", "name": "Slovenian", "native_name": "Slovenščina"},
            {"code": "hr", "name": "Croatian", "native_name": "Hrvatski"},
            {"code": "bg", "name": "Bulgarian", "native_name": "Български"},
            {"code": "lt", "name": "Lithuanian", "native_name": "Lietuvių"},
            {"code": "lv", "name": "Latvian", "native_name": "Latviešu"},
            {"code": "et", "name": "Estonian", "native_name": "Eesti"},
            {"code": "sr", "name": "Serbian", "native_name": "Српски"},
            {"code": "mk", "name": "Macedonian", "native_name": "Македонски"},
            {"code": "al", "name": "Albanian", "native_name": "Shqip"},
            {"code": "is", "name": "Icelandic", "native_name": "Íslenska"},
            {"code": "ga", "name": "Irish", "native_name": "Gaeilge"},
            {"code": "cy", "name": "Welsh", "native_name": "Cymraeg"},
        ]

    def generate_script(self, topic: str, video_type: str, language: str) -> Dict:
        """
        Generate a script using the LLM. Returns a dict with keys: title, description, scenes[].
        Raises Exception if client is missing or parsing fails.
        """
        prompt = f"""
Create an educational video script about \"{topic}\" in {language}.
Return ONLY a JSON object with keys: title, description, scenes[].
Each scene should be an object with: id, heading, text (voiceover), and optionally visual_notes.
"""

        if self.client is None:
            raise RuntimeError("OPENAI_API_KEY missing — cannot generate script.")

        try:
            resp = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1500,
                temperature=0.7,
            )

            # extract content defensively
            content = ""
            if resp.choices and hasattr(resp.choices[0], "message"):
                content = resp.choices[0].message.content
            elif resp.choices and isinstance(resp.choices[0], dict) and "message" in resp.choices[0]:
                content = resp.choices[0]["message"]["content"]
            else:
                content = str(resp)

            parsed = self._parse_json_from_model(content)

            if not isinstance(parsed, dict):
                # If the model sent { "result": { ... } } or similar, try to find nested dict
                if isinstance(parsed, list):
                    # unlikely — wrap into dict
                    return {"title": topic, "description": "", "scenes": parsed}
                for v in parsed.values() if isinstance(parsed, dict) else []:
                    if isinstance(v, dict) and "scenes" in v:
                        return v
                raise ValueError("Model returned JSON but not the expected object shape")

            # Validate minimal shape
            if "scenes" not in parsed:
                parsed.setdefault("scenes", [])
            return parsed

        except Exception as exc:
            # Re-raise with context for easier debugging by caller
            raise Exception(f"Failed to generate script: {exc}") from exc
        if not output_path:
            output_path = tempfile.mktemp(suffix=".png")
        # Create mindmap diagram
        dot = Digraph(comment='Mindmap', format='png')
        dot.node('central', central_topic, shape='ellipse', style='filled', fillcolor='lightgreen')
        for i, branch in enumerate(branches):
            color = colors[i % len(colors)]
            dot.node(f'branch_{i}', branch, shape='box', style='filled', fillcolor=color)
            dot.edge('central', f'branch_{i}')
        dot.render(output_path, format='png', cleanup=True)
        return output_path + ".png"

        