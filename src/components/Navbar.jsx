import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const ADMIN_EMAILS = [
  "vvalenzuela@itson.edu.mx",
  "angel.reyes@itson.edu.mx",
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin =
    user &&
    ADMIN_EMAILS.includes(user.email.trim().toLowerCase());

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/")}
      >
        MiApp
      </div>

      {user && (
        <div className="flex items-center space-x-6">
          <span>Hola, {user.name || user.email}</span>

          {/* Links solo visibles para admin */}
          {isAdmin && (
            <>
              <NavLink
                to="/form"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Solicitudes
              </NavLink>
              <NavLink
                to="/admin/tickets"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Tickets
              </NavLink>
            </>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
