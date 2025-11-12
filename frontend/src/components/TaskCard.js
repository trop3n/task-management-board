import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';

const TaskCard = ({ task, index, onClick }) => {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          onClick={onClick}
        >
          <div className="task-title">{task.title}</div>

          {task.description && (
            <div className="task-description">{task.description}</div>
          )}

          <div className="task-meta">
            <span className={`task-priority ${getPriorityClass(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>

            {task.due_date && (
              <span className="task-due-date">
                Due: {format(new Date(task.due_date), 'MMM dd')}
              </span>
            )}
          </div>

          {task.assigned_to && (
            <div className="task-assignee" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Assigned to: {task.assigned_to.full_name}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
