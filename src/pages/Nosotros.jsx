import React from "react";

const base = import.meta.env.BASE_URL || "/";

function Nosotros() {
  return (
    <main>
      <center>
        <img
          src={`${base}img/icono.png`}
          alt="Imagen de la pastelería"
          width="180"
          height="180"
          style={{ marginTop: "20px" }}
        />
        <h1 style={{ color: "#5D4037" }}>Nosotros</h1>
      </center>

      <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <section className="info-box">

          {/* SOBRE LA EMPRESA */}
          <div className="info-section">
            <h2>Sobre la empresa</h2>
            <p>
              Pastelería Mil Sabores celebra más de 50 años endulzando a Chile con tortas y 
              productos de repostería de alta calidad. Reconocida por su participación en un 
              récord Guinness, la empresa combina tradición e innovación para ofrecer 
              experiencias memorables a sus clientes.
            </p>
          </div>

          {/* HISTORIA Y LOGROS */}
          <div className="info-section">
            <h2>Historia y logros</h2>
            <p>
              Desde 1995, cuando ayudaron a crear la torta más grande del mundo, la pastelería 
              se ha consolidado como un referente nacional. Su compromiso con la creatividad y 
              la excelencia se refleja en cada producto que ofrecen, manteniendo vivas sus 
              raíces históricas.
            </p>
          </div>

          {/* LA PÁGINA WEB */}
          <div className="info-section">
            <h2>La página web</h2>
            <p>
              La página web busca acercar los productos de Pastelería Mil Sabores a todos los 
              clientes, ofreciendo una experiencia de compra moderna, intuitiva y accesible, 
              donde cada torta o dulce se pueda descubrir y adquirir de manera sencilla.
            </p>
          </div>

          {/* VISIÓN */}
          <div className="info-section">
            <h2>Visión</h2>
            <p>
              La plataforma refleja la visión de la empresa: ser la tienda online líder de 
              repostería en Chile, destacando por su innovación, calidad y responsabilidad 
              social. También busca inspirar a nuevos talentos en gastronomía y fomentar la 
              creatividad en la comunidad.
            </p>
          </div>

          {/* DESARROLLADORES */}
          <div className="info-section">
            <h2>Desarrolladores</h2>
            <p>
              Este sitio web fue desarrollado por un equipo comprometido en crear una 
              experiencia amigable y funcional. Los desarrolladores trabajaron para que 
              cada detalle, desde la presentación de los productos hasta el carrito de 
              compras, sea fácil de usar y refleje la esencia de la pastelería.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}

export default Nosotros;
