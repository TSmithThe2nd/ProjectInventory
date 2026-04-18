from flask import Blueprint, jsonify, request
from database import db
from models.item import Item

items_bp = Blueprint('items', __name__)


@items_bp.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([i.to_dict() for i in items])


@items_bp.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    tags = data.get('tags', [])
    item = Item(
        name=data.get('name', ''),
        description=data.get('description', ''),
        quantity=int(data.get('quantity') or 0),
        unit=data.get('unit', ''),
        location=data.get('location', ''),
        tags=','.join(tags) if isinstance(tags, list) else tags,
        notes=data.get('notes', ''),
        photo_url=data.get('photo_url'),
        added_by=data.get('added_by', ''),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@items_bp.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = db.get_or_404(Item, item_id)
    return jsonify(item.to_dict())


@items_bp.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = db.get_or_404(Item, item_id)
    data = request.get_json()
    if 'name' in data:        item.name        = data['name']
    if 'description' in data: item.description = data['description']
    if 'quantity' in data:    item.quantity    = int(data['quantity'] or 0)
    if 'unit' in data:        item.unit        = data['unit']
    if 'location' in data:    item.location    = data['location']
    if 'tags' in data:
        tags = data['tags']
        item.tags = ','.join(tags) if isinstance(tags, list) else tags
    if 'notes' in data:       item.notes       = data['notes']
    if 'photo_url' in data:   item.photo_url   = data['photo_url']
    db.session.commit()
    return jsonify(item.to_dict())


@items_bp.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = db.get_or_404(Item, item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'deleted': item_id})