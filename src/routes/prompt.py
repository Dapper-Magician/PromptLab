from flask import Blueprint, request, jsonify
from ..models.user import db
from ..models.prompt import Prompt, Category
from datetime import datetime
import json

prompt_bp = Blueprint('prompt', __name__)

@prompt_bp.route('/prompts', methods=['GET'])
def get_prompts():
    """Get all prompts with optional filtering, returning only the 'HEAD' version of each prompt chain."""
    try:
        # Subquery to find all prompts that are parents
        parent_ids_subquery = db.session.query(Prompt.parent_id).filter(Prompt.parent_id.isnot(None)).distinct()

        # Main query starts by filtering out any prompt whose ID is in the parent list
        query = Prompt.query.filter(Prompt.id.notin_(parent_ids_subquery))

        # --- The rest of the filtering logic remains the same ---
        category_id = request.args.get('category_id', type=int)
        is_favorite = request.args.get('is_favorite', type=bool)
        is_template = request.args.get('is_template', type=bool)
        search = request.args.get('search', '')
        tags = request.args.get('tags', '')
        
        if category_id:
            query = query.filter(Prompt.category_id == category_id)
        if is_favorite is not None:
            query = query.filter(Prompt.is_favorite == is_favorite)
        if is_template is not None:
            query = query.filter(Prompt.is_template == is_template)
        if search:
            query = query.filter(
                (Prompt.title.contains(search)) |
                (Prompt.content.contains(search)) |
                (Prompt.description.contains(search))
            )
        if tags:
            tag_list = tags.split(',')
            for tag in tag_list:
                query = query.filter(Prompt.tags.contains(tag.strip()))
        
        # Order by last used, then by updated date
        prompts = query.order_by(Prompt.last_used.desc().nullslast(), 
                                Prompt.updated_at.desc()).all()
        
        return jsonify([prompt.to_dict() for prompt in prompts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts', methods=['POST'])
def create_prompt():
    """Create a new prompt"""
    try:
        data = request.get_json()
        
        prompt = Prompt(
            title=data.get('title', ''),
            content=data.get('content', ''),
            description=data.get('description'),
            author=data.get('author'),
            source=data.get('source'),
            category_id=data.get('category_id'),
            is_favorite=data.get('is_favorite', False),
            is_template=data.get('is_template', False),
            version=data.get('version', '1.0.0')
        )
        
        # Handle tags
        if 'tags' in data:
            prompt.set_tags(data['tags'])
        
        # Handle original creation date
        if 'original_creation_date' in data and data['original_creation_date']:
            prompt.original_creation_date = datetime.fromisoformat(
                data['original_creation_date'].replace('Z', '+00:00')
            )
        
        db.session.add(prompt)
        db.session.commit()
        
        return jsonify(prompt.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>', methods=['GET'])
def get_prompt(prompt_id):
    """Get a specific prompt by ID"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        
        # Update last used timestamp
        prompt.last_used = datetime.utcnow()
        prompt.use_count = (prompt.use_count or 0) + 1
        db.session.commit()
        
        return jsonify(prompt.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>', methods=['PUT'])
def update_prompt(prompt_id):
    """
    Update a prompt by creating a new version (non-destructive).
    This functions as a 'commit' in a version control system.
    """
    try:
        # The 'prompt_id' is the parent for the new version.
        parent_prompt = Prompt.query.get_or_404(prompt_id)
        data = request.get_json()

        # Create a new Prompt object for the new version.
        new_version = Prompt(
            title=data.get('title', parent_prompt.title),
            content=data.get('content', parent_prompt.content),
            description=data.get('description', parent_prompt.description),
            author=data.get('author', parent_prompt.author),
            source=data.get('source', parent_prompt.source),
            category_id=data.get('category_id', parent_prompt.category_id),
            is_favorite=data.get('is_favorite', parent_prompt.is_favorite),
            is_template=data.get('is_template', parent_prompt.is_template),
            version=data.get('version', parent_prompt.version), # Version might be incremented on the frontend
            version_message=data.get('version_message'),
            parent_id=parent_prompt.id,
            original_creation_date=parent_prompt.original_creation_date or parent_prompt.created_at
        )

        if 'tags' in data:
            new_version.set_tags(data['tags'])
        else:
            new_version.set_tags(parent_prompt.get_tags())

        db.session.add(new_version)
        db.session.commit()

        return jsonify(new_version.to_dict()), 201 # Return 201 Created for the new resource

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    """Delete a prompt"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        db.session.delete(prompt)
        db.session.commit()
        
        return jsonify({'message': 'Prompt deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>/duplicate', methods=['POST'])
def duplicate_prompt(prompt_id):
    """Create a duplicate of a prompt"""
    try:
        original = Prompt.query.get_or_404(prompt_id)
        data = request.get_json() or {}
        
        duplicate = Prompt(
            title=data.get('title', f"{original.title} (Copy)"),
            content=original.content,
            description=original.description,
            author=original.author,
            source=original.source,
            category_id=original.category_id,
            is_favorite=False,
            is_template=original.is_template,
            version='1.0.0',
            parent_id=original.id
        )
        
        # Copy tags
        duplicate.set_tags(original.get_tags())
        
        db.session.add(duplicate)
        db.session.commit()
        
        return jsonify(duplicate.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>/versions', methods=['GET'])
def get_prompt_versions(prompt_id):
    """Get all versions of a prompt"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        
        # Get all versions (children of this prompt or siblings if this is a child)
        if prompt.parent_id:
            # This is a version, get all siblings including parent
            parent = Prompt.query.get(prompt.parent_id)
            versions = [parent] + parent.versions
        else:
            # This is the parent, get all children
            versions = [prompt] + prompt.versions
        
        return jsonify([v.to_dict() for v in versions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/search', methods=['POST'])
def search_prompts():
    """Advanced search for prompts"""
    try:
        data = request.get_json()
        query_text = data.get('query', '')
        filters = data.get('filters', {})
        
        query = Prompt.query
        
        # Text search across multiple fields
        if query_text:
            query = query.filter(
                (Prompt.title.contains(query_text)) |
                (Prompt.content.contains(query_text)) |
                (Prompt.description.contains(query_text)) |
                (Prompt.author.contains(query_text)) |
                (Prompt.source.contains(query_text))
            )
        
        # Apply filters
        if filters.get('category_ids'):
            query = query.filter(Prompt.category_id.in_(filters['category_ids']))
        if filters.get('tags'):
            for tag in filters['tags']:
                query = query.filter(Prompt.tags.contains(tag))
        if filters.get('is_favorite') is not None:
            query = query.filter(Prompt.is_favorite == filters['is_favorite'])
        if filters.get('is_template') is not None:
            query = query.filter(Prompt.is_template == filters['is_template'])
        if filters.get('date_from'):
            date_from = datetime.fromisoformat(filters['date_from'].replace('Z', '+00:00'))
            query = query.filter(Prompt.created_at >= date_from)
        if filters.get('date_to'):
            date_to = datetime.fromisoformat(filters['date_to'].replace('Z', '+00:00'))
            query = query.filter(Prompt.created_at <= date_to)
        
        # Sorting
        sort_by = data.get('sort_by', 'updated_at')
        sort_order = data.get('sort_order', 'desc')
        
        if hasattr(Prompt, sort_by):
            column = getattr(Prompt, sort_by)
            if sort_order == 'desc':
                query = query.order_by(column.desc())
            else:
                query = query.order_by(column.asc())
        
        prompts = query.all()
        return jsonify([prompt.to_dict() for prompt in prompts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

