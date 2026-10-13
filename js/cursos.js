const sesionCursos = exigirSesion();
mostrarAviso();

const esDirectorCursos = sesionCursos.rol === 'Director de Escuela';
// RF-011: el Director solo ve los cursos de su escuela.
const cursos = leer(CLAVES.cursos).filter(c => !esDirectorCursos || c.escuela === sesionCursos.escuela);
const cuerpoCursos = document.getElementById('lista-cursos');
document.getElementById('sin-cursos').hidden = cursos.length > 0;

for (const c of cursos) {
  const fila = cuerpoCursos.insertRow();
  [c.codigo, c.nombre, nombreEscuela(c.escuela)].forEach(texto => (fila.insertCell().textContent = texto));

  const estado = document.createElement('span');
  estado.className = `estado ${c.enviado ? 'estado--enviado' : 'estado--desarrollo'}`;
  estado.textContent = c.enviado ? 'Enviado a revisión' : c.estado;
  fila.insertCell().append(estado);

  fila.insertCell().textContent = new Date(c.ultimaModificacion).toLocaleString('es-CR');

  const acciones = fila.insertCell();
  if (esDirectorCursos && !c.enviado) {
    const enlace = document.createElement('a');
    enlace.href = `curso.html?id=${encodeURIComponent(c.id)}`;
    enlace.className = 'enlace-accion';
    enlace.textContent = 'Editar';
    enlace.setAttribute('aria-label', `Editar ${c.nombre}`);
    acciones.append(enlace);
  }
}
