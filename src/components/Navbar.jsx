import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const ADMIN_EMAILS = [
  "vvalenzuela@itson.edu.mx",
  "angel.reyes@itson.edu.mx",
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isAdmin =
    user &&
    ADMIN_EMAILS.includes(user.email.trim().toLowerCase());

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center relative shadow-md">
      {/* Logo */}
      <div
        className="cursor-pointer select-none flex items-center gap-2"
        onClick={() => {
          navigate("/");
          setMenuOpen(false);
        }}
      >
        <img src="/logo.png" alt="Logo MiApp" className="h-10 w-auto" />
        <span className="font-semibold text-xl tracking-wide hidden md:block pl-5">
          Soporte
        </span>
      </div>

      {/* Botón hamburguesa */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Menú desktop y móvil */}
      <div
        className={`
          flex-col md:flex-row md:flex md:items-center
          absolute md:static top-full right-0 md:top-auto md:right-auto
          bg-gray-900 md:bg-transparent
          w-full md:w-auto
          md:space-x-8
          ${menuOpen ? "flex" : "hidden"}
          md:flex
          z-30
          p-6 md:p-0
          rounded-b-lg md:rounded-none
          shadow-lg md:shadow-none
          gap-4 md:gap-0
        `}
      >
        {user && (
          <>
            <span className="block md:inline mb-4 md:mb-0 text-white font-medium px-2">
              Hola, <span className="font-semibold">{user.name || user.email}</span>
            </span>

            {isAdmin && (
              <>
                <NavLink
                  to="/form"
                  className={({ isActive }) =>
                    `block md:inline px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "underline text-indigo-400"
                        : "hover:underline hover:text-indigo-300"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Solicitudes
                </NavLink>
                <NavLink
                  to="/admin/tickets"
                  className={({ isActive }) =>
                    `block md:inline px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "underline text-indigo-400"
                        : "hover:underline hover:text-indigo-300"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Tickets
                </NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              className="mt-2 md:mt-0 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition font-semibold"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
