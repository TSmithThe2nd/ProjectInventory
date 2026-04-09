from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

# This service handles Google OAuth 2.0.
# The flow: user clicks "Sign in with Google" → Google redirects back with a code
# → we exchange the code for tokens → we store the token in the session.

def get_auth_url():
    """Return the Google OAuth URL to redirect the user to for login."""
    # TODO: implement with google-auth-oauthlib
    raise NotImplementedError


def exchange_code_for_token(code):
    """Exchange the authorization code (from Google's redirect) for an access token."""
    # TODO: implement with google-auth-oauthlib
    raise NotImplementedError


def get_credentials_from_session(session):
    """Rebuild Google API credentials from the token stored in the Flask session."""
    # TODO: implement with google-auth
    raise NotImplementedError