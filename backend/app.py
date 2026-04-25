from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY, DATABASE_URI, FRONTEND_URL
from database import db
from routes.items import items_bp
from routes.tags import tags_bp
from routes.locations import locations_bp
from routes.sync import sync_bp
from routes.uploads import uploads_bp
from routes.auth import auth_bp

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

CORS(app, origins=[FRONTEND_URL], supports_credentials=True)

app.register_blueprint(items_bp, url_prefix="/api")
app.register_blueprint(tags_bp, url_prefix="/api")
app.register_blueprint(locations_bp, url_prefix="/api")
app.register_blueprint(sync_bp, url_prefix="/api")
app.register_blueprint(uploads_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

with app.app_context():
    db.create_all()
    from models.item import Item
    from urllib.parse import urlparse, parse_qs
    _changed = False
    for _item in Item.query.filter(Item.photo_url.isnot(None)).all():
        url = _item.photo_url
        if url.startswith("/api/image/"):
            file_id = url[len("/api/image/"):]
            _item.photo_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=view"
            _changed = True
        elif "drive.google.com/uc" in url:
            qs = parse_qs(urlparse(url).query)
            file_id = (qs.get("id") or [""])[0]
            if file_id:
                _item.photo_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=view"
                _changed = True
    if _changed:
        db.session.commit()

if __name__ == "__main__":
    app.run(debug=False, port=5000)