import { useNavigate } from "react-router-dom";

// 📸 Importa todas tus imágenes aquí
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

function Productos() {
  const navigate = useNavigate();

  const productos = [
    { id: 1, img: p1, name: "Torta Mil Hojas", price: "$15.990" },
    { id: 2, img: p2, name: "Torta Dos Mil Hojas", price: "$18.990" },
    { id: 3, img: p3, name: "Torta de Panqueques", price: "$14.990" },
    { id: 4, img: p4, name: "Torta Chocolate Suprema", price: "$16.990" },
    { id: 5, img: p5, name: "Torta Selva Negra", price: "$17.990" },
    { id: 6, img: p6, name: "Torta Merengue Lucuma", price: "$19.990" },
    { id: 7, img: p7, name: "Torta Atardecer Púrpura", price: "$16.490" },
    { id: 8, img: p8, name: "Torta Sueño de Verano", price: "$16.990" },
    { id: 9, img: p9, name: "Galletas de Mantequilla", price: "$5.990" },
    { id: 10, img: p10, name: "Pastel de Bodas", price: "$49.990" },
    { id: 11, img: p11, name: "Torta de Manjar Nuez", price: "$18.490" },
    { id: 12, img: p12, name: "Torta Cuadrada Chocolate y Avena", price: "$15.490" },
    { id: 13, img: p13, name: "Mousse de Chocolate", price: "$12.990" },
    { id: 14, img: p14, name: "Galletas Veganas de Avena", price: "$6.490" },
    { id: 15, img: p15, name: "Pan sin gluten", price: "$4.990" },
    { id: 16, img: p16, name: "Empanada de Manzana", price: "$3.990" },
  ];

  const handleVerMas = (id) => {
    navigate(`/detalle-producto/${id}`);
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
