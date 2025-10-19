import React, { useEffect, useState } from "react";

function Carrito() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState(""); // estado para el cupón

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const persist = (nextCart) => {
    localStorage.setItem("cart", JSON.stringify(nextCart));
    setCart(nextCart);
  };

  const increase = (id) => {
    const next = cart.map((p) =>
      p.id === id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
    );
    persist(next);
  };

  const decrease = (id) => {
    const next = cart
      .map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(0, (p.cantidad || 1) - 1) } : p
      )
      .filter((p) => p.cantidad > 0);
    persist(next);
  };

  const changeQty = (id, val) => {
    const n = parseInt(val, 10);
    const qty = Number.isNaN(n) ? 1 : Math.max(1, n);
    const next = cart.map((p) => (p.id === id ? { ...p, cantidad: qty } : p));
    persist(next);
  };

  const totalCorrecto = cart.reduce(
    (acc, p) => acc + Number(p.precio || 0) * Number(p.cantidad || 0),
    0
  );

  // acciones de botones
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      alert("Ingrese un cupón válido");
      return;
    }
    alert(`Cupón "${couponCode}" aplicado (demo).`);
    setCouponCode("");
  };

  const handleCheckout = () => {
    alert(`Procediendo al pago. Total: $${totalCorrecto.toLocaleString()}`);
  };

  return (
    <main>
      <h2 className="page-title">Mi carrito de compras</h2>

      <div className="cart-container">
        <div id="cart-items" className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">Tu carrito está vacío</div>
          ) : (
            cart.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.nombre}</h3>
                  <p className="product-price">
                    ${Number(product.precio || 0).toLocaleString()}
                  </p>

                  <div className="quantity-control">
                    <button
                      className="button decrease"
                      onClick={() => decrease(product.id)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="product-quantity"
                      value={product.cantidad}
                      min="1"
                      onChange={(e) => changeQty(product.id, e.target.value)}
                    />
                    <button
                      className="button increase"
                      onClick={() => increase(product.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="cart-summary">
          <div className="summary-total">
            <span>
              <strong>TOTAL:</strong>
            </span>
            <span>
              $
              <span id="total-amount">{totalCorrecto.toLocaleString()}</span>
            </span>
          </div>

          <div className="coupon">
            <input
              type="text"
              id="coupon-code"
              placeholder="Ingrese el cupón de descuento"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button id="apply-coupon" className="button" onClick={applyCoupon}>
              APLICAR
            </button>
          </div>

          <button
            id="checkout-button"
            className="button pay-button"
            onClick={handleCheckout}
          >
            PAGAR
          </button>
        </aside>
      </div>
    </main>
  );
}

export default Carrito;