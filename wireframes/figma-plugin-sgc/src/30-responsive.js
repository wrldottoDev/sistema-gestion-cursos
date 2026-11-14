// ============================================================================
// 06 — Tablet (768) and 07 — Mobile (390). Not scaled desktops: navigation,
// columns and tables are re-structured per breakpoint (RNF-032).
// ============================================================================
const RAIL = {
  admin: [['dashboard', 'Inicio'], ['users', 'Usuarios'], ['layers', 'Catálogos'], ['upload', 'CSV'], ['book', 'Cursos'], ['chart', 'Reportes']],
  dc: [['dashboard', 'Inicio'], ['inbox', 'Bandeja'], ['book', 'Cursos']],
  dir: [['dashboard', 'Inicio'], ['book', 'Cursos'], ['chart', 'Reportes']],
  rect: [['dashboard', 'Inicio'], ['book', 'Cursos'], ['chart', 'Reportes']],
  vice: [['dashboard', 'Inicio'], ['check-circle', 'Aprobados'], ['book', 'Cursos'], ['chart', 'Reportes']]
};
const BOTTOM = {
  dir: [['dashboard', 'Inicio', 'MB-02'], ['book', 'Cursos', 'MB-02'], ['chart', 'Reportes', 'MB-07'], ['bell', 'Avisos', 'MB-08']],
  dc: [['dashboard', 'Inicio', 'MB-06'], ['inbox', 'Bandeja', 'MB-06'], ['book', 'Cursos', 'MB-02'], ['bell', 'Avisos', 'MB-08']],
  rect: [['dashboard', 'Inicio', 'MB-07'], ['book', 'Cursos', 'MB-02'], ['chart', 'Reportes', 'MB-07'], ['bell', 'Avisos', 'MB-08']]
};

