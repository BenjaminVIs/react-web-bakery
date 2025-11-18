import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const base = import.meta.env.BASE_URL || "/";

function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cantidadRef = useRef(null);

  const productos = [
    { id: 1, img: `${base}img/p1.png`, name: "Torta Mil Hojas", price: "$15.990", desc: "Deliciosa torta tradicional ..." },
    { id: 2, img: `${base}img/p2.png`, name: "Torta Dos Mil Hojas", price: "$18.990", desc: "Versión premium..." },
    { id: 3, img: `${base}img/p3.png`, name: "Torta de Panqueques", price: "$14.990", desc: "Suaves panqueques..." },
    { id: 4, img: `${base}img/p4.png`, name: "Torta Chocolate Suprema", price: "$16.990", desc: "Exquisita torta..." },
    { id: 5, img: `${base}img/p5.png`, name: "Torta Selva Negra", price: "$17.990", desc: "Clásica torta alemana..." },
    { id: 6, img: `${base}img/p6.png`, name: "Torta Merengue Lúcuma", price: "$19.990", desc: "Postre chileno icónico..." },
    { id: 7, img: `${base}img/p7.png`, name: "Torta Atardecer Púrpura", price: "$16.490", desc: "Torta artesanal..." },
    { id: 8, img: `${base}img/p8.png`, name: "Torta Sueño de Verano", price: "$16.990", desc: "Refrescante torta..." },
    { id: 9, img: `${base}img/p9.png`, name: "Galletas de Mantequilla", price: "$5.990", desc: "Crujientes galletas..." },
    { id: 10, img: `${base}img/p10.png`, name: "Pastel de Bodas", price: "$49.990", desc: "Elegante pastel..." },
    { id: 11, img: `${base}img/p11.png`, name: "Torta de Manjar Nuez", price: "$18.490", desc: "Combinación perfecta..." },
    { id: 12, img: `${base}img/p12.png`, name: "Torta Cuadrada Chocolate y Avena", price: "$15.490", desc: "Torta saludable..." },
    { id: 13, img: `${base}img/p13.png`, name: "Mousse de Chocolate", price: "$12.990", desc: "Postre suave..." },
    { id: 14, img: `${base}img/p14.png`, name: "Galletas Veganas de Avena", price: "$6.490", desc: "Hechas sin ingredientes..." },
    { id: 15, img: `${base}img/p15.png`, name: "Pan sin gluten", price: "$4.990", desc: "Pan artesanal libre..." },
    { id: 16, img: `${base}img/p16.png`, name: "Empanada de Manzana", price: "$3.990", desc: "Clásico postre..." },
  ];

  const producto = productos.find((p) => p.id === parseInt(id, 10));

  if (!producto) {
    return (
      <main className="text-center py-5">
        <h2>Producto no encontrado</h2>
        <p>ID recibido: {id}</p>
      </main>
    );
  }

  const addToCart = () => {
    const cantidad = parseInt(cantidadRef.current.value) || 1;
    const precioSinSimbolo = producto.price.replace("$", "").replace(".", "");
    const precioNumerico = parseInt(precioSinSimbolo);

    const itemCarrito = {
      id: producto.id,
      nombre: producto.name,
      precio: precioNumerico,
      imagen: producto.img,
      cantidad: cantidad,
    };

    const carritoActual = JSON.parse(localStorage.getItem("cart")) || [];
    const productoExistente = carritoActual.findIndex(
      (item) => item.id === producto.id
    );

    if (productoExistente >= 0) {
      carritoActual[productoExistente].cantidad += cantidad;
    } else {
      carritoActual.push(itemCarrito);
    }

    localStorage.setItem("cart", JSON.stringify(carritoActual));

    alert(
      `¡${cantidad} ${cantidad > 1 ? "unidades" : "unidad"} de ${
        producto.name
      } ${cantidad > 1 ? "añadidas" : "añadida"} al carrito!`
    );

    navigate("/carrito");
  };

  return (
    <main className="producto container py-4">
      <div className="row align-items-start justify-content-center gy-4">
        {/* Imagen del producto */}
        <div className="col-12 col-md-5 text-center">
          <img
            id="imagenPrincipal"
            src={producto.img}
            alt={producto.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxWidth: "80%" }}
          />
        </div>

        {/* Información del producto */}
        <div className="col-12 col-md-6">
          <h1
            id="nombreProducto"
            className="mb-2"
            style={{ color: "#5D4037" }}
          >
            {producto.name}
          </h1>

          <span id="precio" className="d-block mb-3 fw-bold">
            {producto.price}
          </span>

          <p id="descripcion" className="mb-4">
            {producto.desc}
          </p>

          <div className="cantidad-container d-flex align-items-center gap-3">
            <label htmlFor="cantidad" className="fw-semibold">
              Cantidad:
            </label>

            <input
              type="number"
              id="cantidad"
              defaultValue="1"
              min="1"
              ref={cantidadRef}
              className="form-control"
              style={{ width: "80px" }}
            />

            <button className="button" id="addCart" onClick={addToCart}>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Detalle;
