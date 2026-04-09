from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY
from routes.items import items_bp
from routes.tags import tags_bp
from routes.locations import locations_bp
from routes.sync import sync_bp

app = Flask(__name__)
app.secret_key = SECRET_KEY

# Allow the React dev server (port 5173) to make requests to this backend
CORS(app, origins=["http://localhost:5173"])

# Register route blueprints — each blueprint owns a group of related endpoints
app.register_blueprint(items_bp, url_prefix="/api")
app.register_blueprint(tags_bp, url_prefix="/api")
app.register_blueprint(locations_bp, url_prefix="/api")
app.register_blueprint(sync_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)