function pwdInput() { const i = input('Contraseña', { req: true, ph: 'Ingrese su contraseña', trail: true }); const tr = i.findOne(x => x.type === 'INSTANCE' && x.name === 'Trailing icon'); if (tr) { try { tr.swapComponent(S.cn['icon/eye']); recolor(tr, 'text/secondary'); } catch (e) { } } return i; }
// ---------- Tablet
function tabletShell(o) {
  const items = RAIL[o.role].map(([ic, l]) => { const r = inst('Rail Item', { State: l === o.active ? 'Active' : 'Default' }, { Label: l, Icon: icon(ic) }); r.name = 'Rail · ' + l + (o.navTo && o.navTo[l] ? ' →' + o.navTo[l] : ''); return r; });
  const rail = F({ n: 'Rail (nav)', d: 'V', g: 8, p: [16, 4], w: 80, cx: 'CENTER', bg: 'bg/brand' }, [F({ n: 'Menu button', d: 'H', w: 48, h: 48, r: 8, ax: 'CENTER', cx: 'CENTER' }, [I('menu', 22, 'text/inverse')]), F({ n: 'gap', w: 1, h: 8 }), ...items]);
  const R = ROLES[o.role];
  const top = F({ n: 'Top bar', d: 'H', g: 12, p: [0, 20], h: 64, fx: 'fill', cx: 'CENTER', bg: 'bg/surface', st: 'border/subtle', sides: [0, 0, 1, 0] }, [T(o.title, 'Heading/H3', 'text/primary', { fx: 'fill', trunc: 1 }), inst('Language Switch', { Idioma: 'ES' }), ib('bell', { label: 'Avisos' }), inst('Avatar', { Size: 'MD' }, { Initials: R.ini })]);
  const content = F({ n: 'Content', d: 'V', g: 20, p: 24, fx: 'fill' }, o.body);
  if (o.footer) sz(o.footer, 'fill');
  const main = F({ n: 'Main', d: 'V', fx: 'fill', bg: 'bg/canvas', ax: o.footer ? 'SPACE_BETWEEN' : null }, [F({ n: 'Top', d: 'V', fx: 'fill' }, [top, content]), o.footer || null]);
  main.minHeight = 1024;
  const root = F({ n: o.id + ' · ' + o.name, d: 'H', w: 768, bg: 'bg/canvas', clip: true }, [rail, main]);
  root.minHeight = 1024; rail.layoutSizingVertical = 'FILL';
  return root;
}
function TB01() {
  const logo = S.cn['brand/logo-white'].createInstance(); logo.rescale(260 / logo.width); logo.name = 'Logo oficial (blanco)';
  const band = F({ n: 'Brand band', d: 'V', g: 16, p: [48, 48], fx: 'fill', bg: 'bg/brand' }, [logo, T('Sistema de Gestión de Cursos', 'Heading/H1', 'text/inverse')]);
  const g = btn('Continuar con Google', 'Secondary', { icon: 'google', fx: 'fill', to: 'TB-02' }); const gi = g.findOne(x => x.type === 'INSTANCE' && x.name === 'Icon'); if (gi) for (const v of gi.findAll(x => 'strokes' in x && x.type !== 'INSTANCE')) v.strokes = [];
  const form = card([T('Iniciar sesión', 'Heading/H1'), T('Use su cuenta institucional @ucenfotec.ac.cr', 'Body/MD', 'text/secondary', { fx: 'fill' }), g, input('Correo institucional', { req: true, ph: 'nombre@ucenfotec.ac.cr' }), pwdInput(), btn('Iniciar sesión', 'Primary', { fx: 'fill', to: 'TB-02' })], { w: 520, p: 32, g: 18 });
  const root = F({ n: 'TB-01 · Inicio de sesión (tablet)', d: 'V', g: 40, w: 768, cx: 'CENTER', bg: 'bg/canvas', clip: true }, [band, form, T('¿Problemas para ingresar? Contacte al Administrador del sistema.', 'Body/SM', 'text/secondary')]);
  root.minHeight = 1024; const ls = inst('Language Switch', { Idioma: 'ES' }); abs(root, ls, 768 - 150, 24); return root;
}
function kpiGrid(items, cols = 2, style = 'Neumórfico') { const rows = []; for (let i = 0; i < items.length; i += cols) { const r = items.slice(i, i + cols).map(it => kpi(it[0], it[1], it[2], it[3], style)); while (r.length < cols) r.push(spacer()); rows.push(F({ n: 'Row', d: 'H', g: 16, fx: 'fill', p: style === 'Plano' ? 0 : [4, 4, 8, 4] }, r)); } return F({ n: 'KPI grid', d: 'V', g: 16, fx: 'fill' }, rows); }
function draftRow(code, name, pct, to) { return F({ n: 'Draft · ' + name + ' →' + to, d: 'H', g: 12, p: [12, 0], fx: 'fill', cx: 'CENTER', st: 'border/subtle', sides: [0, 0, 1, 0] }, [F({ n: 't', d: 'V', g: 4, fx: 'fill' }, [code ? T(code, 'Body/MD Strong') : tag('Código pendiente', 'Warning', 'hash'), T(name, 'Body/MD', 'text/primary', { fx: 'fill' }), progressBar(pct, 200)]), I('chevron-right', 18, 'text/secondary')]); }
function TB02() {
  return tabletShell({ id: 'TB-02', name: 'Inicio · Director (tablet)', role: 'dir', active: 'Inicio', title: 'Inicio · Ingeniería del Software', navTo: { Cursos: 'TB-03', Reportes: 'TB-06' },
    body: [btn('Nuevo curso', 'Primary', { icon: 'plus', to: 'TB-04' }), kpiGrid([['Borrador', '4', '2 con más de 7 días', 'edit'], ['En desarrollo', '2', 'En revisión', 'clock'], ['Aprobado', '9', 'Pendientes de ofertarse', 'check-circle'], ['En producción', '21', 'Ofertándose', 'play']]),
    card([T('Continuar donde lo dejó', 'Heading/H3'), draftRow('SOFT-210', 'Arquitectura de software', 70, 'TB-04'), draftRow(null, 'Pruebas de software', 30, 'TB-04')]), proposalNote()] });
}
function TB03() {
  const rows = [['SOFT-210', 'Arquitectura de software', 'Borrador', 'TB-04'], [null, 'Pruebas de software', 'En desarrollo', 'TB-05'], ['SOFT-101', 'Fundamentos de programación', 'Aprobado', null], ['SOFT-118', 'Desarrollo web I', 'En producción', null], ['SOFT-305', 'Patrones de diseño', 'Borrador', 'TB-04']];
  return tabletShell({ id: 'TB-03', name: 'Mis cursos (tablet)', role: 'dir', active: 'Cursos', title: 'Mis cursos', navTo: { Inicio: 'TB-02', Reportes: 'TB-06' },
    body: [F({ n: 'Toolbar', d: 'H', g: 12, fx: 'fill', cx: 'CENTER' }, [inst('Search Field', { State: 'Default' }, { Value: 'Buscar por código o nombre' }, { fx: 'fill' }), inst('Filter Button', { State: 'Default' }, { Label: 'Estado: Todos' })]),
    table([{ h: 'Código', w: 150 }, { h: 'Curso' }, { h: 'Estado', w: 160 }, { h: '', w: 56 }], rows.map(r => ({ c: [codeCell(r[0]), { two: [r[1], 'Ingeniería del Software · 12/10/2026'] }, { b: r[2] }, { node: I('chevron-right', 18, 'text/secondary') }], to: r[3] })), { rh: 64, pager: '1–5 de 36' }),
    T('Tablet: se combinan Nombre + Escuela + fecha en una celda de dos líneas; la fila completa abre el curso.', 'Body/SM', 'text/secondary', { fx: 'fill' })] });
}
function stepChips(cur) { return F({ n: 'Step chips (scroll horizontal)', d: 'H', g: 8, fx: 'fill', clip: true }, STEPS.map((s, i) => F({ n: 'Chip ' + (i + 1), d: 'H', g: 6, p: [0, 12], h: 36, cx: 'CENTER', r: 999, bg: i === cur ? 'action/primary' : i < cur ? 'feedback/success-bg' : 'bg/surface', st: i === cur ? null : 'border/default' }, [i < cur ? I('check', 14, 'feedback/success') : T(String(i + 1), 'Body/SM Medium', i === cur ? 'text/inverse' : 'text/secondary'), T(s, 'Body/SM Medium', i === cur ? 'text/inverse' : 'text/primary')]))); }
function compactBar(status, saveTo, sendTo) { return F({ n: 'Action bar (sticky)', d: 'H', g: 12, p: [12, 20], cx: 'CENTER', bg: 'bg/surface', st: 'border/default', sides: [1, 0, 0, 0] }, [T(status, 'Body/SM', 'text/secondary', { fx: 'fill' }), btn('Guardar borrador', 'Secondary', { icon: 'save', to: saveTo }), btn('Listo para enviar', 'Primary', { icon: 'send', to: sendTo })]); }
function TB04() {
  return tabletShell({ id: 'TB-04', name: 'Formulario · 3 Carga académica (tablet)', role: 'dir', active: 'Cursos', title: 'SOFT-210 · Arquitectura de software', footer: compactBar('Guardado 10:24', 'TB-04', 'TB-03'), navTo: { Inicio: 'TB-02', Cursos: 'TB-03' },
    body: [F({ n: 'Meta', d: 'H', g: 12, cx: 'CENTER' }, [badge('Borrador'), T('Paso 3 de 8 · 40 % de obligatorios', 'Body/MD', 'text/secondary')]), stepChips(2),
    formCard('3. Carga académica y modalidad', 'El total se calcula automáticamente', [grid([input('Créditos', { req: true, v: '4', help: 'Entero 1–12.' }), input('Total de horas', { ro: true, v: '144', help: 'Automático.' }), input('Horas clase', { req: true, v: '48' }), input('Horas extra clase', { req: true, v: '96' }), full(radios('Modalidad', ['Presencial', 'Virtual sincrónica', 'Virtual asincrónica', 'Híbrida'], 'Presencial', { req: true }))], 2)])] });
}
function TB05() {
  return tabletShell({ id: 'TB-05', name: 'Revisión de curso (tablet)', role: 'dc', active: 'Bandeja', title: 'Revisión · SOFT-210',
    body: [F({ n: 'Meta', d: 'H', g: 12, cx: 'CENTER' }, [badge('En desarrollo'), T('Ingeniería del Software · Enviado 12/10/2026', 'Body/MD', 'text/secondary')]),
    F({ n: 'Panels', d: 'H', g: 16, fx: 'fill' }, [codePanel('validate'), decisionPanel('blocked')]), ...courseSections().slice(0, 3)] });
}
function TB06() {
  const totals = STATES.map((_, si) => PROD.reduce((a, r) => a + r[si], 0));
  const tbl = F({ n: 'Table (scroll horizontal)', d: 'V', g: 8, fx: 'fill' }, [T('Desplace horizontalmente para ver todas las columnas →', 'Body/SM', 'text/secondary'), F({ n: 'Scroll area', d: 'H', fx: 'fill', clip: true, r: 12 }, [F({ n: 'Wide table', d: 'V', w: 1000 }, [prodTable(PROD.slice(0, 4), totals)])])]);
  return tabletShell({ id: 'TB-06', name: 'Reporte de producción (tablet)', role: 'rect', active: 'Reportes', title: 'Producción de cursos',
    body: [F({ n: 'Filters', d: 'H', g: 12, fx: 'fill', wrap: true }, [inst('Filter Button', { State: 'Default' }, { Label: 'Escuela: Todas' }), inst('Filter Button', { State: 'Default' }, { Label: 'Carrera: Todas' })]), kpiGrid(STATES.map((s, i) => [s, String(totals[i]), 'Institucional', ['edit', 'clock', 'check-circle', 'play', 'archive'][i]]), 3, 'Plano'), stacked('Cursos por estado y escuela', '312 cursos', SCH, PROD, { h: 200, bw: 32 }), tbl] });
}
function TB07() {
  const U = [['Ana Mora Quesada', 'Director de Escuela', 'amora@ucenfotec.ac.cr', 'AM'], ['Luis Solís Rojas', 'Desarrollo Curricular', 'lsolis@ucenfotec.ac.cr', 'LS'], ['María Vargas Soto', 'Rectoría', 'mvargas@ucenfotec.ac.cr', 'MV'], ['Jorge Castro Mena', 'Vicerrectoría', 'jcastro@ucenfotec.ac.cr', 'JC']];
  return tabletShell({ id: 'TB-07', name: 'Usuarios (tablet)', role: 'admin', active: 'Usuarios', title: 'Usuarios',
    body: [F({ n: 'Toolbar', d: 'H', g: 12, fx: 'fill', cx: 'CENTER' }, [inst('Search Field', { State: 'Default' }, { Value: 'Buscar usuario' }, { fx: 'fill' }), inst('Filter Button', { State: 'Default' }, { Label: 'Rol: Todos' }), btn('Registrar', 'Primary', { icon: 'plus' })]),
    card(U.map(u => F({ n: 'User row', d: 'H', g: 12, p: [12, 0], fx: 'fill', cx: 'CENTER', st: 'border/subtle', sides: [0, 0, 1, 0] }, [inst('Avatar', { Size: 'MD' }, { Initials: u[3] }), F({ n: 't', d: 'V', g: 2, fx: 'fill' }, [T(u[0], 'Body/MD Strong'), T(u[2], 'Body/SM', 'text/secondary')]), tag(u[1], 'Neutral'), ib('edit', { label: 'Editar' }), ib('trash', { label: 'Eliminar' })])), { p: 16, g: 0 })] });
}

