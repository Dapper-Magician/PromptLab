import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.prompt import Category, Prompt, TestResult, PromptTemplate, Shortcut
from src.routes.user import user_bp
from src.routes.prompt import prompt_bp
from src.routes.category import category_bp
from src.routes.test import test_bp
from src.routes.template import template_bp
from src.routes.shortcut import shortcut_bp
from src.routes.analytics import analytics_bp

# Initialize Flask app
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configuration from environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

# Database configuration
base_dir = os.path.abspath(os.path.dirname(__file__))
database_path = os.path.join(base_dir, 'database', 'app.db')

# Ensure database directory exists
os.makedirs(os.path.dirname(database_path), exist_ok=True)

# Use absolute path for SQLite
database_uri = os.getenv('DATABASE_URI')
if not database_uri or database_uri.startswith('sqlite:///database/'):
    # Use absolute path for local development
    database_uri = f"sqlite:///{database_path}"

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = os.getenv('ENABLE_SQL_LOGGING', 'False').lower() == 'true'

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:5002')
CORS(app, resources={r"/api/*": {"origins": cors_origins.split(',')}})

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(prompt_bp, url_prefix='/api')
app.register_blueprint(category_bp, url_prefix='/api')
app.register_blueprint(test_bp, url_prefix='/api')
app.register_blueprint(template_bp, url_prefix='/api')
app.register_blueprint(shortcut_bp, url_prefix='/api')
app.register_blueprint(analytics_bp, url_prefix='/api')

# Initialize database
db.init_app(app)
with app.app_context():
    db.create_all()
    print("✓ Database initialized successfully")

# Serve React app (for production builds)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve static files and React app"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            # In development, show helpful message
            if app.config['DEBUG']:
                return """
                <html>
                    <head><title>PromptLab Backend</title></head>
                    <body style="font-family: system-ui; padding: 40px; max-width: 800px; margin: 0 auto;">
                        <h1>🚀 PromptLab Backend Server</h1>
                        <p>Backend is running successfully at <code>http://localhost:{}</code></p>
                        <p>To start the frontend development server, run:</p>
                        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">npm run dev</pre>
                        <p>API endpoints are available at <code>/api/*</code></p>
                        <ul>
                            <li><a href="/api/prompts">GET /api/prompts</a> - List all prompts</li>
                            <li><a href="/api/categories">GET /api/categories</a> - List all categories</li>
                        </ul>
                    </body>
                </html>
                """.format(os.getenv('PORT', '5002'))
            return "Frontend build not found. Run 'npm run build' first.", 404

# Health check endpoint
@app.route('/health')
def health():
    """Health check endpoint for monitoring"""
    return {
        'status': 'healthy',
        'database': 'connected',
        'version': '2.0.0'
    }

if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', '5002'))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"🎨 Starting PromptLab on http://{host}:{port}")
    print(f"📊 Debug mode: {debug}")
    print(f"🗄️  Database: {database_uri}")
    
    app.run(host=host, port=port, debug=debug)
