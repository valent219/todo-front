import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://feminist-tomi-valent-7c8cb483.koyeb.app/api/users/register', formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registration failed!');
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
