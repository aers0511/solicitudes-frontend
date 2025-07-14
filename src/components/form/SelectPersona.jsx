import React from "react";

const fotoPorCorreo = {
  "vvalenzuela@itson.edu.mx": "/src/assets/vic.jpg",
  "angel.reyes@itson.edu.mx": "/src/assets/angel.jpg",
};

const usuarios = [
  {
    email: "vvalenzuela@itson.edu.mx",
    name: "Victor Hugo Valenzuela Beltran",
    position: "Administrador ",
  },
  {
    email: "angel.reyes@itson.edu.mx",
    name: "Angel Eli Reyes Santiago",
    position: "Soporte Técnico",
  },
];

export default function SelectPersona({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Persona requerida
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <option value="">Selecciona a alguien</option>
        {usuarios.map((u) => (
          <option key={u.email} value={u.email}>
            {u.name} ({u.position})
          </option>
        ))}
      </select>

      {value && (
        <div className="mt-4 flex items-center gap-4">
          <img
            src={fotoPorCorreo[value] || "https://i.pravatar.cc/60?u=default"}
            alt="Foto perfil"
            className="w-16 h-16 rounded-full border-4 border-indigo-400 shadow-lg"
          />
          <p className="text-indigo-700 font-semibold">{value}</p>
        </div>
      )}
    </div>
  );
}
