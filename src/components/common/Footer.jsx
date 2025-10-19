import React from "react";

function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <h5 className="mb-3">Pastelería Mil Sabores</h5>

      <div className="d-flex flex-column flex-sm-row justify-content-sm-end align-items-center gap-2 mb-2 px-3">
        <input
          type="email"
          placeholder="Ingresa tu correo"
          className="form-control"
          style={{
            maxWidth: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button className="button">Suscribirse</button>
      </div>

      <p className="m-0 small">&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;
