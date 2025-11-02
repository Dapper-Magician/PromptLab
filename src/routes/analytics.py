from flask import Blueprint, request, jsonify
from ..models.user import db
from ..models.prompt import Prompt, Category, PromptTemplate, Shortcut, TestResult
from datetime import datetime, timedelta
from sqlalchemy import func, desc

analytics_bp = Blueprint('analytics', __name__)

def get_date_range(days=30):
    """Helper function to get date range for filtering"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return start_date, end_date

@analytics_bp.route('/analytics/overview', methods=['GET'])
def get_overview():
    """Get overall statistics"""
    try:
        # Get date range from query params (default 30 days)
        days = request.args.get('days', 30, type=int)
        start_date, end_date = get_date_range(days)
        
        # Total counts
        total_prompts = Prompt.query.count()
        total_templates = PromptTemplate.query.count()
        total_shortcuts = Shortcut.query.count()
        total_categories = Category.query.count()
        total_tests = TestResult.query.count()
        
        # Prompts in time range
        prompts_in_range = Prompt.query.filter(
            Prompt.created_at >= start_date,
            Prompt.created_at <= end_date
        ).count()
        
        # Previous period for comparison
        prev_start = start_date - timedelta(days=days)
        prev_prompts = Prompt.query.filter(
            Prompt.created_at >= prev_start,
            Prompt.created_at < start_date
        ).count()
        
        # Calculate growth percentage
        prompts_growth = 0
        if prev_prompts > 0:
            prompts_growth = ((prompts_in_range - prev_prompts) / prev_prompts) * 100
        elif prompts_in_range > 0:
            prompts_growth = 100
        
        # Usage statistics
        total_prompt_uses = db.session.query(func.sum(Prompt.use_count)).scalar() or 0
        total_template_uses = db.session.query(func.sum(PromptTemplate.use_count)).scalar() or 0
        total_shortcut_uses = db.session.query(func.sum(Shortcut.use_count)).scalar() or 0
        
        # Favorites
        total_favorites = Prompt.query.filter_by(is_favorite=True).count()
        
        return jsonify({
            'total_prompts': total_prompts,
            'total_templates': total_templates,
            'total_shortcuts': total_shortcuts,
            'total_categories': total_categories,
            'total_tests': total_tests,
            'total_favorites': total_favorites,
            'prompts_in_period': prompts_in_range,
            'prompts_growth': round(prompts_growth, 1),
            'total_prompt_uses': total_prompt_uses,
            'total_template_uses': total_template_uses,
            'total_shortcut_uses': total_shortcut_uses,
            'period_days': days
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/prompts/usage', methods=['GET'])
def get_prompt_usage_over_time():
    """Get prompt creation and usage over time"""
    try:
        days = request.args.get('days', 30, type=int)
        start_date, end_date = get_date_range(days)
        
        # Get prompts created per day
        prompts_by_day = db.session.query(
            func.date(Prompt.created_at).label('date'),
            func.count(Prompt.id).label('count')
        ).filter(
            Prompt.created_at >= start_date,
            Prompt.created_at <= end_date
        ).group_by(func.date(Prompt.created_at)).all()
        
        # Format data for charts
        usage_data = []
        for date, count in prompts_by_day:
            usage_data.append({
                'date': date.strftime('%Y-%m-%d') if date else None,
                'count': count
            })
        
        # Sort by date
        usage_data.sort(key=lambda x: x['date'])
        
        return jsonify(usage_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/prompts/popular', methods=['GET'])
def get_popular_prompts():
    """Get most used prompts"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        popular_prompts = Prompt.query.filter(
            Prompt.use_count > 0
        ).order_by(desc(Prompt.use_count)).limit(limit).all()
        
        result = []
        for prompt in popular_prompts:
            result.append({
                'id': prompt.id,
                'title': prompt.title,
                'use_count': prompt.use_count,
                'category': prompt.category.name if prompt.category else 'Uncategorized',
                'is_favorite': prompt.is_favorite
            })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/prompts/recent', methods=['GET'])
