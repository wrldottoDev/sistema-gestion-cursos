// ============================================================================
// 05 — High Fidelity Desktop (1440). Every node named "… →ID" becomes a
// prototype link to the screen whose name starts with ID (see 40-prototype.js)
// ============================================================================

// ---------- A · Autenticación
function benefit(t) { return F({ n: 'Benefit', d: 'H', g: 12, cx: 'CENTER' }, [F({ n: 'ic', d: 'H', w: 28, h: 28, r: 999, ax: 'CENTER', cx: 'CENTER', bg: '#FFFFFF', bgo: 0.14 }, [I('check', 16, 'text/inverse')]), T(t, 'Body/LG', 'text/inverse', { w: 440 })]); }
function loginScreen(id, name, o = {}) {
  const logo = S.cn['brand/logo-white'].createInstance(); logo.rescale(320 / logo.width); logo.name = 'Logo oficial (blanco, 1 tinta)';
  const left = F({ n: 'Brand panel', d: 'V', g: 32, p: [64, 64], w: 620, h: 1024, bg: 'bg/brand' }, [logo, F({ n: 'gap', w: 1, h: 24 }),
  T('Sistema de Gestión de Cursos', 'Display/XL', 'text/inverse', { w: 480 }), T('Registre, revise y consulte la oferta de cursos de la universidad en un solo lugar, con reglas claras por rol y escuela.', 'Body/LG', 'text/on-brand-muted', { w: 470 }),
  F({ n: 'Benefits', d: 'V', g: 16 }, [benefit('Registro progresivo con las validaciones del estándar institucional'), benefit('Revisión y aprobación por Desarrollo Curricular'), benefit('Consulta y reportes por escuela, estado y período')]),
  F({ n: 'push', w: 1, h: 1, fy: 'fill' }), T('© Universidad CENFOTEC', 'Body/SM', 'text/on-brand-muted')]);
  const email = input('Correo institucional', { req: true, v: o.email || '', ph: 'nombre@ucenfotec.ac.cr', err: o.emailErr });
  const pwd = input('Contraseña', { req: true, v: o.pwd || '', ph: 'Ingrese su contraseña', err: o.pwdErr, trail: true });
  const tr = pwd.findOne(x => x.type === 'INSTANCE' && x.name === 'Trailing icon'); if (tr) { try { tr.swapComponent(S.cn['icon/eye']); recolor(tr, 'text/secondary'); } catch (e) { } }
  const g = btn(o.gLoading ? 'Conectando con Google…' : 'Continuar con Google', 'Secondary', { icon: o.gLoading ? null : 'google', fx: 'fill', state: o.gLoading ? 'Loading' : 'Default', to: 'P-02' });
  const gi = g.findOne(x => x.type === 'INSTANCE' && x.name === 'Icon'); if (gi && !o.gLoading) for (const v of gi.findAll(x => 'strokes' in x && x.type !== 'INSTANCE')) v.strokes = [];
  const divider = F({ n: 'Divider', d: 'H', g: 12, cx: 'CENTER', fx: 'fill' }, [F({ n: 'l', h: 1, w: 10, fx: 'fill', bg: 'border/default' }), T('o con su correo institucional', 'Body/SM', 'text/secondary'), F({ n: 'r', h: 1, w: 10, fx: 'fill', bg: 'border/default' })]);
  const formCardN = card([T('Iniciar sesión', 'Heading/H1'), T('Use su cuenta institucional @ucenfotec.ac.cr', 'Body/MD', 'text/secondary', { fx: 'fill' }), ...(o.alert ? [alertN('Error', o.alert[0], o.alert[1])] : []), g, divider, email, pwd,
  btn('Iniciar sesión', 'Primary', { fx: 'fill', to: o.to || 'P-02' }), T('¿Problemas para ingresar? Contacte al Administrador del sistema.', 'Body/SM', 'text/secondary', { fx: 'fill', al: 'CENTER' })], { w: 460, p: 40, g: 20, n: 'Login card' });
  const right = F({ n: 'Form panel', d: 'V', w: 820, h: 1024, ax: 'CENTER', cx: 'CENTER', bg: 'bg/canvas' }, [formCardN]);
  const ls = inst('Language Switch', { Idioma: 'ES' }); abs(right, ls, 820 - 150, 32);
  return F({ n: id + ' · ' + name, d: 'H', w: 1440, h: 1024, clip: true, bg: 'bg/canvas' }, [left, right]);
}

// ---------- shared data builders
function userRows() {
  const U = [['Ana Mora Quesada', '112340567', 'amora@ucenfotec.ac.cr', 'Director de Escuela', 'Ingeniería del Software', '41', 'AM'], ['Luis Solís Rojas', '203450678', 'lsolis@ucenfotec.ac.cr', 'Desarrollo Curricular', '—', '36', 'LS'], ['María Vargas Soto', '104560789', 'mvargas@ucenfotec.ac.cr', 'Rectoría', '—', '58', 'MV'], ['Jorge Castro Mena', '301230456', 'jcastro@ucenfotec.ac.cr', 'Vicerrectoría', '—', '52', 'JC'], ['Carla Jiménez Ruiz', '115670234', 'cjimenez@ucenfotec.ac.cr', 'Director de Escuela', 'Ciberseguridad', '45', 'CJ'], ['Diego Rojas Alfaro', '206780123', 'drojas@ucenfotec.ac.cr', 'Director de Escuela', 'Sistemas Inteligentes', '39', 'DR'], ['Marco Salazar', '109870654', 'msalazar@ucenfotec.ac.cr', 'Administrador', '—', '47', 'MS']];
  const RT = { 'Administrador': 'Brand', 'Desarrollo Curricular': 'Info', 'Director de Escuela': 'Neutral', 'Rectoría': 'Outline', 'Vicerrectoría': 'Outline' };
  return U.map((u, i) => [{ node: F({ n: 'User', d: 'H', g: 10, cx: 'CENTER', fx: 'fill' }, [inst('Avatar', { Size: 'SM' }, { Initials: u[6] }), T(u[0], 'Body/MD Medium', 'text/primary', { fx: 'fill', trunc: 1 })]) }, u[1], u[2], { tag: u[3], type: RT[u[3]] }, u[4] === '—' ? { m: '—' } : schoolCell(u[4]), u[5], { acts: [ib('edit', { label: 'Editar', to: 'U-05' }), ib('trash', { label: 'Eliminar', to: i === 0 ? 'U-07' : 'U-06' })] }]);
}
const USER_COLS = [{ h: 'Nombre', sort: true }, { h: 'Identificación', w: 124 }, { h: 'Correo institucional', w: 230 }, { h: 'Rol', w: 184 }, { h: 'Escuela', w: 196 }, { h: 'Edad', w: 64 }, { h: 'Acciones', w: 100 }];
const COURSE_COLS = [{ h: 'Código', w: 170 }, { h: 'Nombre del curso', sort: true }, { h: 'Escuela', w: 250 }, { h: 'Estado', w: 170 }, { h: 'Última modificación', w: 180, sort: true }, { h: 'Acciones', w: 112 }];
function courseRows(list, o = {}) {
  return list.map(c => ({ c: [codeCell(c[0]), c[1], schoolCell(c[2]), { b: c[3], en: o.en }, c[4], { acts: o.actsFn ? o.actsFn(c) : [ib('eye', { label: 'Ver detalle', to: o.detail || 'C-05' }), ib('archive', { label: 'Cambiar a Inactivo', to: 'C-07' })] }], to: o.detail || 'C-05' }));
}
function quickLinks(title, items) {
  return card([T(title, 'Heading/H3'), ...items.map(([ic, l, to]) => F({ n: 'Link · ' + l + ' →' + to, d: 'H', g: 12, p: [12, 12], fx: 'fill', cx: 'CENTER', r: 8, st: 'border/subtle' }, [F({ n: 'ic', d: 'H', w: 36, h: 36, r: 999, ax: 'CENTER', cx: 'CENTER', bg: 'bg/brand-subtle' }, [I(ic, 18, 'text/brand')]), T(l, 'Body/MD Medium', 'text/primary', { fx: 'fill' }), I('chevron-right', 16, 'text/secondary')]))], { w: 360, n: 'Accesos rápidos' });
}
const SCH = ['SOFT', 'CIBER', 'SINT', 'TI', 'SI', 'FCOMP', 'ADM'];
const SCH_FULL = ['Ingeniería del Software', 'Ciberseguridad', 'Sistemas Inteligentes', 'Tecnologías de Información', 'Sistemas de Información', 'Fundamentos de Computación', 'Administración de Negocios'];
const PROD = [[4, 2, 9, 21, 3], [6, 3, 5, 18, 1], [8, 2, 6, 14, 2], [5, 1, 7, 40, 4], [7, 2, 6, 38, 3], [6, 1, 5, 35, 3], [5, 1, 6, 32, 1]];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct'];
const proposalNote = () => alertN('Info', 'Propuesta UX pendiente de validación', 'La ERS (RF-002 CA1) define Usuarios (Administrador) y Cursos (demás roles) como vista inicial. "Inicio" solo resume datos que el sistema ya calcula; no agrega funciones.');

