import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import TodosPage from "./pages/TodosPage";
import ExpensePage from "./pages/ExpensePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        element={
          <ProtectedRoute>
            <></>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
      </Route>
    </Routes>
  );
}
