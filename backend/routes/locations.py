from flask import Blueprint, jsonify, request

locations_bp = Blueprint("locations", __name__)

# Each location is a property address with named storage spots
# e.g. {"address": "123 Main St, Cleveland TN", "spots": ["Garage", "Storage Unit"]}
_locations = []


@locations_bp.route("/locations", methods=["GET"])
def get_locations():
    return jsonify(_locations)


@locations_bp.route("/locations", methods=["POST"])
def create_location():
    """Add a new property address and its storage spots."""
    data = request.get_json()
    _locations.append(data)
    return jsonify(data), 201