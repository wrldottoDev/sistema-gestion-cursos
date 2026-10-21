exigirSesion(['Administrador']);

const formUsuario = document.getElementById('form-usuario');
const campos = formUsuario.elements;
const idUsuario = new URLSearchParams(location.search).get('id');
const usuarios = leer(CLAVES.usuarios);
const existente = usuarios.find(u => u.id === idUsuario);
const TAMANO_MAX_FOTO = 500 * 1024;

ROLES.forEach(rol => campos.rol.add(new Option(rol, rol)));
leerCatalogo('escuelas').forEach(e => campos.escuela.add(new Option(e.nombre, e.codigo)));

// RF-004: solo puede haber un Administrador, un Rector y un Vicerrector (RN-03).
const ROLES_UNICOS = ['Administrador', 'Rectoría', 'Vicerrectoría'];
const cargoOcupado = rol => ROLES_UNICOS.includes(rol) && usuarios.some(u => u.rol === rol && u.id !== idUsuario);

const esDirector = () => campos.rol.value === 'Director de Escuela';
const duplicado = (clave, valor) => usuarios.some(u => u[clave] === valor && u.id !== idUsuario);

function actualizarEdad() {
  const valor = campos.fechaNacimiento.value;
  document.getElementById('edad').textContent =
    valor && !validarFechaNacimiento(valor) ? `Edad: ${calcularEdad(valor)} años` : 'Edad: —';
}

function actualizarEscuela() {
  document.getElementById('campo-escuela').hidden = !esDirector();
  if (!esDirector()) campos.escuela.value = '';
}

// Al modificar, la contraseña es opcional: si se deja vacía se conserva la actual.
const contrasenaOpcional = () => existente && !campos.contrasena.value && !campos.confirmacion.value;

const reglasUsuario = {
  nombre: v => validarNombre(v, 'el nombre'),
  apellidos: v => validarNombre(v, 'los apellidos'),
  identificacion: v => validarIdentificacion(v) ||
    (duplicado('identificacion', v.trim()) ? 'Ya existe un usuario con esa identificación.' : ''),
  celular: validarCelular,
  fechaNacimiento: v => validarFechaNacimiento(v),
  sexo: v => obligatorio(v, 'Seleccione una opción.'),
  foto: archivos => {
    const archivo = archivos[0];
    if (!archivo) return '';
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type)) return 'La fotografía debe ser PNG, JPG o WEBP.';
    return archivo.size > TAMANO_MAX_FOTO ? 'La fotografía no puede superar 500 KB.' : '';
  },
  correoInstitucional: v => validarCorreo(v, { institucional: true }) ||
    (duplicado('correoInstitucional', v.trim().toLowerCase()) ? 'Ese correo ya está registrado.' : ''),
  correoPersonal: v => validarCorreo(v, { requerido: false }),
  rol: v => obligatorio(v, 'Seleccione un rol.') ||
    (cargoOcupado(v) ? `Ya existe un usuario con el rol ${v}; solo puede haber uno.` : ''),
  escuela: v => (esDirector() ? obligatorio(v, 'Seleccione la escuela del director.') : ''),
  contrasena: v => (contrasenaOpcional() ? '' : validarContrasena(v)),
  confirmacion: v => (contrasenaOpcional() ? '' : obligatorio(v, 'Confirme la contraseña.') ||
    (v === campos.contrasena.value ? '' : 'Las contraseñas no coinciden.')),
};

if (existente) {
  document.getElementById('titulo-formulario').textContent = 'Modificar usuario';
  document.title = 'Modificar usuario · Gestión de Cursos CENFOTEC';
  ['nombre', 'apellidos', 'identificacion', 'celular', 'fechaNacimiento', 'sexo',
   'correoInstitucional', 'correoPersonal', 'rol', 'escuela'].forEach(c => (campos[c].value = existente[c] ?? ''));
  document.getElementById('ayuda-contrasena').textContent = 'Déjela vacía para conservar la contraseña actual.';
  document.getElementById('marca-contrasena').hidden = true;
  document.getElementById('marca-confirmacion').hidden = true;
  actualizarEscuela();
  campos.escuela.value = existente.escuela;
  actualizarEdad();
}

campos.fechaNacimiento.addEventListener('input', actualizarEdad);
campos.rol.addEventListener('change', actualizarEscuela);
activarValidacionEnVivo(formUsuario, reglasUsuario);

const leerComoDataURL = archivo => new Promise((resolver, rechazar) => {
  const lector = new FileReader();
  lector.onload = () => resolver(lector.result);
  lector.onerror = rechazar;
  lector.readAsDataURL(archivo);
});

formUsuario.addEventListener('submit', async evento => {
  evento.preventDefault();
  if (!validarFormulario(formUsuario, reglasUsuario)) return;

  const usuario = {
    ...existente,
    id: existente?.id ?? crypto.randomUUID(),
    nombre: campos.nombre.value.trim(),
    apellidos: campos.apellidos.value.trim(),
    identificacion: campos.identificacion.value.trim(),
    celular: campos.celular.value.trim(),
    fechaNacimiento: campos.fechaNacimiento.value,
    sexo: campos.sexo.value,
    correoInstitucional: campos.correoInstitucional.value.trim().toLowerCase(),
    correoPersonal: campos.correoPersonal.value.trim(),
    rol: campos.rol.value,
    escuela: campos.escuela.value,
  };
  if (campos.foto.files[0]) usuario.foto = await leerComoDataURL(campos.foto.files[0]);
  if (campos.contrasena.value) Object.assign(usuario, await hashContrasena(campos.contrasena.value));

  guardar(CLAVES.usuarios, existente
    ? usuarios.map(u => (u.id === usuario.id ? usuario : u))
    : [...usuarios, usuario]);
  dejarAviso(existente ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.');
  location.href = 'usuarios.html';
});
