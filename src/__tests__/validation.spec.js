describe("Validación de correo", function () {
  function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo) && correo.length <= 100;
  }

  it("acepta dominios válidos", function () {
    expect(validarCorreo("test@duoc.cl")).toBeTrue();
    expect(validarCorreo("alguien@gmail.com")).toBeTrue();
  });

  it("rechaza dominios inválidos", function () {
    expect(validarCorreo("mal@hacker.com")).toBeFalse();
  });
});