// ---------- Mobile
function mobileShell(o) {
  const bar = inst('Mobile App Bar', null, { Title: o.title }, { fx: 'fill' }); bar.name = 'App bar';
  const mb = bar.findOne(x => x.name === 'menu'); if (mb) mb.name = 'menu →MB-09';
  const content = F({ n: 'Content', d: 'V', g: 16, p: 16, fx: 'fill' }, o.body);
  const kids = [];
  if (o.footer) { sz(o.footer, 'fill'); kids.push(o.footer); }
  if (o.role && BOTTOM[o.role]) kids.push(F({ n: 'Bottom nav', d: 'H', p: [4, 8], fx: 'fill', ax: 'SPACE_BETWEEN', bg: 'bg/surface', st: 'border/default', sides: [1, 0, 0, 0] }, BOTTOM[o.role].map(([ic, l, to]) => { const b = inst('Bottom Nav Item', { State: l === o.active ? 'Active' : 'Default' }, { Label: l, Icon: icon(ic) }); b.name = 'Tab · ' + l + ' →' + to; return b; })));
  const root = F({ n: o.id + ' · ' + o.name, d: 'V', w: 390, bg: 'bg/canvas', clip: true, ax: 'SPACE_BETWEEN' }, [F({ n: 'Top', d: 'V', fx: 'fill' }, [bar, content]), kids.length ? F({ n: 'Bottom', d: 'V', fx: 'fill' }, kids) : null]);
  root.minHeight = 844;
  return root;
}
function MB01() {
  const logo = S.cn['brand/logo-white'].createInstance(); logo.rescale(240 / logo.width); logo.name = 'Logo oficial (blanco)';
  const g = btn('Continuar con Google', 'Secondary', { icon: 'google', fx: 'fill', to: 'MB-02' }); const gi = g.findOne(x => x.type === 'INSTANCE' && x.name === 'Icon'); if (gi) for (const v of gi.findAll(x => 'strokes' in x && x.type !== 'INSTANCE')) v.strokes = [];
  const root = F({ n: 'MB-01 · Inicio de sesión (móvil)', d: 'V', w: 390, bg: 'bg/canvas', clip: true }, [F({ n: 'Brand band', d: 'V', g: 12, p: [56, 24, 28, 24], fx: 'fill', bg: 'bg/brand' }, [logo, T('Sistema de Gestión de Cursos', 'Heading/H2', 'text/inverse')]),
  F({ n: 'Form', d: 'V', g: 16, p: [24, 16], fx: 'fill' }, [T('Iniciar sesión', 'Heading/H1'), T('Use su cuenta @ucenfotec.ac.cr', 'Body/MD', 'text/secondary'), g, input('Correo institucional', { req: true, ph: 'nombre@ucenfotec.ac.cr' }), pwdInput(), btn('Iniciar sesión', 'Primary', { fx: 'fill', to: 'MB-02' }), T('¿Problemas para ingresar? Contacte al Administrador.', 'Body/SM', 'text/secondary', { fx: 'fill', al: 'CENTER' })])]);
  root.minHeight = 844; const ls = inst('Language Switch', { Idioma: 'ES' }); abs(root, ls, 390 - 140, 12); return root;
}
function courseCard(code, name, state, date, to) {
  return card([F({ n: 'top', d: 'H', g: 8, fx: 'fill', cx: 'CENTER' }, [code ? T(code, 'Body/MD Strong') : tag('Código pendiente', 'Warning', 'hash'), spacer(), badge(state)]), T(name, 'Heading/H4', 'text/primary', { fx: 'fill' }), F({ n: 'meta', d: 'H', g: 8, fx: 'fill', cx: 'CENTER' }, [F({ n: 'School color', w: 8, h: 8, r: 999, bg: 'school/software-engineering' }), T('Ing. del Software · ' + date, 'Body/SM', 'text/secondary', { fx: 'fill' }), I('chevron-right', 18, 'text/secondary')])], { n: 'Course card' + (to ? ' →' + to : ''), p: 16, g: 8 });
}
function MB02() {
  return mobileShell({ id: 'MB-02', name: 'Mis cursos (móvil)', role: 'dir', active: 'Cursos', title: 'Mis cursos',
    body: [F({ n: 'Toolbar', d: 'H', g: 8, fx: 'fill', cx: 'CENTER' }, [inst('Search Field', { State: 'Default' }, { Value: 'Buscar curso' }, { fx: 'fill' }), ib('filter', { style: 'Outline', label: 'Filtros' })]), btn('Nuevo curso', 'Primary', { icon: 'plus', fx: 'fill', to: 'MB-04' }),
    courseCard('SOFT-210', 'Arquitectura de software', 'Borrador', '12/10/2026', 'MB-04'), courseCard(null, 'Pruebas de software', 'En desarrollo', '06/10/2026', 'MB-03'), courseCard('SOFT-101', 'Fundamentos de programación', 'Aprobado', '12/10/2026', 'MB-03'), T('Móvil: la tabla se convierte en tarjetas; cada tarjeta abre el curso.', 'Body/SM', 'text/secondary', { fx: 'fill' })] });
}
function accordion(title, open, kids) { return card([F({ n: 'Accordion header', d: 'H', g: 8, fx: 'fill', cx: 'CENTER' }, [T(title, 'Heading/H4', 'text/primary', { fx: 'fill' }), I(open ? 'chevron-up' : 'chevron-down', 20, 'text/secondary')]), ...(open ? kids : [])], { n: 'Accordion · ' + title, p: 16, g: 12 }); }
function MB03() {
  return mobileShell({ id: 'MB-03', name: 'Detalle de curso (móvil)', role: 'dir', active: 'Cursos', title: 'SOFT-210',
    body: [F({ n: 'Back →MB-02', d: 'H', g: 6, cx: 'CENTER' }, [I('arrow-left', 16, 'text/link'), T('Mis cursos', 'Body/MD Medium', 'text/link')]), T('Arquitectura de software', 'Heading/H2', 'text/primary', { fx: 'fill' }), F({ n: 'Meta', d: 'H', g: 8, wrap: true, fx: 'fill' }, [badge('En desarrollo'), tag('Solo lectura', 'Neutral', 'lock')]),
    accordion('Identificación', true, [kv('Código', 'SOFT-210'), kv('Escuela', 'Ingeniería del Software'), kv('Nombre', 'Arquitectura de software')]), accordion('Clasificación académica', false), accordion('Carga académica', false), accordion('Textos y descripciones', false), accordion('Competencia y perfiles', false), accordion('Adjuntos (2)', false), accordion('Historial', false)] });
}
function MB04() {
  const ai = inst('AI Suggestion Panel', { Estado: 'Propuesta' }, null, { fx: 'fill' });
  const aiTag = ai.findOne(x => x.type === 'INSTANCE' && x.componentProperties && Object.keys(x.componentProperties).some(k => k.split('#')[0] === 'Removable')); setP(aiTag, { Label: 'IA · revisar' });
  return mobileShell({ id: 'MB-04', name: 'Formulario · Textos con Gemini (móvil)', title: 'Nuevo curso',
    footer: F({ n: 'Action bar (sticky)', d: 'H', g: 8, p: [12, 16], bg: 'bg/surface', st: 'border/default', sides: [1, 0, 0, 0] }, [btn('Guardar borrador', 'Secondary', { size: 'SM', fx: 'fill', to: 'MB-04' }), btn('Listo para enviar', 'Primary', { size: 'SM', fx: 'fill', to: 'MB-05' })]),
    body: [F({ n: 'Step', d: 'V', g: 6, fx: 'fill' }, [T('Paso 4 de 8 · Textos y descripciones', 'Body/MD Strong'), progressBar(60, 358)]), withCounter(input('Nombre en Power Campus', { req: true, v: CRS.pc }), CRS.pc.length + '/40', 'Máximo 40 caracteres.'), textarea('Descripción corta', { req: true, v: 'Curso sobre arquitectura de software.', cnt: '37/250', ai: true }), ai] });
}
function MB05() {
  return mobileShell({ id: 'MB-05', name: 'Envío bloqueado (móvil)', title: 'Nuevo curso',
    footer: F({ n: 'Action bar (sticky)', d: 'H', g: 8, p: [12, 16], bg: 'bg/surface', st: 'border/default', sides: [1, 0, 0, 0] }, [btn('Guardar borrador', 'Secondary', { size: 'SM', fx: 'fill' }), btn('Listo para enviar', 'Primary', { size: 'SM', fx: 'fill' })]),
    body: [alertN('Error', 'No se puede enviar: 5 campos requieren atención', 'Toque un error para ir al campo. Lo digitado se conservó.', { action: 'Ir al primer error' }), T('Paso 2 de 8 · Clasificación académica', 'Body/MD Strong'), select('Temática', { req: true, err: 'Seleccione una temática.' }), select('Metodología de aprendizaje', { req: true, err: 'Seleccione una metodología.' }), select('Nivel de complejidad', { req: true, err: 'Seleccione un nivel.' })] });
}
function MB06() {
  const item = (code, name, school, wait, to) => card([F({ n: 'top', d: 'H', g: 8, fx: 'fill', cx: 'CENTER' }, [code ? T(code, 'Body/MD Strong') : tag('Código pendiente', 'Warning', 'hash'), spacer(), tag(wait, wait === 'Hoy' ? 'Info' : 'Warning', 'clock')]), T(name, 'Heading/H4', 'text/primary', { fx: 'fill' }), T(school, 'Body/SM', 'text/secondary', { fx: 'fill' }), btn('Revisar', 'Secondary', { size: 'SM', fx: 'fill', to })], { n: 'Review card', p: 16, g: 8 });
  return mobileShell({ id: 'MB-06', name: 'Bandeja de revisión (móvil)', role: 'dc', active: 'Bandeja', title: 'Bandeja de revisión',
    body: [T('7 cursos · del más antiguo al más reciente', 'Body/MD', 'text/secondary'), item(null, 'Pruebas de software', 'Ingeniería del Software · 06/10/2026', '5 días', 'MB-03'), item('CIBER-204', 'Hacking ético', 'Ciberseguridad · 07/10/2026', '4 días', 'MB-03'), item('SOFT-210', 'Arquitectura de software', 'Ingeniería del Software · 12/10/2026', 'Hoy', 'MB-03')] });
}
function MB07() {
  const totals = STATES.map((_, si) => PROD.reduce((a, r) => a + r[si], 0)); const max = Math.max(...totals);
  const bars = card([T('Cursos por estado', 'Heading/H3'), ...STATES.map((s, i) => F({ n: 'Bar · ' + s, d: 'V', g: 4, fx: 'fill' }, [F({ n: 'l', d: 'H', fx: 'fill', ax: 'SPACE_BETWEEN' }, [T(s, 'Body/SM Medium'), T(String(totals[i]), 'Body/SM Medium')]), F({ n: 'Track', d: 'H', h: 12, fx: 'fill', r: 999, bg: 'bg/subtle' }, [F({ n: 'Fill', w: Math.max(6, Math.round(totals[i] / max * 320)), h: 12, r: 999, bg: CHART[s] })])]))], { p: 16, g: 12 });
  return mobileShell({ id: 'MB-07', name: 'Reporte de producción (móvil)', role: 'rect', active: 'Reportes', title: 'Reportes',
    body: [F({ n: 'Filters', d: 'H', g: 8, fx: 'fill', wrap: true }, [inst('Filter Button', { State: 'Default' }, { Label: 'Escuela: Todas' }), inst('Filter Button', { State: 'Default' }, { Label: 'Carrera: Todas' })]), kpiGrid([['Cursos', '312', '7 escuelas', 'book'], ['En producción', '198', '63 %', 'play']], 2, 'Plano'), bars,
    card(SCH_FULL.slice(0, 4).map((s, i) => F({ n: 'School row', d: 'H', g: 8, p: [10, 0], fx: 'fill', cx: 'CENTER', st: 'border/subtle', sides: [0, 0, 1, 0] }, [F({ n: 'School color', w: 8, h: 8, r: 999, bg: SCHOOL[s] }), T(s, 'Body/MD', 'text/primary', { fx: 'fill' }), T(String(PROD[i].reduce((a, b) => a + b, 0)), 'Body/MD Strong')])), { p: 16, g: 0, n: 'Por escuela' })] });
}
function MB08() {
  return mobileShell({ id: 'MB-08', name: 'Avisos (móvil)', role: 'dc', active: 'Avisos', title: 'Avisos',
    body: [tag('Propuesta UX', 'Outline'), card([inst('Notification Item', { Estado: 'No leída' }, { Title: 'Nuevo curso para revisión', Body: 'SOFT-210 · Arquitectura de software', Time: 'Hace 5 min', Icon: icon('inbox') }, { fx: 'fill', n: 'Notification →MB-03' }), inst('Notification Item', { Estado: 'Leída' }, { Title: 'Curso aprobado', Body: 'SOFT-101 · Fundamentos de programación', Time: '12/10/2026', Icon: icon('check-circle') }, { fx: 'fill' })], { p: 0, g: 0, n: 'Lista de avisos' })] });
}
function MB09() {
  const base = MB02(); base.name = 'MB-09 · Menú lateral (móvil)';
  const logo = S.cn['brand/logo-white'].createInstance(); logo.rescale(252 / logo.width); logo.name = 'Logo oficial (blanco)';
  const items = [['dashboard', 'Inicio', 'Default'], ['book', 'Mis cursos', 'Active'], ['chart', 'Reportes', 'Default']].map(([ic, l, st]) => inst('Nav Item', { State: st }, { Label: l, Icon: icon(ic) }, { fx: 'fill' }));
  const drawer = F({ n: 'Drawer', d: 'V', g: 8, p: [24, 16], w: 300, h: base.height, bg: 'bg/brand' }, [logo, T('Ana Mora Quesada · Directora', 'Body/SM Medium', 'text/on-brand-muted'), F({ n: 'div', h: 1, w: 268, bg: '#FFFFFF', op: 0.16 }), ...items, F({ n: 'push', w: 1, h: 1, fy: 'fill' }), inst('Language Switch', { Idioma: 'ES' }), T('Cerrar sesión: fuera de alcance (ERS §1.2).', 'Body/SM', 'text/on-brand-muted', { w: 268 })]);
  const ov = F({ n: 'Overlay (scrim) →MB-02', w: 390, h: base.height, bg: 'bg/overlay', bgo: 0.48 }); abs(base, ov, 0, 0); abs(base, drawer, 0, 0); return base;
}

