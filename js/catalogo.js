// RF-010 a RF-013: registro y modificación de un elemento de catálogo.
exigirSesion(['Administrador']);

const parametros = new URLSearchParams(location.search);
const tipo = parametros.get('tipo') in CATALOGOS ? parametros.get('tipo') : 'escuelas';
const catalogo = CATALOGOS[tipo];
const elementos = leerCatalogo(tipo);
const elementoExistente = elementos.find(e => e.codigo === parametros.get('codigo'));
const formCatalogo = document.getElementById('form-catalogo');
const camposCatalogo = formCatalogo.elements;
const usa = campo => catalogo.campos.includes(campo);
const volverA = `catalogos.html?tipo=${tipo}`;

// Solo se muestran los campos que usa este catálogo.
['codigo', 'director', 'escuela', 'descripcion'].forEach(c => (document.getElementById(`campo-${c}`).hidden = !usa(c)));
document.getElementById('marca-descripcion').hidden = !catalogo.descripcionObligatoria;
document.getElementById('volver').href = volverA;
document.getElementById('volver').textContent = `← Volver a ${catalogo.titulo}`;
document.getElementById('cancelar').href = volverA;
const titulo = `${elementoExistente ? 'Modificar' : 'Agregar'} ${catalogo.singular}`;
document.getElementById('titulo-formulario').textContent = titulo;
document.title = `${titulo} · Gestión de Cursos CENFOTEC`;

// RF-011 CA2: el selector de director solo lista usuarios con rol Director de Escuela.
const directores = leer(CLAVES.usuarios).filter(u => u.rol === 'Director de Escuela');
camposCatalogo.director.add(new Option('Seleccione un director', ''));
directores.forEach(u => camposCatalogo.director.add(new Option(`${u.nombre} ${u.apellidos}`, u.id)));
camposCatalogo.escuela.add(new Option('Seleccione una escuela', ''));
leerCatalogo('escuelas').forEach(e => camposCatalogo.escuela.add(new Option(e.nombre, e.codigo)));

// ¿Otro elemento del catálogo ya tiene ese valor? (sin distinguir mayúsculas ni tildes)
const repetido = (campo, valor) =>
  elementos.some(e => e !== elementoExistente && normalizar(e[campo]) === normalizar(valor));
const dirigeOtraEscuela = idDirector =>
  leerCatalogo('escuelas').some(e => e.director === idDirector && e.codigo !== elementoExistente?.codigo);

const reglasCatalogo = {
  codigo: v => !usa('codigo') ? '' :
    obligatorio(v, 'Ingrese el código.') || (repetido('codigo', v) ? 'Ya existe un elemento con ese código.' : ''),
  nombre: v => obligatorio(v, 'Ingrese el nombre.') || (repetido('nombre', v) ? 'Ya existe un elemento con ese nombre.' : ''),
  director: v => !usa('director') ? '' :
    obligatorio(v, 'Seleccione el director de la escuela.') || (dirigeOtraEscuela(v) ? 'Ese director ya dirige otra escuela.' : ''),
  escuela: v => !usa('escuela') ? '' : obligatorio(v, 'Seleccione la escuela.'),
  descripcion: v => catalogo.descripcionObligatoria ? obligatorio(v, 'Ingrese la descripción.') : '',
};

if (elementoExistente) {
  catalogo.campos.forEach(c => (camposCatalogo[c].value = elementoExistente[c] ?? ''));
  camposCatalogo.codigo.readOnly = true; // el código identifica al elemento: no se cambia
  // Escuela sin director guardado: se propone el Director que ya tiene asignada esa escuela.
  if (tipo === 'escuelas' && !elementoExistente.director) {
    camposCatalogo.director.value = directores.find(u => u.escuela === elementoExistente.codigo)?.id ?? '';
  }
}
camposCatalogo.codigo.addEventListener('input', e => (e.target.value = e.target.value.toUpperCase()));
activarValidacionEnVivo(formCatalogo, reglasCatalogo);

// RF-012: el siguiente número libre para los catálogos con código autonumérico.
const siguienteCodigo = lista => String(Math.max(0, ...lista.map(e => Number(e.codigo) || 0)) + 1);

formCatalogo.addEventListener('submit', evento => {
  evento.preventDefault();
  if (!validarFormulario(formCatalogo, reglasCatalogo)) return;

  const elemento = { ...elementoExistente };
  catalogo.campos.forEach(c => (elemento[c] = camposCatalogo[c].value.trim()));
  if (!elemento.codigo) elemento.codigo = siguienteCodigo(elementos);

  guardarCatalogo(tipo, elementoExistente
    ? elementos.map(e => (e === elementoExistente ? elemento : e))
    : [...elementos, elemento]);

  // RF-011: el director elegido queda asignado a esta escuela también en su usuario.
  if (tipo === 'escuelas') {
    guardar(CLAVES.usuarios, leer(CLAVES.usuarios).map(u => (u.id === elemento.director ? { ...u, escuela: elemento.codigo } : u)));
  }
  // RF-010 CA3: si cambió el nombre, los cursos que lo usaban muestran el nombre nuevo.
  const campoCurso = catalogo.usoEnCurso;
  if (elementoExistente && campoCurso && elementoExistente.nombre !== elemento.nombre) {
    guardar(CLAVES.cursos, leer(CLAVES.cursos).map(c =>
      (c[campoCurso] === elementoExistente.nombre ? { ...c, [campoCurso]: elemento.nombre } : c)));
  }

  dejarAviso(elementoExistente ? `"${elemento.nombre}" se actualizó.` : `"${elemento.nombre}" se registró.`);
  location.href = volverA;
});
