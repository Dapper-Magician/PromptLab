from flask import Blueprint, request, jsonify
from ..models.user import db
from ..models.prompt import PromptTemplate, Prompt, Category
from datetime import datetime
import re

template_bp = Blueprint('template', __name__)

def extract_variables(content):
    """Extract variables from template content in {{variable}} format"""
    pattern = r'\{\{([^}|]+)(?:\|([^}]*))?\}\}'
    matches = re.findall(pattern, content)
    
    variables = []
    seen = set()
    for match in matches:
        var_name = match[0].strip()
        default_value = match[1].strip() if len(match) > 1 and match[1] else ''
        
        if var_name not in seen:
            variables.append({
                'name': var_name,
                'description': '',
                'default': default_value
            })
            seen.add(var_name)
    
    return variables

@template_bp.route('/templates', methods=['GET'])
def get_templates():
    """Get all templates with optional filtering"""
    try:
        query = PromptTemplate.query
        
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search', '')
        
        if category_id:
            query = query.filter(PromptTemplate.category_id == category_id)
        
        if search:
            query = query.filter(
                (PromptTemplate.name.contains(search)) |
                (PromptTemplate.content.contains(search)) |
                (PromptTemplate.description.contains(search))
            )
        
        # Order by use count (popular first), then by updated date
        templates = query.order_by(
            PromptTemplate.use_count.desc(),
            PromptTemplate.updated_at.desc()
        ).all()
        
        return jsonify([template.to_dict() for template in templates])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@template_bp.route('/templates', methods=['POST'])
def create_template():
    """Create a new template"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        
        # Auto-extract variables if not provided
        variables = data.get('variables')
        if variables is None:
            variables = extract_variables(content)
        
        template = PromptTemplate(
            name=data.get('name', ''),
            content=content,
            description=data.get('description'),
            category_id=data.get('category_id')
        )
        
        template.set_variables(variables)
        
        db.session.add(template)
        db.session.commit()
        
        return jsonify(template.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@template_bp.route('/templates/<int:template_id>', methods=['GET'])
def get_template(template_id):
    """Get a specific template by ID"""
    try:
        template = PromptTemplate.query.get_or_404(template_id)
        return jsonify(template.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@template_bp.route('/templates/<int:template_id>', methods=['PUT'])
def update_template(template_id):
    """Update a template"""
    try:
        template = PromptTemplate.query.get_or_404(template_id)
        data = request.get_json()
        
        if 'name' in data:
            template.name = data['name']
        if 'content' in data:
            template.content = data['content']
            # Auto-update variables if content changed
            if 'variables' not in data:
                template.set_variables(extract_variables(data['content']))
        if 'description' in data:
            template.description = data['description']
        if 'category_id' in data:
            template.category_id = data['category_id']
        if 'variables' in data:
            template.set_variables(data['variables'])
        
        template.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(template.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@template_bp.route('/templates/<int:template_id>', methods=['DELETE'])
def delete_template(template_id):
    """Delete a template"""
    try:
        template = PromptTemplate.query.get_or_404(template_id)
        db.session.delete(template)
        db.session.commit()
        
        return jsonify({'message': 'Template deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@template_bp.route('/templates/<int:template_id>/instantiate', methods=['POST'])
def instantiate_template(template_id):
    """Create a prompt from a template by filling in variables"""
    try:
        template = PromptTemplate.query.get_or_404(template_id)
        data = request.get_json()
        variable_values = data.get('variables', {})
        
        # Replace variables in content
        content = template.content
        for var_name, var_value in variable_values.items():
            # Replace {{variable}} or {{variable|default}}
            pattern = r'\{\{' + re.escape(var_name) + r'(?:\|[^}]*)?\}\}'
            content = re.sub(pattern, str(var_value), content)
        
        # Create new prompt from template
        prompt = Prompt(
            title=data.get('title', template.name),
            content=content,
            description=data.get('description', template.description),
            category_id=data.get('category_id', template.category_id),
            is_favorite=False,
            is_template=False,
            version='1.0.0'
        )
        
        # Copy tags if provided
        if 'tags' in data:
            prompt.set_tags(data['tags'])
        
        db.session.add(prompt)
        
        # Increment template use count
        template.use_count = (template.use_count or 0) + 1
        
        db.session.commit()
        
        return jsonify(prompt.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@template_bp.route('/templates/<int:template_id>/preview', methods=['POST'])
def preview_template(template_id):
    """Preview a template with sample variable values"""
    try:
        template = PromptTemplate.query.get_or_404(template_id)
        data = request.get_json()
        variable_values = data.get('variables', {})
        
        # Replace variables in content for preview
        content = template.content
        for var_name, var_value in variable_values.items():
            pattern = r'\{\{' + re.escape(var_name) + r'(?:\|[^}]*)?\}\}'
            content = re.sub(pattern, str(var_value), content)
        
        return jsonify({
            'content': content,
            'variables': template.get_variables()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500