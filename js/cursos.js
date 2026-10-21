const sesionCursos = exigirSesion();
mostrarAviso();

const esDirectorCursos = sesionCursos.rol === 'Director de Escuela';
// RF-011: el Director solo ve los cursos de su escuela.
const cursos = leer(CLAVES.cursos).filter(c => !esDirectorCursos || c.escuela === sesionCursos.escuela);
const cuerpoCursos = document.getElementById('lista-cursos');
const filtrosCursos = document.getElementById('filtros-cursos');

leerCatalogo('escuelas').forEach(e => filtrosCursos.escuela.add(new Option(e.nombre, e.codigo)));
const puedeEliminar = ['Administrador', 'Desarrollo Curricular'].includes(sesionCursos.rol); // RF-035 CA4
const plantillaFila = document.getElementById('plantilla-fila-curso');

function filaCurso(c) {
  const fila = plantillaFila.content.firstElementChild.cloneNode(true);
  const campo = nombre => fila.querySelector(`[data-campo="${nombre}"]`);
  campo('codigo').textContent = c.codigo || 'Por asignar';
  campo('codigo').classList.toggle('codigo--pendiente', !c.codigo);
  const enlace = campo('nombre').firstElementChild;
  enlace.textContent = c.nombre;
  enlace.href = `curso-detalle.html?id=${encodeURIComponent(c.id)}`;
  campo('escuela').textContent = nombreEscuela(c.escuela);
  campo('estado').textContent = c.estado;
  campo('estado').classList.add(`estado--${CLASE_ESTADO[c.estado] ?? 'borrador'}`);
  campo('ultimaModificacion').textContent = fechaHora(c.ultimaModificacion);

  // Solo los borradores se editan, y solo el Director (RF-019).
  const editar = fila.querySelector('[data-accion="editar"]');
  editar.hidden = !(esDirectorCursos && c.estado === 'Borrador');
  editar.href = `curso.html?id=${encodeURIComponent(c.id)}`;
  editar.setAttribute('aria-label', `Editar ${c.nombre}`);

  const eliminar = fila.querySelector('[data-accion="eliminar"]');
  eliminar.hidden = !puedeEliminar || c.estado === 'Inactivo';
  eliminar.setAttribute('aria-label', `Eliminar ${c.nombre}`);
  eliminar.addEventListener('click', () => confirmarInactivacion(c, inactivo => {
    Object.assign(c, inactivo);
    mostrarAviso(`El curso ${c.codigo || c.nombre} pasó a Inactivo.`);
    mostrarCursos();
  }));
  return fila;
}

// RF-041: búsqueda y filtros; del más reciente al más antiguo.
function mostrarCursos() {
  const texto = filtrosCursos.busqueda.value;
  const escuela = filtrosCursos.escuela.value;
  const visibles = filtrarCursos(cursos, { texto, escuela, estado: filtrosCursos.estado.value })
    .sort((a, b) => b.ultimaModificacion.localeCompare(a.ultimaModificacion));
  // Cantidad de cada pestaña de estado con la búsqueda y la escuela actuales.
  filtrosCursos.querySelectorAll('[data-cantidad]').forEach(span => {
    span.textContent = filtrarCursos(cursos, { texto, escuela, estado: span.dataset.cantidad }).length;
  });

  cuerpoCursos.replaceChildren(...visibles.map(filaCurso));

  document.getElementById('sin-cursos').hidden = cursos.length > 0;
  document.getElementById('sin-coincidencias').hidden = !cursos.length || visibles.length > 0;
  document.getElementById('resumen-cursos').textContent = visibles.length ? `${visibles.length} curso(s)` : '';
}

filtrosCursos.addEventListener('input', mostrarCursos);
filtrosCursos.addEventListener('submit', e => e.preventDefault()); // Enter en el buscador no recarga la página
['limpiar-filtros', 'limpiar-sin-coincidencias'].forEach(id => document.getElementById(id).addEventListener('click', () => {
  filtrosCursos.reset();
  mostrarCursos();
}));
mostrarCursos();
