import React from "react";
import logo from "../assets/img/icono.png";

function Registro() {
  return (
    <main className="register-page">
      <div className="register-card">
        <div className="logo-section">
          <img src={logo} alt="Logo Pastelería Mil Sabores" />
        </div>

        <h1>Registro de usuario</h1>

        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" required />
          </div>

          <div>
            <label htmlFor="correo1">Correo</label>
            <input type="email" id="correo1" required />
          </div>

          <div>
            <label htmlFor="correo2">Confirmar correo</label>
            <input type="email" id="correo2" required />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required />
          </div>

          <div>
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input type="password" id="confirm-password" required />
          </div>

          <div>
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input type="tel" id="telefono" />
          </div>

          <div>
            <label htmlFor="region">Región</label>
            <select id="region" required>
              <option value="">-- Selecciona la región --</option>
              <option value="santiago">Región Metropolitana de Santiago</option>
              <option value="araucania">Región de la Araucanía</option>
              <option value="nuble">Región de Ñuble</option>
            </select>
          </div>

          <div>
            <label htmlFor="comuna">Comuna</label>
            <select id="comuna" required>
              <option value="">-- Selecciona la comuna --</option>
              <option value="limache">Limache</option>
              <option value="lonquen">Lonquén</option>
              <option value="concepcion">Concepción</option>
            </select>
          </div>

          <button type="submit" className="button">Registrar</button>

          <div className="register-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Registro;