// ---------- P · Inicio por rol
function P01() {
  return shell({ id: 'P-01', name: 'Inicio · Administrador', role: 'admin', active: 'Inicio', crumbs: ['Inicio'], title: 'Inicio', sub: 'Resumen al momento de la consulta', notif: 0,
    body: [kpiRow([['Usuarios', '24', '5 roles · 7 directores', 'users'], ['Cursos registrados', '312', 'Todas las escuelas', 'book'], ['En revisión', '12', 'Estado En desarrollo', 'clock'], ['Catálogos', '10', '3 fijos del sistema', 'layers']]),
    F({ n: 'Row', d: 'H', g: 24, fx: 'fill' }, [stacked('Cursos por estado y escuela', 'Cantidad actual por escuela', SCH, PROD, { h: 220, bw: 40 }), quickLinks('Accesos rápidos', [['users', 'Registrar usuario', 'U-03'], ['upload', 'Importar CSV de catálogos', 'M-01'], ['building', 'Escuelas y carreras', 'K-02'], ['chart', 'Reporte de producción', 'RP-01']])]), proposalNote()] });
}
function draftsTable() {
  const prog = p => ({ node: F({ n: 'Progress', d: 'H', g: 8, cx: 'CENTER', fx: 'fill' }, [F({ n: 'Track', w: 90, h: 6, r: 999, bg: 'bg/muted', clip: true }, [F({ n: 'Fill', w: Math.round(90 * p / 100), h: 6, r: 999, bg: 'action/primary' })]), T(p + ' %', 'Body/SM Medium', 'text/primary')]) });
  return table([{ h: 'Código', w: 150 }, { h: 'Nombre del curso' }, { h: 'Progreso', w: 130 }, { h: 'Último guardado', w: 150 }, { h: '', w: 116 }],
    [{ c: [codeCell('SOFT-210'), 'Arquitectura de software', prog(70), '12/10/2026 10:24', { node: btn('Continuar', 'Secondary', { size: 'SM', to: 'F-02' }) }], to: 'F-02' }, { c: [codeCell(null), 'Pruebas de software', prog(30), '10/10/2026 16:02', { node: btn('Continuar', 'Secondary', { size: 'SM', to: 'F-01' }) }], to: 'F-01' }, { c: [codeCell('SOFT-305'), 'Patrones de diseño', prog(15), '02/10/2026 09:40', { node: btn('Continuar', 'Secondary', { size: 'SM', to: 'F-01' }) }] }]);
}
function P02() {
  const notes = card([T('Avisos recientes', 'Heading/H3'), inst('Notification Item', { Estado: 'No leída' }, { Title: 'Curso aprobado', Body: 'SOFT-101 · Fundamentos de programación fue aprobado por Desarrollo Curricular.', Time: 'Hace 2 h', Icon: icon('check-circle') }, { fx: 'fill' }), inst('Notification Item', { Estado: 'Leída' }, { Title: 'Curso enviado a revisión', Body: 'SOFT-118 · Desarrollo web I pasó a En desarrollo.', Time: 'Ayer', Icon: icon('send') }, { fx: 'fill' })], { w: 320, p: 20 });
  return shell({ id: 'P-02', name: 'Inicio · Director de Escuela', role: 'dir', active: 'Inicio', crumbs: ['Inicio'], title: 'Hola, Ana', sub: 'Escuela de Ingeniería del Software · solo cursos de su escuela', navTo: { 'Mis cursos': 'C-02', 'Reportes': 'RP-02' },
    actions: [btn('Nuevo curso', 'Primary', { icon: 'plus', to: 'F-01' })],
    body: [kpiRow([['Borrador', '4', '2 con más de 7 días', 'edit'], ['En desarrollo', '2', 'En revisión por DC', 'clock'], ['Aprobado', '9', 'Pendientes de ofertarse', 'check-circle'], ['En producción', '21', 'Ofertándose', 'play']]),
    F({ n: 'Row', d: 'H', g: 24, fx: 'fill' }, [card([cardHead('Continuar donde lo dejó', 'Borradores ordenados por último guardado', [btn('Ver todos', 'Tertiary', { to: 'C-02' })]), draftsTable()]), notes]), proposalNote()] });
}
function P03() {
  return shell({ id: 'P-03', name: 'Inicio · Desarrollo Curricular', role: 'dc', active: 'Inicio', crumbs: ['Inicio'], title: 'Inicio', sub: 'Revisión institucional de cursos', navTo: { 'Bandeja de revisión': 'R-01' },
    actions: [btn('Abrir bandeja', 'Primary', { icon: 'inbox', to: 'R-01' })],
    body: [kpiRow([['Pendientes de revisión', '7', 'Todas las escuelas', 'inbox'], ['Envío más antiguo', '5 días', 'Pruebas de software', 'clock'], ['Aprobados este mes', '14', 'Octubre 2026', 'check-circle'], ['Código pendiente', '3', 'Solicitado por directores', 'hash']]),
    card([cardHead('Próximos en la bandeja', 'Del más antiguo al más reciente', [btn('Ver bandeja', 'Tertiary', { to: 'R-01' })]), table([{ h: 'Código', w: 200 }, { h: 'Nombre' }, { h: 'Escuela', w: 250 }, { h: 'Enviado', w: 150 }, { h: '', w: 130 }],
      [{ c: [codeCell(null), 'Pruebas de software', schoolCell('Ingeniería del Software'), '06/10/2026', { node: btn('Revisar', 'Secondary', { size: 'SM', to: 'R-03' }) }], to: 'R-03' }, { c: [codeCell('CIBER-204'), 'Hacking ético', schoolCell('Ciberseguridad'), '07/10/2026', { node: btn('Revisar', 'Secondary', { size: 'SM', to: 'R-02' }) }] }, { c: [codeCell('SINT-110'), 'Aprendizaje automático I', schoolCell('Sistemas Inteligentes'), '09/10/2026', { node: btn('Revisar', 'Secondary', { size: 'SM', to: 'R-02' }) }] }])]), proposalNote()] });
}
function P04() {
  return shell({ id: 'P-04', name: 'Inicio · Rectoría (ejecutivo)', role: 'rect', active: 'Inicio', crumbs: ['Inicio'], title: 'Producción institucional', tags: [['Solo lectura', 'Neutral', 'lock']], sub: 'Calculado al momento de la consulta · 12/10/2026 15:30', navTo: { Reportes: 'RP-01', Cursos: 'C-01' },
    actions: [btn('Ver reportes', 'Secondary', { icon: 'chart', to: 'RP-01' })],
    body: [kpiRow([['Cursos registrados', '312', '7 escuelas', 'book'], ['En producción', '198', '63 % del total', 'play'], ['Aprobados 2026', '126', 'Ene – Oct', 'check-circle'], ['Inactivos', '17', 'Conservan su historial', 'archive']]),
    F({ n: 'Row', d: 'H', g: 24, fx: 'fill' }, [stacked('Producción por escuela', 'Cursos por estado', SCH, PROD, { h: 220, bw: 36 }), grouped('Aprobados por mes · 2026', 'Cursos que pasaron a Aprobado', MONTHS, [['Aprobados', 'chart/approved', [9, 11, 13, 12, 14, 15, 13, 10, 15, 14]]], { h: 220, bw: 22 })]), proposalNote()] });
}
function P05() {
  return shell({ id: 'P-05', name: 'Inicio · Vicerrectoría', role: 'vice', active: 'Inicio', crumbs: ['Inicio'], title: 'Cursos aprobados recientes', tags: [['Solo lectura', 'Neutral', 'lock']], sub: 'Para transcripción manual a Power Campus', navTo: { 'Cursos aprobados': 'C-06' },
    body: [kpiRow([['Aprobados (7 días)', '6', 'Desde el 05/10/2026', 'check-circle'], ['Aprobados este mes', '14', 'Octubre 2026', 'calendar'], ['En producción', '198', 'Ofertándose', 'play']]),
    card([cardHead('Aprobados recientes', 'Incluye el Nombre en Power Campus (máx. 40 caracteres)'), table([{ h: 'Código', w: 150 }, { h: 'Nombre en Power Campus' }, { h: 'Escuela', w: 250 }, { h: 'Aprobado', w: 150 }, { h: '', w: 150 }],
      [{ c: [codeCell('SOFT-210'), 'Arquitectura de Software', schoolCell('Ingeniería del Software'), '12/10/2026', { node: btn('Ver detalle', 'Secondary', { size: 'SM', to: 'C-06' }) }], to: 'C-06' }, { c: [codeCell('SOFT-101'), 'Fundamentos de Programación', schoolCell('Ingeniería del Software'), '12/10/2026', { node: btn('Ver detalle', 'Secondary', { size: 'SM', to: 'C-06' }) }] }, { c: [codeCell('ADM-140'), 'Gestión de Proyectos de TI', schoolCell('Administración de Negocios'), '03/10/2026', { node: btn('Ver detalle', 'Secondary', { size: 'SM', to: 'C-06' }) }] }])]),
    alertN('Info', 'Sin integración con Power Campus', 'La transcripción es manual y fuera del sistema (ERS §1.2, RN-24).'), proposalNote()] });
}

// ---------- U · Usuarios
function U01(o = {}) {
  let rows = userRows(); if (o.removed) rows = rows.filter((_, i) => i !== 1);
  return shell({ id: 'U-01', name: 'Usuarios · listado', role: 'admin', active: 'Usuarios', crumbs: ['Usuarios'], title: 'Usuarios', sub: 'Personal con acceso al sistema · 24 usuarios', notif: 0, navTo: { 'Catálogos': 'K-01', 'Cursos': 'C-01', 'Reportes': 'RP-01', 'Importar CSV': 'M-01', 'Inicio': 'P-01' },
    actions: [btn('Registrar usuario', 'Primary', { icon: 'plus', to: 'U-03' })],
    body: [toolbar({ p: 'Buscar por nombre, identificación o correo' }, [{ l: 'Rol: Todos' }]), table(USER_COLS, rows, { pager: 'Mostrando 1–' + rows.length + ' de 24 usuarios' })] });
}
function U02() {
  return shell({ id: 'U-02', name: 'Usuarios · sin resultados', role: 'admin', active: 'Usuarios', crumbs: ['Usuarios'], title: 'Usuarios', sub: 'Personal con acceso al sistema · 24 usuarios', notif: 0, actions: [btn('Registrar usuario', 'Primary', { icon: 'plus', to: 'U-03' })],
    body: [toolbar({ v: 'xyz123' }, [{ l: 'Rol: Rectoría', a: true }]), statePanel('Sin resultados', 'No hay usuarios que coincidan', 'La búsqueda no distingue mayúsculas ni tildes y se combina con el rol seleccionado.', 'Limpiar búsqueda', { to: 'U-01' })] });
}
function photoField() { return F({ n: 'Fotografía', d: 'H', g: 16, cx: 'CENTER', fx: 'fill' }, [inst('Avatar', { Size: 'LG' }, { Initials: 'AM' }), F({ n: 't', d: 'V', g: 4, fx: 'fill' }, [F({ n: 'l', d: 'H', g: 4 }, [T('Fotografía', 'Body/MD Medium'), T('(opcional)', 'Body/SM', 'text/secondary')]), T('PNG, JPG o WEBP · máximo 500 KB', 'Body/SM', 'text/secondary')]), btn('Subir fotografía', 'Secondary', { icon: 'upload', size: 'SM' })]); }
function userForm(o = {}) {
  const e = o.err || {}; const v = o.v || {};
  return [formCard('Datos personales', 'Solo los datos necesarios para identificar, contactar y autenticar al usuario (RNF-013).', [grid([
    input('Nombre', { req: true, v: v.nombre || 'Ana' }), input('Apellidos', { req: true, v: v.apellidos || 'Mora Quesada' }),
    input('Identificación', { req: true, v: v.id || '', ph: '9 a 12 dígitos, sin guiones', err: e.id, help: 'Solo números, sin guiones.' }), dateF('Fecha de nacimiento', { req: true, v: v.nac || '14/03/1985' }),
    input('Edad', { ro: true, v: v.edad || '41 años', help: 'Se calcula automáticamente (18 a 100 años).' }), radios('Sexo', ['Femenino', 'Masculino'], 'Femenino', { req: true, help: 'Opciones pendientes de validar con el cliente.' }),
    input('Celular', { req: true, v: v.cel || '88884444', help: '8 dígitos.' }), input('Correo personal', { opt: true, v: v.personal || '', ph: 'usuario@dominio.com' }), full(photoField())], 2)]),
  formCard('Cuenta y acceso', 'Un único rol por usuario (RN-01).', [grid([
    input('Correo institucional', { req: true, v: v.correo || (o.edit ? 'amora@ucenfotec.ac.cr' : ''), ph: 'usuario@ucenfotec.ac.cr', err: e.correo, help: 'Debe terminar en @ucenfotec.ac.cr.' }),
    select('Rol', { req: true, v: v.rol || (o.edit ? 'Director de Escuela' : ''), err: e.rol, help: 'Administrador, Rectoría y Vicerrectoría admiten un solo usuario.' }),
    select('Escuela', { req: true, v: o.edit ? 'Ingeniería del Software' : '', dis: !o.edit, ph: 'Seleccione primero el rol', help: 'Obligatoria solo para Director de Escuela.' }), spacer(),
    input('Contraseña', { req: !o.edit, v: v.pwd || '', ph: o.edit ? 'Déjela vacía para conservarla' : '8 a 15 caracteres', err: e.pwd, help: o.edit ? 'Si la deja vacía se conserva la contraseña actual.' : 'Mayúscula, minúscula y número. Se guarda solo como hash.', trail: true }),
    input('Confirmar contraseña', { req: !o.edit, ph: 'Repita la contraseña' })], 2)])];
}
function formActions(cancelTo, label, to) { return F({ n: 'Form actions', d: 'H', g: 12, ax: 'MAX', fx: 'fill' }, [btn('Cancelar', 'Tertiary', { to: cancelTo }), btn(label, 'Primary', { icon: 'check', to })]); }
function U03() { return shell({ id: 'U-03', name: 'Registrar usuario', role: 'admin', active: 'Usuarios', crumbs: ['Usuarios', 'Registrar usuario'], title: 'Registrar usuario', sub: 'Los campos con * son obligatorios', notif: 0, back: 'Usuarios', backTo: 'U-01', body: [...userForm({ v: { correo: 'amora@ucenfotec.ac.cr' } }), formActions('U-01', 'Registrar usuario', 'U-01')] }); }
function U04() {
  return shell({ id: 'U-04', name: 'Registrar usuario · errores', role: 'admin', active: 'Usuarios', crumbs: ['Usuarios', 'Registrar usuario'], title: 'Registrar usuario', sub: 'Los campos con * son obligatorios', notif: 0, back: 'Usuarios', backTo: 'U-01',
    body: [alertN('Error', 'Revise 4 campos antes de guardar', 'Los mensajes aparecen junto a cada campo. Lo digitado se conservó.'), ...userForm({ v: { id: '112340567', correo: 'ana.mora@gmail.com', rol: 'Rectoría', pwd: 'abc12' }, err: { id: 'Ya existe un usuario con esa identificación.', correo: 'Use su correo institucional @ucenfotec.ac.cr.', rol: 'El cargo Rectoría ya está asignado a María Vargas Soto.', pwd: 'Entre 8 y 15 caracteres con al menos una mayúscula.' } }), formActions('U-01', 'Registrar usuario', 'U-01')] });
}
function U05() { return shell({ id: 'U-05', name: 'Editar usuario', role: 'admin', active: 'Usuarios', crumbs: ['Usuarios', 'Ana Mora Quesada', 'Editar'], title: 'Editar usuario', tags: [['Director de Escuela', 'Neutral']], sub: 'Ana Mora Quesada · Ingeniería del Software', notif: 0, back: 'Usuarios', backTo: 'U-01', body: [...userForm({ edit: true, v: { id: '112340567' } }), formActions('U-01', 'Guardar cambios', 'U-01')] }); }
function U06() { const r = U01(); r.name = 'U-06 · Eliminar usuario · confirmación'; return overlay(r, modal('Destructiva', '¿Eliminar a Luis Solís Rojas?', 'Se eliminarán sus datos personales y ya no podrá iniciar sesión. Esta acción no se puede deshacer.', 'Eliminar usuario', { dt: 'Luis Solís Rojas · Desarrollo Curricular', dm: 'lsolis@ucenfotec.ac.cr', to: 'U-08', back: 'U-01' }), { back: 'U-01' }); }
function U07() { const r = U01(); r.name = 'U-07 · Eliminar usuario · bloqueado'; return overlay(r, modal('Bloqueada', 'No se puede eliminar a Ana Mora Quesada', 'Es Directora de Escuela y tiene 14 cursos registrados. Tampoco puede eliminarse la cuenta propia del Administrador (RN-29).', 'Entendido', { dt: 'Ana Mora Quesada · Director de Escuela', dm: 'Ingeniería del Software · 14 cursos', to: 'U-01' }), { back: 'U-01' }); }
function U08() { const r = U01({ removed: true }); r.name = 'U-08 · Usuario eliminado · confirmación'; return toastOn(r, 'Éxito', 'Usuario eliminado.'); }

