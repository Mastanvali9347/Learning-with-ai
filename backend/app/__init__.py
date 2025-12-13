import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv

load_dotenv()

socketio = SocketIO()

def create_app():
    app = Flask(
        __name__,
        static_folder="../frontend/dist/assets",
        template_folder="../frontend/dist"
    )

    app.config.from_object("app.config.Config")

    # Enable CORS only for API
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv("FRONTEND_URL", "*"),
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    socketio.init_app(app, cors_allowed_origins="*")

    from app.routes.api import api_bp
    from app.routes.video import video_bp

    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(video_bp, url_prefix="/api/video")

    # Serve React frontend
    @app.route("/")
    def serve_frontend():
        return send_from_directory(app.template_folder, "index.html")

    @app.route("/<path:path>")
    def serve_static_files(path):
        return send_from_directory(app.template_folder, path)

    os.makedirs(app.config["OUTPUT_DIR"], exist_ok=True)

    return app
