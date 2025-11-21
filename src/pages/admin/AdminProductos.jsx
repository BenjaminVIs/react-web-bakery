import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// CRUD productos basado en esquema real:
// id, name, price_cents, image, description, stock, active, created_at, updated_at
// NOTA: En tu tabla los valores de price_cents ya representan el precio final en pesos (ej: 15990),
// no están en centavos. Así que mostramos y guardamos tal cual, sin dividir ni multiplicar por 100.

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price_display: "", // precio mostrado (decimal string)
    image: "",
    description: "",
    stock: "",
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,name,price_cents,image,description,stock,active,created_at")
      .order("id", { ascending: true });
    if (error) alert(error.message); else setProductos(data);
    setLoading(false);
  };
  useEffect(() => { fetchProductos(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setForm({ id: null, name: "", price_display: "", image: "", description: "", stock: "", active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price_cents = Math.round(parseFloat(form.price_display || "0"));
    const payload = {
      name: form.name,
      price_cents,
      image: form.image || null,
      description: form.description || null,
      stock: Number(form.stock || 0),
      active: form.active
    };
    if (isEditing) {
      const { error } = await supabase.from("products").update(payload).eq("id", form.id);
      if (error) alert(error.message); else { resetForm(); fetchProductos(); }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) alert(error.message); else { resetForm(); fetchProductos(); }
    }
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setForm({
      id: p.id,
      name: p.name || "",
      price_display: p.price_cents != null ? String(p.price_cents) : "",
      image: p.image || "",
      description: p.description || "",
      stock: p.stock != null ? String(p.stock) : "",
      active: !!p.active
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message); else fetchProductos();
  };

  const formatPrice = (amount) => (amount || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">Productos</h3>
        <button
          className="btn btn-outline-primary btn-sm"
          type="button"
          onClick={() => { resetForm(); setIsEditing(false); }}
          disabled={!isEditing}
        >Nuevo</button>
      </div>
      {loading ? <div className="text-center py-5"><div className="spinner-border" role="status" /></div> : (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white"><strong>Listado</strong></div>
              <div className="table-responsive" style={{maxHeight:"520px"}}>
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light position-sticky top-0">
                    <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Activo</th><th style={{width:"140px"}}>Imagen</th><th style={{width:"130px"}}></th></tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id} className={isEditing && form.id === p.id ? "table-warning" : ""}>
                        <td>{p.id}</td>
                        <td className="text-truncate" style={{maxWidth:"160px"}}>{p.name}</td>
                        <td>{formatPrice(p.price_cents || 0)}</td>
                        <td>{p.stock}</td>
                        <td>{p.active ? <span className="badge bg-success">Sí</span> : <span className="badge bg-secondary">No</span>}</td>
                        <td className="small text-muted text-truncate" style={{maxWidth:"140px"}}>{p.image}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button className="btn btn-outline-warning" onClick={() => handleEdit(p)}>Editar</button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(p.id)}>Borrar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-4 text-muted">Sin productos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-5">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <strong>{isEditing ? `Editar #${form.id}` : "Nuevo Producto"}</strong>
                {isEditing && (
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={resetForm}>Cancelar</button>
                )}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nombre</label>
                    <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Precio (CLP)</label>
                    <input name="price_display" type="number" min="0" step="1" className="form-control" value={form.price_display} onChange={handleChange} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Stock</label>
                    <input name="stock" type="number" min="0" className="form-control" value={form.stock} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">URL Imagen</label>
                    <div className="input-group">
                      <span className="input-group-text">/img/</span>
                      <input name="image" className="form-control" value={form.image.replace(/^\/img\//,'')} onChange={(e)=>handleChange({target:{name:'image', value:'/img/'+e.target.value, type:'text'}})} placeholder="p1.png" />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input name="active" type="checkbox" className="form-check-input" checked={form.active} onChange={handleChange} />
                      <label className="form-check-label">Activo</label>
                    </div>
                  </div>
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary">
                      {isEditing ? "Guardar Cambios" : "Crear Producto"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
