import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import TodosPage from "./pages/TodosPage";
import ExpensePage from "./pages/ExpensePage";
import ProtectedRoute from "./components/ProtectedRoute";
import FullPageLoader from "./components/FullPageLoader";

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <FullPageLoader />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
