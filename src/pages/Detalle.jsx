import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const base = import.meta.env.BASE_URL || "/";

// Resuelve rutas tipo "/img/p1.png" respetando el BASE_URL de Vite
function resolveImagePath(image) {
  if (!image) return "";
  if (/^https?:\/\//.test(image)) return image;
  const path = image.replace(/^\/+/, "");
  return `${base}${path}`;
}

const fmtCLP = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cantidadRef = useRef(null);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id,name,price_cents,image,description,stock,active")
          .eq("id", parseInt(id, 10))
          .single();

        if (error) throw error;
        setProducto(data);
      } catch (err) {
        console.error("Error cargando producto:", err);
        setErrorMsg(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="text-center py-5">
        <h2>Cargando producto...</h2>
      </main>
    );
  }

  if (errorMsg || !producto) {
    return (
      <main className="text-center py-5">
        <h2>Producto no encontrado</h2>
        <p>ID recibido: {id}</p>
        {errorMsg && <p className="text-danger">{errorMsg}</p>}
      </main>
    );
  }

  const addToCart = () => {
    const cantidad = parseInt(cantidadRef.current.value) || 1;
    
    if (cantidad > producto.stock) {
      alert(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`);
      return;
    }

    const itemCarrito = {
      id: producto.id,
      nombre: producto.name,
      precio: producto.price_cents,
      imagen: resolveImagePath(producto.image),
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
            src={resolveImagePath(producto.image)}
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
            {fmtCLP(producto.price_cents)}
          </span>

          <p id="descripcion" className="mb-4">
            {producto.description || "Sin descripción disponible."}
          </p>

          <p className="text-muted small">
            <strong>Stock disponible:</strong> {producto.stock} unidades
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
