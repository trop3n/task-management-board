from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, User
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')
tasks_bp.url_map = None  # Allow strict_slashes to be set per route


@tasks_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_tasks():
    """Get all tasks"""
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200


@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get a specific task"""
    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify(task.to_dict()), 200


@tasks_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_task():
    """Create a new task"""
    data = request.get_json()
    user_id = int(get_jwt_identity())

    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400

    # Parse due_date if provided
    due_date = None
    if 'due_date' in data and data['due_date']:
        try:
            due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00')).date()
        except ValueError:
            return jsonify({'error': 'Invalid due_date format'}), 400

    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'backlog'),
        priority=data.get('priority', 'medium'),
        due_date=due_date,
        assigned_to=data.get('assigned_to'),
        created_by=user_id
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update a task"""
    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()

    # Update fields if provided
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    if 'priority' in data:
        task.priority = data['priority']
    if 'assigned_to' in data:
        task.assigned_to = data['assigned_to']
    if 'due_date' in data:
        if data['due_date']:
            try:
                task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00')).date()
            except ValueError:
                return jsonify({'error': 'Invalid due_date format'}), 400
        else:
            task.due_date = None

    task.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify(task.to_dict()), 200


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete a task"""
    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task deleted successfully'}), 200


@tasks_bp.route('/<int:task_id>/status', methods=['PATCH'])
@jwt_required()
def update_task_status(task_id):
    """Update task status (for drag-and-drop)"""
    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()

    if 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400

    task.status = data['status']
    task.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify(task.to_dict()), 200
