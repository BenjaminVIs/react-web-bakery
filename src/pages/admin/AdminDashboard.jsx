/**
 * Panel de métricas rápidas.
 *
 * Actualmente muestra valores estáticos (placeholders) para ventas, pedidos activos,
 * usuarios registrados y productos activos. Se diseñó como área para:
 * - Incrustar widgets de analytics (ventas por período, desempeño productos).
 * - Mostrar KPIs calculados desde Supabase (consultas agregadas / RPC).
 * - Servir como landing principal al ingresar al panel.
 *
 * Próximas mejoras sugeridas:
 * - Reemplazar montos hardcode por consultas agregadas.
 * - Añadir selector de rango de fechas y gráficas (línea/barras).
 * - Estados de carga y error diferenciados.
 */
import React from "react";

function AdminDashboard() {
  return (
    <>
      <h2 className="mb-4 fw-bold text-primary">Panel de Control</h2>
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
    </>
  );
}

export default AdminDashboard;
