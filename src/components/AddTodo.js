import { useState } from 'react';
import axios from 'axios';

const AddTodo = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([{ description: '' }]);
  const [showForm, setShowForm] = useState(false);  // State untuk menampilkan atau menyembunyikan form
  const [error, setError] = useState(null); // State untuk menangani error

  // Fungsi untuk menangani perubahan di setiap task input
  const handleTaskChange = (index, event) => {
    const newTasks = tasks.map((task, taskIndex) => {
      if (taskIndex === index) {
        return { ...task, description: event.target.value };
      }
      return task;
    });
    setTasks(newTasks);
  };

  // Fungsi untuk menambah task baru (input tambahan)
  const handleAddTask = () => {
    setTasks([...tasks, { description: '' }]);
  };

  // Fungsi untuk mengirim todo dan task ke server
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'https://feminist-tomi-valent-7c8cb483.koyeb.app/api/todos',
        { title, tasks },  // Kirim title dan tasks
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onTodoAdded(response.data);  // Update state todos di halaman TodoList
      setTitle('');  // Reset input setelah submit
      setTasks([{ description: '' }]);  // Reset task input
      setShowForm(false);  // Sembunyikan form setelah berhasil menambahkan todo
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Todo
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold mb-4">Add New Todo</h3>
          {error && <p className="text-red-500 mb-4">{error}</p>} {/* Tampilkan pesan error jika ada */}
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Tasks</h4>
            {tasks.map((task, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) => handleTaskChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`Task ${index + 1}`}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddTask} className="bg-blue-500 text-white p-2 rounded">
              Add Another Task
            </button>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-green-500 text-white p-2 rounded">
              Save Todo
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)} // Sembunyikan form jika batal
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTodo;
