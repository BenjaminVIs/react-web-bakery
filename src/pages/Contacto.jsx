import React from "react";

const base = import.meta.env.BASE_URL || "/";

function Contacto() {
  return (
    <main className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <img
            src={`${base}img/icono.png`}
            alt="Logo Pastelería Mil Sabores"
          />
          <h1>Contáctanos</h1>
          <p>Completa el formulario y nos pondremos en contacto contigo.</p>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="nombre">Nombre Completo</label>
            <input id="nombre" required />
          </div>

          <div>
            <label htmlFor="correo">Correo Electrónico</label>
            <input id="correo" type="email" required />
          </div>

          <div className="full-width">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" required></textarea>
          </div>

          <button type="submit" className="button">Enviar Mensaje</button>
        </form>
      </div>
    </main>
  );
}

export default Contacto;
