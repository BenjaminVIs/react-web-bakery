import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importa todas las imágenes igual que en Productos.jsx
import p1 from "../assets/img/p1.png";
import p2 from "../assets/img/p2.png";
import p3 from "../assets/img/p3.png";
import p4 from "../assets/img/p4.png";
import p5 from "../assets/img/p5.png";
import p6 from "../assets/img/p6.png";
import p7 from "../assets/img/p7.png";
import p8 from "../assets/img/p8.png";
import p9 from "../assets/img/p9.png";
import p10 from "../assets/img/p10.png";
import p11 from "../assets/img/p11.png";
import p12 from "../assets/img/p12.png";
import p13 from "../assets/img/p13.png";
import p14 from "../assets/img/p14.png";
import p15 from "../assets/img/p15.png";
import p16 from "../assets/img/p16.png";

function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cantidadRef = useRef(null);

  const productos = [
    { id: 1, img: p1, name: "Torta Mil Hojas", price: "$15.990", desc: "Deliciosa torta tradicional con capas crujientes y relleno de manjar artesanal." },
    { id: 2, img: p2, name: "Torta Dos Mil Hojas", price: "$18.990", desc: "Versión premium con doble capa de masa fina y manjar casero." },
    { id: 3, img: p3, name: "Torta de Panqueques", price: "$14.990", desc: "Suaves panqueques rellenos de crema y manjar, perfectos para cualquier ocasión." },
    { id: 4, img: p4, name: "Torta Chocolate Suprema", price: "$16.990", desc: "Exquisita torta de chocolate con relleno cremoso y cobertura intensa." },
    { id: 5, img: p5, name: "Torta Selva Negra", price: "$17.990", desc: "Clásica torta alemana con cerezas, crema y bizcocho de chocolate." },
    { id: 6, img: p6, name: "Torta Merengue Lúcuma", price: "$19.990", desc: "Postre chileno icónico con lúcuma natural y merengue crujiente." },
    { id: 7, img: p7, name: "Torta Atardecer Púrpura", price: "$16.490", desc: "Torta artesanal de frutos rojos con crema y bizcocho de vainilla." },
    { id: 8, img: p8, name: "Torta Sueño de Verano", price: "$16.990", desc: "Refrescante torta con relleno de frutas tropicales y crema ligera." },
    { id: 9, img: p9, name: "Galletas de Mantequilla", price: "$5.990", desc: "Crujientes y doradas galletas caseras con el auténtico sabor a mantequilla." },
    { id: 10, img: p10, name: "Pastel de Bodas", price: "$49.990", desc: "Elegante pastel de varios pisos, ideal para celebraciones especiales." },
    { id: 11, img: p11, name: "Torta de Manjar Nuez", price: "$18.490", desc: "Delicada combinación de manjar, nueces y bizcocho húmedo." },
    { id: 12, img: p12, name: "Torta Cuadrada Chocolate y Avena", price: "$15.490", desc: "Torta saludable con mezcla de cacao puro y avena integral." },
    { id: 13, img: p13, name: "Mousse de Chocolate", price: "$12.990", desc: "Postre suave y cremoso de chocolate con textura aireada irresistible." },
    { id: 14, img: p14, name: "Galletas Veganas de Avena", price: "$6.490", desc: "Hechas sin ingredientes de origen animal, con avena y miel natural." },
    { id: 15, img: p15, name: "Pan sin gluten", price: "$4.990", desc: "Pan artesanal libre de gluten, ideal para una dieta saludable." },
    { id: 16, img: p16, name: "Empanada de Manzana", price: "$3.990", desc: "Clásico postre relleno de manzana caramelizada con toque de canela." },
  ];

  const producto = productos.find((p) => p.id === parseInt(id));

  if (!producto) {
    return (
      <main style={{ textAlign: "center", padding: "50px" }}>
        <h2>Producto no encontrado</h2>
      </main>
    );
  }

  // Función para agregar al carrito
  const addToCart = () => {
    // Obtener la cantidad desde el input
    const cantidad = parseInt(cantidadRef.current.value) || 1;
    
    // Convertir precio de string a número
    const precioSinSimbolo = producto.price.replace("$", "").replace(".", "");
    const precioNumerico = parseInt(precioSinSimbolo);
    
    // Crear objeto para el carrito
    const itemCarrito = {
      id: producto.id,
      nombre: producto.name,
      precio: precioNumerico,
      imagen: producto.img,
      cantidad: cantidad
    };
    
    // Obtener carrito actual de localStorage o iniciar uno nuevo
    const carritoActual = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carritoActual.findIndex(item => item.id === producto.id);
    
    if (productoExistente >= 0) {
      // Si existe, sumar cantidad
      carritoActual[productoExistente].cantidad += cantidad;
    } else {
      // Si no existe, agregar al carrito
      carritoActual.push(itemCarrito);
    }
    
    // Guardar carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(carritoActual));
    
    // Mostrar mensaje de confirmación
    alert(`¡${cantidad} ${cantidad > 1 ? 'unidades' : 'unidad'} de ${producto.name} ${cantidad > 1 ? 'añadidas' : 'añadida'} al carrito!`);
    
    // Redirigir al carrito
    navigate('/carrito');
  };

  return (
    <main className="producto">
      <div className="imagenes">
        <img
          id="imagenPrincipal"
          src={producto.img}
          alt={producto.name}
        />
      </div>
      <div className="info">
        <h1 id="nombreProducto">{producto.name}</h1>
        <span id="precio">{producto.price}</span>
        <p id="descripcion">{producto.desc}</p>

        <div className="cantidad-container">
          <label htmlFor="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" defaultValue="1" min="1" ref={cantidadRef} />
            <button className="button" id="addCart" onClick={addToCart}>
              Añadir al carrito
            </button>
        </div>

      </div>
    </main>
  );
}

export default Detalle;