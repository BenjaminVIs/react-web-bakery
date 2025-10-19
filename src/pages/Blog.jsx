import React from "react";
import { Link } from "react-router-dom";
import p1 from "../assets/img/p1.png";
import p2 from "../assets/img/p2.png";

function Blog() {
  const posts = [
    {
      id: 1,
      title: "TUTORIAL: COMO RELLENAR LA MANGA PASTELERA",
      description:
        "Aprende paso a paso cómo rellenar la manga pastelera correctamente para lograr decoraciones perfectas en tus postres. Este tutorial te enseña las técnicas básicas y consejos prácticos para evitar errores comunes y aprovechar al máximo tus ingredientes.",
      image: p1,
    },
    {
      id: 2,
      title: "RECETAS DIVERTIDAS Y BUENAS",
      description:
        "Descubre recetas originales y deliciosas para sorprender a tu familia y amigos. Te mostramos ideas creativas y fáciles de preparar que harán que tus momentos en la cocina sean más divertidos y llenos de sabor.",
      image: p2,
    },
  ];

  return (
    <main className="blog-main">
      <h1 className="blog-title">NOTICIAS IMPORTANTES</h1>

      <div className="blog-container">
        {posts.map((post) => (
          <div key={post.id} className="blog-card">
            <div className="card-text">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <Link to="#" className="button blog-button">
                VER CASO
              </Link>
            </div>
            <div className="card-image">
              <img src={post.image} alt={post.title} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Blog;
