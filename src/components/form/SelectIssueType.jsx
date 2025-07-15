export default function SelectIssueType({ value, onChange, options = [] }) {
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
        disabled={options.length === 0}
        className="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <option value="" >Selecciona el tipo de problema</option>
        {options.map((tipo) => (
          <option key={tipo} value={tipo}>
            {tipo}
          </option>
        ))}
      </select>
    </div>
  );
}
