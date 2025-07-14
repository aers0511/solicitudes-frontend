import { API_URL } from "../config";

// --- Auth ---

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error en login");
  return data.token;
}

export async function register({ name, email, campus, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, campus, password }),
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

export async function createTicket(token, ticketData, file) {
  const formData = new FormData();

  Object.entries(ticketData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  if (file) formData.append("file", file);

  const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error creando ticket");
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
  const month = String(now.getMonth() + 1).padStart(2, "0"); // '01' a '12'

  const res = await fetch(`${API_URL}/tickets/report?year=${year}&month=${month}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Error al generar el reporte mensual");
  }

  // Retornamos el blob para que el frontend pueda manejar la descarga
  return await res.blob();
}