def get_recent_activity():
    """Get recent prompt activity"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Recently created
        recent_created = Prompt.query.order_by(
            desc(Prompt.created_at)
        ).limit(limit).all()
        
        # Recently updated
        recent_updated = Prompt.query.filter(
            Prompt.updated_at.isnot(None)
        ).order_by(desc(Prompt.updated_at)).limit(limit).all()
        
        # Recently used
        recent_used = Prompt.query.filter(
            Prompt.last_used.isnot(None)
        ).order_by(desc(Prompt.last_used)).limit(limit).all()
        
        result = {
            'recent_created': [
                {
                    'id': p.id,
                    'title': p.title,
                    'created_at': p.created_at.isoformat() if p.created_at else None,
                    'category': p.category.name if p.category else 'Uncategorized'
                } for p in recent_created
            ],
            'recent_updated': [
                {
                    'id': p.id,
                    'title': p.title,
                    'updated_at': p.updated_at.isoformat() if p.updated_at else None,
                    'category': p.category.name if p.category else 'Uncategorized'
                } for p in recent_updated
            ],
            'recent_used': [
                {
                    'id': p.id,
                    'title': p.title,
                    'last_used': p.last_used.isoformat() if p.last_used else None,
                    'use_count': p.use_count,
                    'category': p.category.name if p.category else 'Uncategorized'
                } for p in recent_used
            ]
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/categories', methods=['GET'])
def get_category_distribution():
    """Get category distribution"""
    try:
        categories = Category.query.all()
        
        result = []
        for category in categories:
            prompt_count = len(category.prompts)
            if prompt_count > 0:  # Only include categories with prompts
                result.append({
                    'id': category.id,
                    'name': category.name,
                    'count': prompt_count,
                    'color': category.color
                })
        
        # Add uncategorized
        uncategorized_count = Prompt.query.filter_by(category_id=None).count()
        if uncategorized_count > 0:
            result.append({
                'id': None,
                'name': 'Uncategorized',
                'count': uncategorized_count,
                'color': '#6B7280'
            })
        
        # Sort by count descending
        result.sort(key=lambda x: x['count'], reverse=True)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/templates', methods=['GET'])
def get_template_stats():
    """Get template usage statistics"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        templates = PromptTemplate.query.filter(
            PromptTemplate.use_count > 0
        ).order_by(desc(PromptTemplate.use_count)).limit(limit).all()
        
        result = []
        for template in templates:
            result.append({
                'id': template.id,
                'name': template.name,
                'use_count': template.use_count,
                'category': template.category.name if template.category else 'Uncategorized'
            })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/shortcuts', methods=['GET'])
def get_shortcut_stats():
    """Get shortcut usage statistics"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        shortcuts = Shortcut.query.filter(
            Shortcut.use_count > 0
        ).order_by(desc(Shortcut.use_count)).limit(limit).all()
        
        result = []
        for shortcut in shortcuts:
            result.append({
                'id': shortcut.id,
                'trigger': shortcut.trigger,
                'use_count': shortcut.use_count,
                'description': shortcut.description,
                'is_active': shortcut.is_active
            })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/tests', methods=['GET'])
def get_test_stats():
    """Get test results statistics"""
    try:
        days = request.args.get('days', 30, type=int)
        start_date, end_date = get_date_range(days)
        
        # Total tests
        total_tests = TestResult.query.count()
        
        # Tests in range
        tests_in_range = TestResult.query.filter(
            TestResult.created_at >= start_date,
            TestResult.created_at <= end_date
        ).count()
        
        # Average scores
        avg_quality = db.session.query(
            func.avg(TestResult.quality_score)
        ).filter(TestResult.quality_score.isnot(None)).scalar() or 0
        
        avg_consistency = db.session.query(
            func.avg(TestResult.consistency_score)
        ).filter(TestResult.consistency_score.isnot(None)).scalar() or 0
        
        # Average rating
        avg_rating = db.session.query(
            func.avg(TestResult.user_rating)
        ).filter(TestResult.user_rating.isnot(None)).scalar() or 0
        
        # Tests by model
        tests_by_model = db.session.query(
            TestResult.model_name,
            func.count(TestResult.id).label('count')
        ).group_by(TestResult.model_name).all()
        
        models_data = [
            {'model': model or 'Unknown', 'count': count}
            for model, count in tests_by_model
        ]
        
        # Recent tests
        recent_tests = TestResult.query.order_by(
            desc(TestResult.created_at)
        ).limit(10).all()
        
        recent_data = [
            {
                'id': test.id,
                'prompt_id': test.prompt_id,
                'model_name': test.model_name,
                'user_rating': test.user_rating,
                'created_at': test.created_at.isoformat() if test.created_at else None
            } for test in recent_tests
        ]
        
        return jsonify({
            'total_tests': total_tests,
            'tests_in_period': tests_in_range,
            'avg_quality_score': round(avg_quality, 2),
            'avg_consistency_score': round(avg_consistency, 2),
            'avg_user_rating': round(avg_rating, 2),
            'tests_by_model': models_data,
            'recent_tests': recent_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500