from datetime import date


def make_item(name, description, photo_url, address, spot, tags, added_by, quantity, unit, notes, item_id=None):
    """
    Returns a plain dict representing one inventory item.
    item_id is passed in when loading from Sheets; omit it when creating new items
    (the items route will generate the ID).
    """
    return {
        "id": item_id,
        "name": name,
        "description": description,
        "photo_url": photo_url,
        "location": {
            "address": address,
            "spot": spot,
        },
        "tags": tags,           # list of strings, e.g. ["Plumbing", "Copper"]
        "date_added": str(date.today()),
        "added_by": added_by,
        "quantity": quantity,
        "unit": unit,           # e.g. "pieces", "feet", "boxes"
        "notes": notes,
    }