export default function CheckboxPersistent({ checked, onChange, id = "persistente" }) {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id={id}
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
      />
      <label htmlFor={id} className="text-gray-700 font-medium">
        ¿Es un error persistente?
      </label>
    </div>
  );
}