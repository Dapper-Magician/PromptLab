from flask import Blueprint, request, jsonify
from ..models.user import db
from ..models.prompt import TestResult, Prompt
from datetime import datetime
import uuid

test_bp = Blueprint('test', __name__)

@test_bp.route('/tests', methods=['GET'])
def get_tests():
    """Get test results with optional filtering"""
    try:
        # Query parameters
        prompt_id = request.args.get('prompt_id', type=int)
        model_name = request.args.get('model_name')
        test_type = request.args.get('test_type')
        test_session_id = request.args.get('test_session_id')
        
        query = TestResult.query
        
        if prompt_id:
            query = query.filter(TestResult.prompt_id == prompt_id)
        if model_name:
            query = query.filter(TestResult.model_name == model_name)
        if test_type:
            query = query.filter(TestResult.test_type == test_type)
        if test_session_id:
            query = query.filter(TestResult.test_session_id == test_session_id)
        
        tests = query.order_by(TestResult.created_at.desc()).all()
        return jsonify([test.to_dict() for test in tests])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests', methods=['POST'])
def create_test():
    """Create a new test result"""
    try:
        data = request.get_json()
        
        test_result = TestResult(
            prompt_id=data.get('prompt_id'),
            model_name=data.get('model_name'),
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens'),
            system_message=data.get('system_message'),
            user_message=data.get('user_message'),
            model_response=data.get('model_response'),
            response_time=data.get('response_time'),
            token_count_input=data.get('token_count_input'),
            token_count_output=data.get('token_count_output'),
            cost=data.get('cost'),
            user_rating=data.get('user_rating'),
            quality_score=data.get('quality_score'),
            consistency_score=data.get('consistency_score'),
            test_type=data.get('test_type', 'manual'),
            test_session_id=data.get('test_session_id')
        )
        
        db.session.add(test_result)
        db.session.commit()
        
        return jsonify(test_result.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests/<int:test_id>', methods=['GET'])
def get_test(test_id):
    """Get a specific test result"""
    try:
        test = TestResult.query.get_or_404(test_id)
        return jsonify(test.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests/<int:test_id>', methods=['PUT'])
def update_test(test_id):
    """Update a test result"""
    try:
        test = TestResult.query.get_or_404(test_id)
        data = request.get_json()
        
        # Update fields
        if 'user_rating' in data:
            test.user_rating = data['user_rating']
        if 'quality_score' in data:
            test.quality_score = data['quality_score']
        if 'consistency_score' in data:
            test.consistency_score = data['consistency_score']
        
        db.session.commit()
        
        return jsonify(test.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests/<int:test_id>', methods=['DELETE'])
def delete_test(test_id):
    """Delete a test result"""
    try:
        test = TestResult.query.get_or_404(test_id)
        db.session.delete(test)
        db.session.commit()
        
        return jsonify({'message': 'Test result deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests/batch', methods=['POST'])
def create_batch_tests():
    """Create multiple test results for batch testing"""
    try:
        data = request.get_json()
        test_session_id = str(uuid.uuid4())
        
        tests = []
        for test_data in data.get('tests', []):
            test_result = TestResult(
                prompt_id=test_data.get('prompt_id'),
                model_name=test_data.get('model_name'),
                temperature=test_data.get('temperature', 0.7),
                max_tokens=test_data.get('max_tokens'),
                system_message=test_data.get('system_message'),
                user_message=test_data.get('user_message'),
                model_response=test_data.get('model_response'),
                response_time=test_data.get('response_time'),
                token_count_input=test_data.get('token_count_input'),
                token_count_output=test_data.get('token_count_output'),
                cost=test_data.get('cost'),
                test_type=test_data.get('test_type', 'automated'),
                test_session_id=test_session_id
            )
            tests.append(test_result)
            db.session.add(test_result)
        
        db.session.commit()
        
        return jsonify({
            'test_session_id': test_session_id,
            'tests': [test.to_dict() for test in tests]
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests/sessions/<session_id>/analyze', methods=['POST'])
def analyze_test_session(session_id):
    """Analyze a test session for consistency and quality metrics"""
    try:
        tests = TestResult.query.filter_by(test_session_id=session_id).all()
        
        if not tests:
            return jsonify({'error': 'Test session not found'}), 404
        
        # Calculate metrics
        total_tests = len(tests)
        avg_response_time = sum(t.response_time for t in tests if t.response_time) / total_tests
        total_cost = sum(t.cost for t in tests if t.cost)
        avg_input_tokens = sum(t.token_count_input for t in tests if t.token_count_input) / total_tests
        avg_output_tokens = sum(t.token_count_output for t in tests if t.token_count_output) / total_tests
        
        # Quality metrics
        rated_tests = [t for t in tests if t.user_rating]
        avg_rating = sum(t.user_rating for t in rated_tests) / len(rated_tests) if rated_tests else None
        
        quality_tests = [t for t in tests if t.quality_score]
        avg_quality = sum(t.quality_score for t in quality_tests) / len(quality_tests) if quality_tests else None
        
        analysis = {
            'session_id': session_id,
            'total_tests': total_tests,
            'avg_response_time': avg_response_time,
            'total_cost': total_cost,
            'avg_input_tokens': avg_input_tokens,
            'avg_output_tokens': avg_output_tokens,
            'avg_rating': avg_rating,
            'avg_quality_score': avg_quality,
            'models_tested': list(set(t.model_name for t in tests)),
            'test_types': list(set(t.test_type for t in tests))
        }
        
        return jsonify(analysis)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/tests/prompts/<int:prompt_id>/stats', methods=['GET'])
def get_prompt_test_stats(prompt_id):
    """Get testing statistics for a specific prompt"""
    try:
        prompt = Prompt.query.get_or_404(prompt_id)
        tests = TestResult.query.filter_by(prompt_id=prompt_id).all()
        
        if not tests:
            return jsonify({
                'prompt_id': prompt_id,
                'total_tests': 0,
                'stats': {}
            })
        
        # Group by model
        model_stats = {}
        for test in tests:
            model = test.model_name
            if model not in model_stats:
                model_stats[model] = {
                    'count': 0,
                    'avg_response_time': 0,
                    'total_cost': 0,
                    'avg_rating': 0,
                    'avg_quality': 0
                }
            
            stats = model_stats[model]
            stats['count'] += 1
            if test.response_time:
                stats['avg_response_time'] += test.response_time
            if test.cost:
                stats['total_cost'] += test.cost
            if test.user_rating:
                stats['avg_rating'] += test.user_rating
            if test.quality_score:
                stats['avg_quality'] += test.quality_score
        
        # Calculate averages
        for model, stats in model_stats.items():
            count = stats['count']
            stats['avg_response_time'] = stats['avg_response_time'] / count
            stats['avg_rating'] = stats['avg_rating'] / count if stats['avg_rating'] > 0 else None
            stats['avg_quality'] = stats['avg_quality'] / count if stats['avg_quality'] > 0 else None
        
        return jsonify({
            'prompt_id': prompt_id,
            'total_tests': len(tests),
            'model_stats': model_stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

