import os
from dotenv import load_dotenv

# Load environment variables from .env file FIRST, before importing config
load_dotenv()

# Debug: Print the DATABASE_URL to verify it's loaded
print(f"DEBUG: DATABASE_URL = {os.environ.get('DATABASE_URL')}")

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db


def create_app(config_name='default'):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Debug: Print the actual config being used
    print(f"DEBUG: Config name = {config_name}")
    print(f"DEBUG: SQLALCHEMY_DATABASE_URI = {app.config.get('SQLALCHEMY_DATABASE_URI')}")

    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    JWTManager(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.tasks import tasks_bp
    from routes.users import users_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(users_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return {'status': 'healthy'}, 200

    return app


if __name__ == '__main__':
    env = os.environ.get('FLASK_ENV', 'development')
    app = create_app(env)
    app.run(host='0.0.0.0', port=5000, debug=True)