// ---------- K · Catálogos
const CATL = [['building', 'Escuelas', 7, 'K-02', 'Manual', 'Código, nombre, director'], ['graduation', 'Carreras', 18, 'K-03', 'Manual', 'Código, nombre, escuela'], ['layers', 'Áreas SFIA', 12, 'K-04', 'Manual + CSV', 'Autonumérico, nombre, descripción'], ['tag', 'Temáticas', 30, 'K-04', 'Manual + CSV', 'Autonumérico, nombre, descripción'], ['book', 'Metodologías de aprendizaje', 8, 'K-04', 'Manual', 'Código, nombre, descripción'], ['chart', 'Niveles de complejidad', 5, 'K-06', 'Fijo', '5 valores del sistema'], ['shield-check', 'Casas certificadoras', 9, 'K-04', 'Manual + CSV', 'Código, nombre'], ['check-circle', 'Certificaciones', 14, 'K-08', 'Manual', 'Nombre · incluye "No tiene"'], ['clock', 'Estados de curso', 5, 'K-06', 'Fijo', 'Flujo de 5 estados'], ['hash', 'Moneda', 2, 'K-06', 'Fijo', 'Colones, Dólares']];
function catNav(active) {
  return card([overline('Catálogos'), ...CATL.map(([ic, n, c, to, t]) => { const on = n === active; return F({ n: 'Catalog · ' + n + ' →' + to, d: 'H', g: 10, p: [10, 10], fx: 'fill', cx: 'CENTER', r: 8, bg: on ? 'bg/brand-subtle' : null }, [I(t === 'Fijo' ? 'lock' : ic, 18, on ? 'text/brand' : 'text/secondary'), T(n, on ? 'Body/MD Strong' : 'Body/MD', on ? 'text/brand' : 'text/primary', { fx: 'fill' }), T(String(c), 'Body/SM', 'text/secondary')]); })], { w: 260, p: 12, g: 2, n: 'Catalog navigation' });
}
function catShell(id, name, cat, content, o = {}) { return shell({ id, name, role: 'admin', active: 'Catálogos', crumbs: ['Catálogos', cat], title: cat, sub: o.sub, tags: o.tags, actions: o.actions, notif: 0, body: [F({ n: 'Catalog layout', d: 'H', g: 24, fx: 'fill' }, [catNav(cat), F({ n: 'Catalog content', d: 'V', g: 20, fx: 'fill' }, content)])] }); }
function K01() {
  const cards = CATL.map(([ic, n, c, to, t, f]) => card([F({ n: 'top', d: 'H', g: 12, fx: 'fill', cx: 'CENTER' }, [F({ n: 'ic', d: 'H', w: 40, h: 40, r: 999, ax: 'CENTER', cx: 'CENTER', bg: t === 'Fijo' ? 'bg/muted' : 'bg/brand-subtle' }, [I(ic, 20, t === 'Fijo' ? 'text/secondary' : 'text/brand')]), spacer(), tag(t, t === 'Fijo' ? 'Neutral' : t === 'Manual + CSV' ? 'Info' : 'Outline', t === 'Fijo' ? 'lock' : null)]),
  T(n, 'Heading/H3', 'text/primary', { fx: 'fill' }), T(f, 'Body/SM', 'text/secondary', { fx: 'fill' }), F({ n: 'foot', d: 'H', fx: 'fill', cx: 'CENTER' }, [T(c + ' elementos', 'Body/MD Medium'), spacer(), btn('Abrir', 'Tertiary', { size: 'SM', to })])], { n: 'Catalog card · ' + n, p: 20, g: 10 }));
  const rows = []; for (let i = 0; i < cards.length; i += 4) { const r = cards.slice(i, i + 4); while (r.length < 4) r.push(spacer()); rows.push(F({ n: 'Row', d: 'H', g: 20, fx: 'fill' }, r)); }
  return shell({ id: 'K-01', name: 'Catálogos · índice', role: 'admin', active: 'Catálogos', crumbs: ['Catálogos'], title: 'Catálogos maestros', sub: 'Valores estandarizados que usan los formularios de curso (RN-05)', notif: 0, actions: [btn('Importar CSV', 'Secondary', { icon: 'upload', to: 'M-01' })], body: rows });
}
function K02() {
  const dir = (n, i) => ({ node: F({ n: 'Director', d: 'H', g: 8, cx: 'CENTER', fx: 'fill' }, [inst('Avatar', { Size: 'SM' }, { Initials: i }), T(n, 'Body/MD', 'text/primary', { fx: 'fill', trunc: 1 })]) });
  const R = [['SOFT', 'Ingeniería del Software', 'Ana Mora Quesada', 'AM', '4', '39'], ['CIBER', 'Ciberseguridad', 'Carla Jiménez Ruiz', 'CJ', '2', '33'], ['SINT', 'Sistemas Inteligentes', 'Diego Rojas Alfaro', 'DR', '2', '32'], ['TI', 'Tecnologías de Información', 'Rosa Brenes Ulate', 'RB', '3', '57'], ['SI', 'Sistemas de Información', 'Pablo Arias León', 'PA', '3', '56']];
  return catShell('K-02', 'Catálogos · Escuelas', 'Escuelas', [toolbar({ p: 'Buscar por código o nombre' }, []), table([{ h: 'Código', w: 110 }, { h: 'Nombre' }, { h: 'Director de Escuela', w: 230 }, { h: 'Carreras', w: 100, al: 'R' }, { h: 'Cursos', w: 90, al: 'R' }, { h: 'Acciones', w: 112 }],
    R.map(r => [{ s: r[0] }, schoolCell(r[1]), dir(r[2], r[3]), { n2: r[4] }, { n2: r[5] }, { acts: [ib('edit', { label: 'Editar' }), ib('trash', { label: 'Eliminar', to: 'K-07' })] }]), { pager: 'Mostrando 1–5 de 7 escuelas' }),
  alertN('Info', 'Código de escuela = prefijo del código de curso', 'Ejemplo: SOFT-101. El selector de director solo lista usuarios con rol Director de Escuela (RF-011 CA2).')], { sub: '7 escuelas · el código es único', actions: [btn('Registrar escuela', 'Primary', { icon: 'plus' })] });
}
function K03() {
  return catShell('K-03', 'Catálogos · Carreras (filtro por escuela)', 'Carreras', [toolbar({ p: 'Buscar por código o nombre' }, [{ l: 'Escuela: Ingeniería del Software', a: true }]), chips(['Escuela: Ingeniería del Software']),
  table([{ h: 'Código', w: 150 }, { h: 'Nombre' }, { h: 'Escuela', w: 250 }, { h: 'En uso', w: 110, al: 'R' }, { h: 'Acciones', w: 112 }],
    [['ISW-BACH', 'Bachillerato en Ingeniería del Software', 'Ingeniería del Software', '22'], ['ISW-LIC', 'Licenciatura en Ingeniería del Software', 'Ingeniería del Software', '9'], ['TDS', 'Técnico en Desarrollo de Software', 'Ingeniería del Software', '6'], ['ISW-MAE', 'Maestría en Ingeniería del Software', 'Ingeniería del Software', '2']].map(r => [{ s: r[0] }, r[1], schoolCell(r[2]), { n2: r[3] }, { acts: [ib('edit', { label: 'Editar' }), ib('trash', { label: 'Eliminar' })] }]), { pager: 'Mostrando 1–4 de 4 carreras' })],
    { sub: 'Cada carrera pertenece a una escuela y aparece en los filtros de reportes', actions: [btn('Registrar carrera', 'Primary', { icon: 'plus' })] });
}
function K04() {
  return catShell('K-04', 'Catálogos · Áreas SFIA', 'Áreas SFIA', [alertN('Info', 'Código autonumérico · descripción opcional', 'El Área SFIA es opcional en el curso (RN-21). Mismo patrón para Temáticas; Metodologías y Casas certificadoras usan código propio.'), toolbar({ p: 'Buscar por código o nombre' }, []),
  table([{ h: 'Código', w: 90 }, { h: 'Nombre', w: 260 }, { h: 'Descripción' }, { h: 'En uso', w: 120, al: 'R' }, { h: 'Acciones', w: 112 }],
    [['1', 'Desarrollo de software', 'Diseño, construcción y pruebas de software', '23 cursos'], ['2', 'Seguridad de la información', '—', '11 cursos'], ['3', 'Ciencia de datos', 'Análisis y modelado de datos', '7 cursos'], ['4', 'Infraestructura y redes', 'Operación de servicios de TI', '14 cursos'], ['5', 'Gestión de proyectos', '—', '0']].map((r, i) => [{ s: r[0] }, r[1], { m: r[2] }, { n2: r[3] }, { acts: [ib('edit', { label: 'Editar', to: 'K-05' }), ib('trash', { label: 'Eliminar', to: i === 0 ? 'K-07' : null })] }]), { pager: 'Mostrando 1–5 de 12' })],
    { sub: '12 elementos · carga manual o CSV', actions: [btn('Importar CSV', 'Secondary', { icon: 'upload', to: 'M-01' }), btn('Registrar elemento', 'Primary', { icon: 'plus', to: 'K-05' })] });
}
function K05() {
  const r = K04(); r.name = 'K-05 · Registrar elemento · validación';
  return overlay(r, modalFrame('Registrar área SFIA', 'El elemento queda disponible de inmediato en los formularios de curso.', [input('Código', { ro: true, v: '13 · se genera automáticamente' }), input('Nombre', { req: true, v: 'Desarrollo de software', err: 'Ya existe un elemento con ese nombre.' }), textarea('Descripción', { opt: true, ph: 'Describa el alcance del área (opcional)' })], [btn('Cancelar', 'Secondary', { to: 'K-04' }), btn('Guardar', 'Primary', { icon: 'check', to: 'K-04' })], { back: 'K-04' }), { back: 'K-04' });
}
function K06() {
  return catShell('K-06', 'Catálogo fijo · Niveles de complejidad', 'Niveles de complejidad', [alertN('Info', 'Catálogo fijo del sistema', 'No se puede eliminar ni renombrar: el formulario de curso depende de estos cinco valores (RN-15, RN-27). Igual para Estados de curso y Moneda.'),
  table([{ h: 'Código', w: 100 }, { h: 'Nombre' }, { h: 'En uso', w: 140, al: 'R' }, { h: 'Protección', w: 220 }], [['1', 'Básico', '88 cursos'], ['2', 'Intermedio', '120 cursos'], ['3', 'Avanzado', '64 cursos'], ['4', 'Certificación', '21 cursos'], ['5', 'Nivel variable', '19 cursos']].map(r => [{ s: r[0] }, r[1], { n2: r[2] }, { tag: 'Fijo · sin eliminar', type: 'Neutral', icon: 'lock' }]))], { sub: '5 valores · gestionado por el sistema', tags: [['Fijo', 'Neutral', 'lock']] });
}
function K07() { const r = K04(); r.name = 'K-07 · Eliminar elemento en uso · bloqueado'; return overlay(r, modal('Bloqueada', 'No se puede eliminar «Desarrollo de software»', 'Está asignada a 23 cursos. Solo se pueden eliminar elementos que ningún curso ni usuario utiliza (RN-27).', 'Entendido', { dt: 'Área SFIA · código 1', dm: 'En uso por 23 cursos', to: 'K-04' }), { back: 'K-04' }); }
function K08() {
  return catShell('K-08', 'Catálogos · Certificaciones', 'Certificaciones', [toolbar({ p: 'Buscar por nombre' }, []),
  table([{ h: 'Nombre' }, { h: 'En uso', w: 140, al: 'R' }, { h: 'Acciones', w: 240 }], [[{ node: F({ n: 'n', d: 'H', g: 8, cx: 'CENTER' }, [T('No tiene', 'Body/MD Strong'), tag('Opción del sistema', 'Neutral', 'lock')]) }, { n2: '204 cursos' }, { m: 'Siempre disponible · no se elimina' }], ['AWS Certified Cloud Practitioner', { n2: '6 cursos' }, { acts: [ib('edit', { label: 'Editar' }), ib('trash', { label: 'Eliminar' })] }], ['Cisco CCNA', { n2: '9 cursos' }, { acts: [ib('edit', { label: 'Editar' }), ib('trash', { label: 'Eliminar' })] }], ['Scrum Fundamentals Certified', { n2: '0' }, { acts: [ib('edit', { label: 'Editar' }), ib('trash', { label: 'Eliminar' })] }]], { pager: 'Mostrando 1–4 de 14' }),
  alertN('Info', 'Regla RN-25', 'Si el curso tiene una certificación distinta de «No tiene», la casa certificadora es obligatoria al enviar.')], { sub: 'Nombre único · incluye siempre «No tiene»', actions: [btn('Registrar certificación', 'Primary', { icon: 'plus' })] });
}

