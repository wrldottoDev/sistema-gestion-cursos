// Reglas de validación del lado del cliente (JavaScript nativo).
// Cada regla recibe el valor y devuelve '' si es válido o el mensaje de error.

const REGEX = {
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  correoInstitucional: /^[^\s@]+@ucenfotec\.ac\.cr$/i,
  nombre: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]{2,50}$/,
  identificacion: /^\d{9,12}$/,
  celular: /^\d{8}$/,
  // ponytail: formato provisional, el algoritmo oficial del código está pendiente (ERS §12).
  codigoCurso: /^[A-Z]{2,5}-\d{2,4}$/,
};

function obligatorio(valor, mensaje = 'Este campo es obligatorio.') {
  return String(valor ?? '').trim() ? '' : mensaje;
}

function validarNombre(valor, campo = 'el nombre') {
  return obligatorio(valor, `Ingrese ${campo}.`) ||
    (REGEX.nombre.test(valor.trim()) ? '' : `Ingrese ${campo} usando solo letras (2 a 50 caracteres).`);
}

function validarCorreo(valor, { institucional = false, requerido = true } = {}) {
  if (!valor.trim()) return requerido ? 'Ingrese un correo.' : '';
  if (!REGEX.correo.test(valor.trim())) return 'Ingrese un correo válido (usuario@dominio).';
  if (institucional && !REGEX.correoInstitucional.test(valor.trim())) return 'Use su correo institucional @ucenfotec.ac.cr.';
  return '';
}

// RNF-001 a RNF-004.
function validarContrasena(valor) {
  if (!valor) return 'Ingrese una contraseña.';
  if (valor.length < 8 || valor.length > 15) return 'La contraseña debe tener entre 8 y 15 caracteres.';
  if (!/[A-Z]/.test(valor)) return 'La contraseña debe incluir al menos una mayúscula.';
  if (!/[a-z]/.test(valor)) return 'La contraseña debe incluir al menos una minúscula.';
  if (!/\d/.test(valor)) return 'La contraseña debe incluir al menos un número.';
  return '';
}

function validarIdentificacion(valor) {
  return obligatorio(valor, 'Ingrese la identificación.') ||
    (REGEX.identificacion.test(valor.trim()) ? '' : 'La identificación debe tener de 9 a 12 dígitos, sin guiones.');
}

function validarCelular(valor) {
  return obligatorio(valor, 'Ingrese el número de celular.') ||
    (REGEX.celular.test(valor.trim()) ? '' : 'El celular debe tener 8 dígitos.');
}

// RF-008: la edad se calcula, no se digita.
function calcularEdad(fechaISO, hoy = new Date()) {
  const [a, m, d] = fechaISO.split('-').map(Number);
  let edad = hoy.getFullYear() - a;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad--;
  return edad;
}

function validarFechaNacimiento(valor, hoy = new Date()) {
  if (!valor) return 'Ingrese la fecha de nacimiento.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor) || isNaN(new Date(valor))) return 'Ingrese una fecha válida.';
  const edad = calcularEdad(valor, hoy);
  if (edad < 18 || edad > 100) return 'La persona usuaria debe tener entre 18 y 100 años.';
  return '';
}

function validarLongitudMax(valor, max) {
  return valor.length > max ? `Máximo ${max} caracteres (lleva ${valor.length}).` : '';
}

function validarEntero(valor, min, max) {
  if (!/^\d+$/.test(String(valor).trim())) return 'Ingrese un número entero sin decimales.';
  const n = Number(valor);
  return n < min || n > max ? `Ingrese un valor entre ${min} y ${max}.` : '';
}

function validarCodigoCurso(valor) {
  return obligatorio(valor, 'Ingrese el código del curso.') ||
    (REGEX.codigoCurso.test(valor.trim().toUpperCase()) ? '' : 'Use el formato LETRAS-NÚMEROS, por ejemplo SOFT-101.');
}

// RN-13.
function totalHoras(horasClase, horasExtra) {
  return (Number(horasClase) || 0) + (Number(horasExtra) || 0);
}

