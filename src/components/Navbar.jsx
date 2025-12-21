import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Apakah kamu yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Berhasil Logout!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-700 hover:text-indigo-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <div
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          📝 MyDashboard
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            className={isActive("/expenses")}
            onClick={() => navigate("/expenses")}
          >
            Expense
          </button>
          <button
            className={isActive("/todos")}
            onClick={() => navigate("/todos")}
          >
            Todos
          </button>
          <button
            className="text-red-500 hover:text-red-600 font-medium"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <button
            className={`block w-full text-left ${isActive("/expenses")}`}
            onClick={() => {
              navigate("/expenses");
              setOpen(false);
            }}
          >
            Expense
          </button>
          <button
            className={`block w-full text-left ${isActive("/todos")}`}
            onClick={() => {
              navigate("/todos");
              setOpen(false);
            }}
          >
            Todos
          </button>
          <button
            className="block w-full text-left text-red-500 hover:text-red-600"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
