// RF-037: notificación de escritorio a Desarrollo Curricular (Web Notifications API).
// Iteración 1: el aviso viaja por LocalStorage y llega a las pestañas abiertas del mismo navegador.

// La llama curso.js cuando un curso se envía a revisión.
function avisarCursoEnviado(curso) {
  const pendientes = leer(CLAVES.notificaciones);
  pendientes.push({ id: curso.id, codigo: curso.codigo, nombre: curso.nombre });
  guardar(CLAVES.notificaciones, pendientes);
}

// La llaman las páginas donde Desarrollo Curricular debe recibir avisos (inicio y cursos).
function escucharNotificaciones(sesion) {
  if (sesion.rol !== 'Desarrollo Curricular') return;
  const soportado = 'Notification' in window;
  const estado = document.getElementById('estado-notificaciones');
  const boton = document.getElementById('activar-notificaciones');
  const claveVistas = `sgc_notif_vistas_${sesion.id}`;

  function revisar() {
    const permiso = soportado ? Notification.permission : 'no-soportado';
    if (estado) estado.textContent = {
      granted: 'Activadas: recibirá un aviso por cada curso enviado a revisión.',
      denied: 'Bloqueadas. Puede habilitarlas en la configuración del navegador.',
      default: 'Desactivadas.',
      'no-soportado': 'Este navegador no permite notificaciones de escritorio.',
    }[permiso];
    if (boton) boton.hidden = permiso !== 'default';
    if (permiso !== 'granted') return; // RF-037 CA2: sin permiso no hay aviso, el curso igual sale en el listado

    const vistas = leer(claveVistas);
    const nuevas = leer(CLAVES.notificaciones).filter(n => !vistas.includes(n.id));
    nuevas.forEach(n => {
      const aviso = new Notification('Curso enviado a revisión', { body: `${n.codigo || 'Código por asignar'} · ${n.nombre}`, tag: n.id });
      // RF-037 CA3: el clic abre el detalle del curso.
      aviso.onclick = () => { window.focus(); location.href = `curso-detalle.html?id=${encodeURIComponent(n.id)}`; };
    });
    guardar(claveVistas, [...vistas, ...nuevas.map(n => n.id)]);
  }

  if (boton) boton.addEventListener('click', () => Notification.requestPermission().then(revisar));
  window.addEventListener('storage', e => { if (e.key === CLAVES.notificaciones) revisar(); });
  revisar();
}
