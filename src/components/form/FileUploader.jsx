import React, { useState } from "react";

export default function FileUploader({ imagen, setImagen }) {
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const handleFileChange = (e) => {
    const archivoSeleccionado = e.target.files[0];
    setImagen(archivoSeleccionado || null);

    if (archivoSeleccionado && archivoSeleccionado.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setVistaPrevia(reader.result);
      reader.readAsDataURL(archivoSeleccionado);
    } else {
      setVistaPrevia(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Adjuntar archivo (opcional)
      </label>
      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleFileChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
      {vistaPrevia && (
        <div className="mt-3">
          <p className="text-sm font-semibold text-indigo-700 mb-1">Vista previa:</p>
          <img
            src={vistaPrevia}
            alt="Vista previa"
            className="max-h-48 rounded-md shadow-md border"
          />
        </div>
      )}
      {!vistaPrevia && imagen && (
        <p className="mt-2 text-gray-600 text-sm">Archivo: {imagen.name}</p>
      )}
    </div>
  );
}
