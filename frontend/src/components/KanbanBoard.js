import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { tasksAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const KanbanBoard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    // Optimistically update UI
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Update on server
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert on error
      loadTasks();
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleTaskSave = () => {
    loadTasks();
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Task Management Board</h1>
        <div className="header-actions">
          <div className="user-info">
            <span>Welcome, {user?.full_name}</span>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="board-container">
        <div className="board-header">
          <h2>My Tasks</h2>
          <button className="btn btn-primary" onClick={handleCreateTask}>
            + Create Task
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-columns">
            {columns.map(column => {
              const columnTasks = getTasksByStatus(column.id);
              return (
                <div key={column.id} className="board-column">
                  <div className="column-header">
                    <span className="column-title">{column.title}</span>
                    <span className="task-count">{columnTasks.length}</span>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="tasks-list"
                        style={{
                          backgroundColor: snapshot.isDraggingOver
                            ? '#d4dce5'
                            : 'transparent',
                          minHeight: '400px',
                          padding: '0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {columnTasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onClick={() => handleTaskClick(task)}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={handleModalClose}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
