import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Blog from "./pages/Blog";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Detalle from "./pages/Detalle";
import Login from "./pages/Login";
import Nosotros from "./pages/Nosotros";
import Productos from "./pages/Productos";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Admin from "./pages/admin";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";

// 🔹 Componente que controla el layout (muestra o no Header/Footer)
function LayoutWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/detalle/:id" element={<Detalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
