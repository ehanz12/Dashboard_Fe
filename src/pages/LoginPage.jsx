import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Welcome Back 👋",
        text: "Login berhasil",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate("/", { replace: true });
    } catch {
      Swal.fire("Login gagal", "Email atau password salah", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-100">
      {/* LEFT - BRANDING */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white">
        <h1 className="text-5xl font-extrabold mb-6">📝 MyDashboard</h1>
        <p className="text-xl leading-relaxed text-indigo-100">
          Kelola tugas harian, tingkatkan produktivitas, dan fokus pada hal
          penting dalam hidupmu.
        </p>

        <div className="mt-10 space-y-3 text-indigo-200">
          <p>✔ Simple & Fast</p>
          <p>✔ Personal Productivity</p>
          <p>✔ Clean Dashboard</p>
        </div>
      </div>

      {/* RIGHT - LOGIN */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Sign In
          </h2>
          <p className="text-gray-500 mb-8">
            Masuk ke personal dashboard kamu
          </p>

          <form onSubmit={submit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8">
            © {new Date().getFullYear()} MyDashboard
          </p>
        </div>
      </div>
    </div>
  );
}
