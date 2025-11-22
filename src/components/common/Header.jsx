import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { supabase } from "../../lib/supabaseClient"; // Para carga perezosa de perfil

const base = import.meta.env.BASE_URL || "/";

function Header() {
  const user = useAuthStore(s => s.user);
  const profile = useAuthStore(s => s.profile);
  const logout = useAuthStore(s => s.logout);
  const setProfile = useAuthStore(s => s.setProfile);
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Cierra el dropdown al navegar a otra ruta
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Carga perezosa del perfil si existe usuario pero no perfil (ej. sesión restaurada del localStorage)
  useEffect(() => {
    if (user && !profile) {
      (async () => {
        try {
          const { data: row, error } = await supabase
            .from('user_profile')
            .select('display_name, role')
            .eq('user_id', user.id)
            .maybeSingle();
          if (!error && row) {
            setProfile({
              display_name: row.display_name,
              role: row.role,
              email: user.email
            });
          } else {
            // Fallback mínimo
            setProfile({
              display_name: user.email?.split('@')[0] || 'Usuario',
              role: 'customer',
              email: user.email
            });
          }
        } catch (e) {
          console.error('Lazy profile fetch error:', e);
          setProfile({
            display_name: user.email?.split('@')[0] || 'Usuario',
            role: 'customer',
            email: user.email
          });
        }
      })();
    }
  }, [user, profile, setProfile]);
  return (
    <header
      id="main-bar"
      className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm"
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">

        {/* LOGO + TÍTULO */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={`${base}img/icono.png`}   // <-- Ahora funciona SIEMPRE
            alt="Logo Pastelería"
            className="me-2"
            style={{ width: "45px", height: "45px" }}
          />
          <h1 id="title" className="m-0">
            Pastelería Mil Sabores
          </h1>
        </Link>

        {/* BOTÓN COLLAPSABLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <nav className="navbar-nav text-center">
            <Link className="nav-link px-3 button" to="/">Home</Link>
            <Link className="nav-link px-3 button" to="/productos">Productos</Link>
            <Link className="nav-link px-3 button" to="/nosotros">Nosotros</Link>
            <Link className="nav-link px-3 button" to="/blog">Blog</Link>
            <Link className="nav-link px-3 button" to="/contacto">Contacto</Link>
          </nav>
        </div>

        {/* CARRITO + PERFIL */}
        <div className="d-none d-lg-flex align-items-center gap-3 position-relative ms-auto">
          <Link className="button" to="/carrito">🛒 Carrito</Link>
          <button
            type="button"
            className="button"
            onClick={() => {
              if (!user) {
                navigate('/login');
              } else {
                setOpen(o => !o);
              }
            }}
            title={user ? 'Perfil' : 'Iniciar sesión'}
            style={{ lineHeight: 1 }}
          >👤</button>
          {open && profile && (
            <div
              className="shadow-sm border bg-white rounded p-2"
              style={{ position: "absolute", top: "100%", right: 0, minWidth: "220px", zIndex: 50 }}
            >
              <div className="small fw-bold mb-1 text-truncate" title={profile.display_name}>{profile.display_name}</div>
              <div className="small text-muted mb-2 text-truncate" title={profile.email}>{profile.email}</div>
              {profile.role === 'admin' && location.pathname !== '/admin' && (
                <div className="alert alert-warning py-1 px-2 mb-2 small">Usuario administrador</div>
              )}
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={async () => { await logout(); setOpen(false); navigate('/'); }}
                >Cerrar sesión</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
