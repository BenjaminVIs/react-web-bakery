import React from "react";
import logo from "../assets/img/icono.png";
import CenteredLayout from "../components/common/CenteredLayout";

function Registro() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registro enviado 🎂");
  };

  return (
    <CenteredLayout maxWidth="500px" bg="light">
      <div className="register-card">
        <div className="logo-section text-center mb-3">
          <img
            src={logo}
            alt="Logo Pastelería Mil Sabores"
            className="img-fluid mb-3"
            style={{ width: "100px" }}
          />
          <h2>Registro de usuario</h2>
        </div>

        <form className="register-form d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="correo1">Correo</label>
            <input type="email" id="correo1" className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="correo2">Confirmar correo</label>
            <input type="email" id="correo2" className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input type="password" id="confirm-password" className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input type="tel" id="telefono" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select id="region" className="form-select" required>
              <option value="">-- Selecciona la región --</option>
              <option value="santiago">Región Metropolitana de Santiago</option>
              <option value="araucania">Región de la Araucanía</option>
              <option value="nuble">Región de Ñuble</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comuna">Comuna</label>
            <select id="comuna" className="form-select" required>
              <option value="">-- Selecciona la comuna --</option>
              <option value="limache">Limache</option>
              <option value="lonquen">Lonquén</option>
              <option value="concepcion">Concepción</option>
            </select>
          </div>

          <button type="submit" className="button w-100">
            Registrar
          </button>

          <div className="register-link text-center mt-2">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </form>
      </div>
    </CenteredLayout>
  );
}

export default Registro;