// RF-016: compara textos sin distinguir mayúsculas ni tildes.
function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// RF-041: búsqueda por código o nombre y filtros por escuela y estado.
// RF-035: sin estado elegido se muestran los activos (los Inactivo solo con su filtro).
function filtrarCursos(cursos, { texto = '', escuela = '', estado = '' } = {}) {
  const buscado = normalizar(texto);
  return cursos.filter(c =>
    normalizar(`${c.codigo ?? ''} ${c.nombre ?? ''}`).includes(buscado) &&
    (!escuela || c.escuela === escuela) &&
    (estado ? c.estado === estado : c.estado !== 'Inactivo'));
}

// RF-023: palabras clave separadas por coma, sin vacías ni repetidas (se conserva la primera forma escrita).
function separarPalabrasClave(texto) {
  const unicas = new Map();
  String(texto ?? '').split(',').map(p => p.trim()).filter(Boolean)
    .forEach(p => { if (!unicas.has(normalizar(p))) unicas.set(normalizar(p), p); });
  return [...unicas.values()];
}

// ---------- Presentación de errores en el DOM (RNF-030, RNF-031) ----------

function valorCampo(form, nombre) {
  const campo = form.elements[nombre];
  return campo.type === 'file' ? campo.files : campo.value;
}

function mostrarError(form, nombre, mensaje) {
  const campo = form.elements[nombre];
  const controles = campo instanceof RadioNodeList ? Array.from(campo) : [campo];
  controles.forEach(c => c.setAttribute('aria-invalid', mensaje ? 'true' : 'false'));
  const contenedor = controles[0].closest('.campo');
  contenedor.classList.toggle('campo--error', Boolean(mensaje));
  const lleno = campo.type === 'file' ? campo.files.length > 0 : Boolean(campo.value.trim());
  contenedor.classList.toggle('campo--valido', !mensaje && lleno);
  document.getElementById(`error-${nombre}`).textContent = mensaje;
}

function validarCampo(form, reglas, nombre) {
  const mensaje = reglas[nombre](valorCampo(form, nombre), form);
  mostrarError(form, nombre, mensaje);
  return !mensaje;
}

// Valida todo el formulario, marca los campos y lleva el foco al primer error.
function validarFormulario(form, reglas) {
  const invalidos = Object.keys(reglas).filter(nombre => !validarCampo(form, reglas, nombre));
  if (invalidos.length) {
    const primero = form.elements[invalidos[0]];
    (primero instanceof RadioNodeList ? primero[0] : primero).focus();
  }
  return invalidos.length === 0;
}

// Valida al salir del campo y, una vez tocado, mientras se escribe.
function activarValidacionEnVivo(form, reglas) {
  const tocados = new Set();
  const revisar = (e, marcar) => {
    const nombre = e.target.name;
    if (!(nombre in reglas)) return;
    if (marcar) tocados.add(nombre);
    if (tocados.has(nombre)) validarCampo(form, reglas, nombre);
  };
  form.addEventListener('focusout', e => revisar(e, true));
  form.addEventListener('input', e => revisar(e, false));
  form.addEventListener('change', e => revisar(e, true));
}

// Mensajes de confirmación entre páginas (RNF-032).
function dejarAviso(texto, tipo = 'exito') {
  sessionStorage.setItem(CLAVES.aviso, JSON.stringify({ texto, tipo }));
}

function mostrarAviso(texto, tipo = 'exito') {
  const aviso = document.getElementById('aviso');
  const guardado = texto ? { texto, tipo } : JSON.parse(sessionStorage.getItem(CLAVES.aviso) ?? 'null');
  sessionStorage.removeItem(CLAVES.aviso);
  if (!aviso || !guardado?.texto) return;
  aviso.textContent = guardado.texto;
  aviso.className = `aviso aviso--${guardado.tipo}`;
  aviso.hidden = false;
}

if (typeof module !== 'undefined') {
  module.exports = {
    obligatorio, validarNombre, validarCorreo, validarContrasena, validarIdentificacion, validarCelular,
    calcularEdad, validarFechaNacimiento, validarLongitudMax, validarEntero, validarCodigoCurso, totalHoras, normalizar, separarPalabrasClave,
    filtrarCursos,
  };
}