// ---------- M · Importación CSV
function csvSteps(cur) {
  const st = ['Seleccionar', 'Validar', 'Resultado'];
  const kids = []; st.forEach((s, i) => { const done = i < cur, on = i === cur; kids.push(F({ n: 'Step ' + (i + 1), d: 'H', g: 10, cx: 'CENTER' }, [F({ n: 'c', d: 'H', w: 28, h: 28, r: 999, ax: 'CENTER', cx: 'CENTER', bg: done ? 'feedback/success' : on ? 'action/primary' : 'bg/surface', st: done || on ? null : 'border/strong' }, [done ? I('check', 16, 'text/inverse') : T(String(i + 1), 'Body/MD Strong', on ? 'text/inverse' : 'text/secondary')]), T(s, on ? 'Body/MD Strong' : 'Body/MD', on ? 'text/brand' : done ? 'text/primary' : 'text/secondary')])); if (i < 2) kids.push(F({ n: 'line', h: 2, w: 80, r: 1, bg: done ? 'feedback/success' : 'border/default' })); });
  return F({ n: 'CSV steps', d: 'H', g: 16, cx: 'CENTER' }, kids);
}
function csvShell(id, name, body) { return shell({ id, name, role: 'admin', active: 'Importar CSV', crumbs: ['Catálogos', 'Importar CSV'], title: 'Importar CSV', sub: 'Carga masiva de Áreas SFIA, Temáticas y Casas certificadoras · todo o nada', notif: 0, body: [csvSteps(id === 'M-01' ? 0 : id === 'M-02' ? 1 : 2), ...body] }); }
function catOption(t, h, on) { return F({ n: 'Option · ' + t, d: 'V', g: 6, p: 16, fx: 'fill', r: 12, bg: on ? 'bg/brand-subtle' : 'bg/surface', st: on ? 'action/primary' : 'border/default', sw: on ? 2 : 1 }, [inst('Radio', { Selected: on ? 'On' : 'Off', State: 'Default' }, { Label: t }), T('Encabezados: ' + h, 'Body/SM', 'text/secondary', { fx: 'fill' })]); }
function M01() {
  return csvShell('M-01', 'Importar CSV · selección', [formCard('1. Catálogo destino', 'Elija dónde se crearán los elementos', [F({ n: 'Options', d: 'H', g: 16, fx: 'fill' }, [catOption('Áreas SFIA', 'nombre,descripcion', true), catOption('Temáticas', 'nombre,descripcion'), catOption('Casas certificadoras', 'codigo,nombre')])]),
  formCard('2. Archivo', 'Archivo .csv en UTF-8 · hasta 1 000 filas (≤ 10 s)', [alertN('Info', 'Formato requerido', 'Primera fila con los encabezados exactos "nombre,descripcion". Si una fila tiene error, se rechaza la carga completa; los nombres duplicados se omiten y se reportan.'), inst('File Dropzone', { State: 'Default' }), inst('File Item', { State: 'Subido' }, { Name: 'areas_sfia.csv', Meta: '12 KB · 248 filas · UTF-8' })]),
  F({ n: 'Actions', d: 'H', g: 12, ax: 'MAX', fx: 'fill' }, [btn('Cancelar', 'Tertiary', { to: 'K-01' }), btn('Validar e importar', 'Primary', { icon: 'upload', to: 'M-03' })])]);
}
function M02() {
  return csvShell('M-02', 'Importar CSV · rechazo con errores', [alertN('Error', 'Carga rechazada · no se importó ningún registro', 'El archivo tiene 2 errores. Corríjalos y vuelva a cargarlo: la importación es todo o nada (RF-017 CA2).'),
  card([cardHead('Errores encontrados', 'areas_sfia.csv · 248 filas'), table([{ h: 'Fila', w: 90 }, { h: 'Columna', w: 160 }, { h: 'Error' }, { h: 'Valor recibido', w: 260 }], [[{ s: '1' }, 'Encabezados', 'Se esperaban los encabezados "nombre,descripcion"', { m: 'name,description' }], [{ s: '14' }, 'nombre', 'Campo obligatorio vacío', { m: '(vacío)' }]])]),
  F({ n: 'Actions', d: 'H', g: 12, ax: 'MAX', fx: 'fill' }, [btn('Cancelar', 'Tertiary', { to: 'K-01' }), btn('Elegir otro archivo', 'Primary', { icon: 'upload', to: 'M-01' })])]);
}
function M03() {
  return csvShell('M-03', 'Importar CSV · resultado', [alertN('Éxito', 'Importación completada', 'Se importaron 245 elementos al catálogo Áreas SFIA en 2,1 s.'), kpiRow([['Importados', '245', 'Nuevos elementos', 'check-circle'], ['Duplicados omitidos', '3', 'Ya existían', 'copy'], ['Rechazados', '0', 'Sin errores', 'x-circle'], ['Tiempo', '2,1 s', 'Límite 10 s', 'clock']], 'Plano'),
  card([cardHead('Filas omitidas por duplicado', 'No detienen la carga (RF-017 CA3)'), table([{ h: 'Fila', w: 90 }, { h: 'Nombre' }, { h: 'Motivo', w: 320 }], [[{ s: '8' }, 'Desarrollo de software', { tag: 'Ya existe en el catálogo', type: 'Warning' }], [{ s: '52' }, 'Ciencia de datos', { tag: 'Ya existe en el catálogo', type: 'Warning' }], [{ s: '190' }, 'Infraestructura y redes', { tag: 'Ya existe en el catálogo', type: 'Warning' }]])]),
  F({ n: 'Actions', d: 'H', g: 12, ax: 'MAX', fx: 'fill' }, [btn('Importar otro archivo', 'Secondary', { icon: 'upload', to: 'M-01' }), btn('Ver catálogo', 'Primary', { to: 'K-04' })])]);
}

// ---------- C · Consulta de cursos
function C01() {
  return shell({ id: 'C-01', name: 'Cursos · listado global', role: 'admin', active: 'Cursos', crumbs: ['Cursos'], title: 'Cursos', sub: '312 cursos de todas las escuelas · los Inactivos se ven con el filtro Estado', notif: 0, navTo: { Usuarios: 'U-01', 'Catálogos': 'K-01', Reportes: 'RP-01' },
    body: [toolbar({ p: 'Buscar por código o nombre' }, [{ l: 'Escuela: Todas' }, { l: 'Estado: Todos excepto Inactivo' }]), table(COURSE_COLS, courseRows(COURSES), { pager: 'Mostrando 1–9 de 312 cursos' }),
    T('Rectoría y Vicerrectoría ven la misma tabla sin la acción "Cambiar a Inactivo" (RF-008 CA3, RF-035 CA4).', 'Body/SM', 'text/secondary', { fx: 'fill' })] });
}
function C02(o = {}) {
  const mine = [['SOFT-210', 'Arquitectura de software', 'Ingeniería del Software', 'Borrador', '12/10/2026 10:24'], [null, 'Pruebas de software', 'Ingeniería del Software', 'En desarrollo', '06/10/2026 09:12'], ['SOFT-101', 'Fundamentos de programación', 'Ingeniería del Software', 'Aprobado', '12/10/2026 14:05'], ['SOFT-118', 'Desarrollo web I', 'Ingeniería del Software', 'En producción', '11/10/2026 17:20'], ['SOFT-305', 'Patrones de diseño', 'Ingeniería del Software', 'Borrador', '02/10/2026 09:40'], ['SOFT-220', 'Ingeniería de requerimientos', 'Ingeniería del Software', 'En producción', '20/09/2026 11:00']];
  const en = o.en;
  const cols = en ? [{ h: 'Code', w: 170 }, { h: 'Course name', sort: true }, { h: 'School', w: 250 }, { h: 'Status', w: 170 }, { h: 'Last modified', w: 180, sort: true }, { h: 'Action', w: 112 }] : COURSE_COLS.map((c, i) => i === 5 ? { h: 'Acción', w: 112 } : c);
  const rows = courseRows(mine, { en, detail: 'F-13', actsFn: c => c[3] === 'Borrador' ? [ib('edit', { label: en ? 'Edit' : 'Editar', to: 'F-02' })] : [ib('eye', { label: en ? 'View' : 'Ver', to: 'F-13' })] }).map((r, i) => { if (mine[i][3] === 'Borrador') r.to = 'F-02'; return r; });
  if (en) rows.forEach((r, i) => { if (!mine[i][0]) r.c[0] = { tag: 'Code pending', type: 'Warning', icon: 'hash' }; });
  return shell({ id: o.id || 'C-02', name: o.name || 'Mis cursos · Director', role: 'dir', active: 'Mis cursos', en, navLabels: en ? { Inicio: 'Home', 'Mis cursos': 'My courses', Reportes: 'Reports' } : null, userRole: en ? 'Director · Software Engineering' : null,
    crumbs: [en ? 'My courses' : 'Mis cursos'], title: en ? 'My courses' : 'Mis cursos', sub: en ? 'School of Software Engineering · 36 courses' : 'Escuela de Ingeniería del Software · 36 cursos', navTo: { Inicio: 'P-02', Reportes: 'RP-02' },
    actions: [btn(en ? 'New course' : 'Nuevo curso', 'Primary', { icon: 'plus', to: 'F-01' })],
    body: [toolbar({ p: en ? 'Search by code or name' : 'Buscar por código o nombre' }, [{ l: en ? 'School: Software Engineering' : 'Escuela: Ingeniería del Software', dis: true }, { l: en ? 'Status: All' : 'Estado: Todos' }]), table(cols, rows, { pager: en ? 'Showing 1–6 of 36 courses' : 'Mostrando 1–6 de 36 cursos' }),
    en ? alertN('Info', 'User-entered data is not translated', 'Course names and descriptions appear exactly as they were entered (RF-044 CA4).') : T('El filtro de escuela está fijo: solo ve los cursos de su escuela (RF-009, RF-041 CA3).', 'Body/SM', 'text/secondary', { fx: 'fill' })] });
}
function C03() { return shell({ id: 'C-03', name: 'Cursos · sin resultados', role: 'admin', active: 'Cursos', crumbs: ['Cursos'], title: 'Cursos', sub: '312 cursos de todas las escuelas', notif: 0, body: [toolbar({ v: 'blockchain' }, [{ l: 'Escuela: Ciberseguridad', a: true }, { l: 'Estado: Aprobado', a: true }]), chips(['Escuela: Ciberseguridad', 'Estado: Aprobado']), statePanel('Sin resultados', 'No hay cursos que coincidan', 'Pruebe con otro término o limpie los filtros. La búsqueda no distingue mayúsculas ni tildes.', 'Limpiar filtros', { to: 'C-01' })] }); }
function C04() { return shell({ id: 'C-04', name: 'Cursos · carga y error de red', role: 'admin', active: 'Cursos', crumbs: ['Cursos'], title: 'Cursos', sub: '312 cursos de todas las escuelas', notif: 0, body: [toolbar({ p: 'Buscar por código o nombre' }, [{ l: 'Escuela: Todas' }, { l: 'Estado: Todos excepto Inactivo' }]), overline('Estado de carga (> 300 ms)'), inst('Skeleton/Table', null, null, { fx: 'fill' }), overline('Estado de error de red'), statePanel('Error de red', 'No pudimos cargar los cursos', 'Revise su conexión. Sus filtros y búsqueda se conservaron.', 'Reintentar', { to: 'C-01' })] }); }

// course detail (shared by C-05, C-06, F-13, R-*)
function courseSections(o = {}) {
  const c = CRS;
  const pcLen = c.pc.length;
  return [kvCard('Identificación', [['Código', c.code], ['Escuela', c.school], ['Nombre del curso', c.name], ['Solicitó código a Desarrollo Curricular', o.reqCode ? 'Sí' : 'No']]),
  kvCard('Clasificación académica', [['Área SFIA', c.sfia], ['Temática', c.tema], ['Metodología de aprendizaje', c.metod], ['Nivel de complejidad', c.nivel], ['Certificación', c.cert], ['Casa certificadora', c.casa]]),
  kvCard('Carga académica y modalidad', [['Créditos', c.cred], ['Modalidad', c.mod], ['Horas clase', c.hc], ['Horas extra clase', c.hec], ['Total de horas', c.tot + ' (calculado)']]),
  kvCard('Textos y descripciones', [['Nombre en Power Campus', c.pc + '  ·  ' + pcLen + '/40'], ['Meta descripción', c.meta]], 2, [kv('Descripción corta', c.corta), kv('Descripción larga', c.larga)])];
}
function filesCard(ro) { return card([T('Adjuntos', 'Heading/H3'), inst('File Item', { State: ro ? 'Solo lectura' : 'Subido' }, { Name: 'Sílabo_SOFT-210.pdf', Meta: '1,2 MB · 12/10/2026 10:15' }, { fx: 'fill' }), inst('File Item', { State: ro ? 'Solo lectura' : 'Subido' }, { Name: 'Programa_detallado.docx', Meta: '840 KB · 12/10/2026 10:18' }, { fx: 'fill' })], { n: 'Adjuntos', p: 20 }); }
function statusCard(state, lines) { return card([T('Estado', 'Heading/H3'), badge(state), ...lines.map(([k, v]) => kv(k, v))], { n: 'Estado', p: 20, g: 12 }); }
const TL_BASE = [['Creado como borrador', 'Ana Mora Quesada · 01/10/2026 08:40'], ['Último guardado', 'Ana Mora Quesada · 12/10/2026 10:24'], ['Enviado a revisión', 'Ana Mora Quesada · 12/10/2026 10:30']];
function detailBody(right, o = {}) { return [...(o.top || []), F({ n: 'Detail layout', d: 'H', g: 24, fx: 'fill' }, [F({ n: 'Main column', d: 'V', g: 20, fx: 'fill' }, [tabsRow(['Resumen', 'Competencia y perfiles', 'Programa y metadata', ['Adjuntos', 2], 'Historial'], 0), ...courseSections(o)]), F({ n: 'Side column', d: 'V', g: 20, w: o.sideW || 360 }, right)])]; }
function C05() {
  return shell({ id: 'C-05', name: 'Detalle de curso · solo lectura', role: 'rect', active: 'Cursos', crumbs: ['Cursos', 'SOFT-210'], title: 'SOFT-210 · Arquitectura de software', badge: 'Aprobado', tags: [['Solo lectura', 'Neutral', 'lock']], sub: 'Ingeniería del Software · Última modificación 12/10/2026 15:10', back: 'Cursos', backTo: 'C-01', navTo: { Reportes: 'RP-01', Inicio: 'P-04' },
    body: detailBody([statusCard('Aprobado', [['Aprobado por', 'Luis Solís Rojas · 12/10/2026 15:10'], ['Código', 'SOFT-210 · validado']]), timeline([...TL_BASE, ['Código validado', 'Luis Solís Rojas · 12/10/2026 15:02'], ['Aprobado', 'Luis Solís Rojas · 12/10/2026 15:10', 'Actual']]), filesCard(true)]) });
}
function pcRow(k, v, extra) { return F({ n: 'PC field · ' + k, d: 'H', g: 8, p: [10, 0], fx: 'fill', cx: 'CENTER', st: 'border/subtle', sides: [0, 0, 1, 0] }, [F({ n: 'kv', d: 'V', g: 2, fx: 'fill' }, [T(k, 'Body/SM Medium', 'text/secondary'), T(v, 'Body/MD Strong', 'text/primary', { fx: 'fill' }), extra ? T(extra, 'Body/SM', 'text/secondary') : null]), ib('copy', { label: 'Copiar ' + k })]); }
function C06() {
  const pc = card([cardHead('Datos para Power Campus', 'Copie cada valor al transcribir'), pcRow('Código', 'SOFT-210'), pcRow('Nombre en Power Campus', CRS.pc, CRS.pc.length + '/40 caracteres'), pcRow('Créditos', '4'), pcRow('Horas clase / extra clase', '48 / 96', 'Total 144'), pcRow('Modalidad', 'Presencial'), pcRow('Descripción corta', CRS.corta.slice(0, 60) + '…', CRS.corta.length + '/250'),
  alertN('Info', 'Transcripción manual', 'El sistema no se integra con Power Campus (RN-24).')], { n: 'Power Campus panel', p: 20, g: 4 });
  return shell({ id: 'C-06', name: 'Detalle · datos para Power Campus', role: 'vice', active: 'Cursos aprobados', crumbs: ['Cursos aprobados', 'SOFT-210'], title: 'SOFT-210 · Arquitectura de software', badge: 'Aprobado', tags: [['Solo lectura', 'Neutral', 'lock']], sub: 'Aprobado 12/10/2026 15:10 · Ingeniería del Software', back: 'Cursos aprobados', backTo: 'P-05', navTo: { Inicio: 'P-05' },
    body: detailBody([pc, filesCard(true)], { sideW: 400 }) });
}
function C07() { const r = C01(); r.name = 'C-07 · Cambiar curso a Inactivo · confirmación'; return overlay(r, modal('Destructiva', '¿Cambiar SOFT-210 a Inactivo?', 'El curso deja de aparecer en el listado por defecto. No se borra: conserva sus datos e historial y se consulta con el filtro Estado = Inactivo.', 'Cambiar a Inactivo', { dt: 'SOFT-210 · Arquitectura de software', dm: 'Ingeniería del Software · Borrador', to: 'C-01', back: 'C-01' }), { back: 'C-01' }); }

// ---------- F · Formulario de curso (Director)
const STEP_TO = ['F-01', 'F-02', 'F-03', 'F-04', 'F-05', 'F-06', 'F-07', 'F-08'];
function formScreen(o) {
  const footer = inst('Form Action Bar', null, { Status: o.status || 'Borrador guardado · 12/10/2026 10:24' });
  footer.name = 'Form Action Bar';
  linkBtn(footer, 'Cancelar', 'C-02'); linkBtn(footer, 'Guardar borrador', o.saveTo || 'F-03'); linkBtn(footer, 'Listo para enviar', o.sendTo || 'F-11');
  return shell({ id: o.id, name: o.name, role: 'dir', active: 'Mis cursos', crumbs: ['Mis cursos', o.crumb || 'SOFT-210 · Arquitectura de software'], title: o.title || 'SOFT-210 · Arquitectura de software', badge: o.badge === undefined ? 'Borrador' : o.badge, tags: o.tags, sub: o.sub || 'Ingeniería del Software · Último guardado 12/10/2026 10:24', back: 'Mis cursos', backTo: 'C-02', navTo: { Inicio: 'P-02', 'Mis cursos': 'C-02' },
    footer, body: [...(o.top || []), F({ n: 'Form layout', d: 'H', g: 24, fx: 'fill' }, [stepper(o.step, { to: STEP_TO, pct: o.pct, errs: o.errs, errSub: o.errSub, done: o.done }), F({ n: 'Sections', d: 'V', g: 24, fx: 'fill' }, o.cards)])] });
}
function F01() {
  return formScreen({ id: 'F-01', name: 'Nuevo curso · 1 Identificación', step: 0, pct: 10, title: 'Nuevo curso', badge: null, tags: [['Sin guardar', 'Warning']], crumb: 'Nuevo curso', sub: 'Se crea en estado Borrador al guardar', status: 'Sin guardar', saveTo: 'F-02',
    cards: [alertN('Info', 'Guardado progresivo', 'Para guardar el borrador bastan Escuela, Código (o la solicitud a Desarrollo Curricular) y Nombre. Los demás campos se exigen al enviar.'),
    formCard('1. Identificación', 'Datos mínimos para crear el borrador', [grid([input('Escuela', { ro: true, v: 'Ingeniería del Software', help: 'Asignada según su perfil; no se puede cambiar (RF-009 CA2).' }), input('Código del curso', { req: true, v: 'SOFT-210', help: 'Formato PREFIJO-NÚMERO, p. ej. SOFT-101. Debe ser único.' }),
    full(F({ n: 'Request code', d: 'V', g: 4, fx: 'fill' }, [check('Solicitar código a Desarrollo Curricular', false), T('Si no conoce el código, márquelo: el campo Código deja de ser obligatorio y Desarrollo Curricular lo generará durante la revisión.', 'Body/SM', 'text/secondary', { fx: 'fill' })])),
    full(input('Nombre del curso', { req: true, v: 'Arquitectura de software', help: 'Mínimo 3 caracteres.' }))], 2)])] });
}
function F02(o = {}) {
  const e = o.err;
  return formScreen({ id: o.id || 'F-02', name: o.name || '2 Clasificación académica', step: 1, pct: o.pct || 25, top: o.top, errs: o.errs, errSub: o.errSub, done: o.done,
    cards: [formCard('2. Clasificación académica', 'Solo se ofrecen valores vigentes de cada catálogo', [grid([select('Área SFIA', { opt: true, v: e ? '' : 'Desarrollo de software', help: 'Opcional (RN-21).' }), select('Temática', { req: true, v: e ? '' : 'Ingeniería de software', err: e && 'Seleccione una temática.' }),
    select('Metodología de aprendizaje', { req: true, v: e ? '' : 'Aprendizaje basado en proyectos', err: e && 'Seleccione una metodología de aprendizaje.' }), select('Nivel de complejidad', { req: true, v: e ? '' : 'Intermedio', open: !e, err: e && 'Seleccione un nivel de complejidad.' }),
    select('Certificación', { req: true, v: e ? 'Cisco CCNA' : 'No tiene', help: 'Incluye siempre la opción «No tiene».' }), select('Casa certificadora', { req: !!e, v: '', dis: !e, ph: e ? 'Seleccione una opción' : 'No aplica', err: e && 'Obligatoria porque el curso tiene certificación (RN-25).', help: 'Obligatoria solo si el curso tiene certificación (RN-25).' })], 2)])] });
}
function F03() {
  const r = formScreen({ id: 'F-03', name: '3 Carga académica y modalidad', step: 2, pct: 40,
    cards: [formCard('3. Carga académica y modalidad', 'El total de horas se calcula automáticamente', [grid([input('Créditos', { req: true, v: '4', help: 'Número entero entre 1 y 12.' }), input('Total de horas', { ro: true, v: '144', help: 'Horas clase + Horas extra clase · no editable (RN-16).' }),
    input('Horas clase', { req: true, v: '48', help: 'Entero entre 0 y 300.' }), input('Horas extra clase', { req: true, v: '96', help: 'Entero entre 0 y 300.' }),
    full(radios('Modalidad', ['Presencial', 'Virtual sincrónica', 'Virtual asincrónica', 'Híbrida'], 'Presencial', { req: true, help: 'Valores fijos (RN-14).' }))], 2)])] });
  return toastOn(r, 'Éxito', 'Borrador guardado · 12/10/2026 10:24');
}
function F04(o = {}) {
  const cards = [alertN('Info', 'Asistencia de redacción con Gemini', 'Disponible en Metodología, Descripción corta, Meta descripción y Descripción larga. La propuesta solo reemplaza su texto si usted la acepta.'),
  formCard('4. Textos y descripciones', 'Contadores en tiempo real; el texto no se recorta automáticamente', [
    withCounter(input('Nombre en Power Campus', { req: true, v: CRS.pc }), CRS.pc.length + '/40', 'Máximo 40 caracteres (límite de Power Campus, RN-17).'),
    o.ai === 'short' ? textarea('Descripción corta', { req: true, v: 'Curso sobre arquitectura de software.', cnt: '37/250', ai: true }) : textarea('Descripción corta', { req: true, v: CRS.corta, cnt: CRS.corta.length + '/250', ai: true, aiTo: 'F-09' }),
    ...(o.ai === 'short' ? [o.panel] : []),
    textarea('Meta descripción', { req: true, v: CRS.meta, cnt: CRS.meta.length + '/155', ai: true }),
    textarea('Descripción larga', { req: true, v: CRS.larga, ai: true, aiTo: 'F-10' }), ...(o.ai === 'long' ? [o.panel] : []),
    F({ n: 'Metodología (pendiente)', d: 'V', g: 8, fx: 'fill' }, [tag('Pendiente de validar · Apéndice E', 'Warning', 'alert-triangle'), textarea('Metodología de aprendizaje (redacción)', { opt: true, ai: true, ph: 'Describa cómo se desarrollará el aprendizaje…', help: 'Si la metodología también es texto (además del catálogo), Gemini puede sugerir su redacción (RF-028).' })])])];
  return formScreen({ id: o.id || 'F-04', name: o.name || '4 Textos y descripciones', step: 3, pct: 60, cards });
}
function F05() {
  return formScreen({ id: 'F-05', name: '5 Competencia y perfiles', step: 4, pct: 75,
    cards: [formCard('5. Competencia, requisitos y perfiles', 'Propósito formativo y a quién está dirigido', [grid([full(textarea('Competencia', { req: true, v: CRS.comp, help: 'Sin asistencia de IA (RN-22).' })), full(textarea('Capacidades específicas', { req: true, v: CRS.capac })),
    textarea('Requisitos indispensables', { req: true, v: CRS.reqI }), textarea('Requisitos deseables', { req: true, v: CRS.reqD }), textarea('Perfil de ingreso', { req: true, v: CRS.pIn }), textarea('Perfil de salida', { req: true, v: CRS.pOut }),
    full(tagsField('Palabras clave', CRS.kw, { req: true }))], 2)])] });
}
function F06() {
  return formScreen({ id: 'F-06', name: '6 Programa, e-commerce y metadata', step: 5, pct: 85,
    cards: [formCard('6a. Programa', 'Si marca la casilla, el nombre del programa es obligatorio', [check('Pertenece a un programa', true), input('Nombre del programa', { req: true, v: 'Técnico en Desarrollo de Software' })]),
    formCard('6b. E-commerce', 'Disponibilidad comercial del curso', [radios('E-commerce abierto', ['Sí', 'No'], 'Sí', { req: true }), grid([dateF('Fecha de inicio', { req: true, v: '15/01/2027' }), dateF('Fecha de fin', { req: true, v: '10/01/2027', err: 'La fecha de fin no puede ser anterior a la de inicio.' })], 2)]),
    formCard('6c. Metadata', 'Texto libre · estructura pendiente de validar (Apéndice E)', [textarea('Metadata', { req: true, v: CRS.metaD }), input('Última modificación de la metadata', { ro: true, v: '12/10/2026 10:20 · automática', help: 'Independiente de la última modificación del curso (RN-26).' })])] });
}
function F07() {
  return formScreen({ id: 'F-07', name: '7 Adjuntos', step: 6, pct: 95,
    cards: [formCard('7. Adjuntos (opcional)', 'Respaldan la revisión de Desarrollo Curricular', [inst('File Dropzone', { State: 'Error' }), inst('File Item', { State: 'Subido' }, { Name: 'Sílabo_SOFT-210.pdf', Meta: '1,2 MB · 12/10/2026 10:15' }, { fx: 'fill' }), inst('File Item', { State: 'Subido' }, { Name: 'Programa_detallado.docx', Meta: '840 KB · 12/10/2026 10:18' }, { fx: 'fill' }), T('Solo .doc, .docx o .pdf de hasta 10 MB cada uno (RN-28).', 'Body/SM', 'text/secondary', { fx: 'fill' })])] });
}
function reviewRow(ok, name, detail, to) { return F({ n: 'Section check · ' + name + ' →' + to, d: 'H', g: 12, p: [14, 0], fx: 'fill', cx: 'CENTER', st: 'border/subtle', sides: [0, 0, 1, 0] }, [I(ok ? 'check-circle' : 'alert-triangle', 20, ok ? 'feedback/success' : 'feedback/warning'), F({ n: 't', d: 'V', g: 2, fx: 'fill' }, [T(name, 'Body/MD Strong'), T(detail, 'Body/SM', ok ? 'text/secondary' : 'feedback/warning')]), btn('Ir a la sección', 'Tertiary', { size: 'SM', to })]); }
function F08(o = {}) {
  return formScreen({ id: o.id || 'F-08', name: o.name || '8 Revisión y envío', step: 7, pct: 100, sendTo: 'F-12',
    cards: [card([cardHead('Resumen antes de enviar', 'Todas las secciones obligatorias están completas'), ...STEPS.slice(0, 7).map((s, i) => reviewRow(true, (i + 1) + '. ' + s, i === 6 ? '2 adjuntos (opcional)' : 'Completo', STEP_TO[i]))], { n: 'Completitud' }),
    kvCard('Datos clave del curso', [['Código', 'SOFT-210'], ['Nombre', CRS.name], ['Créditos · Total de horas', '4 · 144'], ['Modalidad · Nivel', 'Presencial · Intermedio']]),
    alertN('Info', 'Qué ocurre al enviar', 'El curso pasa a En desarrollo, Desarrollo Curricular recibe un correo y una notificación de escritorio, y usted ya no podrá editarlo (RN-09).')] });
}
function F09() {
  const ai = inst('AI Suggestion Panel', { Estado: 'Propuesta' }, null, { fx: 'fill' });
  const prop = 'Curso intermedio que desarrolla la capacidad de diseñar, documentar y evaluar arquitecturas de software mediante estilos, patrones y atributos de calidad, con un proyecto aplicado.';
  txt(ai, 'Proposal', prop); const cnt = ai.findOne(x => x.type === 'INSTANCE' && x.componentProperties && Object.keys(x.componentProperties).some(k => k.split('#')[0] === 'Count')); setP(cnt, { Count: prop.length + '/250' });
  linkBtn(ai, 'Usar propuesta', 'F-04'); linkBtn(ai, 'Descartar', 'F-04');
  return F04({ id: 'F-09', name: 'Gemini · propuesta editable', ai: 'short', panel: ai });
}
function F10() { const ai = inst('AI Suggestion Panel', { Estado: 'Error' }, null, { fx: 'fill' }); linkBtn(ai, 'Cerrar', 'F-04'); return F04({ id: 'F-10', name: 'Gemini · error sin pérdida de datos', ai: 'long', panel: ai }); }
function F11() { return F02({ id: 'F-11', name: 'Envío bloqueado · validación', err: true, pct: 70, errs: [1, 4], errSub: { 1: '4 campos por corregir', 4: '1 campo por corregir' }, done: [0, 2, 3, 5, 6], top: [alertN('Error', 'No se puede enviar: 5 campos requieren atención', 'Corríjalos en las secciones marcadas. El foco se movió al primer campo con error y todo lo digitado se conservó (RF-030 CA2).', { action: 'Ir al primer error' })] }); }
function F12() { const r = F08({ id: 'F-12', name: 'Confirmar envío a revisión' }); return overlay(r, modal('Confirmación', '¿Enviar SOFT-210 a revisión?', 'El curso pasará a En desarrollo y ya no podrá editarlo. Desarrollo Curricular recibirá un correo y una notificación de escritorio.', 'Enviar a revisión', { dt: 'SOFT-210 · Arquitectura de software', dm: 'Ingeniería del Software · 8 de 8 secciones completas', to: 'F-13', back: 'F-08' }), { back: 'F-08' }); }
function F13() {
  return shell({ id: 'F-13', name: 'Curso enviado · En desarrollo (solo lectura)', role: 'dir', active: 'Mis cursos', crumbs: ['Mis cursos', 'SOFT-210'], title: 'SOFT-210 · Arquitectura de software', badge: 'En desarrollo', tags: [['Solo lectura', 'Neutral', 'lock']], sub: 'Enviado 12/10/2026 10:30 · Ingeniería del Software', back: 'Mis cursos', backTo: 'C-02', navTo: { Inicio: 'P-02', 'Mis cursos': 'C-02' },
    body: detailBody([statusCard('En desarrollo', [['En revisión por', 'Desarrollo Curricular'], ['Enviado', '12/10/2026 10:30']]), timeline([...TL_BASE.slice(0, 2), [TL_BASE[2][0], TL_BASE[2][1], 'Actual'], ['Revisión y aprobación', 'Pendiente', 'Pendiente']]), filesCard(true)], { top: [alertN('Éxito', 'Curso enviado a revisión', 'Desarrollo Curricular fue notificado. Le avisaremos por correo cuando sea aprobado. El curso ya no es editable (RF-019 CA4).')] }) });
}

