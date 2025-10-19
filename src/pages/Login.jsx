import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/icono.png";
import CenteredLayout from "../components/common/CenteredLayout";

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
    <CenteredLayout maxWidth="400px" bg="light">
      <div className="login-card">
        <div className="logo-section text-center mb-3">
          <img
            src={logo}
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
            ¿No tienes una cuenta?{" "}
            <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </CenteredLayout>
  );
}

export default Login;
