// Persistencia y sesión de la Iteración 1 (LocalStorage / sessionStorage).
// En la entrega final esta capa se reemplaza por el backend con MongoDB.

const CLAVES = { usuarios: 'sgc_usuarios', cursos: 'sgc_cursos', sesion: 'sgc_sesion', aviso: 'sgc_aviso' };

// Catálogos estáticos de la iteración (RF-009, RF-046, RF-057, RN-11, RN-12).
const ROLES = ['Administrador', 'Desarrollo Curricular', 'Director de Escuela', 'Rectoría', 'Vicerrectoría'];
const ESCUELAS = [
  { codigo: 'ESC-01', nombre: 'Escuela de Ingeniería del Software' },
  { codigo: 'ESC-02', nombre: 'Escuela de Ciberseguridad' },
  { codigo: 'ESC-03', nombre: 'Escuela de Tecnologías de Información' },
  { codigo: 'ESC-04', nombre: 'Escuela de Diseño y Animación Digital' },
];
const AREAS_SEFIA = ['Desarrollo de software', 'Infraestructura y redes', 'Seguridad informática', 'Datos e inteligencia artificial', 'Diseño digital'];
const TEMATICAS = ['Programación web', 'Bases de datos', 'Computación en la nube', 'Ciberseguridad ofensiva', 'Experiencia de usuario'];
const METODOLOGIAS = ['Aprendizaje basado en proyectos', 'Aula invertida', 'Aprendizaje basado en problemas', 'Clase magistral participativa'];
const NIVELES = ['Básico', 'Intermedio', 'Avanzado', 'Certificación', 'Nivel variable'];
const MODALIDADES = ['Presencial', 'Virtual sincrónica', 'Virtual asincrónica', 'Híbrida'];
const CERTIFICACIONES = ['No tiene', 'AWS Certified Cloud Practitioner', 'Cisco CCNA', 'CompTIA Security+'];

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

function nombreEscuela(codigo) {
  const escuela = ESCUELAS.find(e => e.codigo === codigo);
  return escuela ? escuela.nombre : '—';
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
