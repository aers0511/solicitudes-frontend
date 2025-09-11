export default function TextareaDescription({ value, onChange, rows = 5 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Descripción del problema
      </label>
      <textarea
        name="descripcion"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder="Describe con detalle el problema o falla"
        className="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
      />
    </div>
  );
}
