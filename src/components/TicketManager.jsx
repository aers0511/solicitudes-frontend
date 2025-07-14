import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getTickets, updateTicket } from "../js/api";
import { API_URL } from "../config";


export default function TicketManager() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [solucion, setSolucion] = useState({ comentario: "", archivo: null });
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const BACKEND_URL = API_URL;

  
  // Cargar tickets desde backend
  useEffect(() => {
  if (!token) return;
  async function fetchTickets() {
    try {
      const data = await getTickets(token);
      setTickets(data);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    }
  }
  fetchTickets();
}, [token]);

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    setSolucion((prev) => ({ ...prev, archivo: file }));

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setVistaPrevia(reader.result);
      reader.readAsDataURL(file);
    } else {
      setVistaPrevia(null);
    }
  };

  // Marcar ticket como solucionado y enviar actualización al backend
  const marcarComoSolucionado = async (ticket) => {
    try {
      const updateData = {
        status: "Solucionado",
        comment: solucion.comentario || "",
        // Aquí no se envía el archivo, para manejar archivo necesitarías otra ruta o método
      };

      await updateTicket(user.token, ticket._id, updateData);

      alert(`Ticket solucionado y notificado a ${ticket.nombreSolicitante}`);

      setSelectedTicket(null);
      setSolucion({ comentario: "", archivo: null });
      setVistaPrevia(null);

      // Recarga tickets
      const data = await getTickets(user.token);
      setTickets(data);
    } catch (error) {
      console.error("Error actualizando ticket:", error);
      alert("Error al actualizar el ticket");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Tickets asignados a ti</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-500">No hay tickets pendientes.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 shadow-md rounded-xl">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="p-3 text-left">Lugar</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Error persistente</th>
              <th className="p-3">Fecha límite</th>
              <th className="p-3">Archivo adjunto</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="border-t hover:bg-indigo-50 transition"
              >
                <td className="p-3">{ticket.location}</td>
                <td className="p-3">{ticket.issueType}</td>
                <td className="p-3 text-center">
                  {ticket.persistentError ? "✅" : "❌"}
                </td>
                <td className="p-3">{new Date(ticket.fechaLimite).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  {ticket.image ? (
                    <img
                      src={`${BACKEND_URL}/${ticket.image.replace(/^\/?uploads\//, "uploads/")}`}
                      alt="Adjunto"
                      className="max-h-16 mx-auto rounded"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="text-indigo-700 font-semibold hover:underline"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    Resolver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTicket && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Resolver Ticket
          </h2>
          <p className="text-gray-700 mb-2">
            <strong>Lugar:</strong> {selectedTicket.location}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Descripción:</strong> {selectedTicket.description}
          </p>

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Comentario de solución
          </label>
          <textarea
            rows="4"
            value={solucion.comentario}
            onChange={(e) =>
              setSolucion((prev) => ({ ...prev, comentario: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 mt-1"
          ></textarea>

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Subir archivo (opcional)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleArchivo}
            className="mt-1"
          />
          {vistaPrevia && (
            <img
              src={vistaPrevia}
              alt="Vista previa"
              className="mt-3 max-w-sm border rounded shadow"
            />
          )}

          <button
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
            onClick={() => marcarComoSolucionado(selectedTicket)}
          >
            Marcar como solucionado
          </button>
        </div>
      )}
    </div>
  );
}
