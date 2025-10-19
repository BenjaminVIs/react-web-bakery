import { Link } from "react-router-dom";
import icono from "../assets/img/icono.png";
import p1 from "../assets/img/p1.png";
import p2 from "../assets/img/p2.png";
import p3 from "../assets/img/p3.png";
import p4 from "../assets/img/p4.png";
import p5 from "../assets/img/p5.png";
import p6 from "../assets/img/p6.png";
import p7 from "../assets/img/p7.png";
import p8 from "../assets/img/p8.png";

function Home() {
  return (
    <main className="container-fluid py-4">
      {/* Botones de inicio de sesión */}
      <div className="text-end mb-3 px-3">
        <Link to="/login" className="button me-2">
          Iniciar sesión
        </Link>
        <Link to="/registro" className="button">
          Registrarse
        </Link>
      </div>

      {/* Banner de introducción */}
      <section id="intro" className="text-center mb-5">
        <div className="banner-container mx-auto">
          <h1 className="mb-4">Pastelería Mil Sabores</h1>

          {/* Layout original restaurado: texto a la izquierda, imagen a la derecha */}
          <div className="desc-imagen d-flex flex-wrap align-items-center justify-content-between p-3 rounded">
            <div id="description" className="col-12 col-md-7 text-start">
              <p className="lead mb-0">
                Pastelería 1000 Sabores, celebrando 50 años como ícono de la
                repostería chilena y conocida por nuestro récord Guinness en
                1995, renovamos nuestra tienda online para ofrecer una
                experiencia de compra fácil y moderna. Ahora puedes explorar
                nuestro catálogo de tortas y pasteles exclusivos, conocer
                nuestras promociones especiales y realizar tus pedidos desde
                cualquier lugar, con la comodidad de recibirlos en tu hogar.
                Nuestro compromiso es seguir entregando calidad, sabor y
                tradición en cada producto, adaptándonos a tus necesidades y
                preferencias. ¡Descubre todo lo que Pastelería Mil Sabores tiene
                para ti!
              </p>
            </div>

            <div className="col-12 col-md-4 text-center mt-4 mt-md-0">
              <img
                src={icono}
                alt="icono"
                className="img-fluid rounded shadow-sm"
                style={{ maxWidth: "220px" }}
              />
            </div>
          </div>

          <div className="mt-4">
            <Link to="/productos" className="button">
              Ver Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Galería de productos destacados */}
      <section className="container">
        <div className="row g-4 justify-content-center">
          {[
            { img: p1, name: "Torta Mil Hojas", price: "$15.990" },
            { img: p2, name: "Torta Dos Mil Hojas", price: "$18.990" },
            { img: p3, name: "Torta de Panqueques", price: "$14.990" },
            { img: p4, name: "Torta Chocolate Suprema", price: "$16.990" },
            { img: p5, name: "Torta Selva Negra", price: "$17.990" },
            { img: p6, name: "Torta Merengue Lúcuma", price: "$19.990" },
            { img: p7, name: "Torta Atardecer Púrpura", price: "$16.490" },
            { img: p8, name: "Torta Sueño de Verano", price: "$16.990" },
          ].map((producto, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100">
                <div className="image-placeholder text-center">
                  <img
                    src={producto.img}
                    width="250"
                    height="250"
                    alt={producto.name}
                    className="img-fluid rounded"
                  />
                </div>
                <a href="#producto">{producto.name}</a>
                <div className="price">{producto.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
