import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cambiamos 'password' por 'contraseña'
  const [form, setForm] = useState({ email: "", contraseña: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Se envía 'form.contraseña' en lugar de 'form.password'
    const result = await login(form.email, form.contraseña);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/form");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center bg-gray-900 bg-clip-text text-transparent drop-shadow-lg">
          Inicia sesión con tu cuenta.
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Correo institucional
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              placeholder="ejemplo@itson.edu.mx"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              name="contraseña" // Cambiado aquí
              value={form.contraseña}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 transition shadow-md flex justify-center items-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            <span>{loading ? "Ingresando..." : "Iniciar sesión"}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
