import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Valores del constraint orders_status_check: 'pending', 'paid', 'cancelled'
const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "cancelled", label: "Cancelado" }
];

// Map de estados antiguos -> nuevos valores permitidos
const LEGACY_STATUS_MAP = {
  pendiente: "pending",
  en_preparacion: "paid",
  processing: "paid",
  completado: "paid",
  completed: "paid",
  cancelado: "cancelled"
};

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // perfiles
  const [loading, setLoading] = useState(true);
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

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("user_profile")
      .select("user_id, display_name, role")
      .order("display_name");
    if (!error) setUsuarios(data || []);
  };

  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id,user_id,status,subtotal_cents,discount_cents,total_cents,coupon_code,created_at")
      .order("id", { ascending: true });
    if (error) alert(error.message); else {
      // Normaliza estados legacy si aún existen en BD (sin romper UI)
      const legacyRows = (data || []).filter(r => LEGACY_STATUS_MAP[r.status]);
      if (legacyRows.length) {
        // Actualiza cada pedido legacy al nuevo código aceptado
        for (const row of legacyRows) {
          const newCode = LEGACY_STATUS_MAP[row.status];
          try {
            await supabase.from("orders").update({ status: newCode }).eq("id", row.id);
            row.status = newCode; // refleja en la lista tras migrar
          } catch (e) {
            console.error("No se pudo migrar estado pedido", row.id, row.status, e);
          }
        }
      }
      setPedidos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
    fetchPedidos();
  }, []);

  const isValidUUID = (val) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const calcTotalDisplay = (subtotalStr, discountStr) => {
    const subtotal = parseFloat(subtotalStr || "0");
    const discount = parseFloat(discountStr || "0");
    return (subtotal - discount).toFixed(0);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidUUID(form.user_id)) {
      alert("Selecciona un usuario válido.");
      return;
    }
    
    // Asegurar que status es uno de los valores permitidos por el constraint
    const allowedStatuses = ["pending", "paid", "cancelled"];
    const finalStatus = allowedStatuses.includes(form.status) ? form.status : "pending";
    
    const payload = {
      user_id: form.user_id,
      status: finalStatus,
      subtotal_cents: Math.round(Number(form.subtotal_display || 0)),
      discount_cents: Math.round(Number(form.discount_display || 0)),
      total_cents: Math.round(Number(form.total_display || 0)),
      coupon_code: form.coupon_code || null
    };
    
    console.log('[PEDIDOS] Enviando payload:', payload);
    
    let error;
    if (isEditing) {
      ({ error } = await supabase.from("orders").update(payload).eq("id", form.id));
    } else {
      ({ error } = await supabase.from("orders").insert(payload));
    }
    if (error) {
      console.error('[PEDIDOS] insert/update error', { payload, error, details: error.details, hint: error.hint });
      alert("Error creando/guardando pedido: " + error.message + "\nStatus enviado: " + finalStatus + "\nVer consola para más detalles.");
    } else {
      resetForm();
      fetchPedidos();
    }
  };

  const handleEdit = (o) => {
    setIsEditing(true);
    setForm({
      id: o.id,
      user_id: o.user_id,
      status: LEGACY_STATUS_MAP[o.status] || o.status,
      subtotal_display: String(o.subtotal_cents || 0),
      discount_display: String(o.discount_cents || 0),
      total_display: String(o.total_cents || 0),
      coupon_code: o.coupon_code || ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar pedido?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) alert(error.message); else fetchPedidos();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">Pedidos</h3>
        <button
          className="btn btn-outline-primary btn-sm"
          type="button"
          onClick={resetForm}
          disabled={!isEditing}
        >Nuevo</button>
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
                  {pedidos.map(o => (
                    <tr key={o.id} className={isEditing && form.id === o.id ? "table-warning" : ""}>
                      <td>{o.id}</td>
                      <td className="small text-truncate" style={{ maxWidth: "140px" }}>{o.user_id}</td>
                      <td><span className="badge bg-info text-dark">{STATUS_OPTIONS.find(x => x.value === o.status)?.label || o.status}</span></td>
                      <td>{o.subtotal_cents}</td>
                      <td>{o.discount_cents}</td>
                      <td>{o.total_cents}</td>
                      <td className="small">{o.coupon_code || "-"}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-warning" onClick={() => handleEdit(o)}>Editar</button>
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(o.id)}>Borrar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pedidos.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-4 text-muted">Sin pedidos</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
                  <select
                    name="user_id"
                    className="form-select"
                    value={form.user_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione…</option>
                    {usuarios.map(u => (
                      <option key={u.user_id} value={u.user_id}>
                        {u.display_name || "(sin nombre)"} — {u.user_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Estado</label>
                  <select
                    name="status"
                    className="form-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Subtotal (CLP)</label>
                  <input
                    name="subtotal_display"
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.subtotal_display}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Descuento (CLP)</label>
                  <input
                    name="discount_display"
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.discount_display}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Total (auto)</label>
                  <input
                    name="total_display"
                    type="number"
                    className="form-control"
                    value={form.total_display}
                    readOnly
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Cupón</label>
                  <input
                    name="coupon_code"
                    className="form-control"
                    value={form.coupon_code}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />
                </div>
                <div className="col-12 d-grid">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Guardar Cambios" : "Crear Pedido"}
                  </button>
                </div>
              </form>
              {!isValidUUID(form.user_id) && form.user_id !== "" && (
                <div className="alert alert-warning mt-3 p-2 mb-0">
                  UUID inválido: selecciona de la lista.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPedidos;