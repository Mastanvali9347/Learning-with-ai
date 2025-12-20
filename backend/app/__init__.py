import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv

load_dotenv()

# Socket.IO instance
socketio = SocketIO(
    cors_allowed_origins="*",
    async_mode="eventlet"
)

def create_app():
    app = Flask(
        __name__,
        static_folder="../frontend/dist/assets",
        template_folder="../frontend/dist"
    )

    app.config.from_object("app.config.Config")

    # REST API CORS only
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": os.getenv("FRONTEND_URL", "*"),
                "methods": ["GET", "POST", "PUT", "DELETE"],
                "allow_headers": ["Content-Type", "Authorization"]
            }
        }
    )

    # Initialize Socket.IO
    socketio.init_app(app)

    @socketio.on("connect")
    def on_connect():
        print("✅ React connected via Socket.IO")

    @socketio.on("message")
    def on_message(data):
        print("📩 Message from React:", data)
        socketio.emit("response", {"reply": "Hello from Flask Socket.IO"})


    from app.routes.api import api_bp
    from app.routes.video import video_bp

    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(video_bp, url_prefix="/api/video")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        full_path = os.path.join(app.template_folder, path)
        if path and os.path.exists(full_path):
            return send_from_directory(app.template_folder, path)
        return send_from_directory(app.template_folder, "index.html")

    # Create output directory
    os.makedirs(app.config["OUTPUT_DIR"], exist_ok=True)

    return app
