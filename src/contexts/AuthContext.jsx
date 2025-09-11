import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../config";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenLocal = localStorage.getItem("token");
    if (tokenLocal) {
      setToken(tokenLocal);
      fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${tokenLocal}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        });
    }
  }, []);

  // LOGIN
  const login = async (email, contraseña) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }), // <-- cambiado aquí
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.msg || "Error al iniciar sesión" };
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const userData = await profileRes.json();
      setUser(userData);

      return { success: true };
    } catch (err) {
      console.error("Error de conexión:", err);
      return { success: false, message: "No se pudo conectar con el servidor" };
    }
  };

  // REGISTER
  const register = async ({ nombre, email, campus, contraseña }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, campus, contraseña }), // <-- cambiado aquí
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.msg || "Error en registro" };
      }
      return { success: true };
    } catch (err) {
      console.error("Error de conexión:", err);
      return { success: false, message: "No se pudo conectar con el servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
  