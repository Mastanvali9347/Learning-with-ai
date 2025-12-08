import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv

load_dotenv()

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object('app.config.Config')
    
    # CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv("FRONTEND_URL", "http://localhost:3000"),
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize SocketIO
    socketio.init_app(app, cors_allowed_origins="*")
    
    # Register blueprints
    from app.routes.api import api_bp
    from app.routes.video import video_bp
    
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(video_bp, url_prefix='/api/video')
    
    # Create output directory
    os.makedirs(app.config['OUTPUT_DIR'], exist_ok=True)
    
    return app