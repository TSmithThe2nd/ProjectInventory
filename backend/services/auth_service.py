import os
from itsdangerous import URLSafeSerializer
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, SECRET_KEY

SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
]

CLIENT_CONFIG = {
    "web": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [REDIRECT_URI],
    }
}

_state_s = URLSafeSerializer(SECRET_KEY, salt="oauth-state")
_token_s = URLSafeSerializer(SECRET_KEY, salt="auth-token")


def _build_flow():
    return Flow.from_client_config(CLIENT_CONFIG, scopes=SCOPES, redirect_uri=REDIRECT_URI)


def generate_state():
    return _state_s.dumps(os.urandom(16).hex())


def verify_state(state):
    try:
        _state_s.loads(state)
        return True
    except Exception:
        return False


def get_auth_url():
    state = generate_state()
    flow = _build_flow()
    auth_url, _ = flow.authorization_url(access_type="offline", prompt="consent", state=state)
    return auth_url, state


def exchange_code_for_token(code):
    flow = _build_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials
    return {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": list(creds.scopes),
    }


def generate_auth_token(token_data):
    return _token_s.dumps(token_data)


def _build_credentials(token_data):
    return Credentials(
        token=token_data["token"],
        refresh_token=token_data["refresh_token"],
        token_uri=token_data["token_uri"],
        client_id=token_data["client_id"],
        client_secret=token_data["client_secret"],
        scopes=token_data["scopes"],
    )


def get_credentials():
    from flask import request
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    try:
        token_data = _token_s.loads(auth_header[7:])
        return _build_credentials(token_data)
    except Exception:
        return None
