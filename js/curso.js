// RF-032 a RF-072: creación progresiva, contadores, total de horas y envío a revisión.
const sesionCurso = exigirSesion(['Director de Escuela']);

const formCurso = document.getElementById('form-curso');
const camposCurso = formCurso.elements;
const idCurso = new URLSearchParams(location.search).get('id');
const listaCursos = leer(CLAVES.cursos);
const cursoExistente = listaCursos.find(c => c.id === idCurso && c.escuela === sesionCurso.escuela);
const CAMPOS_TEXTO = ['codigo', 'nombre', 'nombrePowerCampus', 'areaSfia', 'tematica', 'metodologia', 'nivel',
  'certificacion', 'creditos', 'horasClase', 'horasExtra', 'descripcionCorta', 'metaDescripcion',
  'competencia', 'requisitos', 'requisitosDeseables', 'palabrasClave'];

// RF-030: un curso enviado (En desarrollo o posterior) ya no lo edita el Director.
if (cursoExistente && cursoExistente.estado !== 'Borrador') {
  dejarAviso(`El curso ${cursoExistente.codigo || cursoExistente.nombre} ya fue enviado y no se puede editar.`);
  location.replace('cursos.html');
  throw new Error('Curso no editable');
}

function llenarSelect(select, opciones) {
  select.add(new Option('Seleccione una opción', ''));
  opciones.forEach(o => select.add(new Option(o, o)));
}

camposCurso.escuela.add(new Option(nombreEscuela(sesionCurso.escuela), sesionCurso.escuela));
llenarSelect(camposCurso.areaSfia, AREAS_SEFIA);
llenarSelect(camposCurso.tematica, TEMATICAS);
llenarSelect(camposCurso.metodologia, METODOLOGIAS);
llenarSelect(camposCurso.nivel, NIVELES);
llenarSelect(camposCurso.certificacion, CERTIFICACIONES);
document.getElementById('opciones-modalidad').innerHTML = MODALIDADES.map(m =>
  `<label><input type="radio" name="modalidad" value="${m}" aria-describedby="error-modalidad"> ${m}</label>`
).join('');

// "Guardar borrador" solo exige escuela, código y nombre; "Listo para enviar" exige todo (RN-06).
let modoEnvio = false;
const paraEnvio = (valor, mensaje) => (modoEnvio ? obligatorio(valor, mensaje) : '');
const siHayValor = (valor, regla) => (String(valor).trim() ? regla(valor) : '');

// RF-018: con "Solicitar código" marcado, el código puede quedar vacío (lo genera Desarrollo Curricular).
const codigoOpcional = () => camposCurso.solicitarCodigo.checked;

