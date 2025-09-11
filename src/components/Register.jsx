import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    campus: "",
    contraseña: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { nombre, email, campus, contraseña, confirmPassword } = form;

    if (!nombre.trim() || !email.trim() || !campus || !contraseña || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (contraseña !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombre: nombre.trim(), 
          email: email.trim(), 
          campus, 
          contraseña 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al registrar");
      } else {
        setSuccess("Registro exitoso. Redirigiendo al login...");
        // Limpiar formulario
        setForm({ nombre: "", email: "", campus: "", contraseña: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-700 mb-8 text-center">
          Registro de Usuario
        </h2>

        {error && (
          <div
            role="alert"
            className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mb-6 text-sm font-semibold"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="alert"
            className="bg-green-100 border border-green-400 text-green-700 p-3 rounded-md mb-6 text-sm font-semibold"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5" noValidate>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-gray-400 transition"
            required
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo institucional"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-gray-400 transition"
            required
            autoComplete="email"
          />

          <select
            name="campus"
            value={form.campus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-gray-400 transition"
            required
          >
            <option value="" disabled>
              Selecciona tu campus
            </option>
            <option value="Nainari">Náinari</option>
            <option value="Centro">Centro</option>
            <option value="Navojoa">Navojoa</option>
            <option value="Guaymas">Guaymas</option>
            <option value="Empalme">Empalme</option>
          </select>

          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-gray-400 transition"
            required
            autoComplete="new-password"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-gray-400 transition"
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gray-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-gray-600 font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
