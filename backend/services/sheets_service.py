from googleapiclient.discovery import build
from config import GOOGLE_SHEET_ID
from services.google_service_account import get_admin_credentials

RANGE = "Sheet1!A:Z"
HEADERS = ["id", "name", "description", "photo_url", "location", "tags", "date_added", "added_by", "quantity", "unit", "notes"]


def _service():
    return build("sheets", "v4", credentials=get_admin_credentials())


def get_all_items():
    result = _service().spreadsheets().values().get(
        spreadsheetId=GOOGLE_SHEET_ID, range=RANGE
    ).execute()
    rows = result.get("values", [])
    if len(rows) < 2:
        return []
    headers = rows[0]
    return [dict(zip(headers, row)) for row in rows[1:]]


def sync_all_items(items):
    svc = _service()
    svc.spreadsheets().values().clear(spreadsheetId=GOOGLE_SHEET_ID, range=RANGE).execute()
    rows = [HEADERS] + [[str(item.get(h, "")) for h in HEADERS] for item in items]
    svc.spreadsheets().values().update(
        spreadsheetId=GOOGLE_SHEET_ID,
        range="Sheet1!A1",
        valueInputOption="RAW",
        body={"values": rows},
    ).execute()
