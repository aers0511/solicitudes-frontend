import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import TicketManager from "../components/TicketManager";
import Navbar from "../components/Navbar";

export default function AdminRoute() {
  const { user } = useContext(AuthContext);
  const [loadingUser, setLoadingUser] = useState(true);

  const responsables = ["angel.reyes@itson.edu.mx"];

  useEffect(() => {
    console.log("Usuario actual:", user);
    // Esperamos a que user esté definido
    if (user !== null) {
      setLoadingUser(false);
    }
  }, [user]);

  // Mostrar loader mientras se carga el usuario
  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-lg">
        Cargando usuario...
      </div>
    );
  }

  // Si no hay usuario, redirigir a login
  if (!user) return <Navigate to="/login" />;

  // Normalizar email
  const emailUser = (user.email || "").trim().toLowerCase();
  const responsablesLower = responsables.map((e) => e.toLowerCase());

  // Verificar si el usuario es responsable/autorizado
  const autorizado = responsablesLower.includes(emailUser);

  return autorizado ? (
    <>
      <Navbar />
      <TicketManager />
    </>
  ) : (
    <div className="text-center mt-20 text-red-600 font-semibold text-xl">
      Acceso denegado: No eres personal autorizado.
    </div>
  );
}
