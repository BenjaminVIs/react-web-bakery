import React from "react";
import { Link } from "react-router-dom";

const base = import.meta.env.BASE_URL || "/";

function Header() {
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

        {/* CARRITO */}
        <div className="d-none d-lg-block">
          <Link className="button" to="/carrito">🛒 Carrito</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