// ---------- R · Revisión (Desarrollo Curricular)
function codePanel(mode) {
  const head = T('Código del curso', 'Heading/H3');
  if (mode === 'validate') return card([head, kv('Registrado por la Directora', T('SOFT-210', 'Heading/H2', 'text/primary')), tag('Sin validar', 'Warning', 'alert-triangle'), F({ n: 'acts', d: 'H', g: 8, fx: 'fill' }, [btn('Corregir', 'Secondary', { size: 'SM', icon: 'edit', to: 'R-04' }), btn('Validar código', 'Primary', { size: 'SM', icon: 'check', to: 'R-05' })]), T('Formato PREFIJO-NÚMERO, único. Desarrollo Curricular es la autoridad final (RN-10).', 'Body/SM', 'text/secondary', { fx: 'fill' })], { n: 'Code panel', p: 20, g: 12 });
  if (mode === 'generate') return card([head, alertN('Info', 'La Directora solicitó el código', 'Genere el siguiente código disponible con el prefijo de la escuela y ajústelo si es necesario (RF-032 CA3).'), btn('Generar código', 'Secondary', { icon: 'refresh', fx: 'fill' }), input('Código propuesto', { req: true, v: 'SOFT-211', help: 'Siguiente disponible para SOFT. Puede ajustarlo antes de confirmar.' }), btn('Confirmar código', 'Primary', { icon: 'check', fx: 'fill', to: 'R-05' })], { n: 'Code panel', p: 20, g: 12 });
  if (mode === 'correct') return card([head, input('Nuevo código', { req: true, v: 'SOFT-101', err: 'Ya existe un curso con ese código.' }), T('Se registrará quién y cuándo cambió el código (RF-032 CA2).', 'Body/SM', 'text/secondary', { fx: 'fill' }), F({ n: 'acts', d: 'H', g: 8, fx: 'fill', ax: 'MAX' }, [btn('Cancelar', 'Tertiary', { size: 'SM', to: 'R-02' }), btn('Guardar código', 'Primary', { size: 'SM', icon: 'check' })])], { n: 'Code panel', p: 20, g: 12 });
  return card([head, kv('Código', T('SOFT-210', 'Heading/H2', 'text/primary')), tag('Validado · L. Solís · 12/10/2026 15:02', 'Success', 'check-circle')], { n: 'Code panel', p: 20, g: 12 });
}
function decisionPanel(mode) {
  const head = T('Decisión', 'Heading/H3');
  const k = { blocked: [btn('Aprobar curso', 'Primary', { state: 'Disabled', fx: 'fill', icon: 'check' }), T('Valide el código para habilitar la aprobación (RN-10, RF-032 CA4).', 'Body/SM', 'text/secondary', { fx: 'fill' })],
    ready: [btn('Aprobar curso', 'Primary', { fx: 'fill', icon: 'check', to: 'R-05' }), T('Se avisará a la Directora y a Vicerrectoría.', 'Body/SM', 'text/secondary', { fx: 'fill' })],
    approved: [btn('Pasar a En producción', 'Secondary', { fx: 'fill', icon: 'play', to: 'R-08' }), btn('Cambiar a Inactivo', 'Tertiary', { fx: 'fill', icon: 'archive', to: 'R-09' }), T('"Pasar a En producción" cuando el curso empiece a ofertarse (RN-11).', 'Body/SM', 'text/secondary', { fx: 'fill' })],
    production: [btn('Cambiar a Inactivo', 'Secondary', { fx: 'fill', icon: 'archive', to: 'R-09' })],
    error: [btn('Reintentar aprobación', 'Primary', { fx: 'fill', icon: 'refresh', to: 'R-06' })] }[mode];
  return card([head, ...k], { n: 'Decision panel', p: 20, g: 12 });
}
function reviewScreen(o) {
  return shell({ id: o.id, name: o.name, role: 'dc', active: 'Bandeja de revisión', crumbs: ['Bandeja de revisión', o.crumb || 'SOFT-210'], title: o.title || 'SOFT-210 · Arquitectura de software', badge: o.state || 'En desarrollo', tags: o.tags, sub: 'Ingeniería del Software · Enviado por Ana Mora Quesada · 12/10/2026 10:30', back: 'Bandeja de revisión', backTo: 'R-01', notif: 2, bellTo: 'N-01', navTo: { 'Bandeja de revisión': 'R-01', Inicio: 'P-03', Cursos: 'C-01' },
    body: detailBody([...o.panels, filesCard(true)], { top: o.top, reqCode: o.reqCode, sideW: 380 }) });
}
function R01(o = {}) {
  const rows = [[null, 'Pruebas de software', 'Ingeniería del Software', '06/10/2026', '5 días', '1', 'R-03'], ['CIBER-204', 'Hacking ético', 'Ciberseguridad', '07/10/2026', '4 días', '2', 'R-02'], ['SINT-110', 'Aprendizaje automático I', 'Sistemas Inteligentes', '09/10/2026', '2 días', '0', 'R-02'], ['TI-412', 'Computación en la nube', 'Tecnologías de Información', '10/10/2026', '1 día', '1', 'R-02'], ['SOFT-210', 'Arquitectura de software', 'Ingeniería del Software', '12/10/2026', 'Hoy', '2', 'R-02']];
  return shell({ id: o.id || 'R-01', name: o.name || 'Bandeja de revisión', role: 'dc', active: 'Bandeja de revisión', crumbs: ['Bandeja de revisión'], title: 'Bandeja de revisión', sub: '7 cursos En desarrollo de todas las escuelas · del más antiguo al más reciente', notif: 2, bellTo: 'N-01', navTo: { Inicio: 'P-03', Cursos: 'C-01' },
    body: [...(o.top || []), toolbar({ p: 'Buscar por código o nombre' }, [{ l: 'Escuela: Todas' }]), table([{ h: 'Código', w: 180 }, { h: 'Nombre del curso' }, { h: 'Escuela', w: 230 }, { h: 'Enviado ↑', w: 120 }, { h: 'En espera', w: 110 }, { h: 'Adjuntos', w: 90, al: 'R' }, { h: '', w: 120 }],
      rows.map(r => ({ c: [codeCell(r[0]), r[1], schoolCell(r[2]), r[3], r[4] === 'Hoy' ? { tag: 'Hoy', type: 'Info' } : { tag: r[4], type: parseInt(r[4]) >= 5 ? 'Warning' : 'Neutral', icon: 'clock' }, { n2: r[5] }, { node: btn('Revisar', 'Secondary', { size: 'SM', to: r[6] }) }], to: r[6] })), { pager: 'Mostrando 1–5 de 7 cursos' })] });
}
function R02() { return reviewScreen({ id: 'R-02', name: 'Revisión · validar código', panels: [codePanel('validate'), decisionPanel('blocked')] }); }
function R03() { return reviewScreen({ id: 'R-03', name: 'Revisión · generar código', crumb: 'Código pendiente', title: 'Pruebas de software', tags: [['Código pendiente', 'Warning', 'hash']], reqCode: true, panels: [codePanel('generate'), decisionPanel('blocked')] }); }
function R04() { return reviewScreen({ id: 'R-04', name: 'Revisión · corregir código', panels: [codePanel('correct'), decisionPanel('blocked')] }); }
function R05() { const r = reviewScreen({ id: 'R-05', name: 'Confirmar aprobación', panels: [codePanel('validated'), decisionPanel('ready')] }); return overlay(r, modal('Confirmación', '¿Aprobar SOFT-210?', 'El estado cambiará a Aprobado y se registrarán su usuario y la fecha. Se avisará a la Directora y a Vicerrectoría para la transcripción a Power Campus.', 'Aprobar curso', { dt: 'SOFT-210 · Arquitectura de software', dm: 'Código validado · Ingeniería del Software', to: 'R-06', back: 'R-02' }), { back: 'R-02' }); }
function R06() { return reviewScreen({ id: 'R-06', name: 'Curso aprobado · avisos enviados', state: 'Aprobado', top: [alertN('Éxito', 'Curso aprobado', 'Se registró su usuario y la fecha (12/10/2026 15:10). Avisos enviados a Ana Mora Quesada (Directora) y a Vicerrectoría.')], panels: [codePanel('validated'), decisionPanel('approved')] }); }
function R07() { return reviewScreen({ id: 'R-07', name: 'Error al aprobar · estado conservado', top: [alertN('Error', 'No se pudo aprobar el curso', 'Ocurrió un error al guardar. El curso conserva su estado En desarrollo: no quedó aprobado a medias (RNF-025). Intente de nuevo.')], panels: [codePanel('validated'), decisionPanel('error')] }); }
function R08() { const r = reviewScreen({ id: 'R-08', name: 'Pasar a En producción · confirmación', state: 'Aprobado', panels: [codePanel('validated'), decisionPanel('approved')] }); return overlay(r, modal('Confirmación', '¿Pasar SOFT-210 a En producción?', 'Indica que el curso ya se oferta. Se registrarán la fecha y su usuario. Solo Desarrollo Curricular puede hacerlo (RF-034).', 'Pasar a En producción', { dt: 'SOFT-210 · Arquitectura de software', dm: 'Aprobado 12/10/2026', to: 'R-06', back: 'R-06' }), { back: 'R-06' }); }
function R09() { const r = reviewScreen({ id: 'R-09', name: 'Cambiar a Inactivo · confirmación', state: 'En producción', panels: [codePanel('validated'), decisionPanel('production')] }); return overlay(r, modal('Destructiva', '¿Cambiar SOFT-210 a Inactivo?', 'Dejará de ofertarse y no aparecerá en el listado por defecto. Se conserva con todos sus datos e historial (eliminación lógica, RN-12).', 'Cambiar a Inactivo', { dt: 'SOFT-210 · Arquitectura de software', dm: 'En producción desde 20/10/2026', to: 'C-01', back: 'R-06' }), { back: 'R-06' }); }

