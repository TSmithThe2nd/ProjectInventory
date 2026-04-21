import os
from dotenv import load_dotenv

load_dotenv()

# Google OAuth credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# The ID of your Google Sheet (from the URL: /spreadsheets/d/<SHEET_ID>/edit)
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

# The ID of the Google Drive folder where photos will be uploaded
GOOGLE_DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")

# Flask secret key (used to sign session cookies)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")

# SQLite database file — lives in the backend directory
DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///inventory.db")

# Frontend origin and OAuth redirect (set in .env for local, env vars in production)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
REDIRECT_URI = os.getenv("REDIRECT_URI", "http://localhost:5173/api/auth/callback")