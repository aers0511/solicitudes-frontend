import React, { useState } from "react";

export default function FileUploader({ file, setFile }) {
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
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
      {filePreview && (
        <div className="mt-3">
          <p className="text-sm font-semibold text-indigo-700 mb-1">Vista previa:</p>
          <img
            src={filePreview}
            alt="Vista previa"
            className="max-h-48 rounded-md shadow-md border"
          />
        </div>
      )}
      {!filePreview && file && (
        <p className="mt-2 text-gray-600 text-sm">Archivo: {file.name}</p>
      )}
    </div>
  );
}
