import React from "react";

export default function Lugar({ value, onChange }) {
  const lugares = [
    "Edificio A",
    "Edificio B",
    "Edificio C",
    "Coordinación",
    "Laboratorio 1",
    "Laboratorio 2",
    "Sala de juntas",
    "Área de servidores",
  ];

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">
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
  