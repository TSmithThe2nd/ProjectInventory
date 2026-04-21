from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI

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


def _build_flow():
    return Flow.from_client_config(CLIENT_CONFIG, scopes=SCOPES, redirect_uri=REDIRECT_URI)


def get_auth_url():
    """Return the Google OAuth URL and state token to redirect the user to for login."""
    flow = _build_flow()
    auth_url, state = flow.authorization_url(access_type="offline", prompt="consent")
    return auth_url, state


def exchange_code_for_token(code, state):
    """Exchange the authorization code from Google's redirect for an access token."""
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


def get_credentials_from_session(session):
    """Rebuild Google API credentials from the token dict stored in the Flask session."""
    token_data = session.get("google_token")
    if not token_data:
        return None
    return Credentials(
        token=token_data["token"],
        refresh_token=token_data["refresh_token"],
        token_uri=token_data["token_uri"],
        client_id=token_data["client_id"],
        client_secret=token_data["client_secret"],
        scopes=token_data["scopes"],
    )