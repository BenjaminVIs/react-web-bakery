/**
 * Administración de pedidos.
 *
 * Funcionalidades principales:
 * - Listado paginado y filtrable (por estado y por UUID de usuario).
 * - Migración automática de estados legacy al cargarse (usa `migrateLegacyStatuses`).
 * - Control de roles: sólo admin puede crear/editar/eliminar; vendedor visualiza; cliente es redirigido.
 * - Validaciones de montos (subtotal/discount) y transición de estado (canTransition).
 * - Formateo de valores monetarios en CLP y sanitización de estado antes de enviar (sanitizeStatus).
 *
 * Arquitectura:
 * - Lógica pura (cálculos y validaciones) en `ordersUtils.js`.
 * - Acceso a datos encapsulado en `ordersService.js` para facilitar futuras Edge Functions / RPC.
 * - El componente solo coordina UI + llamadas a servicio + estado local.
 *
 * Mejoras futuras:
 * - Reemplazar paginación en memoria por consultas con límite y offset.
 * - Añadir exportación (CSV/Excel) y filtros por rango de fechas.
 * - Mostrar historial de cambios de estado (audit trail).
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuthStore } from "../../stores/useAuthStore";
import { STATUS_ALLOWED, LEGACY_STATUS_MAP, calcTotalDisplay, isValidUUID, formatCLP, validateAmounts, allowedStatusOptions, canTransition } from "../../lib/ordersUtils";
import { fetchOrders, migrateLegacyStatuses, createOrder, updateOrder, deleteOrder, sanitizeStatus } from "../../lib/ordersService";

const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  cancelled: "Cancelado"
};
const STATUS_OPTIONS_FULL = STATUS_ALLOWED.map(s => ({ value: s, label: STATUS_LABELS[s] || s }));

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    id: null,
    user_id: "",
    status: "pending",
    subtotal_display: "",
    discount_display: "",
    total_display: "",
    coupon_code: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalStatus, setOriginalStatus] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const navigate = useNavigate();
  const authUser = useAuthStore(state => state.user);

  const currentRole = useMemo(() => {
    if (!authUser) return null;
    const profile = usuarios.find(u => u.user_id === authUser.id);
    return profile?.role || null;
  }, [authUser, usuarios]);
  const isAdmin = currentRole === 'admin';
  const isVendor = currentRole === 'vendedor';

  // Carga de perfiles para mostrar display_name y role
  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profile")
        .select("user_id, display_name, role")
        .order("display_name");
      if (error) throw error;
      setUsuarios(data || []);
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  // Carga de pedidos + migración de estados legacy
  const fetchPedidos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      let rows = await fetchOrders();
      rows = await migrateLegacyStatuses(rows);
      setPedidos(rows);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchPedidos();
  }, []);
  useEffect(() => {
    if (currentRole === 'cliente') navigate('/');
  }, [currentRole, navigate]);

  // Derivado: aplica filtros y prepara subconjunto paginado
  const filteredPedidos = useMemo(() => {
    let rows = pedidos;
    if (statusFilter) rows = rows.filter(r => r.status === statusFilter);
    if (userFilter) rows = rows.filter(r => r.user_id.toLowerCase().includes(userFilter.toLowerCase()));
    return rows;
  }, [pedidos, statusFilter, userFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredPedidos.length / pageSize));
  const pagePedidos = filteredPedidos.slice((page - 1) * pageSize, page * pageSize);

  // Manejo de cambios en inputs; recalcula total al cambiar subtotal/discount
  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = { ...form, [name]: value };
    if (name === "subtotal_display" || name === "discount_display") {
      next.total_display = calcTotalDisplay(
        name === "subtotal_display" ? value : form.subtotal_display,
        name === "discount_display" ? value : form.discount_display
      );
    }
    setForm(next);
  };
  const resetForm = () => {
    setIsEditing(false);
    setOriginalStatus(null);
    setForm({
      id: null,
      user_id: "",
      status: "pending",
      subtotal_display: "",
      discount_display: "",
      total_display: "",
      coupon_code: ""
    });
  };
  // Crear o actualizar pedido con validaciones previas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!isValidUUID(form.user_id)) {
      setErrorMsg("Selecciona un usuario válido.");
      return;
    }
    const v = validateAmounts(form.subtotal_display, form.discount_display);
    if (!v.ok) { setErrorMsg(v.message); return; }
    if (isEditing && originalStatus && !canTransition(originalStatus, form.status)) {
      setErrorMsg(`Cambio de estado ${originalStatus} -> ${form.status} no permitido.`);
      return;
    }
    const finalStatus = sanitizeStatus(form.status);
    const payload = {
      user_id: form.user_id,
      status: finalStatus,
      subtotal_cents: Math.round(Number(form.subtotal_display || 0)),
      discount_cents: Math.round(Number(form.discount_display || 0)),
      total_cents: Math.round(Number(form.total_display || 0)),
      coupon_code: form.coupon_code || null
    };
    try {
      if (isEditing) await updateOrder(form.id, payload); else await createOrder(payload);
      resetForm();
      fetchPedidos();
    } catch (e) {
      setErrorMsg(`Error guardando pedido: ${e.message}`);
    }
  };
  // Activa modo edición y guarda estado original para validar transición
  const handleEdit = (o) => {
    if (!isAdmin) return;
    setIsEditing(true);
    const normalized = LEGACY_STATUS_MAP[o.status] || o.status;
    setOriginalStatus(normalized);
    setForm({
      id: o.id,
      user_id: o.user_id,
      status: normalized,
      subtotal_display: String(o.subtotal_cents || 0),
      discount_display: String(o.discount_cents || 0),
      total_display: String(o.total_cents || 0),
      coupon_code: o.coupon_code || ""
    });
  };
  // Elimina pedido (solo admin) tras confirmación
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("¿Eliminar pedido?")) return;
    try { await deleteOrder(id); fetchPedidos(); } catch (e) { setErrorMsg(e.message); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">Pedidos</h3>
        {isAdmin && (
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={resetForm} disabled={!isEditing}>Nuevo</button>
        )}
      </div>
      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white"><strong>Listado</strong></div>
            <div className="table-responsive" style={{ maxHeight: "520px" }}>
              <table className="table table-sm table-hover mb-0">
                <thead className="table-light position-sticky top-0">
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Subtotal</th>
                    <th>Descuento</th>
                    <th>Total</th>
                    <th>Cupon</th>
                    <th style={{ width: "130px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={8} className="text-center py-4">Cargando…</td></tr>
                  )}
                  {!loading && pagePedidos.map(o => (
                    <tr key={o.id} className={isEditing && form.id === o.id ? "table-warning" : ""}>
                      <td>{o.id}</td>
                      <td className="small text-truncate" style={{ maxWidth: "140px" }}>{o.user_id}</td>
                      <td><span className="badge bg-info text-dark">{STATUS_LABELS[o.status] || o.status}</span></td>
                      <td>{formatCLP(o.subtotal_cents)}</td>
                      <td>{formatCLP(o.discount_cents)}</td>
                      <td>{formatCLP(o.total_cents)}</td>
                      <td className="small">{o.coupon_code || "-"}</td>
                      <td>
                        {isAdmin && (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-warning" onClick={() => handleEdit(o)}>Editar</button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(o.id)}>Borrar</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loading && pagePedidos.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-4 text-muted">Sin pedidos</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-white p-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <input className="form-control form-control-sm" placeholder="Filtrar usuario UUID" value={userFilter} onChange={e => { setUserFilter(e.target.value); setPage(1); }} style={{ maxWidth: '180px' }} />
                <select className="form-select form-select-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ maxWidth: '150px' }}>
                  <option value="">Todos estados</option>
                  {STATUS_OPTIONS_FULL.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="ms-auto d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>«</button>
                  <span className="small">Página {page} / {totalPages}</span>
                  <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>»</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isAdmin && (
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <strong>{isEditing ? `Editar #${form.id}` : "Nuevo Pedido"}</strong>
              {isEditing && (
                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={resetForm}>Cancelar</button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Usuario</label>
                  <select name="user_id" className="form-select" value={form.user_id} onChange={handleChange} required>
                    <option value="">Seleccione…</option>
                    {usuarios.map(u => (
                      <option key={u.user_id} value={u.user_id}>{u.display_name || "(sin nombre)"} — {u.user_id}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Estado</label>
                  <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                    {(isEditing ? allowedStatusOptions(originalStatus) : STATUS_ALLOWED).map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Subtotal (CLP)</label>
                  <input name="subtotal_display" type="number" min="0" className="form-control" value={form.subtotal_display} onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Descuento (CLP)</label>
                  <input name="discount_display" type="number" min="0" className="form-control" value={form.discount_display} onChange={handleChange} />
                </div>
                <div className="col-6">
                  <label className="form-label">Total (auto)</label>
                  <input name="total_display" type="number" className="form-control" value={form.total_display} readOnly />
                </div>
                <div className="col-6">
                  <label className="form-label">Cupón</label>
                  <input name="coupon_code" className="form-control" value={form.coupon_code} onChange={handleChange} placeholder="Opcional" />
                </div>
                <div className="col-12 d-grid">
                  <button type="submit" className="btn btn-primary" disabled={!!validateAmounts(form.subtotal_display, form.discount_display).message}>{isEditing ? "Guardar Cambios" : "Crear Pedido"}</button>
                </div>
              </form>
              {(!isValidUUID(form.user_id) && form.user_id !== "") && (<div className="alert alert-warning mt-3 p-2 mb-0">UUID inválido: selecciona de la lista.</div>)}
              {validateAmounts(form.subtotal_display, form.discount_display).message && (<div className="alert alert-warning mt-3 p-2 mb-0">{validateAmounts(form.subtotal_display, form.discount_display).message}</div>)}
              {errorMsg && (<div className="alert alert-danger mt-3 p-2 mb-0">{errorMsg}</div>)}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default AdminPedidos;