// ---------- RP · Reportes
function reportShell(o) { return shell({ id: o.id, name: o.name, role: o.role || 'rect', active: 'Reportes', crumbs: ['Reportes', o.crumb || 'Producción'], title: o.title || 'Reportes', tags: o.role === 'dir' ? null : [['Solo lectura', 'Neutral', 'lock']], sub: o.sub || 'Calculado al momento de la consulta · 12/10/2026 15:30', navTo: { Inicio: o.role === 'dir' ? 'P-02' : 'P-04', Cursos: 'C-01' },
  actions: [T('Sin exportación (fuera de alcance, ERS §1.2)', 'Body/SM', 'text/secondary')], body: [tabsRow(['Producción', 'Histórico y comparativo'], o.tab || 0, { to: ['RP-01', 'RP-03'] }), ...o.body] }); }
function prodTable(rows, totals) { return table([{ h: 'Escuela' }, ...STATES.map(s => ({ h: s, w: 128, al: 'R' })), { h: 'Total', w: 100, al: 'R' }], [...rows.map((r, i) => [schoolCell(SCH_FULL[i]), ...r.map(v => ({ n2: String(v), col: 'text/primary' })), { n2: String(r.reduce((a, b) => a + b, 0)) }]), [{ s: 'Total institucional' }, ...totals.map(v => ({ n2: String(v) })), { n2: String(totals.reduce((a, b) => a + b, 0)) }]]); }
function RP01() {
  const totals = STATES.map((_, si) => PROD.reduce((a, r) => a + r[si], 0));
  return reportShell({ id: 'RP-01', name: 'Reporte de producción', title: 'Producción de cursos', body: [F({ n: 'Filters', d: 'H', g: 12, cx: 'CENTER', fx: 'fill' }, [inst('Filter Button', { State: 'Default' }, { Label: 'Escuela: Todas' }), inst('Filter Button', { State: 'Default' }, { Label: 'Carrera: Todas' }), tag('Filtro por carrera: relación curso–carrera pendiente de validar', 'Warning', 'alert-triangle')]),
  kpiRow(STATES.map((s, i) => [s, String(totals[i]), i === 3 ? '63 % del total' : 'Institucional', ['edit', 'clock', 'check-circle', 'play', 'archive'][i]]), 'Plano'),
  stacked('Cursos por estado y escuela', 'Totales institucionales: 312 cursos', SCH_FULL.map((s, i) => SCH[i]), PROD, { h: 240, bw: 48 }), card([cardHead('Tabla equivalente', 'Mismos datos del gráfico'), prodTable(PROD, totals)])] });
}
function stateBars(title, vals) { const max = Math.max(...vals); return card([cardHead(title, 'Cantidad por estado'), ...STATES.map((s, i) => F({ n: 'Bar · ' + s, d: 'H', g: 12, cx: 'CENTER', fx: 'fill' }, [T(s, 'Body/MD', 'text/primary', { w: 140 }), F({ n: 'Track', d: 'H', h: 20, fx: 'fill', r: 4, bg: 'bg/subtle' }, [F({ n: 'Fill', w: Math.max(6, Math.round(vals[i] / max * 560)), h: 20, r: 4, bg: CHART[s] })]), T(String(vals[i]), 'Body/MD Strong', 'text/primary', { w: 40, al: 'RIGHT' })]))]); }
function RP02() {
  return reportShell({ id: 'RP-02', name: 'Reporte de producción · Director', role: 'dir', title: 'Producción de mi escuela', sub: 'Ingeniería del Software · calculado al momento de la consulta', body: [F({ n: 'Filters', d: 'H', g: 12, cx: 'CENTER', fx: 'fill' }, [inst('Filter Button', { State: 'Disabled' }, { Label: 'Escuela: Ingeniería del Software' }), inst('Filter Button', { State: 'Default' }, { Label: 'Carrera: Todas' }), T('El filtro de escuela está fijo para su rol (RF-042 CA3).', 'Body/SM', 'text/secondary')]),
  kpiRow(STATES.map((s, i) => [s, String(PROD[0][i]), 'Su escuela', ['edit', 'clock', 'check-circle', 'play', 'archive'][i]]), 'Plano'), stateBars('Cursos de Ingeniería del Software', PROD[0]), alertN('Info', 'Histórico y comparativo', 'El reporte histórico (RF-043) está disponible para Administrador, Rectoría y Vicerrectoría.')] });
}
function RP03() {
  return reportShell({ id: 'RP-03', name: 'Reporte histórico por período', crumb: 'Histórico y comparativo', title: 'Histórico y comparativo', tab: 1, body: [card([tabsRow(['Por período', 'Comparativo'], 0, { to: ['RP-03', 'RP-04'] }), F({ n: 'Range', d: 'H', g: 16, cx: 'MAX', fx: 'fill' }, [dateF('Desde', { req: true, v: '01/01/2026' }), dateF('Hasta', { req: true, v: '31/10/2026' }), btn('Aplicar', 'Primary', { to: 'RP-05' })])]),
  kpiRow([['Creados', '148', '01/01 – 31/10/2026', 'plus'], ['Aprobados', '126', 'En el período', 'check-circle'], ['Inactivados', '9', 'Incluidos en su período', 'archive']], 'Plano'),
  grouped('Creados, aprobados e inactivados por mes', 'Los cursos Inactivos se cuentan en el período en que se crearon o aprobaron (RF-043 CA4)', MONTHS, [['Creados', 'chart/review', [12, 14, 16, 15, 13, 18, 17, 12, 13, 18]], ['Aprobados', 'chart/approved', [9, 11, 13, 12, 14, 15, 13, 10, 15, 14]], ['Inactivados', 'chart/draft', [1, 0, 2, 1, 0, 1, 1, 0, 2, 1]]], { h: 220, bw: 12 })] });
}
function diffCell(t, up) { return { node: F({ n: 'Diff', d: 'H', g: 6, cx: 'CENTER' }, [I(up ? 'chevron-up' : 'chevron-down', 16, up ? 'feedback/success' : 'feedback/error'), T(t, 'Body/MD Strong', up ? 'feedback/success' : 'feedback/error')]) }; }
function RP04() {
  return reportShell({ id: 'RP-04', name: 'Comparativo mismo mes · dos años', crumb: 'Histórico y comparativo', title: 'Histórico y comparativo', tab: 1, body: [card([tabsRow(['Por período', 'Comparativo'], 1, { to: ['RP-03', 'RP-04'] }), F({ n: 'Compare', d: 'H', g: 16, cx: 'MAX', fx: 'fill' }, [select('Mes', { req: true, v: 'Octubre' }), select('Año A', { req: true, v: '2025' }), select('Año B', { req: true, v: '2026' }), btn('Comparar', 'Primary')])]),
  F({ n: 'Row', d: 'H', g: 24, fx: 'fill' }, [card([cardHead('Octubre 2025 vs. Octubre 2026', 'Valores lado a lado con su diferencia'), table([{ h: 'Métrica' }, { h: 'Oct 2025', w: 92, al: 'R' }, { h: 'Oct 2026', w: 92, al: 'R' }, { h: 'Diferencia', w: 150 }], [[{ s: 'Creados' }, { n2: '12' }, { n2: '18' }, diffCell('+6 (+50 %)', true)], [{ s: 'Aprobados' }, { n2: '10' }, { n2: '14' }, diffCell('+4 (+40 %)', true)], [{ s: 'Inactivados' }, { n2: '2' }, { n2: '1' }, diffCell('−1 (−50 %)', false)]])]),
  grouped('Comparación visual', 'Año A vs. Año B', ['Creados', 'Aprobados', 'Inactivados'], [['Octubre 2025', 'chart/draft', [12, 10, 2]], ['Octubre 2026', 'chart/review', [18, 14, 1]]], { h: 200, bw: 28 })])] });
}
function RP05() {
  return reportShell({ id: 'RP-05', name: 'Histórico · rango inválido', crumb: 'Histórico y comparativo', title: 'Histórico y comparativo', tab: 1, body: [card([tabsRow(['Por período', 'Comparativo'], 0), F({ n: 'Range', d: 'H', g: 16, cx: 'MIN', fx: 'fill' }, [dateF('Desde', { req: true, v: '31/10/2026', err: 'La fecha de inicio debe ser menor o igual que la de fin.' }), dateF('Hasta', { req: true, v: '01/01/2026' }), F({ n: 'b', d: 'V', p: [26, 0, 0, 0] }, [btn('Aplicar', 'Primary', { to: 'RP-03' })])])]),
  statePanel('Sin resultados', 'Consulta no ejecutada', 'Corrija el rango de fechas para ver los resultados (RF-043 CA3).', null)] });
}

