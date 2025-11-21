import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminUsuarios from "./AdminUsuarios";
import AdminProductos from "./AdminProductos";
import AdminPedidos from "./AdminPedidos";
import AdminComentarios from "./AdminComentarios";

const base = import.meta.env.BASE_URL || "/";

function Admin() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="admin-dashboard d-flex flex-column flex-lg-row min-vh-100 bg-light">
      <aside className="sidebar bg-white shadow-sm p-3 d-flex flex-lg-column justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-4">
            <img src={`${base}img/icono.png`} alt="Logo" width="40" height="40" className="me-2" />
            <h5 className="m-0">Admin Panel</h5>
          </div>
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
