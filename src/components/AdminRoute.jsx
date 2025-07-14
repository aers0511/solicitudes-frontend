import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import TicketManager from "../components/TicketManager";
import Navbar from "../components/Navbar";

export default function AdminRoute() {

    
  const { user } = useContext(AuthContext);

  const responsables = [
    "vvalenzuela@itson.edu.mx",
    "angel.reyes@itson.edu.mx",
  ];

  useEffect(() => {
    console.log("Usuario actual:", user);
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const emailUser = user.email.trim().toLowerCase();
  const responsablesLower = responsables.map((e) => e.toLowerCase());

  return responsablesLower.includes(emailUser) ? (
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
