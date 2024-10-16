import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white text-lg">ToDoList App</Link>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300">Login</Link>
          <Link to="/register" className="text-gray-300">Register</Link>
          <Link to="/todos" className="text-gray-300">Todos</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
