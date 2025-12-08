# Learning with AI – AI-Powered Educational Video Generator
Learning with AI is a full-stack, production-ready system that transforms any topic into a complete AI-generated learning video, including:

🧠 Script generation
🎤 Voice narration
🎨 AI images & diagrams
🎬 Video rendering
🔄 Async background processing
🌍 30+ language support

Built using Flask, OpenAI, ElevenLabs, MoviePy, Redis, Celery, and a modern React frontend.

This project is ideal for:
EdTech startups
Teachers/instructors
AI learning tools
Automated video content creation

# ✨ Key Features
🧠 1. AI Script Generation
Topic → Multi-scene structured educational script
Multiple video formats (explanation, diagram walkthrough, flowchart, etc.)
Multi-language support (Indian + global languages)

# 🎤 2. AI Text-to-Speech
Supports:
OpenAI gpt-4o-mini-tts
ElevenLabs multilingual voices
Automatic fallback if API fails

# 🎨 3. AI Image Generation
Uses OpenAI image models
Intelligent prompts for clean educational illustrations
Auto fallback to placeholder images

# 🖼 4. Smart Diagram Generation
Flowcharts
Mindmaps
Organization Charts
Diagram-from-text via LLM
GraphViz rendering pipeline

# 🎬 5. Automated Video Creation
Scene assembly
Fade/slide transitions
Text overlay support
Intro + outro scenes
Full audio sync
Supports HD output up to 1080p

# 🔄 6. Celery Worker System
All video generation runs in the background
Redis message queue
Frontend receives job updates in real-time

# 🌐 7. Frontend (React)
Clean UI
Step-by-step video generation workflow
Realtime job progress
Video playback & downloads
