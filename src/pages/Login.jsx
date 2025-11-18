import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CenteredLayout from "../components/common/CenteredLayout";

// BASE_URL para que funcione en GitHub Pages
const base = import.meta.env.BASE_URL || "/";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo) && correo.length <= 100;
  };

  const validarPassword = (pass) => pass.length >= 4 && pass.length <= 10;

  const adminEmails = [
    "dario.admin@gmail.com",
    "admin@gmail.com",
    "benja.admin@gmail.com"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCorreo(correo)) {
      alert("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com.");
      return;
    }

    if (!validarPassword(password)) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!usuario) {
      alert("Usuario o contraseña incorrectos ❌");
      return;
    }

    const esAdmin = adminEmails.includes(correo.toLowerCase());

    if (esAdmin) {
      const modo = window.confirm("¿Deseas entrar como administrador?");
      if (modo) {
        alert(`Bienvenido administrador ${usuario.nombre} 🧁`);
        navigate("/admin");
      } else {
        alert(`Inicio de sesión exitoso ✅\nBienvenido, ${usuario.nombre}`);
        navigate("/");
      }
    } else {
      alert(`Inicio de sesión exitoso ✅\nBienvenido, ${usuario.nombre}`);
      navigate("/");
    }
  };

  return (
    <CenteredLayout maxWidth="400px" bg="light">
      <div className="login-card">
        <div className="logo-section text-center mb-3">
          <img
            src={`${base}img/icono.png`}
            alt="Logo Pastelería Mil Sabores"
            className="img-fluid mb-3"
            style={{ width: "100px" }}
          />
          <h2>Inicio de sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <button className="button w-100" type="submit">
            Iniciar sesión
          </button>

          <div className="register-link text-center mt-2">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </CenteredLayout>
  );
}

export default Login;
