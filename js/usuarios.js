// RF-005, RF-006 y RF-007: listado, eliminación y búsqueda de usuarios.
const sesionUsuarios = exigirSesion(['Administrador']);
mostrarAviso();

const filtrosUsuarios = document.getElementById('filtros-usuarios');
const cuerpoUsuarios = document.getElementById('lista-usuarios');
ROLES.forEach(rol => filtrosUsuarios.filtroRol.add(new Option(rol, rol)));

function enlaceEditar(u) {
  const enlace = document.createElement('a');
  enlace.href = `usuario.html?id=${encodeURIComponent(u.id)}`;
  enlace.className = 'enlace-accion';
  enlace.textContent = 'Editar';
  enlace.setAttribute('aria-label', `Editar a ${u.nombre} ${u.apellidos}`);
  return enlace;
}

function botonEliminar(u) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'boton-enlace boton-enlace--peligro';
  boton.textContent = 'Eliminar';
  boton.setAttribute('aria-label', `Eliminar a ${u.nombre} ${u.apellidos}`);
  boton.addEventListener('click', () => eliminarUsuario(u));
  return boton;
}

// RF-006: no se elimina la propia cuenta ni a un Director con cursos en su escuela (RN-29).
function eliminarUsuario(u) {
  if (u.id === sesionUsuarios.id) {
    mostrarAviso('No puede eliminar su propia cuenta: siempre debe existir un Administrador.', 'error');
    return;
  }
  if (u.rol === 'Director de Escuela' && leer(CLAVES.cursos).some(c => c.escuela === u.escuela)) {
    mostrarAviso(`No se puede eliminar a ${u.nombre} ${u.apellidos}: tiene cursos asociados a su escuela.`, 'error');
    return;
  }
  if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}? Ya no podrá iniciar sesión.`)) return;
  guardar(CLAVES.usuarios, leer(CLAVES.usuarios).filter(x => x.id !== u.id));
  mostrarAviso('Usuario eliminado.');
  mostrarUsuarios();
}

// RF-007: busca por nombre, apellidos, identificación o correo (sin mayúsculas ni tildes) y filtra por rol.
function mostrarUsuarios() {
  const texto = normalizar(filtrosUsuarios.buscar.value);
  const rol = filtrosUsuarios.filtroRol.value;
  const visibles = leer(CLAVES.usuarios).filter(u =>
    normalizar(`${u.nombre} ${u.apellidos} ${u.identificacion} ${u.correoInstitucional}`).includes(texto) &&
    (!rol || u.rol === rol));

  cuerpoUsuarios.replaceChildren();
  for (const u of visibles) {
    const fila = cuerpoUsuarios.insertRow();
    [
      `${u.nombre} ${u.apellidos}`,
      u.identificacion,
      u.correoInstitucional,
      u.rol,
      u.escuela ? nombreEscuela(u.escuela) : '—',
      calcularEdad(u.fechaNacimiento),
    ].forEach(texto => (fila.insertCell().textContent = texto));
    fila.insertCell().append(enlaceEditar(u), botonEliminar(u));
  }
  document.getElementById('sin-resultados').hidden = visibles.length > 0;
}

filtrosUsuarios.addEventListener('input', mostrarUsuarios);
filtrosUsuarios.addEventListener('submit', e => e.preventDefault()); // Enter en el buscador no recarga la página
document.getElementById('limpiar').addEventListener('click', () => {
  filtrosUsuarios.reset();
  mostrarUsuarios();
});
mostrarUsuarios();
