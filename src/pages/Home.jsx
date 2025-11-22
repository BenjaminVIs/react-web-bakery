import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const base = import.meta.env.BASE_URL || "/";

function Home() {
  const user = useAuthStore(s => s.user);
  const destacados = [
    { img: `${base}img/p1.png`, name: "Torta Mil Hojas", price: "$15.990" },
    { img: `${base}img/p2.png`, name: "Torta Dos Mil Hojas", price: "$18.990" },
    { img: `${base}img/p3.png`, name: "Torta de Panqueques", price: "$14.990" },
    { img: `${base}img/p4.png`, name: "Torta Chocolate Suprema", price: "$16.990" },
    { img: `${base}img/p5.png`, name: "Torta Selva Negra", price: "$17.990" },
    { img: `${base}img/p6.png`, name: "Torta Merengue Lúcuma", price: "$19.990" },
    { img: `${base}img/p7.png`, name: "Torta Atardecer Púrpura", price: "$16.490" },
    { img: `${base}img/p8.png`, name: "Torta Sueño de Verano", price: "$16.990" },
  ];

  return (
    <main className="container-fluid py-4">
      {/* Botones de inicio de sesión (ocultos si hay usuario autenticado) */}
      {!user && (
        <div className="text-end mb-3 px-3">
          <Link to="/login" className="button me-2">Iniciar sesión</Link>
          <Link to="/registro" className="button">Registrarse</Link>
        </div>
      )}

      {/* Banner de introducción */}
      <section id="intro" className="text-center mb-5">
        <div className="banner-container mx-auto">
          <h1 className="mb-4">Pastelería Mil Sabores</h1>

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
                tradición en cada producto. ¡Descubre todo lo que tenemos para ti!
              </p>
            </div>

            <div className="col-12 col-md-4 text-center mt-4 mt-md-0">
              <img
                src={`${base}img/icono.png`}
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
          {destacados.map((producto, i) => (
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
