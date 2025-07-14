import React from "react";

export default function TicketResult({ ticket }) {
  if (!ticket) return null;

  return (
    <div className="mt-10 bg-green-50 border border-green-300 rounded-xl p-6 shadow-lg animate-fade-in">
      <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
        ✅ Ticket generado correctamente
      </h2>
      <pre className="text-gray-800 whitespace-pre-wrap rounded-md bg-white p-4 max-h-72 overflow-auto shadow-inner">
        {JSON.stringify(ticket, null, 2)}
      </pre>
    </div>
  );
}
