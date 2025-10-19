import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header id="main-bar">
      <h1 id="title">Pastelería Mil Sabores</h1>
      <nav>
        <Link className="button" to="/">Home</Link> {" "}
        <Link className="button" to="/productos">Productos</Link> {" "}
        <Link className="button" to="/nosotros">Nosotros</Link> {" "}
        <Link className="button" to="/blog">Blog</Link> {" "}
        <Link className="button" to="/contacto">Contacto</Link>
      </nav>
      <Link className="button" to="/carrito">🛒 Carrito</Link>
    </header>
  );
}

export default Header;
