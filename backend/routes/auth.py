from flask import Blueprint, redirect, request, session, jsonify
from services.auth_service import get_auth_url, exchange_code_for_token, get_credentials_from_session
from config import FRONTEND_URL

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/login")
def login():
    auth_url, state = get_auth_url()
    session["oauth_state"] = state
    return redirect(auth_url)


@auth_bp.route("/auth/callback")
def callback():
    code = request.args.get("code")
    state = request.args.get("state")

    if state != session.get("oauth_state"):
        return jsonify({"error": "Invalid state"}), 400

    token_data = exchange_code_for_token(code, state)
    session["google_token"] = token_data
    return redirect(FRONTEND_URL)


@auth_bp.route("/auth/logout")
def logout():
    session.pop("google_token", None)
    return jsonify({"message": "Logged out"})


@auth_bp.route("/auth/me")
def me():
    creds = get_credentials_from_session(session)
    if not creds:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True})