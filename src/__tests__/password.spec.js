describe("Validación de contraseñas", function () {
  function validarPassword(pass) {
    return pass.length >= 4 && pass.length <= 10;
  }

  it("acepta contraseñas dentro del rango válido (4–10 caracteres)", function () {
    expect(validarPassword("abcd")).toBeTrue();
    expect(validarPassword("1234567890")).toBeTrue();
  });

  it("rechaza contraseñas muy cortas", function () {
    expect(validarPassword("abc")).toBeFalse();
  });

  it("rechaza contraseñas demasiado largas", function () {
    expect(validarPassword("12345678901")).toBeFalse();
  });
});
