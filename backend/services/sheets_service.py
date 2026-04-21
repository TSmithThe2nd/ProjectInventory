from googleapiclient.discovery import build
from config import GOOGLE_SHEET_ID

RANGE = "Sheet1!A:Z"
HEADERS = ["id", "name", "description", "photo_url", "location", "tags", "date_added", "added_by", "quantity", "unit", "notes"]


def _service(creds):
    return build("sheets", "v4", credentials=creds)


def get_all_items(creds):
    """Read all rows from the sheet and return as a list of item dicts."""
    result = _service(creds).spreadsheets().values().get(
        spreadsheetId=GOOGLE_SHEET_ID, range=RANGE
    ).execute()

    rows = result.get("values", [])
    if len(rows) < 2:
        return []

    headers = rows[0]
    return [dict(zip(headers, row)) for row in rows[1:]]


def sync_all_items(creds, items):
    """Overwrite the sheet with the current full item list."""
    svc = _service(creds)
    svc.spreadsheets().values().clear(
        spreadsheetId=GOOGLE_SHEET_ID, range=RANGE
    ).execute()
    rows = [HEADERS] + [[str(item.get(h, "")) for h in HEADERS] for item in items]
    svc.spreadsheets().values().update(
        spreadsheetId=GOOGLE_SHEET_ID,
        range="Sheet1!A1",
        valueInputOption="RAW",
        body={"values": rows},
    ).execute()


def append_item(creds, item):
    """Add a new row to the sheet for the given item dict."""
    row = [str(item.get(h, "")) for h in HEADERS]
    _service(creds).spreadsheets().values().append(
        spreadsheetId=GOOGLE_SHEET_ID,
        range=RANGE,
        valueInputOption="RAW",
        body={"values": [row]},
    ).execute()


def update_item(creds, item_id, item):
    """Find the row with the matching ID and update it in place."""
    svc = _service(creds)
    result = svc.spreadsheets().values().get(
        spreadsheetId=GOOGLE_SHEET_ID, range=RANGE
    ).execute()
    rows = result.get("values", [])

    for i, row in enumerate(rows[1:], start=2):
        if row and row[0] == item_id:
            updated = [str(item.get(h, "")) for h in HEADERS]
            svc.spreadsheets().values().update(
                spreadsheetId=GOOGLE_SHEET_ID,
                range=f"Sheet1!A{i}:Z{i}",
                valueInputOption="RAW",
                body={"values": [updated]},
            ).execute()
            return
    raise ValueError(f"Item {item_id} not found in sheet")


def delete_item(creds, item_id):
    """Find the row with the matching ID and delete it."""
    svc = _service(creds)
    result = svc.spreadsheets().values().get(
        spreadsheetId=GOOGLE_SHEET_ID, range=RANGE
    ).execute()
    rows = result.get("values", [])

    for i, row in enumerate(rows[1:], start=2):
        if row and row[0] == item_id:
            spreadsheet = svc.spreadsheets().get(spreadsheetId=GOOGLE_SHEET_ID).execute()
            sheet_id = spreadsheet["sheets"][0]["properties"]["sheetId"]
            svc.spreadsheets().batchUpdate(
                spreadsheetId=GOOGLE_SHEET_ID,
                body={"requests": [{"deleteDimension": {"range": {
                    "sheetId": sheet_id,
                    "dimension": "ROWS",
                    "startIndex": i - 1,
                    "endIndex": i,
                }}}]},
            ).execute()
            return
    raise ValueError(f"Item {item_id} not found in sheet")