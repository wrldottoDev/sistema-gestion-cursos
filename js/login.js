const formLogin = document.getElementById('form-login');
const datosListos = inicializarDatos();

const reglasLogin = {
  correo: valor => validarCorreo(valor, { institucional: true }),
  contrasena: valor => obligatorio(valor, 'Ingrese su contraseña.'),
};

activarValidacionEnVivo(formLogin, reglasLogin);

formLogin.addEventListener('submit', async evento => {
  evento.preventDefault();
  if (!validarFormulario(formLogin, reglasLogin)) return;

  await datosListos;
  const correo = formLogin.elements.correo.value.trim().toLowerCase();
  const usuario = leer(CLAVES.usuarios).find(u => u.correoInstitucional === correo);
  const valido = usuario && (await hashContrasena(formLogin.elements.contrasena.value, usuario.sal)).hash === usuario.hash;

  // RNF-011: el mensaje no revela si falló el correo o la contraseña.
  if (!valido) {
    mostrarAviso('Correo o contraseña incorrectos.', 'error');
    return;
  }
  iniciarSesion(usuario);
  location.href = usuario.rol === 'Administrador' ? 'pages/usuarios.html' : 'pages/cursos.html';
});
