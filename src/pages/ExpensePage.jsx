import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== ADD EXPENSE =====
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");

  // ===== ADD CATEGORY =====
  const [categoryName, setCategoryName] = useState("");

  // ===== EDIT EXPENSE MODAL =====
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editNote, setEditNote] = useState("");

  // ================= FETCH =================
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expense/");
      setExpenses(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/category/");
      setCategories(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // ================= ADD EXPENSE =================
  const handleAdd = async () => {
    if (!amount || !note) {
      return Swal.fire("Amount & note wajib diisi", "", "warning");
    }

    try {
      const res = await api.post("/expense/", {
        amount: Number(amount),
        category_id: parseInt(categoryId) || null,
        note,
      });

      setExpenses((prev) => [res.data.data, ...prev]); // 🔥
      setAmount("");
      setCategoryId("");
      setNote("");

      Swal.fire("Expense ditambahkan!", "", "success");
    } catch {
      Swal.fire("Gagal menambah expense", "", "error");
    }
  };

  // ================= DELETE EXPENSE =================
  const handleDeleteExpense = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus expense?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
    });

    if (confirm.isConfirmed) {
      await api.delete(`/expense/${id}`);
      fetchExpenses();
      Swal.fire("Terhapus!", "", "success");
    }
  };

  // ================= ADD CATEGORY =================
  const handleAddCategory = async () => {
    if (!categoryName) {
      return Swal.fire("Nama kategori wajib diisi", "", "warning");
    }

    try {
      await api.post("/category/", { name: categoryName });
      setCategoryName("");
      fetchCategories();
      Swal.fire("Kategori ditambahkan!", "", "success");
    } catch {
      Swal.fire("Gagal menambah kategori", "", "error");
    }
  };

  // ================= DELETE CATEGORY =================
  const handleDeleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus kategori?",
      text: "Kategori yang sudah dipakai tidak bisa dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/category/${id}`);
        fetchCategories();
        Swal.fire("Kategori terhapus", "", "success");
      } catch {
        Swal.fire("Kategori sedang dipakai", "", "error");
      }
    }
  };

  // ================= OPEN EDIT MODAL =================
  const openEditModal = (exp) => {
    setEditId(exp.id);
    setEditAmount(exp.amount);
    setEditCategoryId(exp.category_id || "");
    setEditNote(exp.note);
    setShowModal(true);
  };

  // ================= UPDATE EXPENSE =================
  const handleUpdateExpense = async () => {
    try {
      const res = await api.patch(`/expense/${editId}`, {
        amount: Number(editAmount),
        category_id: parseInt(editCategoryId) || null,
        note: editNote,
      });

      setExpenses((prev) =>
        prev.map((e) => (e.id === editId ? res.data.data : e))
      ); // 🔥

      setShowModal(false);
      Swal.fire("Expense diupdate!", "", "success");
    } catch {
      Swal.fire("Gagal update expense", "", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">💸 Expense Manager</h1>

        {/* FORM AREA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ADD EXPENSE */}
          <div className="bg-white p-6 rounded-xl shadow md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">➕ Add Expense</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                className="border px-4 py-2 rounded-lg"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <select
                className="border px-4 py-2 rounded-lg"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Tanpa Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                className="border px-4 py-2 rounded-lg sm:col-span-2"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                onClick={handleAdd}
                className="sm:col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Tambah Expense
              </button>
            </div>
          </div>

          {/* ADD CATEGORY */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold">📂 Category</h2>

            <input
              className="border px-4 py-2 rounded-lg w-full"
              placeholder="Nama kategori"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <button
              onClick={handleAddCategory}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Tambah Kategori
            </button>

            <div className="border-t pt-3 space-y-2 max-h-40 overflow-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                >
                  <span>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Note</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-3 bg-gray-100" colSpan={5}></td>
                  </tr>
                ))
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">
                    Belum ada expense
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="border-b">
                    <td className="p-3">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {exp.category ? exp.category.name : "-"}
                    </td>
                    <td className="p-3 text-right text-red-600 font-semibold">
                      Rp {Number(exp.amount).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3">{exp.note}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">✏️ Edit Expense</h2>

            <input
              type="number"
              className="border px-4 py-2 rounded-lg w-full"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />

            <select
              className="border px-4 py-2 rounded-lg w-full"
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)}
            >
              <option value="">Tanpa Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              className="border px-4 py-2 rounded-lg w-full"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExpense}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
