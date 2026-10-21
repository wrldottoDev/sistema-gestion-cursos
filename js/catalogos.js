// RF-010, RF-015 y RF-016: listado, eliminación y búsqueda de los catálogos maestros.
exigirSesion(['Administrador']);
mostrarAviso();

const filtros = document.getElementById('filtros');
const cuerpoCatalogo = document.getElementById('lista-catalogo');
const tipoPedido = new URLSearchParams(location.search).get('tipo');
const tipo = tipoPedido in CATALOGOS ? tipoPedido : 'escuelas';
const catalogo = CATALOGOS[tipo];

// Lista lateral: marca el catálogo abierto y muestra cuántos elementos tiene cada uno.
function actualizarCantidades() {
  document.querySelectorAll('[data-cantidad]').forEach(cantidad => {
    cantidad.textContent = leerCatalogo(cantidad.dataset.cantidad).length;
    if (cantidad.dataset.cantidad === tipo) cantidad.parentElement.setAttribute('aria-current', 'page');
  });
}
actualizarCantidades();

document.title = `${catalogo.titulo} · Gestión de Cursos CENFOTEC`;
document.getElementById('titulo-tabla').textContent = `Elementos de ${catalogo.titulo}`;
document.getElementById('columna-detalle').textContent = { escuelas: 'Director', carreras: 'Escuela' }[tipo] ?? 'Descripción';
const agregar = document.getElementById('agregar');
agregar.href = `catalogo.html?tipo=${tipo}`;
agregar.textContent = `Agregar ${catalogo.singular}`;

// RF-016 CA2: el filtro de escuela solo aplica a Carreras.
document.getElementById('campo-filtro-escuela').hidden = tipo !== 'carreras';
filtros.filtroEscuela.add(new Option('Todas las escuelas', ''));
leerCatalogo('escuelas').forEach(e => filtros.filtroEscuela.add(new Option(e.nombre, e.codigo)));

// Director de una escuela: el elegido en el catálogo o, si no hay, el usuario director asignado a esa escuela.
function nombreDirector(escuela) {
  const director = leer(CLAVES.usuarios).find(u =>
    u.id === escuela.director || (!escuela.director && u.rol === 'Director de Escuela' && u.escuela === escuela.codigo));
  return director ? `${director.nombre} ${director.apellidos}` : 'Sin asignar';
}

function detalle(elemento) {
  if (tipo === 'escuelas') return nombreDirector(elemento);
  if (tipo === 'carreras') return nombreEscuela(elemento.escuela);
  return elemento.descripcion || '—';
}

function enlaceEditar(elemento) {
  const enlace = document.createElement('a');
  enlace.href = `catalogo.html?tipo=${tipo}&codigo=${encodeURIComponent(elemento.codigo)}`;
  enlace.className = 'enlace-accion';
  enlace.textContent = 'Editar';
  enlace.setAttribute('aria-label', `Editar ${elemento.nombre}`);
  return enlace;
}

function botonEliminar(elemento) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'boton-enlace boton-enlace--peligro';
  boton.dataset.accion = 'eliminar';
  boton.textContent = 'Eliminar';
  boton.setAttribute('aria-label', `Eliminar ${elemento.nombre}`);
  boton.addEventListener('click', () => eliminar(elemento));
  return boton;
}

// RF-015: solo se elimina un elemento que nadie usa (RN-27), y siempre con confirmación.
const dialogoEliminar = document.getElementById('dialogo-eliminar');

function eliminar(elemento) {
  const usos = usosDe(tipo, elemento);
  if (usos > 0) {
    mostrarAviso(`No se puede eliminar "${elemento.nombre}": lo usan ${usos} registro(s).`, 'error');
    return;
  }
  document.getElementById('titulo-dialogo-eliminar').textContent = `¿Eliminar "${elemento.nombre}"?`;
  document.getElementById('mensaje-eliminar').textContent =
    `Se quitará de ${catalogo.titulo} y dejará de aparecer en los formularios.`;
  dialogoEliminar.returnValue = '';
  dialogoEliminar.addEventListener('close', () => {
    if (dialogoEliminar.returnValue !== 'confirmar') return;
    guardarCatalogo(tipo, leerCatalogo(tipo).filter(e => e.codigo !== elemento.codigo));
    mostrarAviso(`"${elemento.nombre}" se eliminó.`);
    actualizarCantidades();
    mostrar();
  }, { once: true });
  dialogoEliminar.showModal();
}

// "No tiene" debe existir siempre en Certificaciones (RF-013 CA3).
const esFijo = elemento => tipo === 'certificaciones' && elemento.nombre === 'No tiene';

// RF-016: búsqueda por código o nombre, sin distinguir mayúsculas ni tildes.
function mostrar() {
  const texto = normalizar(filtros.buscar.value);
  const escuela = filtros.filtroEscuela.value;
  const visibles = leerCatalogo(tipo).filter(e =>
    normalizar(`${e.codigo} ${e.nombre}`).includes(texto) && (!escuela || e.escuela === escuela));

  cuerpoCatalogo.replaceChildren();
  for (const elemento of visibles) {
    const fila = cuerpoCatalogo.insertRow();
    [elemento.codigo, elemento.nombre, detalle(elemento)].forEach(t => (fila.insertCell().textContent = t));
    const acciones = fila.insertCell();
    acciones.className = 'acciones-tabla';
    acciones.append(enlaceEditar(elemento));
    if (!esFijo(elemento)) acciones.append(botonEliminar(elemento));
  }
  document.getElementById('sin-resultados').hidden = visibles.length > 0;
  document.getElementById('resumen-catalogo').textContent = visibles.length ? `${visibles.length} elemento(s)` : '';
}

filtros.addEventListener('input', mostrar);
filtros.addEventListener('submit', e => e.preventDefault()); // Enter en el buscador no recarga la página
['limpiar', 'limpiar-sin-resultados'].forEach(id => document.getElementById(id).addEventListener('click', () => {
  filtros.reset();
  mostrar();
}));
mostrar();
