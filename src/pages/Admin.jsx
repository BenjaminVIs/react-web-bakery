import React from "react";
import { Link } from "react-router-dom";

const base = import.meta.env.BASE_URL || "/";

function Admin() {
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
              <a className="nav-link active" href="#">
                📊 Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                🍰 Productos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                🛒 Pedidos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
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
      </main>
    </div>
  );
}

export default Admin;
