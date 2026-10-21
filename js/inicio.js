// Página de inicio: accesos según el rol (RF-008).
const sesionInicio = exigirSesion();
mostrarAviso();
document.getElementById('saludo').textContent = `Hola, ${sesionInicio.nombre}`;
escucharNotificaciones(sesionInicio);
document.getElementById('fecha-hoy').textContent =
  new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });
