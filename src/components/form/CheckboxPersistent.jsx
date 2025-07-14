import React from "react";

export default function CheckboxPersistent({ checked, onChange }) {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        name="persistentError"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        id="persistentError"
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
      />
      <label htmlFor="persistentError" className="text-gray-700 font-medium">
        ¿Es un error persistente?
      </label>
    </div>
  );
}
