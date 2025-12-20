import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos/");
      setTodos(res.data.data);
    } catch (err) {
      console.error("Fetch todos failed", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Statistik
  const totalTodos = todos.length;
  const pendingTodos = todos.filter((t) => t.status.toLowerCase() === "pending").length;
  const InProgressTodos = todos.filter((t) => t.status.toLowerCase() === "in_progress").length;
  const completedTodos = todos.filter((t) => t.status.toLowerCase() === "completed").length;

  const chartData = [
    { name: "Pending", value: pendingTodos },
    { name: "In Progress", value: InProgressTodos },
    { name: "Completed", value: completedTodos },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Navbar/>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          📊 Dashboard Overview
        </h1>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-medium text-gray-500">Total Todos</h2>
            <p className="text-2xl font-bold text-indigo-600 mt-2">{totalTodos}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-medium text-gray-500">Pending</h2>
            <p className="text-2xl font-bold text-yellow-500 mt-2">{pendingTodos}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-medium text-gray-500">In Progress</h2>
            <p className="text-2xl font-bold text-yellow-500 mt-2">{InProgressTodos}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-medium text-gray-500">Completed</h2>
            <p className="text-2xl font-bold text-green-500 mt-2">{completedTodos}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Todo Status Chart</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
