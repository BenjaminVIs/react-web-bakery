import { useNavigate } from "react-router-dom";
import productosData from "../assets/productos.json";

function Productos() {
  const navigate = useNavigate();

  const productos = productosData.map((p) => ({
  ...p,
  img: new URL(`../assets/img/${p.img}`, import.meta.url).href,
}));

  const handleVerMas = (id) => {
    navigate(`/detalle/${id}`);
  };

  return (
    <main>
      <center><h1 style={{ color: "#5D4037"}} id="title-productos">Todos los Productos</h1></center>
      <div className="container">
        {productos.map((producto) => (
          <div key={producto.id} className="card">
            <div className="image-placeholder">
              <img
                src={producto.img}
                width="250"
                height="250"
                alt={producto.name}
              />
            </div>
            <a href="#producto">{producto.name}</a>
            <div className="price">{producto.price}</div>
            <button
              className="button ver-mas"
              onClick={() => handleVerMas(producto.id)}
            >
              Ver más
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Productos;
