import json
import os
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def get_service_account_credentials():
    sa_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not sa_json:
        raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON is not set")
    return Credentials.from_service_account_info(json.loads(sa_json), scopes=SCOPES)
