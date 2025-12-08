import os
import re
import uuid
from datetime import datetime

def generate_job_id() -> str:
    """Generate unique job ID"""
    return str(uuid.uuid4())

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    return re.sub(r'[^\w\-_\.]', '_', filename)

def get_file_size(filepath: str) -> int:
    """Get file size in bytes"""
    if os.path.exists(filepath):
        return os.path.getsize(filepath)
    return 0

def format_duration(seconds: int) -> str:
    """Format duration in human readable format"""
    mins, secs = divmod(seconds, 60)
    return f"{mins:02d}:{secs:02d}"

def cleanup_temp_files(directory: str, max_age_hours: int = 24):
    """Clean up old temporary files"""
    import time
    now = time.time()
    max_age_seconds = max_age_hours * 3600
    
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            if now - os.path.getmtime(filepath) > max_age_seconds:
                os.remove(filepath)