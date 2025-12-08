import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'
    
    # OpenAI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', "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")
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')
    
    # TTS
    ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', "sk_8fd2c0c73775e38464da80e8711dc8f7cae3319a7f3d9a8a")
    ELEVENLABS_VOICE_ID = os.getenv('ELEVENLABS_VOICE_ID', 'k3zGUviRBlOalyiswEdo')
    
    # Redis/Celery
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
    
    # Storage
    OUTPUT_DIR = os.getenv('OUTPUT_DIR', './output')
    MAX_VIDEO_DURATION = int(os.getenv('MAX_VIDEO_DURATION', 1800))