/**
 * Vista raíz del panel de administración.
 *
 * Responsabilidades:
 * - Renderiza el layout (sidebar + área principal) y gestiona navegación interna
 *   mediante estado local `activeMenu` (no usa router interno para simplicidad).
 * - Despliega los módulos: Dashboard, Productos, Pedidos, Usuarios, Comentarios.
 * - Gestiona cierre de sesión básico limpiando `usuarioActual` del localStorage
 *   y redirigiendo a `/` (flujo simple sin confirmación ni API extra).
 *
 * Notas:
 * - El valor `base` permite servir imágenes correctas en despliegues subcarpeta.
 * - Si se requieren permisos por rol, se puede envolver cada módulo con lógica
 *   condicional (actualmente se asume acceso admin total).
 */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuthStore } from "../../stores/useAuthStore";
import AdminDashboard from "./AdminDashboard";
import AdminUsuarios from "./AdminUsuarios";
import AdminProductos from "./AdminProductos";
import AdminPedidos from "./AdminPedidos";
import AdminComentarios from "./AdminComentarios";

const base = import.meta.env.BASE_URL || "/";

function Admin() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();
  const authUser = useAuthStore(s => s.user);

  // Obtener rol del usuario actual
  const currentRole = useMemo(() => {
    if (!authUser) return null;
    const profile = usuarios.find(u => u.user_id === authUser.id);
    return profile?.role || null;
  }, [authUser, usuarios]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data } = await supabase.from("user_profile").select("user_id, role");
      if (data) setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  // Redirigir si no es admin o no autenticado
  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    } else if (currentRole && currentRole !== 'admin') {
      navigate('/');
    }
  }, [authUser, currentRole, navigate]);

  return (
    <div className="admin-dashboard d-flex flex-column flex-lg-row min-vh-100 bg-light">
      <aside className="sidebar bg-white shadow-sm p-3 d-flex flex-lg-column justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-4">
            <img src={`${base}img/icono.png`} alt="Logo" width="40" height="40" className="me-2" />
            <h5 className="m-0">Admin Panel</h5>
          </div>
          {/* Menú principal dinámico: fácil de extender agregando más items */}
          <ul className="nav flex-lg-column gap-2">
            {[
              { key: "dashboard", label: "📊 Dashboard" },
              { key: "productos", label: "🍰 Productos" },
              { key: "pedidos", label: "🛒 Pedidos" },
              { key: "usuarios", label: "👥 Usuarios" },
              { key: "comentarios", label: "💬 Comentarios" }
            ].map(item => (
              <li key={item.key} className="nav-item">
                <button
                  type="button"
                  className={"nav-link text-start " + (activeMenu === item.key ? "active" : "")}
                  onClick={() => setActiveMenu(item.key)}
                >{item.label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-top pt-3">
          {/* Botón de cierre de sesión simplificado (no invalida token en Supabase aquí) */}
          <button
            className="btn btn-outline-danger w-100"
            onClick={() => {
              localStorage.removeItem("usuarioActual");
              window.location.href = "/";
            }}
          >Cerrar sesión</button>
        </div>
      </aside>
      <main className="flex-fill p-4">
        {/* Render condicional del módulo solicitado */}
        {activeMenu === "dashboard" && <AdminDashboard />}
        {activeMenu === "usuarios" && <AdminUsuarios />}
        {activeMenu === "productos" && <AdminProductos />}
        {activeMenu === "pedidos" && <AdminPedidos />}
        {activeMenu === "comentarios" && <AdminComentarios />}
      </main>
    </div>
  );
}

export default Admin;
