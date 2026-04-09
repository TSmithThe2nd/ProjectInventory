from flask import Blueprint, jsonify

sync_bp = Blueprint("sync", __name__)


@sync_bp.route("/sync", methods=["POST"])
def sync_to_sheets():
    """
    Push all in-memory items to Google Sheets.
    For now this is a stub — the real implementation comes in Phase 1
    when we wire up sheets_service.py.
    """
    return jsonify({"status": "ok", "message": "Sync not yet implemented"})