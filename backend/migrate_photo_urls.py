"""
One-time migration: convert proxy photo URLs to public Google Drive URLs.

Old format: /api/image/<file_id>
New format: https://drive.google.com/uc?id=<file_id>&export=view

Run from the backend directory:
    python migrate_photo_urls.py
"""

from app import app
from database import db
from models.item import Item

PREFIX = "/api/image/"

with app.app_context():
    items = Item.query.filter(Item.photo_url.like(f"{PREFIX}%")).all()

    if not items:
        print("No items with old-style photo URLs found. Nothing to migrate.")
    else:
        print(f"Found {len(items)} item(s) to migrate:")
        for item in items:
            file_id = item.photo_url[len(PREFIX):]
            new_url = f"https://drive.google.com/uc?id={file_id}&export=view"
            print(f"  [{item.id}] {item.name}: {item.photo_url} -> {new_url}")
            item.photo_url = new_url

        db.session.commit()
        print(f"\nDone. {len(items)} record(s) updated.")
