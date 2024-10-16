import { useState } from 'react';

const TaskModal = ({ 
  todo, 
  onClose, 
  onTaskStatusChange, 
  onEditTaskClick, 
  editTaskId, 
  taskDescription, 
  setTaskDescription, 
  onSaveTask, 
  onAddTask,  // Fungsi untuk menambahkan task baru
  isTodoComplete  // Status todo apakah sudah complete
}) => {
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      onAddTask(newTaskDescription);  // Gunakan fungsi onAddTask yang diterima
      setNewTaskDescription('');  // Reset input setelah task ditambahkan
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{todo.title} Tasks</h2>
        <ul>
          {todo.Tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center mb-2">
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={() => onSaveTask(task.id)}
                    className="ml-2 bg-green-500 text-white p-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className={`${task.isDone ? 'line-through' : ''}`}>{task.description}</span>
                  <div>
                    {!task.isDone && (
                      <>
                        <button
                          onClick={() => onTaskStatusChange(todo.id, task.id, { isDone: true })}
                          className="ml-2 bg-green-500 text-white p-1 rounded"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => onEditTaskClick(task)}
                          className="ml-2 bg-yellow-500 text-white p-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onTaskStatusChange(todo.id, task.id, { isDeleted: true })}
                          className="ml-2 bg-red-500 text-white p-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {!isTodoComplete && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Add New Task</h4>
            <input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="New task description"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddTask}
              className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Add Task
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 bg-gray-500 text-white p-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default TaskModal;
