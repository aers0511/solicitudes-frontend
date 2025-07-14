import React from "react";

export default function TextareaDescription({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Descripción del problema
      </label>
      <textarea
        name="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        rows="5"
        placeholder="Describe con detalle el problema o falla"
        className="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
      ></textarea>
    </div>
  );
}
