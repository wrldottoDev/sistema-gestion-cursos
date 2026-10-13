exigirSesion(['Administrador']);
mostrarAviso();

const cuerpoUsuarios = document.getElementById('lista-usuarios');

for (const u of leer(CLAVES.usuarios)) {
  const fila = cuerpoUsuarios.insertRow();
  [
    `${u.nombre} ${u.apellidos}`,
    u.identificacion,
    u.correoInstitucional,
    u.rol,
    u.escuela ? nombreEscuela(u.escuela) : '—',
    calcularEdad(u.fechaNacimiento),
  ].forEach(texto => (fila.insertCell().textContent = texto));

  const enlace = document.createElement('a');
  enlace.href = `usuario.html?id=${encodeURIComponent(u.id)}`;
  enlace.className = 'enlace-accion';
  enlace.textContent = 'Editar';
  enlace.setAttribute('aria-label', `Editar a ${u.nombre} ${u.apellidos}`);
  fila.insertCell().append(enlace);
}
