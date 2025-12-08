from flask import Blueprint, request, jsonify, send_file
import os
from app.tasks.video_tasks import generate_video_task
from app.tasks import celery_app

video_bp = Blueprint("video", __name__)

@video_bp.route("/generate", methods=["POST"])
def generate_video():
    """
    Starts async video generation job using Celery.
    """
    try:
        data = request.get_json() or {}

        topic = data.get("topic")
        video_type = data.get("type")
        language = data.get("language")
        options = data.get("options", {})

        # Validation
        if not topic or not video_type or not language:
            return jsonify({
                "error": "topic, type, and language are required"
            }), 400

        # Start Celery task
        task = generate_video_task.apply_async(
            args=[topic, video_type, language, options]
        )

        return jsonify({
            "success": True,
            "job_id": task.id,
            "message": "Video generation started"
        }), 202

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@video_bp.route("/status/<job_id>", methods=["GET"])
def get_status(job_id):
    """
    Returns real-time Celery job status.
    """
    try:
        task = celery_app.AsyncResult(job_id)

        response = {
            "job_id": job_id,
            "status": task.state,
        }

        if task.state == "PENDING":
            response.update({
                "progress": 0,
                "message": "Job is waiting to start..."
            })

        elif task.state == "PROGRESS":
            info = task.info or {}
            response.update({
                "progress": info.get("progress", 0),
                "message": info.get("message", "Processing..."),
                "current_step": info.get("current_step", "Unknown")
            })

        elif task.state == "SUCCESS":
            result = task.result or {}
            response.update({
                "progress": 100,
                "message": "Video generation complete!",
                "result": result
            })

        elif task.state == "FAILURE":
            response.update({
                "progress": 0,
                "message": f"Job failed: {str(task.info)}",
                "error": str(task.info)
            })

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@video_bp.route("/download/<job_id>", methods=["GET"])
def download_video(job_id):
    """
    Downloads the completed video as a file.
    """
    try:
        task = celery_app.AsyncResult(job_id)

        if task.state != "SUCCESS":
            return jsonify({"error": "Video not ready"}), 400

        result = task.result or {}
        video_path = result.get("video_path")

        if not video_path or not os.path.exists(video_path):
            return jsonify({"error": "Video file not found"}), 404

        return send_file(
            video_path,
            mimetype="video/mp4",
            as_attachment=True,
            download_name=f"learning_video_{job_id}.mp4"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@video_bp.route("/stream/<job_id>", methods=["GET"])
def stream_video(job_id):
    """
    Streams the completed video without downloading.
    """
    try:
        task = celery_app.AsyncResult(job_id)

        if task.state != "SUCCESS":
            return jsonify({"error": "Video not ready"}), 400

        result = task.result or {}
        video_path = result.get("video_path")

        if not video_path or not os.path.exists(video_path):
            return jsonify({"error": "Video file not found"}), 404

        return send_file(
            video_path,
            mimetype="video/mp4"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@video_bp.route("/history", methods=["GET"])
def get_history():
    """
    Future-ready: will fetch completed jobs from a database.
    """
    return jsonify({
        "videos": [],
        "total": 0
    })
