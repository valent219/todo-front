import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi
import TodoCard from '../components/TodoCard';
import AddTodo from '../components/AddTodo';
import EditTodoModal from '../components/EditTodoModal'; // Modal baru untuk edit todo

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const [selectedTodo, setSelectedTodo] = useState(null); // Untuk menyimpan todo yang sedang di-edit
  const todosPerPage = 12; // Maksimal 12 todo per halaman
  const navigate = useNavigate(); // Gunakan navigate untuk redirection

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Cek sessionStorage apakah alert sudah muncul sebelumnya
    const alertShown = sessionStorage.getItem('alertShown');

    if (!token && !alertShown) {
      alert('You need to login to access this page. Redirecting to login page...');
      sessionStorage.setItem('alertShown', 'true'); // Set alert shown di sessionStorage
      navigate('/login');
    } else if (token) {
      const fetchTodos = async () => {
        try {
          const response = await axios.get('https://feminist-tomi-valent-7c8cb483.koyeb.app/api/todos', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTodos(response.data);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };

      fetchTodos();
    }
  }, [navigate]);

  const handleTodoAdded = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const handleTodoEdited = async (updatedTodo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://feminist-tomi-valent-7c8cb483.koyeb.app/api/todos/${updatedTodo.id}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos(todos.map(todo => (todo.id === updatedTodo.id ? response.data : todo)));
      setSelectedTodo(null); // Tutup modal
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`https://feminist-tomi-valent-7c8cb483.koyeb.app/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleTaskStatusChange = async (todoId, taskId, updateData) => {
    try {
      const token = localStorage.getItem('token');

      if (updateData.isDeleted) {
        await axios.delete(`https://feminist-tomi-valent-7c8cb483.koyeb.app/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId
              ? {
                  ...todo,
                  Tasks: todo.Tasks.filter(task => task.id !== taskId),
                  isCompleted: todo.Tasks.filter(task => task.id !== taskId).every(task => task.isDone) ? 1 : 0,
                }
              : todo
          )
        );
      } else {
        const response = await axios.put(`https://feminist-tomi-valent-7c8cb483.koyeb.app/api/tasks/${taskId}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedTodos = todos.map(todo =>
          todo.id === todoId
            ? {
                ...todo,
                Tasks: todo.Tasks.map(task =>
                  task.id === taskId ? { ...task, ...response.data } : task
                ),
              }
            : todo
        );

        setTodos(updatedTodos);

        const currentTodo = updatedTodos.find(todo => todo.id === todoId);
        const allTasksDone = currentTodo?.Tasks.every(task => task.isDone);

        await axios.put(`https://feminist-tomi-valent-7c8cb483.koyeb.app/api/todos/${todoId}`, { isCompleted: allTasksDone ? 1 : 0 }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, isCompleted: allTasksDone ? 1 : 0 } : todo
          )
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(todos.length / todosPerPage);

  const handleAddTask = async (todoId, description) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://feminist-tomi-valent-7c8cb483.koyeb.app/api/tasks/${todoId}`,
        { description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Setelah task berhasil ditambahkan, perbarui state todos
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId
            ? {
                ...todo,
                Tasks: [...todo.Tasks, response.data], // Tambahkan task baru ke daftar
              }
            : todo
        )
      );
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Your Todos</h2>

      <AddTodo onTodoAdded={handleTodoAdded} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {currentTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onEdit={(todo) => setSelectedTodo(todo)} // Buka modal edit
            onDelete={handleDeleteTodo} // Pastikan onDelete diteruskan dengan benar
            onTaskStatusChange={handleTaskStatusChange} // Update status task
            onAddTask={(description) => handleAddTask(todo.id, description)} // Teruskan fungsi handleAddTask
          />
        ))}
      </div>

      {/* Pagination navigation */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal untuk mengedit todo */}
      {selectedTodo && (
        <EditTodoModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onSave={handleTodoEdited}
        />
      )}
    </div>
  );
};

export default TodoList;
