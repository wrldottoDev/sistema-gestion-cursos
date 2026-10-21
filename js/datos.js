// Persistencia y sesión de la Iteración 1 (LocalStorage / sessionStorage).
// En la entrega final esta capa se reemplaza por el backend con MongoDB.

const CLAVES = {
  usuarios: 'sgc_usuarios', cursos: 'sgc_cursos', sesion: 'sgc_sesion', aviso: 'sgc_aviso',
  notificaciones: 'sgc_notificaciones',
};

// Listas fijas: no se administran (RN-02, RN-14, RN-15).
const ROLES = ['Administrador', 'Desarrollo Curricular', 'Director de Escuela', 'Rectoría', 'Vicerrectoría'];
const NIVELES = ['Básico', 'Intermedio', 'Avanzado', 'Certificación', 'Nivel variable'];
const MODALIDADES = ['Presencial', 'Virtual sincrónica', 'Virtual asincrónica', 'Híbrida'];
// Clase de color de cada estado (RN-09, RN-11, RN-12).
const CLASE_ESTADO = { 'Borrador': 'borrador', 'En desarrollo': 'desarrollo', 'Aprobado': 'aprobado', 'En producción': 'produccion', 'Inactivo': 'inactivo' };

// RF-010 a RF-013: catálogos maestros que administra el Administrador.
// campos: qué pide el formulario · codigoAuto: el sistema numera el código · usoEnCurso: campo del curso que guarda el nombre.
const CATALOGOS = {
  escuelas: {
    titulo: 'Escuelas', singular: 'escuela', grupo: 'Estructura académica', campos: ['codigo', 'nombre', 'director'],
    semilla: [
      { codigo: 'ESC-01', nombre: 'Escuela de Ingeniería del Software', director: '' },
      { codigo: 'ESC-02', nombre: 'Escuela de Ciberseguridad', director: '' },
      { codigo: 'ESC-03', nombre: 'Escuela de Tecnologías de Información', director: '' },
      { codigo: 'ESC-04', nombre: 'Escuela de Diseño y Animación Digital', director: '' },
    ],
  },
  carreras: {
    titulo: 'Carreras', singular: 'carrera', grupo: 'Estructura académica', campos: ['codigo', 'nombre', 'escuela'],
    semilla: [
      { codigo: 'CAR-01', nombre: 'Ingeniería del Software', escuela: 'ESC-01' },
      { codigo: 'CAR-02', nombre: 'Ciberseguridad', escuela: 'ESC-02' },
      { codigo: 'CAR-03', nombre: 'Tecnologías de Información', escuela: 'ESC-03' },
      { codigo: 'CAR-04', nombre: 'Diseño y Animación Digital', escuela: 'ESC-04' },
    ],
  },
  areasSfia: {
    titulo: 'Áreas SFIA', singular: 'área SFIA', grupo: 'Clasificación', campos: ['nombre', 'descripcion'], codigoAuto: true, usoEnCurso: 'areaSfia',
    semilla: ['Desarrollo de software', 'Infraestructura y redes', 'Seguridad informática',
      'Datos e inteligencia artificial', 'Diseño digital'].map((nombre, i) => ({ codigo: String(i + 1), nombre, descripcion: '' })),
  },
  tematicas: {
    titulo: 'Temáticas', singular: 'temática', grupo: 'Clasificación', campos: ['nombre', 'descripcion'], codigoAuto: true, usoEnCurso: 'tematica',
    semilla: ['Programación web', 'Bases de datos', 'Computación en la nube', 'Ciberseguridad ofensiva',
      'Experiencia de usuario'].map((nombre, i) => ({ codigo: String(i + 1), nombre, descripcion: '' })),
  },
  metodologias: {
    titulo: 'Metodologías de aprendizaje', singular: 'metodología', grupo: 'Clasificación', campos: ['codigo', 'nombre', 'descripcion'],
    descripcionObligatoria: true, usoEnCurso: 'metodologia',
    semilla: [
      { codigo: 'MET-01', nombre: 'Aprendizaje basado en proyectos', descripcion: 'El estudiante aprende desarrollando un proyecto.' },
      { codigo: 'MET-02', nombre: 'Aula invertida', descripcion: 'La teoría se estudia antes de clase y la clase se dedica a practicar.' },
      { codigo: 'MET-03', nombre: 'Aprendizaje basado en problemas', descripcion: 'El estudiante resuelve problemas reales guiado por el docente.' },
      { codigo: 'MET-04', nombre: 'Clase magistral participativa', descripcion: 'Exposición del docente con participación activa.' },
    ],
  },
  casasCertificadoras: {
    titulo: 'Casas certificadoras', singular: 'casa certificadora', grupo: 'Certificación', campos: ['codigo', 'nombre'],
    usoEnCurso: 'casaCertificadora',
    semilla: [
      { codigo: 'AWS', nombre: 'Amazon Web Services' },
      { codigo: 'CISCO', nombre: 'Cisco' },
      { codigo: 'COMPTIA', nombre: 'CompTIA' },
    ],
  },
  certificaciones: {
    titulo: 'Certificaciones', singular: 'certificación', grupo: 'Certificación', campos: ['nombre'], codigoAuto: true, usoEnCurso: 'certificacion',
    semilla: ['No tiene', 'AWS Certified Cloud Practitioner', 'Cisco CCNA', 'CompTIA Security+']
      .map((nombre, i) => ({ codigo: String(i + 1), nombre })),
  },
};

// Fecha y hora cortas para listados y detalle: 21/10/2026 · 2:32 p. m.
function fechaHora(iso) {
  const fecha = new Date(iso);
  return `${fecha.toLocaleDateString('es-CR')} · ${fecha.toLocaleTimeString('es-CR', { hour: 'numeric', minute: '2-digit' })}`;
}

