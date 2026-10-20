const sesionCursos = exigirSesion();
mostrarAviso();

const esDirectorCursos = sesionCursos.rol === 'Director de Escuela';
// RF-011: el Director solo ve los cursos de su escuela.
const cursos = leer(CLAVES.cursos).filter(c => !esDirectorCursos || c.escuela === sesionCursos.escuela);
const cuerpoCursos = document.getElementById('lista-cursos');
// Clase de color de cada estado (RN-09, RN-11, RN-12).
const CLASE_ESTADO = { 'Borrador': 'borrador', 'En desarrollo': 'desarrollo', 'Aprobado': 'aprobado', 'En producción': 'produccion', 'Inactivo': 'inactivo' };
document.getElementById('sin-cursos').hidden = cursos.length > 0;

for (const c of cursos) {
  const fila = cuerpoCursos.insertRow();
  [c.codigo || 'Código pendiente', c.nombre, nombreEscuela(c.escuela)].forEach(texto => (fila.insertCell().textContent = texto));

  const estado = document.createElement('span');
  estado.className = `estado estado--${CLASE_ESTADO[c.estado] ?? 'borrador'}`;
  estado.textContent = c.estado;
  fila.insertCell().append(estado);

  fila.insertCell().textContent = new Date(c.ultimaModificacion).toLocaleString('es-CR');

  const acciones = fila.insertCell();
  if (esDirectorCursos && c.estado === 'Borrador') {
    const enlace = document.createElement('a');
    enlace.href = `curso.html?id=${encodeURIComponent(c.id)}`;
    enlace.className = 'enlace-accion';
    enlace.textContent = 'Editar';
    enlace.setAttribute('aria-label', `Editar ${c.nombre}`); // solo los borradores se editan (RF-030)
    acciones.append(enlace);
  }
}
