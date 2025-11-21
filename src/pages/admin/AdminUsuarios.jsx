import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

// CRUD de perfiles de usuario (user_profile).
// NOTA: Crear cuenta auth se hace fuera (signUp o admin.createUser). Aquí sólo perfil.

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  // Añadimos campos para facilitar creación de auth user sin tener que copiar el UUID.
  const [form, setForm] = useState({ user_id: "", display_name: "", role: "", email: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [creatingAuth, setCreatingAuth] = useState(false);
  const [lastGeneratedPass, setLastGeneratedPass] = useState("");
  // Eliminamos estado de confirmación: flujo sin emails.

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_profile")
      .select("*")
      .order("user_id", { ascending: true });
    if (error) alert("Error cargando usuarios: " + error.message); else setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo) && correo.length <= 120;
  };

  const generarPassword = (len = 10) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  const handleAutoCreateAuthUser = async (e) => {
    e.preventDefault();
    if (isEditing) return; // Solo al crear
    if (form.user_id) {
      alert("Ya hay un user_id asignado. Limpia el formulario para crear otro.");
      return;
    }
    if (!validarCorreo(form.email)) {
      alert("Correo inválido.");
      return;
    }
    const pass = form.password || generarPassword();
    setCreatingAuth(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: pass,
      });
      if (error) {
        const msg = String(error.message || '').toLowerCase();
        if (msg.includes('already registered') || msg.includes('user already exists') || msg.includes('already exists')) {
          alert('Ese correo ya está registrado en Auth. Usa otro correo.');
        } else {
          alert("Error creando usuario auth: " + error.message);
        }
        return;
      }
      if (!data?.user?.id) {
        alert("No se obtuvo el ID del usuario. Revisa confirmación de correo.");
        return;
      }
      setForm(f => ({ ...f, user_id: data.user.id }));
      setLastGeneratedPass(pass);
      alert("Auth user creado (sin verificación requerida).\nContraseña: " + pass);
    } catch (err) {
      alert("Fallo inesperado creando usuario auth: " + err.message);
    } finally {
      setCreatingAuth(false);
    }
  };

  // Reenvío eliminado: no se usan correos de confirmación en este modo.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const { error } = await supabase
        .from("user_profile")
        .update({ display_name: form.display_name, role: form.role })
        .eq("user_id", form.user_id);
      if (error) alert(error.message); else { setIsEditing(false); setForm({ user_id: "", display_name: "", role: "", email: "", password: "" }); fetchUsuarios(); }
    } else {
      // Si aún no hay user_id pero sí email, intentamos crear auth primero.
      if (!form.user_id && form.email) {
        alert("Primero pulsa 'Crear Auth + UUID' para generar el usuario.");
        return;
      }
      if (!form.user_id) { alert("Necesitas un user_id (genera automáticamente con el correo)."); return; }
      const { error } = await supabase.from("user_profile").upsert({
        user_id: form.user_id,
        display_name: form.display_name,
        role: form.role || "user"
      }, { onConflict: "user_id" });
      if (error) alert(error.message); else { setForm({ user_id: "", display_name: "", role: "", email: "", password: "" }); fetchUsuarios(); }
    }
  };

  const handleEdit = (u) => { setForm(u); setIsEditing(true); };
  const handleDelete = async (user_id) => {
    if (!window.confirm("¿Eliminar perfil?")) return;
    const { error } = await supabase.from('user_profile').delete().eq('user_id', user_id);
    if (error) {
      alert('Error eliminando perfil: ' + error.message);
    } else {
      alert('Perfil eliminado (usuario auth permanece).');
      fetchUsuarios();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">Usuarios</h3>
        <button
          className="btn btn-outline-primary btn-sm"
          type="button"
          onClick={() => { setIsEditing(false); setForm({ user_id: "", display_name: "", role: "" }); }}
          disabled={!isEditing}
        >Nuevo</button>
      </div>
      {loading ? <div className="text-center py-5"><div className="spinner-border" /></div> : (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white"><strong>Perfiles</strong></div>
              <div className="table-responsive" style={{maxHeight:"520px"}}>
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light position-sticky top-0">
                    <tr><th>User ID</th><th>Nombre</th><th>Rol</th><th style={{width:"130px"}}></th></tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.user_id} className={isEditing && form.user_id === u.user_id ? "table-warning" : ""}>
                        <td className="small text-truncate" style={{maxWidth:"170px"}}>{u.user_id}</td>
                        <td>{u.display_name}</td>
                        <td><span className="badge bg-info text-dark">{u.role}</span></td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button className="btn btn-outline-warning" onClick={() => handleEdit(u)}>Editar</button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(u.user_id)}>Borrar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usuarios.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-4 text-muted">Sin usuarios</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <strong>{isEditing ? `Editar Perfil` : "Nuevo Perfil"}</strong>
                {isEditing && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => { setIsEditing(false); setForm({ user_id: "", display_name: "", role: "" }); }}>Cancelar</button>}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="row g-3">
                  {!isEditing && (
                    <>
                      <div className="col-12">
                        <label className="form-label">Correo (para crear nuevo usuario)</label>
                        <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} placeholder="nuevo@dominio.com" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Password (dejar vacío para generar)</label>
                        <input name="password" type="text" className="form-control" value={form.password} onChange={handleChange} placeholder="autogenerada si vacío" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">User ID (UUID)</label>
                        <div className="input-group">
                          <input name="user_id" className="form-control" value={form.user_id} onChange={handleChange} placeholder="Pulsa crear para autollenar" readOnly={!!form.user_id} />
                          <button className="btn btn-outline-secondary" type="button" onClick={handleAutoCreateAuthUser} disabled={creatingAuth || !form.email || !!form.user_id}>
                            {creatingAuth ? "Creando..." : "Crear Auth + UUID"}
                          </button>
                        </div>
                        {lastGeneratedPass && (
                          <small className="text-muted">Contraseña generada: {lastGeneratedPass}</small>
                        )}
                        {/* Flujo de confirmación deshabilitado */}
                      </div>
                    </>
                  )}
                  <div className="col-12">
                    <label className="form-label">Nombre</label>
                    <input name="display_name" className="form-control" value={form.display_name} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Rol</label>
                    <select name="role" className="form-select" value={form.role} onChange={handleChange} required>
                      <option value="">Selecciona rol</option>
                      <option value="admin">Admin (administrador)</option>
                      <option value="user">User (usuario)</option>
                    </select>
                  </div>
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary">{isEditing ? "Guardar Cambios" : "Crear Perfil"}</button>
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

export default AdminUsuarios;
