import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);

  // ADD
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  // EDIT
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos/");
      setTodos(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ================= ADD =================
  const handleAdd = async () => {
    if (!title) {
      return Swal.fire("Title wajib diisi", "", "warning");
    }

    try {
      await api.post("/todos/", { title, description, status });
      setTitle("");
      setDescription("");
      setStatus("pending");
      fetchTodos();
      Swal.fire("Todo ditambahkan!", "", "success");
    } catch (err) {
      Swal.fire("Gagal menambah todo", "", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Todo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/todos/${id}`);
        fetchTodos();
        Swal.fire("Terhapus!", "", "success");
      } catch {
        Swal.fire("Gagal menghapus", "", "error");
      }
    }
  };

  // ================= EDIT =================
  const handleEdit = (todo) => {
    setEditTodoId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditStatus(todo.status.toLowerCase());
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/todos/${editTodoId}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
      setEditTodoId(null);
      fetchTodos();
      Swal.fire("Berhasil diupdate", "", "success");
    } catch {
      Swal.fire("Gagal update", "", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">📝 Todo List</h1>

        {/* ADD TODO */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">➕ Add Todo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border px-4 py-2 rounded-lg"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border px-4 py-2 rounded-lg"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="border px-4 py-2 rounded-lg"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Tambah
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{todo.title}</td>
                  <td className="p-3">{todo.description}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        todo.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {todo.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(todo)}
                      className={`px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 ${todo.status == "completed" ? 'hidden' : '-'}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EDIT FORM */}
        {editTodoId && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold">✏️ Edit Todo</h2>
            <input
              className="border px-4 py-2 rounded-lg w-full"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              className="border px-4 py-2 rounded-lg w-full"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <select
              className="border px-4 py-2 rounded-lg w-full"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTodoId(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
