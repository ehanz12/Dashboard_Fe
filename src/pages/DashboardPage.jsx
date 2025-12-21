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
  const [expenseSummary, setExpenseSummary] = useState({
    daily_total: 0,
    monthly_total: 0,
    chart: [],
  });

  // ================= TODOS =================
  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos/");
      setTodos(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EXPENSE SUMMARY =================
  const fetchExpenseSummary = async () => {
    try {
      const res = await api.get("/expense/summary");
      setExpenseSummary(res.data);
    } catch (err) {
      console.error("Fetch expense summary failed", err);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchExpenseSummary();
  }, []);

  // Statistik Todo
  const totalTodos = todos.length;
  const pendingTodos = todos.filter((t) => t.status === "pending").length;
  const inProgressTodos = todos.filter((t) => t.status === "in_progress").length;
  const completedTodos = todos.filter((t) => t.status === "completed").length;

  const todoChart = [
    { name: "Pending", value: pendingTodos },
    { name: "In Progress", value: inProgressTodos },
    { name: "Completed", value: completedTodos },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <h1 className="text-3xl font-bold text-center">📊 Dashboard Overview</h1>

        {/* ================= TODO CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <StatCard title="Total Todos" value={totalTodos} color="indigo" />
          <StatCard title="Pending" value={pendingTodos} color="yellow" />
          <StatCard title="In Progress" value={inProgressTodos} color="orange" />
          <StatCard title="Completed" value={completedTodos} color="green" />
        </div>

        {/* ================= TODO CHART ================= */}
        <ChartCard title="Todo Status Chart" data={todoChart} />

        {/* ================= EXPENSE SUMMARY ================= */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          💸 Expense Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-gray-500">Pengeluaran Hari Ini</h3>
            <p className="text-2xl font-bold text-red-500 mt-2">
              Rp {expenseSummary.daily_total.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-gray-500">Pengeluaran Bulan Ini</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              Rp {expenseSummary.monthly_total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* ================= EXPENSE CHART ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            📊 Expense Comparison
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={expenseSummary.chart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENT ================= */

function StatCard({ title, value, color }) {
  const colors = {
    indigo: "text-indigo-600",
    yellow: "text-yellow-500",
    orange: "text-orange-500",
    green: "text-green-500",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <h2 className="text-gray-500">{title}</h2>
      <p className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">📊 {title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
