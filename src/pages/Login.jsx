import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/icono.png";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (correo === "admin@pasteleria.cl" && password === "1234") {
      alert("Inicio de sesión exitoso 🎂");
      navigate("/");
    } else {
      alert("Credenciales incorrectas ❌");
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <img src={logo} alt="Logo Pastelería Mil Sabores" />
          <h2>Inicio de sesión</h2>
        </div>


        <form onSubmit={handleSubmit}>
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="button" type="submit">
            Iniciar sesión
          </button>

          <div className="register-link">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
