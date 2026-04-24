from flask import Blueprint, redirect, request, jsonify
from services.auth_service import get_auth_url, exchange_code_for_token, verify_state, generate_auth_token, get_credentials
from config import FRONTEND_URL

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/login")
def login():
    auth_url, _ = get_auth_url()
    return redirect(auth_url)


@auth_bp.route("/auth/callback")
def callback():
    code = request.args.get("code")
    state = request.args.get("state")

    if not verify_state(state):
        return jsonify({"error": "Invalid state"}), 400

    token_data = exchange_code_for_token(code)
    auth_token = generate_auth_token(token_data)
    return redirect(f"{FRONTEND_URL}?token={auth_token}")


@auth_bp.route("/auth/logout")
def logout():
    return jsonify({"message": "Logged out"})


@auth_bp.route("/auth/refresh-token-export")
def refresh_token_export():
    # TEMPORARY — delete this route after copying GOOGLE_REFRESH_TOKEN to Render
    from services.auth_service import _token_s
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Not authenticated"}), 401
    try:
        token_data = _token_s.loads(auth_header[7:])
        return jsonify({"refresh_token": token_data["refresh_token"]})
    except Exception:
        return jsonify({"error": "Invalid token"}), 401


@auth_bp.route("/auth/me")
def me():
    creds = get_credentials()
    if not creds:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True})
