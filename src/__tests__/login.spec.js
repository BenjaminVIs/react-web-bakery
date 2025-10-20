describe("Flujo de inicio de sesión", function () {
  // Simulamos localStorage antes de cada test
  beforeEach(function () {
    const usuarios = [
      {
        nombre: "Darío Meza",
        correo: "dario.admin@gmail.com",
        password: "1234",
      },
      {
        nombre: "Cliente Test",
        correo: "cliente@gmail.com",
        password: "abcd",
      },
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  });

  afterEach(function () {
    localStorage.clear();
  });

  // Funciones a probar (idénticas a las de Login.jsx)
  function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo) && correo.length <= 100;
  }

  function validarPassword(pass) {
    return pass.length >= 4 && pass.length <= 10;
  }

  function loginUsuario(correo, password) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );
    return usuario ? `Bienvenido, ${usuario.nombre}` : "Usuario o contraseña incorrectos";
  }

  it("inicia sesión correctamente con credenciales válidas", function () {
    const correo = "dario.admin@gmail.com";
    const pass = "1234";
    expect(validarCorreo(correo)).toBeTrue();
    expect(validarPassword(pass)).toBeTrue();
    expect(loginUsuario(correo, pass)).toContain("Bienvenido, Darío");
  });

  it("rechaza inicio de sesión con credenciales inválidas", function () {
    const correo = "cliente@gmail.com";
    const pass = "12345";
    expect(validarCorreo(correo)).toBeTrue();
    expect(validarPassword(pass)).toBeTrue();
    expect(loginUsuario("cliente@gmail.com", "0000")).toBe("Usuario o contraseña incorrectos");
  });

  it("rechaza correos no permitidos", function () {
    const correo = "hacker@evil.com";
    const pass = "abcd";
    expect(validarCorreo(correo)).toBeFalse();
  });
});
