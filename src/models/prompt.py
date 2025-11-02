from .user import db
from datetime import datetime
import json

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    color = db.Column(db.String(7), default='#3B82F6')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    prompts = db.relationship('Prompt', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'prompt_count': len(self.prompts)
        }

class Prompt(db.Model):
    __tablename__ = 'prompts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    author = db.Column(db.String(100))
    source = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    is_favorite = db.Column(db.Boolean, default=False)
    is_template = db.Column(db.Boolean, default=False)
    tags = db.Column(db.Text) # Stored as a JSON string
    version = db.Column(db.String(20), default='1.0.0')
    version_message = db.Column(db.String(500))
    parent_id = db.Column(db.Integer, db.ForeignKey('prompts.id'))
    versions = db.relationship('Prompt', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_used = db.Column(db.DateTime)
    use_count = db.Column(db.Integer, default=0)
    original_creation_date = db.Column(db.DateTime)

    def set_tags(self, tags_list):
        self.tags = json.dumps(tags_list)

    def get_tags(self):
        return json.loads(self.tags) if self.tags else []

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'description': self.description,
            'author': self.author,
            'source': self.source,
            'category_id': self.category_id,
            'is_favorite': self.is_favorite,
            'is_template': self.is_template,
            'tags': self.get_tags(),
            'version': self.version,
            'version_message': self.version_message,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'use_count': self.use_count,
            'original_creation_date': self.original_creation_date.isoformat() if self.original_creation_date else None,
            'category': self.category.to_dict() if self.category else None
        }

class TestResult(db.Model):
    __tablename__ = 'test_results'
    id = db.Column(db.Integer, primary_key=True)
    prompt_id = db.Column(db.Integer, db.ForeignKey('prompts.id'), nullable=False)
    model_name = db.Column(db.String(100))
    temperature = db.Column(db.Float)
    max_tokens = db.Column(db.Integer)
    system_message = db.Column(db.Text)
    user_message = db.Column(db.Text)
    model_response = db.Column(db.Text)
    response_time = db.Column(db.Float)
    token_count_input = db.Column(db.Integer)
    token_count_output = db.Column(db.Integer)
    cost = db.Column(db.Float)
    user_rating = db.Column(db.Integer)
    quality_score = db.Column(db.Float)
    consistency_score = db.Column(db.Float)
    test_type = db.Column(db.String(50))
    test_session_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    prompt = db.relationship('Prompt', backref='test_results')

    def to_dict(self):
        return {
            'id': self.id,
            'prompt_id': self.prompt_id,
            'model_name': self.model_name,
            'temperature': self.temperature,
            'max_tokens': self.max_tokens,
            'system_message': self.system_message,
            'user_message': self.user_message,
            'model_response': self.model_response,
            'response_time': self.response_time,
            'token_count_input': self.token_count_input,
            'token_count_output': self.token_count_output,
            'cost': self.cost,
            'user_rating': self.user_rating,
            'quality_score': self.quality_score,
            'consistency_score': self.consistency_score,
            'test_type': self.test_type,
            'test_session_id': self.test_session_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PromptTemplate(db.Model):
    __tablename__ = 'prompt_templates'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    variables = db.Column(db.Text) # JSON string of variables
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    use_count = db.Column(db.Integer, default=0)
    category = db.relationship('Category', backref='templates')

    def set_variables(self, variables_list):
        self.variables = json.dumps(variables_list)

    def get_variables(self):
        return json.loads(self.variables) if self.variables else []

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'content': self.content,
            'description': self.description,
            'variables': self.get_variables(),
            'category_id': self.category_id,
            'category': self.category.to_dict() if self.category else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'use_count': self.use_count
        }

class Shortcut(db.Model):
    """Text expansion shortcuts (Espanso-style)"""
    __tablename__ = 'shortcuts'
    id = db.Column(db.Integer, primary_key=True)
    trigger = db.Column(db.String(50), nullable=False, unique=True)
    expansion = db.Column(db.Text, nullable=False)
    description = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    use_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'trigger': self.trigger,
            'expansion': self.expansion,
            'description': self.description,
            'is_active': self.is_active,
            'use_count': self.use_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
