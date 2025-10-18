import React from "react";
import logo from "../assets/img/icono.png";

function Contacto() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gracias por contactarte con Pastelería Mil Sabores 🍰");
  };

  return (
    <main>
      <center>
        <img
          src={logo}
          alt="Logo de Pastelería Mil Sabores"
          width="180"
          height="180"
          style={{ marginTop: "20px" }}
        />
        <h1 style={{ color: "#5D4037" }}>Contáctanos</h1>
      </center>

      <div className="container" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <section className="login-box">
          <div className="login-header" style={{ textAlign: "center" }}>
            Formulario de Contacto
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="nombre-completo">Nombre Completo</label>
            <input
              type="text"
              id="nombre-completo"
              name="nombre-completo"
              placeholder="Ingresa tu nombre"
              required
            />

            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              required
            />

            <label htmlFor="contenido">Mensaje</label>
            <textarea
              id="contenido"
              name="contenido"
              rows="4"
              placeholder="Escribe tu mensaje aquí..."
              required
            ></textarea>

            <button className="button" type="submit">
              Enviar Mensaje
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Contacto;
