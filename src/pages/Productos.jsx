import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Resuelve rutas tipo "/img/p1.png" respetando el BASE_URL de Vite
function resolveImagePath(image) {
  if (!image) return "";
  if (/^https?:\/\//.test(image)) return image;
  const base = import.meta.env.BASE_URL || "/";
  const path = image.replace(/^\/+/, "");
  return `${base}${path}`;
}

const fmtCLP = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id,name,price_cents,image,description,active")
          // .eq("active", true)  // actívalo si quieres filtrar solo activos
          .order("id", { ascending: true });

        console.log("[SB products]", {
          error,
          count: data?.length,
          sample: data?.[0],
        });

        if (error) throw error;
        setProductos(data || []);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setErrorMsg(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleVerMas = (id) => {
    navigate(`/detalle/${id}`);
  };

  // === Estados de carga / error, pero manteniendo el estilo general ===
  if (loading) {
    return (
      <main className="container-fluid py-5 text-center">
        <h2>Cargando productos...</h2>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="container-fluid py-5 text-center">
        <h2>Error al cargar productos</h2>
        <p>{errorMsg}</p>
      </main>
    );
  }

  return (
    <main className="container-fluid py-4">
      <h1
        id="title-productos"
        className="text-center mb-4"
        style={{ color: "#5D4037" }}
      >
        Todos los Productos
      </h1>

      <div className="container">
        {productos.length === 0 ? (
          <div className="text-center py-5">No hay productos disponibles.</div>
        ) : (
          <div className="row g-4 justify-content-center">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
              >
                <div className="card flex-fill text-center p-2">
                  <div className="image-placeholder mb-2">
                    <img
                      src={resolveImagePath(producto.image)}
                      alt={producto.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  </div>
                  <a href="#producto">{producto.name}</a>
                  <div className="price mb-2">
                    {fmtCLP(producto.price_cents)}
                  </div>
                  <button
                    className="button ver-mas w-100"
                    onClick={() => handleVerMas(producto.id)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Productos;
