from config import GOOGLE_SHEET_ID

# This service talks to the Google Sheets API.
# Each inventory item maps to one row in the sheet.
# Column order matches the fields in models/item.py.

def get_all_items():
    """Read all rows from the sheet and return as a list of item dicts."""
    # TODO: implement with google-api-python-client
    raise NotImplementedError


def append_item(item):
    """Add a new row to the sheet for the given item dict."""
    # TODO: implement with google-api-python-client
    raise NotImplementedError


def update_item(item_id, item):
    """Find the row with the matching ID and update it in place."""
    # TODO: implement with google-api-python-client
    raise NotImplementedError


def delete_item(item_id):
    """Find the row with the matching ID and delete it."""
    # TODO: implement with google-api-python-client
    raise NotImplementedError