from googleapiclient.discovery import build
from config import GOOGLE_SHEET_ID

RANGE = "Sheet1!A:Z"
HEADERS = ["id", "name", "description", "photo_url", "location", "tags", "date_added", "added_by", "quantity", "unit", "notes"]


def _service(creds):
    return build("sheets", "v4", credentials=creds)


def get_all_items(creds):
    result = _service(creds).spreadsheets().values().get(
        spreadsheetId=GOOGLE_SHEET_ID, range=RANGE
    ).execute()
    rows = result.get("values", [])
    if len(rows) < 2:
        return []
    headers = rows[0]
    return [dict(zip(headers, row)) for row in rows[1:]]


def sync_all_items(items, creds):
    svc = _service(creds)
    svc.spreadsheets().values().clear(spreadsheetId=GOOGLE_SHEET_ID, range=RANGE).execute()
    rows = [HEADERS] + [[str(item.get(h, "")) for h in HEADERS] for item in items]
    svc.spreadsheets().values().update(
        spreadsheetId=GOOGLE_SHEET_ID,
        range="Sheet1!A1",
        valueInputOption="RAW",
        body={"values": rows},
    ).execute()
