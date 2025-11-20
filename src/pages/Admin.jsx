import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Ajusta según tu estructura

const base = import.meta.env.BASE_URL || "/";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Para formulario nuevo o editar
  const [form, setForm] = useState({
    user_id: "",
    display_name: "",
    role: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  // Obtener usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("user_profile").select("*");
    if (error) {
      alert("Error cargando usuarios: " + error.message);
    } else {
      setUsuarios(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Editar usuario
      const { error } = await supabase
        .from("user_profile")
        .update({
          display_name: form.display_name,
          role: form.role
        })
        .eq("user_id", form.user_id);
      if (error) {
        alert("Error editando usuario: " + error.message);
      } else {
        alert("Usuario actualizado");
        fetchUsuarios();
        setIsEditing(false);
        setForm({user_id: "", display_name: "", role: ""});
      }
    } else {
      // Para crear usuario nuevo:
      alert("Crear usuario manual no implementado. Usa el registro de Supabase Auth.");
    }
  };

  const handleEdit = (usuario) => {
    setForm(usuario);
    setIsEditing(true);
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm("¿Eliminar usuario? Esto solo borra su perfil, no su cuenta de autenticación.")) return;
    const { error } = await supabase.from("user_profile").delete().eq("user_id", user_id);
    if (error) {
      alert("Error eliminando usuario: " + error.message);
    } else {
      alert("Usuario eliminado");
      fetchUsuarios();
    }
  };

  return (
    <div>
      <h3>Gestión de Usuarios</h3>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <>
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.display_name}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => handleEdit(u)} className="btn btn-sm btn-warning me-2">Editar</button>
                    <button onClick={() => handleDelete(u.user_id)} className="btn btn-sm btn-danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="mt-4">{isEditing ? "Editar Usuario" : "Crear Usuario (SIN TERMINAR!!!!)"}</h4>
          <form onSubmit={handleSubmit} className="d-flex gap-2 flex-wrap align-items-center">
            <input
              type="text"
              name="display_name"
              placeholder="Nombre"
              value={form.display_name}
              onChange={handleChange}
              required
              className="form-control"
              style={{maxWidth: "200px"}}
            />
            <input
              type="text"
              name="role"
              placeholder="Rol"
              value={form.role}
              onChange={handleChange}
              required
              className="form-control"
              style={{maxWidth: "150px"}}
            />
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Actualizar" : "Agregar"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({ user_id: "", display_name: "", role: "" });
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
}

function Admin() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="admin-dashboard d-flex flex-column flex-lg-row min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="sidebar bg-white shadow-sm p-3 d-flex flex-lg-column justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-4">
            <img
              src={`${base}img/icono.png`}
              alt="Logo"
              width="40"
              height="40"
              className="me-2"
            />
            <h5 className="m-0">Admin Panel</h5>
          </div>

          <ul className="nav flex-lg-column gap-2">
            <li className="nav-item">
              <a
                href="#"
                className={"nav-link " + (activeMenu === "dashboard" ? "active" : "")}
                onClick={() => setActiveMenu("dashboard")}
              >
                📊 Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={"nav-link " + (activeMenu === "usuarios" ? "active" : "")}
                onClick={() => setActiveMenu("usuarios")}
              >
                🍰 Productos
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={"nav-link " + (activeMenu === "usuarios" ? "active" : "")}
                onClick={() => setActiveMenu("usuarios")}
              >
                🛒 Pedidos
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={"nav-link " + (activeMenu === "usuarios" ? "active" : "")}
                onClick={() => setActiveMenu("usuarios")}
              >
                👥 Usuarios
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                💬 Comentarios
              </a>
            </li>
          </ul>
        </div>

        <div className="border-top pt-3">
          <button
            className="btn btn-outline-danger w-100"
            onClick={() => {
              localStorage.removeItem("usuarioActual");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-fill p-4">
        {activeMenu === "dashboard" && (
          <>
            <h2 className="mb-4 fw-bold text-primary">Panel de Control</h2>

            {/* Tarjetas resumen */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card text-center shadow-sm border-0 rounded-3">
                  <div className="card-body">
                    <h5 className="card-title text-muted">Ventas totales</h5>
                    <h3 className="fw-bold text-success">$2.450.000</h3>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <div className="card text-center shadow-sm border-0 rounded-3">
                  <div className="card-body">
                    <h5 className="card-title text-muted">Pedidos activos</h5>
                    <h3 className="fw-bold text-warning">18</h3>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <div className="card text-center shadow-sm border-0 rounded-3">
                  <div className="card-body">
                    <h5 className="card-title text-muted">Usuarios registrados</h5>
                    <h3 className="fw-bold text-info">254</h3>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <div className="card text-center shadow-sm border-0 rounded-3">
                  <div className="card-body">
                    <h5 className="card-title text-muted">Productos activos</h5>
                    <h3 className="fw-bold text-secondary">47</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de últimos pedidos */}
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-white border-bottom">
                <h5 className="m-0 fw-bold">Últimos pedidos</h5>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover align-middle m-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Monto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#00124</td>
                      <td>María Torres</td>
                      <td>18 Oct 2025</td>
                      <td>$28.500</td>
                      <td>
                        <span className="badge bg-success">Completado</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#00125</td>
                      <td>Pedro Pérez</td>
                      <td>19 Oct 2025</td>
                      <td>$15.000</td>
                      <td>
                        <span className="badge bg-warning text-dark">Pendiente</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#00126</td>
                      <td>Laura Díaz</td>
                      <td>19 Oct 2025</td>
                      <td>$42.000</td>
                      <td>
                        <span className="badge bg-danger">Cancelado</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#00127</td>
                      <td>Darío Meza</td>
                      <td>20 Oct 2025</td>
                      <td>$35.000</td>
                      <td>
                        <span className="badge bg-info text-dark">En preparación</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {activeMenu === "usuarios" && <AdminUsuarios />}
      </main>
    </div>
  );
}

export default Admin;
