import uuid
from flask import Blueprint, request, jsonify, Response
from werkzeug.utils import secure_filename
from services.auth_service import get_credentials
from services.drive_service import upload_photo, delete_photo, get_photo

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "heic"}
MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp", "heic": "image/heic"}


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@uploads_bp.route("/upload", methods=["POST"])
def upload():
    creds = get_credentials()
    if not creds:
        return jsonify({"error": "Not authenticated"}), 401

    if "photo" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["photo"]
    if not file.filename or not _allowed(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    ext = secure_filename(file.filename).rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    mime_type = MIME_TYPES.get(ext, "image/jpeg")

    photo_url = upload_photo(file.read(), filename, mime_type, creds)
    return jsonify({"photo_url": photo_url}), 201


@uploads_bp.route("/image/<file_id>")
def proxy_image(file_id):
    creds = get_credentials()
    if not creds:
        return jsonify({"error": "Not authenticated"}), 401
    try:
        data, mime_type = get_photo(file_id, creds)
        return Response(data, mimetype=mime_type)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@uploads_bp.route("/upload/<file_id>", methods=["DELETE"])
def remove_photo(file_id):
    creds = get_credentials()
    if not creds:
        return jsonify({"error": "Not authenticated"}), 401
    delete_photo(file_id, creds)
    return jsonify({"deleted": file_id})
