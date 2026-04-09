from flask import Blueprint, jsonify, request

items_bp = Blueprint("items", __name__)

# In-memory placeholder — will be replaced with Google Sheets calls in Phase 1
_items = []
_counter = 1


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