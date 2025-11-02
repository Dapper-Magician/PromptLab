from flask import Blueprint, request, jsonify
from ..models.user import db
from ..models.prompt import Shortcut
from datetime import datetime

shortcut_bp = Blueprint('shortcut', __name__)

@shortcut_bp.route('/shortcuts', methods=['GET'])
def get_shortcuts():
    """Get all shortcuts with optional filtering"""
    try:
        query = Shortcut.query
        
        search = request.args.get('search', '')
        is_active = request.args.get('is_active')
        
        if search:
            query = query.filter(
                (Shortcut.trigger.contains(search)) |
                (Shortcut.expansion.contains(search)) |
                (Shortcut.description.contains(search))
            )
        
        if is_active is not None:
            query = query.filter(Shortcut.is_active == (is_active.lower() == 'true'))
        
        # Order by use count (popular first), then by trigger
        shortcuts = query.order_by(
            Shortcut.use_count.desc(),
            Shortcut.trigger.asc()
        ).all()
        
        return jsonify([shortcut.to_dict() for shortcut in shortcuts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@shortcut_bp.route('/shortcuts', methods=['POST'])
def create_shortcut():
    """Create a new shortcut"""
    try:
        data = request.get_json()
        
        trigger = data.get('trigger', '').strip()
        expansion = data.get('expansion', '').strip()
        
        if not trigger:
            return jsonify({'error': 'Trigger is required'}), 400
        if not expansion:
            return jsonify({'error': 'Expansion is required'}), 400
        
        # Check if trigger already exists
        existing = Shortcut.query.filter_by(trigger=trigger).first()
        if existing:
            return jsonify({'error': f'Shortcut with trigger "{trigger}" already exists'}), 409
        
        shortcut = Shortcut(
            trigger=trigger,
            expansion=expansion,
            description=data.get('description', '').strip(),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(shortcut)
        db.session.commit()
        
        return jsonify(shortcut.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@shortcut_bp.route('/shortcuts/<int:shortcut_id>', methods=['GET'])
def get_shortcut(shortcut_id):
    """Get a specific shortcut by ID"""
    try:
        shortcut = Shortcut.query.get_or_404(shortcut_id)
        return jsonify(shortcut.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@shortcut_bp.route('/shortcuts/<int:shortcut_id>', methods=['PUT'])
def update_shortcut(shortcut_id):
    """Update a shortcut"""
    try:
        shortcut = Shortcut.query.get_or_404(shortcut_id)
        data = request.get_json()
        
        if 'trigger' in data:
            new_trigger = data['trigger'].strip()
            if not new_trigger:
                return jsonify({'error': 'Trigger cannot be empty'}), 400
            
            # Check if new trigger conflicts with another shortcut
            if new_trigger != shortcut.trigger:
                existing = Shortcut.query.filter_by(trigger=new_trigger).first()
                if existing:
                    return jsonify({'error': f'Shortcut with trigger "{new_trigger}" already exists'}), 409
            
            shortcut.trigger = new_trigger
        
        if 'expansion' in data:
            expansion = data['expansion'].strip()
            if not expansion:
                return jsonify({'error': 'Expansion cannot be empty'}), 400
            shortcut.expansion = expansion
        
        if 'description' in data:
            shortcut.description = data['description'].strip()
        
        if 'is_active' in data:
            shortcut.is_active = data['is_active']
        
        shortcut.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(shortcut.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@shortcut_bp.route('/shortcuts/<int:shortcut_id>', methods=['DELETE'])
def delete_shortcut(shortcut_id):
    """Delete a shortcut"""
    try:
        shortcut = Shortcut.query.get_or_404(shortcut_id)
        db.session.delete(shortcut)
        db.session.commit()
        
        return jsonify({'message': 'Shortcut deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@shortcut_bp.route('/shortcuts/test', methods=['POST'])
def test_shortcut():
    """Test if text contains a shortcut trigger and return its expansion"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'match': None})
        
        # Get all active shortcuts
        shortcuts = Shortcut.query.filter_by(is_active=True).all()
        
        # Find matching shortcut (check if text ends with any trigger)
        for shortcut in shortcuts:
            if text.endswith(shortcut.trigger):
                return jsonify({
                    'match': shortcut.to_dict(),
                    'position': len(text) - len(shortcut.trigger)
                })
        
        return jsonify({'match': None})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@shortcut_bp.route('/shortcuts/<int:shortcut_id>/increment', methods=['POST'])
def increment_use_count(shortcut_id):
    """Increment the use count for a shortcut"""
    try:
        shortcut = Shortcut.query.get_or_404(shortcut_id)
        shortcut.use_count = (shortcut.use_count or 0) + 1
        
        db.session.commit()
        
        return jsonify(shortcut.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500