const TABLET = [['TB-01', TB01], ['TB-02', TB02], ['TB-03', TB03], ['TB-04', TB04], ['TB-05', TB05], ['TB-06', TB06], ['TB-07', TB07]];
const MOBILE = [['MB-01', MB01], ['MB-02', MB02], ['MB-03', MB03], ['MB-04', MB04], ['MB-05', MB05], ['MB-06', MB06], ['MB-07', MB07], ['MB-08', MB08], ['MB-09', MB09]];
async function buildResponsive() {
  const page = await pageAt(2);
  let n = 0;
  for (const [secName, list, per, sub] of [['06 — High Fidelity Tablet', TABLET, 4, 'Tablet 768 px · riel de navegación con icono + etiqueta, tablas de 2 líneas o scroll horizontal controlado, formulario con pasos en chips y barra de acciones fija.'], ['07 — High Fidelity Mobile', MOBILE, 5, 'Móvil 390 px · barra superior + navegación inferior, tablas convertidas en tarjetas, acordeones en el detalle, una columna y acciones principales fijas abajo.']]) {
    const sec = section(page, secName, 0, 0, 6000, 2000); clearSection(sec);
    const intro = F({ n: 'Intro', d: 'V', g: 8, w: 2400 }, [T(secName, 'Display/XL'), T(sub, 'Body/LG', 'text/secondary', { w: 2400 })]); sec.appendChild(intro); intro.x = 80; intro.y = 80;
    const frames = []; for (const [id, fn] of list) { const f = await safe(id, async () => fn()); if (f) { frames.push(f); n++; } }
    placeRow(sec, frames, secName.slice(5), per, 100); fit(sec);
  }
  return n;
}
