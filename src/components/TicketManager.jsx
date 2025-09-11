import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getTickets, updateTicket } from "../js/api";

export default function TicketManager() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comentario, setComentario] = useState("");
  const [mostrarSolucionados, setMostrarSolucionados] = useState(false);

  const token = localStorage.getItem("token");

  
  // Cargar tickets
  useEffect(() => {
    if (!token) return;
    async function fetchTickets() {
      try {
        const data = await getTickets(token);
        const ticketsConBooleano = data.map((t) => ({
          ...t,
          comentarios: t.comentarios || [],
        }));
        setTickets(ticketsConBooleano);
      } catch (error) {
        console.error("Error cargando tickets:", error);
      }
    }
    fetchTickets();
  }, [token]);

  // Marcar ticket como solucionado
  const marcarComoSolucionado = async (ticket) => {
    try {
      const updateData = {
        estatus: "Solucionado",
        comentarios: [
          {
            texto: comentario || "Ticket solucionado",
            authr: user.nombre || user.email,
            fecha: new Date(),
          },
        ],
      };
      const updated = await updateTicket(token, ticket._id, updateData);

      // Actualizar estado de tickets
      setTickets((prev) =>
        prev.map((t) => (t._id === updated._id ? { ...updated } : t))
      );

      setSelectedTicket(null);
      setComentario("");
      alert(`Ticket #${updated.numeroTicket} marcado como solucionado`);
    } catch (error) {
      console.error("Error actualizando ticket:", error);
      alert("Error al actualizar el ticket");
    }
  };

  const pendientes = tickets.filter((t) => t.estatus !== "Solucionado");
  const solucionados = tickets.filter((t) => t.estatus === "Solucionado");

  
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Tickets
      </h1>

      {/* Detalle/Resolver ticket */}
      {selectedTicket && (
        <div className="mb-8 border border-gray-200 p-5 rounded-2xl bg-gray-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">
            {selectedTicket.estatus === "Solucionado"
              ? "Detalles del Ticket Solucionado"
              : "Resolver Ticket"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm mb-3">
            <p>
              <strong>Ticket #:</strong> {selectedTicket.numeroTicket}
            </p>
            <p>
              <strong>Lugar:</strong> {selectedTicket.ubicacion}
            </p>
            <p>
              <strong>Tipo de error:</strong> {selectedTicket.tipoDeError}
            </p>
            <p>
              <strong>Persistente:</strong>{" "}
              {selectedTicket.persistente ? "Sí" : "No"}
            </p>
            <p>
              <strong>Fecha límite:</strong>{" "}
              {new Date(selectedTicket.fechaLimite).toLocaleDateString()}
            </p>
            <p>
              <strong>Solicitante:</strong> {selectedTicket.nombreSolicitante}
            </p>
          </div>
          <p className="mb-3">
            <strong>Descripción:</strong> {selectedTicket.descripcion}
          </p>

          {/* Mostrar comentario si ya fue solucionado */}
          {selectedTicket.estatus === "Solucionado" &&
            selectedTicket.comentarios.length > 0 && (
              <div className="mt-3">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Comentario:
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedTicket.comentarios[0].texto}
                </p>
              </div>
            )}

          {/* Textarea y botón solo si no está solucionado */}
          {selectedTicket.estatus !== "Solucionado" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl shadow-sm flex flex-col gap-4 animate-fade-in">
              <textarea
                rows="3"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
              />
              <button
                onClick={() => marcarComoSolucionado(selectedTicket)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all duration-200"
              >
                Marcar como solucionado
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botones de vista */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMostrarSolucionados(false)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            !mostrarSolucionados
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 border border-gray-300"
          }`}
        >
          Tickets Pendientes
        </button>
        <button
          onClick={() => setMostrarSolucionados(true)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            mostrarSolucionados
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 border border-gray-300"
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

// Tabla de tickets
function TicketTable({ tickets, onResolver, mostrarResolver }) {
  if (!tickets.length)
    return (
      <p className="text-gray-500 text-sm text-center mt-4">
        No hay tickets para mostrar.
      </p>
    );

  return (
    <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200">
      <table className="min-w-full bg-white divide-y divide-gray-200 rounded-2xl">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center text-gray-600 text-sm font-medium">
              #
            </th>
            <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">
              Lugar
            </th>
            <th className="px-4 py-2 text-center text-gray-600 text-sm font-medium">
              Tipo
            </th>
            <th className="px-4 py-2 text-center text-gray-600 text-sm font-medium">
              Persistente
            </th>
            <th className="px-4 py-2 text-center text-gray-600 text-sm font-medium">
              Fecha Límite
            </th>
            <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">
              Solicitante
            </th>
            {/* Mostrar columna Comentario solo en tickets solucionados */}
            {!mostrarResolver && (
              <th className="px-4 py-2 text-left text-gray-600 text-sm font-medium">
                Comentario
              </th>
            )}
            <th className="px-4 py-2 text-center text-gray-600 text-sm font-medium">
              Estado
            </th>
            <th className="px-4 py-2 text-center text-gray-600 text-sm font-medium">
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2 text-center text-gray-700">
                {ticket.numeroTicket}
              </td>
              <td className="px-4 py-2 text-gray-700">{ticket.ubicacion}</td>
              <td className="px-4 py-2 text-center text-gray-700">
                {ticket.tipoDeError}
              </td>
              <td className="px-4 py-2 text-center text-gray-700">
                {ticket.persistente ? "Sí":"No"}
              </td>
              <td className="px-4 py-2 text-center text-gray-700">
                {new Date(ticket.fechaLimite).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {ticket.nombreSolicitante}
              </td>
              {/* Solo mostrar comentario en tickets solucionados */}
              {!mostrarResolver && (
                <td className="px-4 py-2 text-gray-700">
                  {ticket.comentarios.length > 0
                    ? ticket.comentarios[0].texto
                    : "—"}
                </td>
              )}
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    ticket.estatus === "Solucionado"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {ticket.estatus}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                {mostrarResolver && ticket.estatus !== "Solucionado" ? (
                  <button
                    onClick={() => onResolver(ticket)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
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
