from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict


@dataclass
class Job:
    """
    Represents a video generation job.
    Works with Celery, Redis, DB, or in-memory storage.
    """

    id: str
    topic: str
    video_type: str
    language: str
    status: str = "PENDING"
    progress: int = 0

    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    video_path: Optional[str] = None
    error: Optional[str] = None

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "topic": self.topic,
            "video_type": self.video_type,
            "language": self.language,
            "status": self.status,
            "progress": self.progress,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "video_path": self.video_path,
            "error": self.error
        }

    def _touch(self):
        self.updated_at = datetime.utcnow()

    def set_progress(self, progress: int, status: Optional[str] = None):
        self.progress = max(0, min(progress, 100))  # clamp 0-100
        if status:
            self.status = status
        self._touch()

    def set_error(self, error_message: str):
        self.status = "FAILURE"
        self.error = error_message
        self.progress = 0
        self._touch()

    def set_completed(self, video_path: Optional[str]):
        self.status = "SUCCESS"
        self.progress = 100
        self.video_path = video_path
        self._touch()

    @staticmethod
    def from_dict(data: Dict) -> "Job":
        return Job(
            id=data["id"],
            topic=data["topic"],
            video_type=data["video_type"],
            language=data["language"],
            status=data.get("status", "PENDING"),
            progress=data.get("progress", 0),
            created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else datetime.utcnow(),
            updated_at=datetime.fromisoformat(data["updated_at"]) if data.get("updated_at") else datetime.utcnow(),
            video_path=data.get("video_path"),
            error=data.get("error")
        )