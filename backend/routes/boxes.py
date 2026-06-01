from flask import Blueprint, jsonify, request
from database import db
from models.box import Box
from models.item import Item

boxes_bp = Blueprint('boxes', __name__)


@boxes_bp.route('/boxes', methods=['GET'])
def get_boxes():
    boxes = Box.query.all()
    return jsonify([b.to_dict() for b in boxes])


@boxes_bp.route('/boxes', methods=['POST'])
def create_box():
    data = request.get_json()
    box = Box(
        name=data.get('name', ''),
        description=data.get('description', ''),
        location=data.get('location', ''),
    )
    db.session.add(box)
    db.session.commit()
    return jsonify(box.to_dict()), 201


@boxes_bp.route('/boxes/<int:box_id>', methods=['GET'])
def get_box(box_id):
    box = db.get_or_404(Box, box_id)
    return jsonify(box.to_dict(include_items=True))


@boxes_bp.route('/boxes/<int:box_id>', methods=['PUT'])
def update_box(box_id):
    box = db.get_or_404(Box, box_id)
    data = request.get_json()
    if 'name' in data:        box.name        = data['name']
    if 'description' in data: box.description = data['description']
    if 'location' in data:    box.location    = data['location']
    db.session.commit()
    return jsonify(box.to_dict())


@boxes_bp.route('/boxes/<int:box_id>', methods=['DELETE'])
def delete_box(box_id):
    box = db.get_or_404(Box, box_id)
    for item in box.items:
        item.box_id = None
    db.session.delete(box)
    db.session.commit()
    return jsonify({'deleted': box_id})


@boxes_bp.route('/items/<int:item_id>/box', methods=['PUT'])
def assign_box(item_id):
    item = db.get_or_404(Item, item_id)
    data = request.get_json()
    item.box_id = data.get('box_id')
    db.session.commit()
    return jsonify(item.to_dict())
