import { useState } from "react";
import api from "../services/api";

export default function TodoForm() {
  const [Title, SetTitle] = useState("");
  const [description, SetDescription] = useState("");
  const [status, SetStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/todos/", { Title, description, status });
    SetTitle("");
    SetDescription("");
    SetStatus("");
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Tambah tugas..."
        value={Title}
        onChange={(e) => SetTitle(e.target.value)}
        required
      />
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Tambah deskripsi..."
        value={description}
        onChange={(e) => SetDescription(e.target.value)}
        required
      />
      <select
        className="flex-1 border rounded px-3 py-2"
        placeholder="Tambah status..."
        value={status}
        onChange={(e) => SetStatus(e.target.value)}
        required
      >
        <option value="pending">Pending</option>
        <option value="in_progress">in_progress</option>
        <option value="completed">completed</option>
      </select>
      <button className="bg-blue-600 text-white px-4 rounded">Tambah</button>
    </form>
  );
}
