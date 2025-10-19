import React from 'react'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blog from './pages/Blog';
import Carrito from './pages/Carrito';
import Contacto from './pages/Contacto';
import Detalle from './pages/Detalle';
import Login from './pages/Login';
import Nosotros from './pages/Nosotros';
import Productos from './pages/Productos';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import '/styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
  
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App

