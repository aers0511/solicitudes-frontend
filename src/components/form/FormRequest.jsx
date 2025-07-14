import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import SelectPersona from "./SelectPersona";
import FileUploader from "./FileUploader";
import InputLugar from "./InputLugar";
import CheckboxPersistent from "./CheckboxPersistent";
import SelectIssueType from "./SelectIssueType";
import TextareaDescription from "./TextareaDescription";
import TicketResult from "./TicketResult";

import { generarFechaLimite } from "./utils";
import { createTicket } from "../../js/api"; // importa la función aquí

export default function FormRequest() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [personaSeleccionada, setPersonaSeleccionada] = useState("");
  const [ticket, setTicket] = useState(null);

  const [formData, setFormData] = useState({
    location: "",
    persistentError: false,
    issueType: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Protege el acceso si no hay usuario
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleFormChange = (field, value) => {
    setFormData((f) => ({
      ...f,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!personaSeleccionada) {
      setError("Selecciona a alguien.");
      return;
    }

    const fechaLimite = generarFechaLimite();

    const ticketGenerado = {
      nombreSolicitante: user.name,
      correoSolicitante: user.email,
      destinatario: personaSeleccionada,
      fechaLimite,
      location: formData.location,
      persistentError: formData.persistentError,
      issueType: formData.issueType,
      description: formData.description,
      archivoNombre: file ? file.name : null,
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const createdTicket = await createTicket(token, ticketGenerado, file);

      setTicket(createdTicket);

      // Limpia formulario
      setFormData({
        location: "",
        persistentError: false,
        issueType: "",
        description: "",
      });
      setPersonaSeleccionada("");
      setFile(null);
    } catch (err) {
      setError(err.message || "Error al crear el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 p-8 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 space-y-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gradient bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Registrar Solicitud
          </h1>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-red-600/70 font-semibold hover:text-red-800 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1 md:col-span-2">
            <SelectPersona
              value={personaSeleccionada}
              onChange={setPersonaSeleccionada}
            />
          </div>

          <div className="md:col-span-2">
            <InputLugar
              value={formData.location}
              onChange={(v) => handleFormChange("location", v)}
            />
          </div>

          <div className="md:col-span-2">
            <SelectIssueType
              value={formData.issueType}
              onChange={(v) => handleFormChange("issueType", v)}
            />
          </div>

          <div className="md:col-span-2">
            <FileUploader file={file} setFile={setFile} />
          </div>

          <div className="md:col-span-2">
            <TextareaDescription
              value={formData.description}
              onChange={(v) => handleFormChange("description", v)}
            />
          </div>

          <div className="flex items-center space-x-3 md:col-span-2">
            <CheckboxPersistent
              checked={formData.persistentError}
              onChange={(v) => handleFormChange("persistentError", v)}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Creando ticket..." : "Crear ticket"}
            </button>
          </div>
        </form>

        <TicketResult ticket={ticket} />
      </div>
    </div>
  );
}
