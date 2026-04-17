from flask import Blueprint, jsonify, request

items_bp = Blueprint("items", __name__)

# In-memory placeholder — will be replaced with SQLite in the next phase
_items = [
    {
        "id": "INV-0001",
        "name": "PVC Pipe ½ inch",
        "description": "Standard white PVC, 10ft lengths",
        "quantity": 14,
        "unit": "pcs",
        "location": "123 Main St – Storage Room",
        "tags": ["Plumbing"],
        "notes": "Check for cracks before use",
        "photo_url": None,
    },
    {
        "id": "INV-0002",
        "name": "LED Recessed Lights 6\"",
        "description": "Dimmable, 5000K daylight, retrofit kit",
        "quantity": 8,
        "unit": "pcs",
        "location": "456 Oak Ave – Garage Shelf B",
        "tags": ["Electrical", "Lighting"],
        "notes": "",
        "photo_url": None,
    },
    {
        "id": "INV-0003",
        "name": "Drywall Screws 1-5/8\"",
        "description": "Coarse thread, phosphate coated",
        "quantity": 3,
        "unit": "boxes",
        "location": "123 Main St – Storage Room",
        "tags": ["Drywall", "General Hardware"],
        "notes": "",
        "photo_url": None,
    },
]
_counter = 4


def _next_id():
    global _counter
    item_id = f"INV-{_counter:04d}"
    _counter += 1
    return item_id


@items_bp.route("/items", methods=["GET"])
def get_items():
    """Return all inventory items. Supports ?search=, ?tag=, ?location= query params later."""
    return jsonify(_items)


@items_bp.route("/items", methods=["POST"])
def create_item():
    """Accept a new item from the frontend form and store it."""
    data = request.get_json()
    data["id"] = _next_id()
    _items.append(data)
    return jsonify(data), 201


@items_bp.route("/items/<item_id>", methods=["GET"])
def get_item(item_id):
    item = next((i for i in _items if i["id"] == item_id), None)
    if not item:
        return jsonify({"error": "Not found"}), 404
    return jsonify(item)


@items_bp.route("/items/<item_id>", methods=["PUT"])
def update_item(item_id):
    item = next((i for i in _items if i["id"] == item_id), None)
    if not item:
        return jsonify({"error": "Not found"}), 404
    item.update(request.get_json())
    return jsonify(item)


@items_bp.route("/items/<item_id>", methods=["DELETE"])
def delete_item(item_id):
    global _items
    _items = [i for i in _items if i["id"] != item_id]
    return jsonify({"deleted": item_id})