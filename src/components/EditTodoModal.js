import { useState } from 'react';

const EditTodoModal = ({ todo, onClose, onSave }) => {
  const [title, setTitle] = useState(todo.title);

  const handleSave = () => {
    onSave({ ...todo, title });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold">Edit Todo</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mt-4"
        />
        <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded mt-4">
          Save
        </button>
        <button onClick={onClose} className="bg-red-500 text-white p-2 rounded mt-2">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTodoModal;
