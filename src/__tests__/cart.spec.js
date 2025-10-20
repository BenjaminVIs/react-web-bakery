describe("Lógica del carrito de compras", function () {
  beforeEach(function () {
    const carrito = [
      { id: 1, nombre: "Torta de Chocolate", precio: 5000, cantidad: 1 },
      { id: 2, nombre: "Cupcake", precio: 2000, cantidad: 2 },
    ];
    localStorage.setItem("cart", JSON.stringify(carrito));
  });

  afterEach(function () {
    localStorage.clear();
  });

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function calcularTotal(cart) {
    return cart.reduce(
      (acc, p) => acc + p.precio * (p.cantidad || 1),
      0
    );
  }

  it("calcula el total correctamente", function () {
    const cart = getCart();
    expect(calcularTotal(cart)).toBe(5000 + 2000 * 2);
  });

  it("aumenta correctamente la cantidad de un producto", function () {
    const cart = getCart();
    cart[0].cantidad += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    const nuevo = getCart();
    expect(nuevo[0].cantidad).toBe(2);
  });

  it("disminuye correctamente la cantidad sin eliminar producto", function () {
    const cart = getCart();
    cart[1].cantidad -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    const nuevo = getCart();
    expect(nuevo[1].cantidad).toBe(1);
  });
});
