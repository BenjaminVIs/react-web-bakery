import React, { useEffect, useState } from "react";

function Carrito() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");

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
    <main className="container-fluid py-4">
      <h2 className="page-title text-center mb-4">
        Mi carrito de compras
      </h2>

      <div className="cart-container row justify-content-center">
        {/* Lista de productos */}
        <div id="cart-items" className="cart-items col-12 col-lg-8 mb-4 mb-lg-0">
          {cart.length === 0 ? (
            <div className="empty-cart text-center py-5">
              Tu carrito está vacío
            </div>
          ) : (
            cart.map((product) => (
              <div
                key={product.id}
                className="cart-item d-flex flex-column flex-sm-row align-items-center justify-content-between"
              >
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="product-image mb-3 mb-sm-0"
                />
                <div className="product-info flex-fill text-center text-sm-start">
                  <h3 className="product-name">{product.nombre}</h3>
                  <p className="product-price mb-2">
                    ${Number(product.precio || 0).toLocaleString()}
                  </p>

                  <div className="quantity-control d-flex justify-content-center justify-content-sm-start align-items-center gap-2">
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

        {/* Resumen del carrito */}
        <aside className="cart-summary col-12 col-lg-3">
          <div className="summary-total d-flex justify-content-between align-items-baseline mb-3">
            <span>
              <strong>TOTAL:</strong>
            </span>
            <span>
              $
              <span id="total-amount">
                {totalCorrecto.toLocaleString()}
              </span>
            </span>
          </div>

          <div className="coupon d-flex flex-column flex-sm-row gap-2 mb-3">
            <input
              type="text"
              id="coupon-code"
              className="form-control"
              placeholder="Ingrese el cupón de descuento"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              id="apply-coupon"
              className="button"
              onClick={applyCoupon}
            >
              APLICAR
            </button>
          </div>

          <button
            id="checkout-button"
            className="button pay-button w-100"
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
