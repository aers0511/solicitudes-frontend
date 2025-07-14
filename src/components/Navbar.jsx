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
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center relative">
      {/* Logo */}
      <div
        className="cursor-pointer select-none"
        onClick={() => {
          navigate("/");
          setMenuOpen(false);
        }}
      >
        <img src="../../public/logo.png" alt="Logo MiApp" className="h-10 w-auto" />
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
          bg-gray-800 md:bg-transparent
          w-full md:w-auto
          md:space-x-6
          ${menuOpen ? "flex" : "hidden"}
          md:flex
          z-20
          p-4 md:p-0
          rounded-b-md md:rounded-none
          shadow-md md:shadow-none
        `}
      >
        {user && (
          <>
            <span className="block md:inline mb-2 md:mb-0 text-white font-medium">
              Hola, {user.name || user.email}
            </span>

            {isAdmin && (
              <>
                <NavLink
                  to="/form"
                  className={({ isActive }) =>
                    `block md:inline px-2 py-1 rounded ${
                      isActive
                        ? "underline text-indigo-400"
                        : "hover:underline"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Solicitudes
                </NavLink>
                <NavLink
                  to="/admin/tickets"
                  className={({ isActive }) =>
                    `block md:inline px-2 py-1 rounded ${
                      isActive
                        ? "underline text-indigo-400"
                        : "hover:underline"
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
              className="mt-3 md:mt-0 bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
