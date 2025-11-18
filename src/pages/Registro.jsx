import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredLayout from "../components/common/CenteredLayout";

// BASE_URL para GitHub Pages
const base = import.meta.env.BASE_URL || "/";

function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    correo1: "",
    correo2: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    region: "",
    comuna: "",
  });

  const navigate = useNavigate();

  const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo) && correo.length <= 100;
  };

  const validarPassword = (pass) => pass.length >= 4 && pass.length <= 10;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      nombre,
      correo1,
      correo2,
      password,
      confirmPassword,
      telefono,
      region,
      comuna,
    } = form;

    if (nombre === "" || nombre.length > 100) {
      alert("Nombre requerido (máx. 100 caracteres).");
      return;
    }

    if (!validarCorreo(correo1)) {
      alert("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com.");
      return;
    }

    if (correo1 !== correo2) {
      alert("Los correos no coinciden.");
      return;
    }

    if (!validarPassword(password)) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (region === "" || comuna === "") {
      alert("Debes seleccionar una región y una comuna.");
      return;
    }

    const nuevoUsuario = {
      nombre,
      correo: correo1,
      password,
      telefono,
      region,
      comuna,
    };

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find((u) => u.correo === correo1);

    if (existe) {
      alert("Este correo ya está registrado.");
      return;
    }

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente ✅");
    navigate("/login");
  };

  return (
    <CenteredLayout maxWidth="500px" bg="light">
      <div className="register-card">
        <div className="logo-section text-center mb-3">
          <img
            src={`${base}img/icono.png`}
            alt="Logo Pastelería Mil Sabores"
            className="img-fluid mb-3"
            style={{ width: "100px" }}
          />
          <h2>Registro de usuario</h2>
        </div>

        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo1">Correo</label>
            <input
              type="email"
              id="correo1"
              value={form.correo1}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo2">Confirmar correo</label>
            <input
              type="email"
              id="correo2"
              value={form.correo2}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              type="tel"
              id="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select
              id="region"
              value={form.region}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Selecciona la región --</option>
              <option value="santiago">Región Metropolitana de Santiago</option>
              <option value="araucania">Región de la Araucanía</option>
              <option value="nuble">Región de Ñuble</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comuna">Comuna</label>
            <select
              id="comuna"
              value={form.comuna}
              onChange={handleChange}
              className="form-select"
              required
            >
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
