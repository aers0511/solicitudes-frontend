import React from "react";

export default function SelectIssueType({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de problema
      </label>
      <select
        name="issueType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <option value="">Selecciona el tipo de problema</option>
        <option value="Impresora">Impresora</option>
        <option value="Fallas del equipo">Fallas del equipo</option>
        <option value="Internet">Internet</option>
        <option value="Software">Problemas con software</option>
        <option value="Acceso a cuentas">Acceso a cuentas</option>
        <option value="Otro">Otro</option>
      </select>
    </div>
  );
}
