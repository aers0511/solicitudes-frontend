export default function TicketResult({ ticket }) {
  if (!ticket) return null;

  return (
    <div className="mt-10 bg-green-50 border border-green-300 rounded-xl p-6 shadow-lg animate-fade-in">
      <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
        ✅ Ticket generado correctamente
      </h2>

      <div className="space-y-2 text-gray-700">
        {ticket.numeroTicket && (
          <p>
            <strong>Número de ticket:</strong> {ticket.numeroTicket}
          </p>
        )}
        {ticket.fechaLimite && (
          <p>
            <strong>Fecha límite:</strong>{" "}
            {new Date(ticket.fechaLimite).toLocaleDateString()}
          </p>
        )}
        {ticket.destinatario && (
          <p>
            <strong>Destinatario:</strong> {ticket.destinatario}
          </p>
        )}
        {ticket.location && (
          <p>
            <strong>Lugar:</strong> {ticket.location}
          </p>
        )}
      </div>
    </div>
  );
}
