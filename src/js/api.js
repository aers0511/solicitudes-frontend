import { API_URL } from "../config";

// --- Auth ---

export async function login(email, contraseña) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contraseña }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error en login");
  return data.token;
}

export async function register({ nombre, email, campus, contraseña }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, campus, contraseña }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error en registro");
  return data.token;
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error al obtener perfil");
  }
  return res.json();
}

// --- Tickets ---

export async function createTicket(token, ticketData) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.msg || "Error creando ticket");
  }

  return res.json();
}

export async function getTickets(token) {
  const res = await fetch(`${API_URL}/tickets`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error obteniendo tickets");
  }
  return res.json();
}

export async function getTicketById(token, id) {
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error obteniendo ticket");
  }
  return res.json();
}

export async function updateTicket(token, id, updateData) {
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error actualizando ticket");
  }
  return res.json();
}

// --- Reporte mensual ---

export async function downloadMonthlyReport(token) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const res = await fetch(
    `${API_URL}/tickets/report?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error al generar el reporte mensual");
  }

  return await res.blob();
}
