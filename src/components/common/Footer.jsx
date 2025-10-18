import React from 'react';

function Footer() {
  return (
    <footer>
      <h5>Pastelería Mil Sabores</h5>
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <input 
          type="email" 
          placeholder="Ingresa tu correo" 
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", marginRight: "5px" }}
        />
        <button className="button">Suscribirse</button>
      </div>
      <p>&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;
