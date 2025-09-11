import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import SelectPersona from "./SelectPersona";
import InputLugar from "./InputLugar";
import CheckboxPersistent from "./CheckboxPersistent";
import SelecttipoDeError from "./SelectIssueType";
import TextareaDescription from "./TextareaDescription";
import { createTicket } from "../../js/api";

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
  const [formData, setFormData] = useState({
    location: "",
    persistente: false,
    tipoDeError: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketCreated, setTicketCreated] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleFormChange = (field, value) => {
    if (field === "persistente") {
      setFormData((prev) => ({ ...prev, [field]: !!value })); // asegurar boolean
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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

    if (!formData.tipoDeError) {
      setError("Selecciona el tipo de problema.");
      return;
    }

    if (!formData.descripcion.trim()) {
      setError("Describe el problema.");
      return;
    }

    const ubicacionFinal =
      personaSeleccionada === "vvalenzuela@itson.edu.mx"
        ? user.campus || "No especificado"
        : formData.location.trim();

    const nuevoTicket = {
      nombreSolicitante: user.nombre || user.email, // siempre nombre si existe
      correoSolicitante: user.email,
      destinatario: personaSeleccionada,
      ubicacion: ubicacionFinal,
      persistente: formData.persistente, // ya es boolean
      tipoDeError: formData.tipoDeError,
      descripcion: formData.descripcion.trim(),
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuario no autenticado.");

      const createdTicket = await createTicket(token, nuevoTicket);
      setTicketCreated(createdTicket);
      setShowAlert(true);

      // Ocultar alerta automáticamente después de 3 segundos
      setTimeout(() => setShowAlert(false), 3000);

      // Limpiar formulario
      setFormData({
        location: "",
        persistente: false,
        tipoDeError: "",
        descripcion: "",
      });
      setPersonaSeleccionada("");
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
        <h1 className="text-4xl font-extrabold mb-7 text-center">
          Registrar Solicitud
        </h1>

        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded-lg mb-5 text-sm font-semibold shadow-sm">
            {error}
          </div>
        )}

        {showAlert && ticketCreated && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in">
            ✅ Ticket #{ticketCreated.numeroTicket} creado correctamente
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
                  tipoDeError: "",
                  location: "",
                }));
              }}
            />
          </div>

          {personaSeleccionada !== "vvalenzuela@itson.edu.mx" && (
            <div className="md:col-span-2">
              <InputLugar
                value={formData.location}
                onChange={(v) => handleFormChange("location", v)}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <SelecttipoDeError
              value={formData.tipoDeError}
              onChange={(v) => handleFormChange("tipoDeError", v)}
              options={tiposPorPersona[personaSeleccionada] || []}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaDescription
              value={formData.descripcion}
              onChange={(v) => handleFormChange("descripcion", v)}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-3 md:col-span-2">
            <CheckboxPersistent
              checked={formData.persistente}
              onChange={(v) => handleFormChange("persistente", v)}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-3xl font-bold text-lg hover:brightness-110 transition-shadow shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              aria-busy={loading}
            >
              {loading ? "Creando ticket..." : "Solicitar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
