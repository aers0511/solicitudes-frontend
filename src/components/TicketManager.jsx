import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getTickets, updateTicket, downloadMonthlyReport } from "../js/api";
import { API_URL } from "../config";

export default function TicketManager() {
  useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [solucion, setSolucion] = useState({ comentario: "", archivo: null });
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [mostrarSolucionados, setMostrarSolucionados] = useState(false);

  const token = localStorage.getItem("token");

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

  const descargarCSV = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");

      const blob = await downloadMonthlyReport(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tickets-${year}-${month}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar reporte:", error);
      alert("Error al descargar el reporte mensual");
    }
  };

  const pendientes = tickets.filter((t) => t.status !== "Solucionado");
  const solucionados = tickets.filter((t) => t.status === "Solucionado");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Tickets</h1>
        <button
          onClick={descargarCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Descargar reporte del mes
        </button>
      </div>

      {/* Resolver Ticket */}
      {selectedTicket && (
        <div className="mb-8 border p-4 rounded-lg bg-gray-100 shadow-md animate-fade-in">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Resolver Ticket
          </h2>
          <p className="text-gray-700 text-sm">
            <strong>Lugar:</strong> {selectedTicket.location}
          </p>
          <p className="text-gray-700 text-sm mb-3">
            <strong>Descripción:</strong> {selectedTicket.description}
          </p>

          <label className="block text-sm font-medium text-gray-700 mt-3">
            Comentario de solución
          </label>
          <textarea
            rows="3"
            value={solucion.comentario}
            onChange={(e) =>
              setSolucion({ ...solucion, comentario: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
          />

          <label className="block text-sm font-medium text-gray-700 mt-3">
            Archivo (opcional)
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
            onClick={() => marcarComoSolucionado(selectedTicket)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
          >
            Marcar como solucionado
          </button>
        </div>
      )}

      {/* Botones para alternar vistas */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => setMostrarSolucionados(false)}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            !mostrarSolucionados
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 border border-gray-900"
          }`}
        >
          Tickets Pendientes
        </button>
        <button
          onClick={() => setMostrarSolucionados(true)}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            mostrarSolucionados
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 border border-gray-900"
          }`}
        >
          Tickets Solucionados
        </button>
      </div>

      <TicketTable
        tickets={mostrarSolucionados ? solucionados : pendientes}
        onResolver={setSelectedTicket}
        mostrarResolver={!mostrarSolucionados}
      />
    </div>
  );
}

function TicketTable({ tickets, onResolver, mostrarResolver }) {
  const BACKEND_URL = API_URL;

  if (tickets.length === 0)
    return (
      <p className="text-gray-500 text-sm mb-4">No hay tickets para mostrar.</p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200 text-sm shadow-sm rounded-lg">
        <thead className="bg-indigo-100 text-indigo-800">
          <tr>
            <th className="p-2 text-left">Lugar</th>
            <th className="p-2 text-center">Tipo</th>
            <th className="p-2 text-center">Persistente</th>
            <th className="p-2 text-center">Fecha Límite</th>
            <th className="p-2 text-center">Archivo</th>
            <th className="p-2 text-center">Solicitante</th>
            <th className="p-2 text-center">Estado</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="border-t hover:bg-gray-50">
              <td className="p-2 text-center">{ticket.location}</td>
              <td className="p-2 text-center">{ticket.issueType}</td>
              <td className="p-2 text-center">
                {ticket.persistentError ? "✅" : "❌"}
              </td>
              <td className="p-2 text-center">
                {ticket.fechaLimite
                  ? new Date(ticket.fechaLimite).toLocaleDateString()
                  : "—"}
              </td>
              <td className="p-2 text-center">
                {ticket.image ? (
                  <img
                    src={`${BACKEND_URL}/${ticket.image.replace(
                      /^\/?uploads\//,
                      "uploads/"
                    )}`}
                    alt="Adjunto"
                    className="h-10 mx-auto rounded"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="p-2">{ticket.nombreSolicitante}</td>
              <td className="p-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === "Solucionado"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="p-2 text-center">
                {mostrarResolver ? (
                  <button
                    className="text-indigo-700 font-semibold hover:underline text-sm"
                    onClick={() => onResolver(ticket)}
                  >
                    Resolver
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
