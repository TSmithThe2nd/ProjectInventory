from flask import Blueprint, jsonify, request

tags_bp = Blueprint("tags", __name__)

# Predefined tags from the spec — users can also add custom ones
_tags = [
    "Plumbing", "Electrical", "Drywall", "Lighting",
    "Decor", "Flooring", "HVAC", "General Hardware"
]


@tags_bp.route("/tags", methods=["GET"])
def get_tags():
    return jsonify(_tags)


@tags_bp.route("/tags", methods=["POST"])
def create_tag():
    """Add a custom tag."""
    data = request.get_json()
    tag = data.get("tag", "").strip()
    if tag and tag not in _tags:
        _tags.append(tag)
    return jsonify(_tags), 201