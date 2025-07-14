import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    campus: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { name, email, campus, password, confirmPassword } = form;

    if (!name || !email || !campus || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, campus, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al registrar");
        return;
      }

      setSuccess("Registro exitoso. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setError("No se pudo conectar con el servidor.", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Registro de Usuario
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo institucional"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />

          <select
            name="campus"
            value={form.campus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          >
            <option value="">Selecciona tu campus</option>
            <option value="Nainari">Náinari</option>
            <option value="Centro">Centro</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
