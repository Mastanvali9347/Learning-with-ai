import os
from celery import Celery


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "learning_with_ai_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,

    # Track started state (so we can show "STARTED" in API)
    task_track_started=True,

    # Task hard time limit
    task_time_limit=1800,          # hard 30 minutes limit
    task_soft_time_limit=1500,     # soft limit with grace period

    # Store results temporarily (clean Redis)
    result_expires=3600,           # auto expire after 1 hour

    # Performance options
    worker_prefetch_multiplier=1,  # prevents worker overload
    worker_concurrency=int(os.getenv("CELERY_WORKERS", 2)),

    # Routing support
    task_routes={
        "app.tasks.video_tasks.*": {"queue": "video"},
        "app.tasks.*": {"queue": "default"},
    },

    # JSON safety
    task_default_rate_limit=None,  # unlimited unless configured
    task_ignore_result=False,      # store results for tracking API
)


def _autodiscover():
    """
    Auto-register all tasks from app.tasks.* modules.
    Ensures Celery works even if project is moved or refactored.
    """
    try:
        celery_app.autodiscover_tasks([
            "app.tasks",
        ])
    except Exception as exc:
        print("Celery autodiscovery warning:", exc)


_autodiscover()
