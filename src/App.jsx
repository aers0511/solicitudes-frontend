import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar"; // <-- importa Navbar
import Login from "./components/Login";
import Register from "./components/Register";
import FormRequest from "./components/form/FormRequest";
import TicketManager from "./components/TicketManager";
import NotFoundPage from "./components/NotFoundPage";

// Ruta protegida para cualquier usuario logueado
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

// Ruta protegida para técnicos/administradores por correo
function AdminRoute({ children }) {
  const { user } = React.useContext(AuthContext);

  const responsables = [
    "vvalenzuela@itson.edu.mx",
    "angel.reyes@itson.edu.mx",
  ];

  if (!user) return <Navigate to="/login" />;

  return responsables.includes(user.email.toLowerCase()) ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <div className="text-center mt-20 text-red-600 font-semibold text-xl">
      Acceso denegado: No eres personal autorizado.
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <FormRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets"
            element={
              <AdminRoute>
                <TicketManager />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
