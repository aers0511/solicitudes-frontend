import React, { useState, useEffect } from "react";
import { getTickets, updateTicket } from "../js/api";
import { API_URL } from "../config";

export default function TicketManager() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [solucion, setSolucion] = useState({ comentario: "", archivo: null });
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const token = localStorage.getItem("token");
  const BACKEND_URL = API_URL;

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

  const marcarComoSolucionado = async (ticket) => {
    try {
      const updateData = {
        status: "Solucionado",
        comment: solucion.comentario || "",
      };

      await updateTicket(token, ticket._id, updateData);

      alert(`Ticket solucionado y notificado a ${ticket.nombreSolicitante}`);
      setSelectedTicket(null);
      setSolucion({ comentario: "", archivo: null });
      setVistaPrevia(null);

      const data = await getTickets(token);
      setTickets(data);
    } catch (error) {
      console.error("Error actualizando ticket:", error);
      alert("Error al actualizar el ticket");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center md:text-left">
        Tickets asignados a ti
      </h1>

      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center">No hay tickets pendientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-auto border border-gray-300 shadow-md rounded-xl text-sm">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Lugar</th>
                <th className="p-3 whitespace-nowrap">Tipo</th>
                <th className="p-3 text-center whitespace-nowrap">Error persistente</th>
                <th className="p-3 whitespace-nowrap">Fecha límite</th>
                <th className="p-3 text-center whitespace-nowrap">Archivo adjunto</th>
                <th className="p-3 text-center whitespace-nowrap">Estado</th>
                <th className="p-3 text-center whitespace-nowrap">Solucionado el</th>
                <th className="p-3 text-center whitespace-nowrap">Acción</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-t hover:bg-indigo-50 transition"
                >
                  <td className="p-3 whitespace-nowrap">{ticket.location}</td>
                  <td className="p-3 whitespace-nowrap">{ticket.issueType}</td>
                  <td className="p-3 text-center">{ticket.persistentError ? "✅" : "❌"}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(ticket.fechaLimite).toLocaleDateString()}
                  </td>
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
                    {ticket.status === "Solucionado" ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                        Solucionado
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {ticket.status === "Solucionado" && ticket.updatedAt
                      ? new Date(ticket.updatedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
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
        </div>
      )}

      {selectedTicket && (
        <div className="mt-6 border-t pt-6 px-2 md:px-0">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center md:text-left">
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
              className="mt-3 max-w-sm border rounded shadow mx-auto md:mx-0"
            />
          )}

          <button
            className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
            onClick={() => marcarComoSolucionado(selectedTicket)}
          >
            Marcar como solucionado
          </button>

          {selectedTicket.comments && selectedTicket.comments.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Comentarios de solución</h3>
              <ul className="space-y-3">
                {selectedTicket.comments.map((comment, i) => (
                  <li key={i} className="bg-gray-100 p-4 rounded-md">
                    <p className="text-gray-700 mb-1">{comment.text}</p>
                    <div className="text-xs text-gray-500">
                      Por <strong>{comment.author}</strong> el{" "}
                      {new Date(comment.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
