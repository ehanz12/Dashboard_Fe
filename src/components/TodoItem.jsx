import api from "../services/api";

export default function TodoItem({ todo, onUpdate }) {
  const toggle = async () => {
    await api.put(`/todos/${todo.id}`, {
      completed: !todo.completed,
    });
    onUpdate();
  };

  const remove = async () => {
    await api.delete(`/todos/${todo.id}`);
    onUpdate();
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <span
        onClick={toggle}
        className={`cursor-pointer ${
          todo.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={remove}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
}
