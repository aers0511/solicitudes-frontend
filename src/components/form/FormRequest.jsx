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
import { createTicket } from "../../js/api";

// ✅ Tipos de problema por persona
const tiposPorPersona = {
  "vvalenzuela@itson.edu.mx": [
    "Paranetrizacion del SIB.",
    "Otorgar permisos a PR.",
    "Actualizacion masiva de usuarios.",
    "Actualizacion individual de usuarios.",
    "Alta de nuevos usuarios STAFF.",
    "Inventario.",
    "Capacitacion sobre operaciones del SIB.",
    "Emision de reportes.",
  ],
  "angel.reyes@itson.edu.mx": [
    "Fallas en equio de servicio.",
    "Fallas en equipo personal.",
    "Soporte a usuario.",
    "Falla en equipo de impresion.",
    "Fallas en servicio de internet.",
    "Fallas en equipo de autoprestamo.",
    "Solicitud de consumibles (toner, cargador, mouse, teclado, etc.).",
    "Otro",
  ],
};

export default function FormRequest() {
  const { user } = useContext(AuthContext);
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

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!personaSeleccionada) {
      setError("Por favor selecciona una persona destinataria.");
      return;
    }

    if (
      personaSeleccionada !== "vvalenzuela@itson.edu.mx" &&
      !formData.location.trim()
    ) {
      setError("El campo Lugar es obligatorio.");
      return;
    }

    if (!formData.issueType) {
      setError("Selecciona el tipo de problema.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Describe el problema.");
      return;
    }

    const fechaLimite = generarFechaLimite();

    const nuevoTicket = {
      nombreSolicitante: user.name || user.email,
      correoSolicitante: user.email,
      destinatario: personaSeleccionada,
      fechaLimite,
      location:
        personaSeleccionada === "vvalenzuela@itson.edu.mx"
          ? ""
          : formData.location.trim(),
      persistentError: formData.persistentError,
      issueType: formData.issueType,
      description: formData.description.trim(),
      archivoNombre: file ? file.name : null,
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const createdTicket = await createTicket(token, nuevoTicket, file);
      setTicket(createdTicket);

      setFormData({
        location: "",
        persistentError: false,
        issueType: "",
        description: "",
      });
      setPersonaSeleccionada("");
      setFile(null);
      setError("");
    } catch (err) {
      setError(err.message || "Error al crear el ticket. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-8 space-y-7 animate-fade-in">
        <div className="flex justify-between items-center mb-7">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            Registrar Solicitud
          </h1>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-200 text-red-800 p-3 rounded-lg mb-5 text-sm font-semibold shadow-sm"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          noValidate
        >
          <div className="col-span-1 md:col-span-2">
            <SelectPersona
              value={personaSeleccionada}
              onChange={(val) => {
                setPersonaSeleccionada(val);
                setFormData((prev) => ({
                  ...prev,
                  issueType: "",
                  location: "",
                }));
              }}
              className="text-base"
            />
          </div>

          {/* Mostrar el campo Lugar solo si no es Victor */}
          {personaSeleccionada !== "vvalenzuela@itson.edu.mx" && (
            <div className="md:col-span-2">
              <InputLugar
                value={formData.location}
                onChange={(v) => handleFormChange("location", v)}
                className="text-base"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <SelectIssueType
              value={formData.issueType}
              onChange={(v) => handleFormChange("issueType", v)}
              options={tiposPorPersona[personaSeleccionada] || []}
              className="text-base"
            />
          </div>

          <div className="md:col-span-2">
            <FileUploader file={file} setFile={setFile} />
          </div>

          <div className="md:col-span-2">
            <TextareaDescription
              value={formData.description}
              onChange={(v) => handleFormChange("description", v)}
              className="text-base"
              rows={4}
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
              className="w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white py-3 rounded-3xl font-bold text-lg hover:brightness-110 transition-shadow shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              aria-busy={loading}
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