// ---------- N · Avisos, correo, idioma, menú de usuario
function N01() {
  const r = R01({ id: 'N-01', name: 'Panel de avisos (propuesta UX)' });
  const items = [inst('Notification Item', { Estado: 'No leída' }, { Title: 'Nuevo curso para revisión', Body: 'SOFT-210 · Arquitectura de software · Ingeniería del Software', Time: 'Hace 5 min', Icon: icon('inbox') }, { fx: 'fill', n: 'Notification →R-02' }), inst('Notification Item', { Estado: 'No leída' }, { Title: 'Nuevo curso para revisión', Body: 'TI-412 · Computación en la nube · Tecnologías de Información', Time: 'Hace 2 días', Icon: icon('inbox') }, { fx: 'fill' }), inst('Notification Item', { Estado: 'Leída' }, { Title: 'Curso aprobado', Body: 'SOFT-101 · Fundamentos de programación', Time: '12/10/2026', Icon: icon('check-circle') }, { fx: 'fill' })];
  const drawer = F({ n: 'Avisos (drawer)', d: 'V', g: 0, w: 420, h: r.height, bg: 'bg/surface', eff: 'Elevation/3 · Modal' }, [F({ n: 'Header', d: 'H', g: 8, p: [20, 16, 16, 20], fx: 'fill', cx: 'CENTER', st: 'border/subtle', sides: [0, 0, 1, 0] }, [T('Avisos', 'Heading/H2', 'text/primary', { fx: 'fill' }), T('Marcar todo como leído', 'Body/SM Medium', 'text/link', { u: true }), ib('x', { label: 'Cerrar', to: 'R-01' })]), ...items,
  F({ n: 'Note', d: 'V', g: 8, p: 20, fx: 'fill' }, [tag('Propuesta UX', 'Outline'), T('La ERS define avisos por correo (RF-036, RF-038) y notificación de escritorio (RF-037). Este panel solo los reúne dentro de la app; requiere validación.', 'Body/SM', 'text/secondary', { fx: 'fill' })])]);
  const ov = F({ n: 'Overlay (scrim) →R-01', w: r.width, h: r.height, bg: 'bg/overlay', bgo: 0.32 }); abs(r, ov, 0, 0); abs(r, drawer, r.width - 420, 0); return r;
}
function N02() {
  const r = R01({ id: 'N-02', name: 'Notificación de escritorio', top: [alertN('Info', 'Active las notificaciones de escritorio', 'Le avisaremos cada vez que un Director envíe un curso. Si no las activa, los cursos igual aparecen en esta bandeja (RF-037 CA2).', { action: 'Activar notificaciones' })] });
  const os = inst('OS Notification', null, { Title: 'Nuevo curso para revisión', Body: 'SOFT-210 · Arquitectura de software' }); os.name = 'OS Notification →R-02'; abs(r, os, r.width - 404, 16);
  const cap = T('Simulación: la apariencia real la define el sistema operativo. Clic abre el detalle del curso (CA3).', 'Body/SM', 'text/secondary', { w: 380 }); abs(r, cap, r.width - 404, 112);
  return r;
}
function emailScreen(id, name, o) {
  const logo = S.cn['brand/logo-white'].createInstance(); logo.rescale(200 / logo.width); logo.name = 'Logo oficial (blanco)';
  const rows = o.rows.map(([k, v, hl]) => F({ n: 'Row · ' + k, d: 'H', g: 16, p: [10, 0], fx: 'fill', st: 'border/subtle', sides: [0, 0, 1, 0], bg: hl ? 'bg/brand-subtle' : null }, [T(k, 'Body/MD Medium', 'text/secondary', { w: 200 }), T(v, hl ? 'Body/MD Strong' : 'Body/MD', 'text/primary', { fx: 'fill' })]));
  const mail = F({ n: 'Email (HTML)', d: 'V', w: 640, r: 12, bg: 'bg/surface', clip: true, eff: 'Elevation/2 · Raised' }, [F({ n: 'Email header', d: 'H', p: [24, 32], fx: 'fill', bg: 'bg/brand' }, [logo]),
  F({ n: 'Email body', d: 'V', g: 16, p: 32, fx: 'fill' }, [T(o.title, 'Heading/H2', 'text/primary', { fx: 'fill' }), T(o.greet, 'Body/LG', 'text/primary', { fx: 'fill' }), F({ n: 'Details', d: 'V', fx: 'fill' }, rows), btn(o.cta, 'Primary', { to: o.to }), ...(o.extra || [])]),
  F({ n: 'Email footer', d: 'V', g: 4, p: [16, 32], fx: 'fill', bg: 'bg/subtle' }, [T('Mensaje automático del Sistema de Gestión de Cursos · Universidad CENFOTEC. No responda a este correo.', 'Body/SM', 'text/secondary', { fx: 'fill' })])]);
  const meta = card([F({ n: 'Meta', d: 'V', g: 6, fx: 'fill' }, [T('Asunto: ' + o.subject, 'Body/MD Strong', 'text/primary', { fx: 'fill' }), T('De: Sistema de Gestión de Cursos · Para: ' + o.to_, 'Body/SM', 'text/secondary', { fx: 'fill' })])], { w: 640, p: 16 });
  return F({ n: id + ' · ' + name, d: 'V', g: 16, p: [48, 0], w: 1440, h: 1024, cx: 'CENTER', bg: 'bg/muted', clip: true }, [meta, mail, T(o.note, 'Body/SM', 'text/secondary', { w: 640 })]);
}
function N03() { return emailScreen('N-03', 'Correo a Desarrollo Curricular · curso enviado', { subject: '[SGC] Nuevo curso para revisión: SOFT-210 · Arquitectura de software', to_: 'usuarios de Desarrollo Curricular', title: 'Nuevo curso enviado a revisión', greet: 'Un Director de Escuela envió un curso completo para su revisión.', rows: [['Código', 'SOFT-210'], ['Nombre', 'Arquitectura de software'], ['Escuela', 'Ingeniería del Software'], ['Enviado por', 'Ana Mora Quesada · 12/10/2026 10:30']], cta: 'Revisar curso', to: 'R-02', note: 'RF-036: correo HTML con código, nombre, escuela y enlace. Si el servicio de correo falla, el curso conserva su estado, el error se registra y el Director ve el envío como exitoso (RNF-024). No se envía al guardar borradores.' }); }
function N04() {
  const dirV = card([overline('Variante para el Director'), T('Asunto: [SGC] Su curso SOFT-210 fue aprobado', 'Body/MD Strong', 'text/primary', { fx: 'fill' }), T('"Su curso Arquitectura de software fue aprobado por Desarrollo Curricular." · Enlace al detalle.', 'Body/SM', 'text/secondary', { fx: 'fill' })], { p: 16, g: 6, bg: 'bg/subtle', eff: false });
  return emailScreen('N-04', 'Correo de aprobación · Vicerrectoría y Director', { subject: '[SGC] Curso aprobado para Power Campus: SOFT-210', to_: 'Vicerrectoría', title: 'Curso aprobado · listo para transcribir', greet: 'Desarrollo Curricular aprobó el siguiente curso. Transcríbalo manualmente a Power Campus.', rows: [['Código', 'SOFT-210'], ['Nombre', 'Arquitectura de software'], ['Nombre en Power Campus', CRS.pc + ' (' + CRS.pc.length + '/40)', true], ['Aprobado', 'Luis Solís Rojas · 12/10/2026 15:10']], cta: 'Ver detalle del curso', to: 'C-06', extra: [dirV], note: 'RF-038: correo a Vicerrectoría (código, nombre, Nombre en Power Campus, enlace) y al Director de la escuela. Un fallo de correo no revierte la aprobación; el error queda registrado.' });
}
function N05() { return C02({ en: true, id: 'N-05', name: 'Interfaz en inglés' }); }
function N06() {
  const r = C02({ id: 'N-06', name: 'Menú de usuario e idioma' });
  const menu = card([F({ n: 'Who', d: 'H', g: 12, cx: 'CENTER', fx: 'fill' }, [inst('Avatar', { Size: 'LG' }, { Initials: 'AM' }), F({ n: 't', d: 'V', g: 2, fx: 'fill' }, [T('Ana Mora Quesada', 'Body/MD Strong'), T('amora@ucenfotec.ac.cr', 'Body/SM', 'text/secondary')])]), F({ n: 'div', h: 1, w: 10, fx: 'fill', bg: 'border/subtle' }),
  kv('Rol', 'Director de Escuela'), kv('Escuela', 'Ingeniería del Software'), F({ n: 'div', h: 1, w: 10, fx: 'fill', bg: 'border/subtle' }), radios('Idioma de la interfaz', ['Español', 'English'], 'Español', { v: true, help: 'Se recuerda su preferencia (RF-044 CA3).' }), F({ n: 'div', h: 1, w: 10, fx: 'fill', bg: 'border/subtle' }),
  T('Cerrar sesión no está disponible: fuera de alcance de la ERS (§1.2) y pendiente de validar (Apéndice E).', 'Body/SM', 'text/secondary', { fx: 'fill' })], { w: 320, p: 20, g: 14, eff: 'Elevation/2 · Raised', n: 'User menu' });
  abs(r, menu, r.width - 352, 68); return r;
}

const DESKTOP = [
  ['A · Autenticación', [['A-01', () => loginScreen('A-01', 'Inicio de sesión')], ['A-02', () => loginScreen('A-02', 'Inicio de sesión · errores por campo', { email: 'ana.mora@gmail.com', emailErr: 'Use su correo institucional @ucenfotec.ac.cr.', pwdErr: 'Ingrese su contraseña.', to: 'A-03' })], ['A-03', () => loginScreen('A-03', 'Inicio de sesión · credenciales incorrectas', { email: 'amora@ucenfotec.ac.cr', pwd: '••••••••••', alert: ['Correo o contraseña incorrectos', 'Verifique sus datos e intente de nuevo.'] })], ['A-04', () => loginScreen('A-04', 'Google · cuenta no autorizada', { alert: ['Su cuenta no está autorizada', 'La cuenta de Google no está registrada en el sistema. Solicite acceso al Administrador. Si usó otro dominio, ingrese con una cuenta @ucenfotec.ac.cr.'] })], ['A-05', () => loginScreen('A-05', 'Google · cancelado o sin respuesta', { gLoading: true, alert: ['No se pudo completar el inicio con Google', 'El proceso se canceló o el servicio no respondió. Intente de nuevo o use su correo institucional.'] })], ['A-06', () => shell({ id: 'A-06', name: 'Acceso denegado', role: 'dir', active: '', crumbs: ['Acceso denegado'], title: 'Acceso denegado', body: [statePanel('Acceso denegado', 'No tiene acceso a esta vista', 'Su rol no permite abrir esta página o el curso pertenece a otra escuela. Lo llevamos a su vista inicial.', 'Ir a mi inicio', { to: 'P-02' })] })]]],
  ['P · Inicio por rol (propuesta UX)', [['P-01', P01], ['P-02', P02], ['P-03', P03], ['P-04', P04], ['P-05', P05]]],
  ['U · Usuarios (Administrador)', [['U-01', U01], ['U-02', U02], ['U-03', U03], ['U-04', U04], ['U-05', U05], ['U-06', U06], ['U-07', U07], ['U-08', U08]]],
  ['K · Catálogos (Administrador)', [['K-01', K01], ['K-02', K02], ['K-03', K03], ['K-04', K04], ['K-05', K05], ['K-06', K06], ['K-07', K07], ['K-08', K08]]],
  ['M · Importación CSV', [['M-01', M01], ['M-02', M02], ['M-03', M03]]],
  ['C · Consulta de cursos', [['C-01', C01], ['C-02', C02], ['C-03', C03], ['C-04', C04], ['C-05', C05], ['C-06', C06], ['C-07', C07]]],
  ['F · Formulario de curso (Director de Escuela)', [['F-01', F01], ['F-02', F02], ['F-03', F03], ['F-04', F04], ['F-05', F05], ['F-06', F06], ['F-07', F07], ['F-08', F08], ['F-09', F09], ['F-10', F10], ['F-11', F11], ['F-12', F12], ['F-13', F13]]],
  ['R · Revisión y aprobación (Desarrollo Curricular)', [['R-01', R01], ['R-02', R02], ['R-03', R03], ['R-04', R04], ['R-05', R05], ['R-06', R06], ['R-07', R07], ['R-08', R08], ['R-09', R09]]],
  ['RP · Reportes', [['RP-01', RP01], ['RP-02', RP02], ['RP-03', RP03], ['RP-04', RP04], ['RP-05', RP05]]],
  ['N · Avisos, correo, idioma y menú', [['N-01', N01], ['N-02', N02], ['N-03', N03], ['N-04', N04], ['N-05', N05], ['N-06', N06]]]
];

function placeRow(sec, frames, title, perRow, gap = 120) {
  let my = 0; for (const c of sec.children) my = Math.max(my, c.y + c.height);
  const y0 = my + (my ? 200 : 80);
  const lbl = T(title, 'Display/XL', 'text/primary'); sec.appendChild(lbl); lbl.x = 80; lbl.y = y0;
  let x = 80, y = y0 + 96, rowH = 0, i = 0;
  for (const f of frames) { if (!f) continue; sec.appendChild(f); f.x = x; f.y = y; rowH = Math.max(rowH, f.height); i++; if (i % perRow === 0) { x = 80; y += rowH + gap; rowH = 0; } else x += f.width + gap; }
}
async function buildDesktop() {
  const page = await pageAt(2);
  const sec = section(page, '05 — High Fidelity Desktop', 0, 0, 8000, 2000);
  clearSection(sec);
  const intro = F({ n: 'Intro 05', d: 'V', g: 8, w: 3000 }, [T('05 — High Fidelity Desktop · 1440 px', 'Display/XL'), T('Pantallas finales compuestas con instancias del Design System (sección 04). Nombre de cada frame = ID del inventario (ver 01 y 09). Elementos con "→ID" en su nombre están conectados en el prototipo (08).', 'Body/LG', 'text/secondary', { w: 3000 })]);
  sec.appendChild(intro); intro.x = 80; intro.y = 80;
  let n = 0;
  for (const [title, list] of DESKTOP) {
    const frames = [];
    for (const [id, fn] of list) { const f = await safe('Desktop ' + id, async () => fn()); if (f) { frames.push(f); n++; } }
    placeRow(sec, frames, title, 4);
  }
  fit(sec);
  return n;
}
