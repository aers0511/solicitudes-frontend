import React from "react";

export default function Lugar({ value, onChange }) {
  const lugares = [
    "Cubículos",
    "Cyber",
    "Circulación",
    "Oficinas",
    "Capacitación"
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Lugar donde se requiere el soporte
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      >
        <option value="">Selecciona un lugar</option>
        {lugares.map((lugar, index) => (
          <option key={index} value={lugar}>
            {lugar}
          </option>
        ))}
      </select>
    </div>
  );
}
  