import React from "react";
import logo from "../assets/img/icono.png";

function Contacto() {
  return (
    <main className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <img src={logo} alt="Logo Pastelería Mil Sabores" />
          <h1>Contáctanos</h1>
          <p>Completa el formulario y nos pondremos en contacto contigo.</p>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          <div>
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="full-width">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              placeholder="Escribe tu mensaje aquí..."
              required
            ></textarea>
          </div>

          <button type="submit" className="button">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </main>
  );
}

export default Contacto;
