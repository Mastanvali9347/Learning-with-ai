from flask import Blueprint, request, jsonify
from app.services.llm_service import LLMService

api_bp = Blueprint("api", __name__)
llm = LLMService()

def require_fields(data, fields: list):
    missing = [f for f in fields if not data.get(f)]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    return True, None



@api_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Learning with AI"
    })


@api_bp.route("/suggest-types", methods=["POST"])
def suggest_types():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["topic"])
    if not ok:
        return jsonify({"error": err}), 400

    try:
        types = llm.suggest_types(data["topic"])
        return jsonify({"success": True, "types": types})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/suggest-languages", methods=["POST"])
def suggest_languages():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["topic", "type"])
    if not ok:
        return jsonify({"error": err}), 400

    try:
        languages = llm.suggest_languages(data["topic"], data["type"])
        return jsonify({"success": True, "languages": languages})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/generate-script", methods=["POST"])
def generate_script():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["topic", "type", "language"])
    if not ok:
        return jsonify({"error": err}), 400

    try:
        script = llm.generate_script(
            data["topic"], data["type"], data["language"]
        )
        return jsonify({"success": True, "script": script})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/generate-video-outline", methods=["POST"])
def generate_video_outline():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["topic", "type", "language"])
    if not ok:
        return jsonify({"error": err}), 400

    if not hasattr(llm, "generate_video_outline"):
        return jsonify({"error": "generate_video_outline() not implemented"}), 501

    try:
        outline = llm.generate_video_outline(
            data["topic"], data["type"], data["language"]
        )
        return jsonify({"success": True, "outline": outline})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/suggest-topics", methods=["POST"])
def suggest_topics():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["subject_area"])
    if not ok:
        return jsonify({"error": err}), 400

    if not hasattr(llm, "suggest_topics"):
        return jsonify({"error": "suggest_topics() not implemented"}), 501

    try:
        topics = llm.suggest_topics(data["subject_area"])
        return jsonify({"success": True, "topics": topics})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/summarize-text", methods=["POST"])
def summarize_text():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["text"])
    if not ok:
        return jsonify({"error": err}), 400

    if not hasattr(llm, "summarize_text"):
        return jsonify({"error": "summarize_text() not implemented"}), 501

    try:
        summary = llm.summarize_text(data["text"])
        return jsonify({"success": True, "summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/extract-keypoints", methods=["POST"])
def extract_keypoints():
    data = request.get_json() or {}
    ok, err = require_fields(data, ["text"])
    if not ok:
        return jsonify({"error": err}), 400

    if not hasattr(llm, "extract_keypoints"):
        return jsonify({"error": "extract_keypoints() not implemented"}), 501
    try:
        keypoints = llm.extract_keypoints(data["text"])
        return jsonify({"success": True, "keypoints": keypoints})
    except Exception as e:
        return jsonify({"error": str(e)}), 500