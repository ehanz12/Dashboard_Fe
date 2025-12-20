import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TodosPage from "./pages/TodosPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<TodosPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
