import { useState } from 'react';
import TaskModal from './TaskModal';

const TodoCard = ({ todo, onEdit, onDelete, onTaskStatusChange, onAddTask }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskDescription, setTaskDescription] = useState('');

  const handleEditTaskClick = (task) => {
    setEditTaskId(task.id);
    setTaskDescription(task.description);
  };

  const handleSaveTask = (taskId) => {
    onTaskStatusChange(todo.id, taskId, { description: taskDescription });
    setEditTaskId(null);
  };

  const handleDeleteClick = () => {
    // Pastikan window.confirm hanya dipanggil sekali
    const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
    if (confirmDelete) {
      // console.log('Delete clicked, todo ID:', todo.id);
      onDelete(todo.id);
    }
  };

  return (
    <div className={`bg-white p-4 rounded shadow-md ${todo.isCompleted ? 'bg-green-100' : ''}`}>
      <h3 className="text-xl font-bold">
        {todo.title} {todo.isCompleted ? <span className="text-green-600">(Done)</span> : ''}
      </h3>

      <button onClick={() => setModalOpen(true)} className="mt-2 bg-blue-500 text-white p-2 rounded">
        View Tasks
      </button>

      <button
        onClick={() => onEdit(todo)}
        className="ml-2 bg-yellow-500 text-white p-2 rounded"
      >
        Edit
      </button>

      {/* Tombol delete hanya muncul jika todo belum selesai */}
      {!todo.isCompleted && (
        <button
          onClick={handleDeleteClick} // Panggil fungsi handleDeleteClick
          className="ml-2 bg-red-500 text-white p-2 rounded"
        >
          Delete
        </button>
      )}

      {isModalOpen && (
        <TaskModal
          todo={todo}
          onClose={() => setModalOpen(false)}
          onTaskStatusChange={onTaskStatusChange}
          onEditTaskClick={handleEditTaskClick}
          editTaskId={editTaskId}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          onSaveTask={handleSaveTask}
          onAddTask={onAddTask}  // Kirim onAddTask ke TaskModal
          isTodoComplete={todo.isCompleted}
        />
      )}
    </div>
  );
};

export default TodoCard;