function leer(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch {
    return [];
  }
}

function guardar(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

const claveCatalogo = tipo => `sgc_cat_${tipo}`;

// Si el catálogo nunca se ha guardado, devuelve sus valores iniciales.
function leerCatalogo(tipo) {
  return localStorage.getItem(claveCatalogo(tipo)) ? leer(claveCatalogo(tipo)) : CATALOGOS[tipo].semilla;
}

function guardarCatalogo(tipo, lista) {
  guardar(claveCatalogo(tipo), lista);
}

const nombresDe = tipo => leerCatalogo(tipo).map(e => e.nombre);

function nombreEscuela(codigo) {
  const escuela = leerCatalogo('escuelas').find(e => e.codigo === codigo);
  return escuela ? escuela.nombre : '—';
}

// RN-27: cuántos registros usan un elemento. Si es más de 0, no se puede eliminar.
function usosDe(tipo, elemento) {
  const cursos = leer(CLAVES.cursos);
  if (tipo === 'escuelas') {
    return cursos.filter(c => c.escuela === elemento.codigo).length
      + leer(CLAVES.usuarios).filter(u => u.escuela === elemento.codigo).length
      + leerCatalogo('carreras').filter(c => c.escuela === elemento.codigo).length;
  }
  const campo = CATALOGOS[tipo].usoEnCurso;
  return campo ? cursos.filter(c => c[campo] === elemento.nombre).length : 0;
}

// RNF-005 / RNF-006: la contraseña nunca se guarda en texto plano.
// PBKDF2-HMAC-SHA256 con sal aleatoria de 16 bytes (Web Crypto API, OWASP 2023).
const ITERACIONES_PBKDF2 = 600000;

const aHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
const deHex = hex => new Uint8Array(hex.match(/.{2}/g).map(h => parseInt(h, 16)));

async function hashContrasena(contrasena, salHex) {
  const sal = salHex ? deHex(salHex) : crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(contrasena), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: ITERACIONES_PBKDF2 },
    material,
    256
  );
  return { sal: aHex(sal), hash: aHex(new Uint8Array(bits)) };
}

// Datos de demostración para poder probar el login la primera vez.
async function inicializarDatos() {
  if (leer(CLAVES.usuarios).length) return;
  const base = { correoPersonal: '', celular: '88888888', fechaNacimiento: '1985-04-12', sexo: 'Femenino', foto: '' };
  const admin = await hashContrasena('Admin1234');
  const director = await hashContrasena('Director1234');
  guardar(CLAVES.usuarios, [
    { ...base, id: crypto.randomUUID(), nombre: 'Ana', apellidos: 'Mora Solís', identificacion: '101110111',
      correoInstitucional: 'admin@ucenfotec.ac.cr', rol: 'Administrador', escuela: '', ...admin },
    { ...base, id: crypto.randomUUID(), nombre: 'Carlos', apellidos: 'Vargas Rojas', identificacion: '202220222',
      correoInstitucional: 'director@ucenfotec.ac.cr', rol: 'Director de Escuela', escuela: 'ESC-01', sexo: 'Masculino', ...director },
  ]);
  guardar(CLAVES.cursos, [
    { id: crypto.randomUUID(), escuela: 'ESC-01', codigo: 'SOFT-101', nombre: 'Fundamentos de programación web',
      estado: 'Borrador', ultimaModificacion: new Date().toISOString() },
  ]);
}

function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVES.sesion));
  } catch {
    return null;
  }
}

function iniciarSesion(usuario) {
  const { id, nombre, apellidos, rol, escuela } = usuario;
  sessionStorage.setItem(CLAVES.sesion, JSON.stringify({ id, nombre, apellidos, rol, escuela }));
}

// RF-035: eliminación lógica. El curso pasa a Inactivo y conserva todos sus datos.
function inactivarCurso(id) {
  const lista = leer(CLAVES.cursos);
  const curso = lista.find(c => c.id === id);
  curso.estado = 'Inactivo';
  curso.ultimaModificacion = new Date().toISOString();
  guardar(CLAVES.cursos, lista);
  return curso;
}

// RF-035: pide confirmación en el <dialog> de la página; si se confirma, inactiva y avisa a alTerminar.
function confirmarInactivacion(curso, alTerminar) {
  const dialogo = document.getElementById('dialogo-eliminar-curso');
  document.getElementById('mensaje-eliminar-curso').textContent =
    `${curso.codigo || 'El curso'} · ${curso.nombre} pasará a Inactivo. No se borra: sigue disponible con el filtro Inactivo.`;
  dialogo.returnValue = '';
  dialogo.addEventListener('close', () => {
    if (dialogo.returnValue === 'confirmar') alTerminar(inactivarCurso(curso.id));
  }, { once: true });
  dialogo.showModal();
}

// Protege las páginas internas (RF-010). Redirige al login si no hay sesión o el rol no aplica.
function exigirSesion(rolesPermitidos) {
  const sesion = obtenerSesion();
  if (!sesion || (rolesPermitidos && !rolesPermitidos.includes(sesion.rol))) {
    location.replace('../index.html');
    throw new Error('Sin acceso');
  }
  document.querySelectorAll('[data-rol]').forEach(el => {
    el.hidden = !el.dataset.rol.split(',').includes(sesion.rol);
  });
  const etiqueta = document.getElementById('usuario-actual');
  if (etiqueta) etiqueta.textContent = `${sesion.nombre} ${sesion.apellidos} · ${sesion.rol}`;
  return sesion;
}
