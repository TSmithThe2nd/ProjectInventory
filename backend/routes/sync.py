from flask import Blueprint, jsonify, session
from database import db
from models.item import Item
from services.auth_service import get_credentials_from_session
from services.sheets_service import sync_all_items, get_all_items

sync_bp = Blueprint("sync", __name__)


@sync_bp.route("/sync", methods=["POST"])
def sync_to_sheets():
    creds = get_credentials_from_session(session)
    if not creds:
        return jsonify({"error": "Not authenticated"}), 401

    items = Item.query.all()
    sync_all_items(creds, [item.to_dict() for item in items])
    return jsonify({"status": "ok", "synced": len(items)})


@sync_bp.route("/sync/status", methods=["GET"])
def sync_status():
    creds = get_credentials_from_session(session)
    if not creds:
        return jsonify({"error": "Not authenticated"}), 401

    sheet_items = get_all_items(creds)
    local_items = Item.query.count()
    return jsonify({"local": local_items, "sheet": len(sheet_items)})