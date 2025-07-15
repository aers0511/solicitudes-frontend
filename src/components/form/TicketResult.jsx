import React from "react";

export default function TicketResult({ ticket }) {
  if (!ticket) return null;

  return (
    <div className="mt-10 bg-green-50 border border-green-300 rounded-xl p-6 shadow-lg animate-fade-in">
      <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
        ✅ Ticket generado correctamente
      </h2>
    </div>
  );
}
