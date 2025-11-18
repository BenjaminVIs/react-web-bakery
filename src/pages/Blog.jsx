import React from "react";
import { Link } from "react-router-dom";

const base = import.meta.env.BASE_URL || "/";

function Blog() {
  const posts = [
    {
      id: 1,
      title: "TUTORIAL: COMO RELLENAR LA MANGA PASTELERA",
      description:
        "Aprende paso a paso cómo rellenar la manga pastelera correctamente...",
      image: `${base}img/p1.png`,
    },
    {
      id: 2,
      title: "RECETAS DIVERTIDAS Y BUENAS",
      description:
        "Descubre recetas originales y deliciosas para sorprender...",
      image: `${base}img/p2.png`,
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
