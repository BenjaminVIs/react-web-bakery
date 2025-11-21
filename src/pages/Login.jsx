import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CenteredLayout from "../components/common/CenteredLayout";
import { supabase } from "../lib/supabaseClient";

// BASE_URL para que funcione en GitHub Pages
const base = import.meta.env.BASE_URL || "/";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Alineamos validación con creación en Admin (acepta cualquier dominio válido). Si quieres restringir, vuelve al regex anterior.
  const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo) && correo.length <= 120;
  };

  const validarPassword = (pass) => pass.length >= 4 && pass.length <= 10;

  const adminEmails = [
    "dario.admin@gmail.com",
    "admin@gmail.com",
    "benja.admin@gmail.com"
  ];

  // Asegura que exista un perfil en user_profile tras login
  const ensureProfile = async (user, isAdmin) => {
    try {
      if (!user?.id) return;
      const { data: existing, error: selErr } = await supabase
        .from("user_profile")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (selErr) {
        console.error("Error verificando perfil:", selErr);
        return;
      }
      if (existing) return;
      const display = (user.email || "Usuario").split("@")[0];
      const { error: insErr } = await supabase.from("user_profile").insert({
        user_id: user.id,
        display_name: display,
        role: isAdmin ? "admin" : "customer",
      });
      if (insErr) console.error("Error creando perfil post-login:", insErr);
    } catch (e) {
      console.error("ensureProfile error:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCorreo(correo)) {
      alert("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com.");
      return;
    }

    if (!validarPassword(password)) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    // 🚀 LOGIN EN SUPABASE
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) {
      // Mensaje genérico (se oculta el de confirmación como pidió el usuario)
      alert("Usuario o contraseña incorrectos ❌");
      return;
    }

    const esAdmin = adminEmails.includes(correo.toLowerCase());

    // Crea el perfil si no existe para que aparezca en Admin
    await ensureProfile(data.user, esAdmin);

    if (esAdmin) {
      const modo = window.confirm("¿Deseas entrar como administrador?");
      if (modo) {
        alert(`Bienvenido administrador 🧁`);
        navigate("/admin");
      } else {
        alert(`Inicio de sesión exitoso ✅`);
        navigate("/");
      }
    } else {
      alert(`Inicio de sesión exitoso ✅`);
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
