from flask import Blueprint, request, jsonify
from ..models.user import db
from ..models.prompt import Category

category_bp = Blueprint('category', __name__)

@category_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.order_by(Category.name.asc()).all()
        return jsonify([category.to_dict() for category in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories', methods=['POST'])
def create_category():
    """Create a new category"""
    try:
        data = request.get_json()
        
        # Check if category name already exists
        existing = Category.query.filter_by(name=data.get('name')).first()
        if existing:
            return jsonify({'error': 'Category name already exists'}), 400
        
        category = Category(
            name=data.get('name', ''),
            description=data.get('description'),
            color=data.get('color', '#3B82F6')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get a specific category by ID"""
    try:
        category = Category.query.get_or_404(category_id)
        return jsonify(category.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update a category"""
    try:
        category = Category.query.get_or_404(category_id)
        data = request.get_json()
        
        # Check if new name conflicts with existing category
        if 'name' in data and data['name'] != category.name:
            existing = Category.query.filter_by(name=data['name']).first()
            if existing:
                return jsonify({'error': 'Category name already exists'}), 400
        
        # Update fields
        if 'name' in data:
            category.name = data['name']
        if 'description' in data:
            category.description = data['description']
        if 'color' in data:
            category.color = data['color']
        
        db.session.commit()
        
        return jsonify(category.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category"""
    try:
        category = Category.query.get_or_404(category_id)
        
        # Check if category has prompts
        if category.prompts:
            return jsonify({
                'error': 'Cannot delete category with prompts. Move or delete prompts first.'
            }), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({'message': 'Category deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>/prompts', methods=['GET'])
def get_category_prompts(category_id):
    """Get all prompts in a category"""
    try:
        category = Category.query.get_or_404(category_id)
        prompts = category.prompts
        return jsonify([prompt.to_dict() for prompt in prompts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

