// RF-040: detalle completo del curso, con acciones según el rol.
const sesionDetalle = exigirSesion();
mostrarAviso();

const idDetalle = new URLSearchParams(location.search).get('id');
const cursoDetalle = leer(CLAVES.cursos).find(c => c.id === idDetalle);
const esDirectorDetalle = sesionDetalle.rol === 'Director de Escuela';

// RF-040 CA3 / RF-009: el Director no abre cursos de otra escuela.
if (!cursoDetalle || (esDirectorDetalle && cursoDetalle.escuela !== sesionDetalle.escuela)) {
  dejarAviso('No tiene acceso a ese curso o no existe.', 'error');
  location.replace('cursos.html');
  throw new Error('Curso no disponible');
}

// Ids de la página que no se llaman igual que el campo del curso.
const CAMPO_DE_ID = { 'solicitar-codigo': 'solicitarCodigo' };

function textoDetalle(valor) {
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (Array.isArray(valor)) return valor.join(', ') || '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return new Date(`${valor}T00:00`).toLocaleDateString('es-CR');
  return String(valor ?? '').trim() || '—';
}

document.title = `${cursoDetalle.nombre} · Gestión de Cursos CENFOTEC`;
document.getElementById('detalle-nombre').textContent = cursoDetalle.nombre;
document.getElementById('detalle-codigo').textContent = cursoDetalle.codigo || 'Código por asignar';
document.getElementById('detalle-escuela').textContent = nombreEscuela(cursoDetalle.escuela);
document.getElementById('desglose-horas').textContent =
  `${cursoDetalle.horasClase || 0} clase + ${cursoDetalle.horasExtra || 0} extra`;
const estadoDetalle = document.getElementById('detalle-estado');
estadoDetalle.textContent = cursoDetalle.estado;
estadoDetalle.className = `estado estado--${CLASE_ESTADO[cursoDetalle.estado] ?? 'borrador'}`;
const fechaDetalle = document.getElementById('detalle-ultima-modificacion');
fechaDetalle.dateTime = cursoDetalle.ultimaModificacion;
fechaDetalle.textContent = fechaHora(cursoDetalle.ultimaModificacion);

document.querySelectorAll('dd[id^="detalle-"]').forEach(dd => {
  const id = dd.id.slice('detalle-'.length);
  const campo = CAMPO_DE_ID[id] ?? id;
  dd.textContent = textoDetalle(cursoDetalle[campo]);
});

// RF-019 CA4: el Director solo edita sus borradores. RF-035 CA4: solo Administrador y Desarrollo Curricular eliminan.
// RF-040 CA2: Rectoría y Vicerrectoría quedan en solo lectura (sin botones).
const editarDetalle = document.getElementById('editar-curso');
editarDetalle.hidden = !(esDirectorDetalle && cursoDetalle.estado === 'Borrador');
editarDetalle.href = `curso.html?id=${encodeURIComponent(cursoDetalle.id)}`;

const eliminarDetalle = document.getElementById('abrir-dialogo-eliminar');
eliminarDetalle.hidden = !['Administrador', 'Desarrollo Curricular'].includes(sesionDetalle.rol) || cursoDetalle.estado === 'Inactivo';
eliminarDetalle.addEventListener('click', () => confirmarInactivacion(cursoDetalle, () => {
  dejarAviso(`El curso ${cursoDetalle.codigo || cursoDetalle.nombre} pasó a Inactivo.`);
  location.reload();
}));
