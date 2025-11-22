/**
 * Administración de productos.
 *
 * Esquema base:
 * id, name, price_cents, image, description, stock, active, created_at, updated_at
 *
 * Notas importantes:
 * - `price_cents` en esta base de datos representa el precio final (no centavos reales),
 *   por eso no se hace conversión (se guarda el número tal cual ingresado).
 * - Se normaliza la ruta de imagen para anteponer `/img/` si el usuario ingresa sólo el nombre.
 * - El formulario funciona en modo creación y edición controlado con `isEditing`.
 * - Las operaciones CRUD se realizan directamente sobre Supabase sin capa de servicio todavía.
 *
 * Mejoras futuras:
 * - Extraer lógica a `productsService.js` (similar a pedidos).
 * - Añadir paginación y filtros (stock, activo, rango de precio).
 * - Validaciones adicionales (stock máximo, nombre único, longitud descripción).
 */
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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

  // Carga inicial / recarga de productos
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

  // Manejo de inputs controlados (incluye checkbox de activo)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Reinicia el formulario a estado inicial (modo creación)
  const resetForm = () => {
    setIsEditing(false);
    setForm({ id: null, name: "", price_display: "", image: "", description: "", stock: "", active: true });
  };

  // Submit: inserta o actualiza producto según `isEditing`
  const handleSubmit = async (e) => {
    e.preventDefault();
    const price_cents = Math.round(parseFloat(form.price_display || "0"));
    
    // Normalizar ruta de imagen: si no empieza con /img/, agregarlo
    let imagePath = (form.image || "").trim();
    if (imagePath && !imagePath.startsWith("/img/") && !imagePath.startsWith("http")) {
      imagePath = `/img/${imagePath}`;
    }
    
    const payload = {
      name: form.name,
      price_cents,
      image: imagePath || null,
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

  // Activa modo edición con datos existentes
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

  // Elimina un producto tras confirmación
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message); else fetchProductos();
  };

  // Formato de precio CLP sin decimales
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
                    <input 
                      name="image" 
                      className="form-control" 
                      value={form.image} 
                      onChange={handleChange} 
                      placeholder="/img/p1.png o nombre-archivo.png" 
                    />
                    <small className="text-muted">Usa ruta completa (/img/archivo.png) o solo el nombre (se agregará /img/ automático)</small>
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