const reglasCurso = {
  codigo: v => (codigoOpcional() && !v.trim() ? '' : validarCodigoCurso(v)) ||
    (v.trim() && listaCursos.some(c => c.codigo === v.trim().toUpperCase() && c.id !== idCurso) ? 'Ya existe un curso con ese código.' : ''),
  nombre: v => obligatorio(v, 'Ingrese el nombre del curso.') ||
    (v.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres.' : ''),
  nombrePowerCampus: v => paraEnvio(v, 'Ingrese el nombre para Power Campus.') || validarLongitudMax(v, 40),
  areaSfia: () => '', // RF-020: el Área SFIA es opcional
  tematica: v => paraEnvio(v, 'Seleccione una temática.'),
  metodologia: v => paraEnvio(v, 'Seleccione una metodología.'),
  nivel: v => paraEnvio(v, 'Seleccione el nivel de complejidad.'),
  modalidad: v => paraEnvio(v, 'Seleccione la modalidad.'),
  certificacion: v => paraEnvio(v, 'Seleccione una certificación o "No tiene".'),
  creditos: v => paraEnvio(v, 'Ingrese los créditos.') || siHayValor(v, x => validarEntero(x, 1, 12)),
  horasClase: v => paraEnvio(v, 'Ingrese las horas clase.') || siHayValor(v, x => validarEntero(x, 0, 300)),
  horasExtra: v => paraEnvio(v, 'Ingrese las horas extra clase.') || siHayValor(v, x => validarEntero(x, 0, 300)),
  descripcionCorta: v => paraEnvio(v, 'Ingrese la descripción corta.') || validarLongitudMax(v, 250),
  metaDescripcion: v => paraEnvio(v, 'Ingrese la meta descripción.') || validarLongitudMax(v, 155),
  competencia: v => paraEnvio(v, 'Ingrese la competencia del curso.'),
  requisitos: v => paraEnvio(v, 'Ingrese los requisitos indispensables.'),
  requisitosDeseables: v => paraEnvio(v, 'Ingrese los requisitos deseables.'),
  palabrasClave: v => paraEnvio(v, 'Ingrese al menos una palabra clave.'),
};

// RF-040 / RNF-034: contador dinámico de caracteres.
function actualizarContador(campo) {
  const contador = document.getElementById(`contador-${campo.name}`);
  const max = Number(contador.dataset.max);
  contador.textContent = `${campo.value.length}/${max}`;
  contador.classList.toggle('contador--excedido', campo.value.length > max);
}

// RF-045: Total de horas = Horas clase + Horas extra clase.
function actualizarTotal() {
  document.getElementById('totalHoras').value = totalHoras(camposCurso.horasClase.value, camposCurso.horasExtra.value);
}

if (cursoExistente) {
  document.getElementById('titulo-formulario').textContent = `Editar curso ${cursoExistente.codigo || cursoExistente.nombre}`;
  CAMPOS_TEXTO.forEach(c => (camposCurso[c].value = cursoExistente[c] ?? ''));
  camposCurso.palabrasClave.value = [].concat(cursoExistente.palabrasClave ?? []).join(', ');
  camposCurso.solicitarCodigo.checked = Boolean(cursoExistente.solicitarCodigo);
  camposCurso.modalidad.value = cursoExistente.modalidad ?? '';
}

['nombrePowerCampus', 'descripcionCorta', 'metaDescripcion'].forEach(nombre => {
  actualizarContador(camposCurso[nombre]);
  camposCurso[nombre].addEventListener('input', e => actualizarContador(e.target));
});
camposCurso.horasClase.addEventListener('input', actualizarTotal);
camposCurso.horasExtra.addEventListener('input', actualizarTotal);
camposCurso.codigo.addEventListener('input', e => (e.target.value = e.target.value.toUpperCase()));
camposCurso.solicitarCodigo.addEventListener('change', () => validarCampo(formCurso, reglasCurso, 'codigo'));
actualizarTotal();
activarValidacionEnVivo(formCurso, reglasCurso);

formCurso.addEventListener('submit', evento => {
  evento.preventDefault();
  modoEnvio = evento.submitter?.value === 'enviar';
  const valido = validarFormulario(formCurso, reglasCurso);
  if (!valido) return;

  const curso = { ...cursoExistente, id: cursoExistente?.id ?? crypto.randomUUID(), escuela: sesionCurso.escuela };
  CAMPOS_TEXTO.forEach(c => (curso[c] = camposCurso[c].value.trim()));
  curso.codigo = curso.codigo.toUpperCase();
  curso.solicitarCodigo = camposCurso.solicitarCodigo.checked;
  curso.palabrasClave = separarPalabrasClave(curso.palabrasClave); // RF-023: etiquetas sin repetir
  curso.modalidad = camposCurso.modalidad.value;
  curso.totalHoras = totalHoras(curso.horasClase, curso.horasExtra);
  curso.estado = modoEnvio ? 'En desarrollo' : 'Borrador'; // RF-030: al enviarse pasa a En desarrollo
  delete curso.enviado;
  curso.ultimaModificacion = new Date().toISOString(); // RF-035

  guardar(CLAVES.cursos, cursoExistente
    ? listaCursos.map(c => (c.id === curso.id ? curso : c))
    : [...listaCursos, curso]);
  const nombreAviso = curso.codigo || curso.nombre;
  dejarAviso(modoEnvio ? `Curso ${nombreAviso} enviado a Desarrollo Curricular.` : `Borrador de ${nombreAviso} guardado.`);
  location.href = 'cursos.html';
});
