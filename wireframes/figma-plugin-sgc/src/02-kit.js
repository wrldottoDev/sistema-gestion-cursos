// ============================================================================
// High-fidelity screen kit: composes Design System instances (page 03–04)
// ============================================================================
const ROLES = {
  admin: { v: 'Administrador', name: 'Marco Salazar', role: 'Administrador del sistema', ini: 'MS' },
  dc: { v: 'Desarrollo Curricular', name: 'Luis Solís Rojas', role: 'Desarrollo Curricular', ini: 'LS' },
  dir: { v: 'Director de Escuela', name: 'Ana Mora Quesada', role: 'Directora · Ing. del Software', ini: 'AM' },
  rect: { v: 'Rectoría', name: 'María Vargas', role: 'Rectoría', ini: 'MV' },
  vice: { v: 'Vicerrectoría', name: 'Jorge Castro', role: 'Vicerrectoría', ini: 'JC' }
};
const STATES = ['Borrador', 'En desarrollo', 'Aprobado', 'En producción', 'Inactivo'];
const STATES_EN = { 'Borrador': 'Draft', 'En desarrollo': 'In review', 'Aprobado': 'Approved', 'En producción': 'In production', 'Inactivo': 'Inactive' };
const CHART = { 'Borrador': 'chart/draft', 'En desarrollo': 'chart/review', 'Aprobado': 'chart/approved', 'En producción': 'chart/production', 'Inactivo': 'chart/inactive' };
const SCHOOL = {
  'Ingeniería del Software': 'school/software-engineering', 'Ciberseguridad': 'school/cybersecurity', 'Sistemas Inteligentes': 'school/intelligent-systems',
  'Tecnologías de Información': 'school/information-technology', 'Sistemas de Información': 'school/information-systems', 'Fundamentos de Computación': 'school/computing-fundamentals', 'Administración de Negocios': 'school/business-administration'
};
const STEP_SUBS = ['Escuela, código y nombre', 'Catálogos institucionales', 'Créditos, horas y modalidad', 'Límites 40 / 250 / 155', 'Competencia, requisitos, perfiles', 'Programa, e-commerce, metadata', 'Word o PDF · opcional', 'Validación completa'];
const CRS = {
  code: 'SOFT-210', name: 'Arquitectura de software', school: 'Ingeniería del Software', sfia: 'Desarrollo de software', tema: 'Ingeniería de software', metod: 'Aprendizaje basado en proyectos', nivel: 'Intermedio', cert: 'No tiene', casa: '—',
  cred: '4', hc: '48', hec: '96', tot: '144', mod: 'Presencial', pc: 'Arquitectura de Software',
  corta: 'Curso que introduce los principios, estilos y patrones de arquitectura para diseñar sistemas de software mantenibles, escalables y seguros.',
  meta: 'Aprenda a diseñar arquitecturas de software con patrones, estilos y decisiones documentadas. Curso intermedio de Ingeniería del Software.',
  larga: 'El curso aborda los fundamentos de la arquitectura de software: atributos de calidad, estilos arquitectónicos (capas, microservicios, eventos), patrones, documentación con vistas y registro de decisiones. Incluye un proyecto integrador por equipos.',
  comp: 'Diseña arquitecturas de software que satisfacen atributos de calidad definidos, justificando sus decisiones técnicas.',
  capac: 'Evalúa estilos arquitectónicos; modela vistas; documenta decisiones (ADR); valida la arquitectura con escenarios de calidad.',
  reqI: 'Programación orientada a objetos; Bases de datos I.', reqD: 'Experiencia básica con servicios web y control de versiones.',
  pIn: 'Estudiante con fundamentos de programación y diseño orientado a objetos.', pOut: 'Profesional capaz de proponer, comunicar y evaluar la arquitectura de un sistema.',
  kw: ['arquitectura', 'patrones', 'microservicios', 'ADR'], prog: 'Sí · Técnico en Desarrollo de Software', ecom: 'Sí · 15/01/2027 – 30/04/2027', metaD: 'Área: Software · Público: estudiantes de bachillerato', metaMod: '12/10/2026 10:20', last: '12/10/2026 10:24'
};
const COURSES = [
  ['SOFT-101', 'Fundamentos de programación', 'Ingeniería del Software', 'Aprobado', '12/10/2026 14:05'],
  ['SOFT-210', 'Arquitectura de software', 'Ingeniería del Software', 'Borrador', '12/10/2026 10:24'],
  [null, 'Pruebas de software', 'Ingeniería del Software', 'En desarrollo', '06/10/2026 09:12'],
  ['CIBER-204', 'Hacking ético', 'Ciberseguridad', 'En desarrollo', '07/10/2026 11:40'],
  ['SINT-110', 'Aprendizaje automático I', 'Sistemas Inteligentes', 'En desarrollo', '09/10/2026 16:02'],
  ['TI-305', 'Administración de redes', 'Tecnologías de Información', 'En producción', '28/09/2026 08:30'],
  ['SI-220', 'Bases de datos II', 'Sistemas de Información', 'En producción', '22/09/2026 13:15'],
  ['ADM-140', 'Gestión de proyectos de TI', 'Administración de Negocios', 'Aprobado', '03/10/2026 10:00'],
  ['SOFT-118', 'Desarrollo web I', 'Ingeniería del Software', 'En producción', '11/10/2026 17:20']
];

// ---------- atoms
function icon(name) { return S.cn['icon/' + name] ? S.cn['icon/' + name].id : S.cn['icon/more'].id; }
function btn(label, v = 'Primary', o = {}) {
  const props = { Label: label }; if (o.icon) { props['Show icon'] = true; props.Icon = icon(o.icon); }
  const b = inst('Button', { Variant: v, State: o.state || 'Default', Size: o.size || 'MD' }, props);
  b.name = 'Button · ' + label + (o.to ? ' →' + o.to : ''); if (o.fx) sz(b, o.fx); return b;
}
function ib(name, o = {}) { const b = inst('Icon Button', { Style: o.style || 'Ghost', State: o.state || 'Default' }, { Icon: icon(name) }); b.name = 'IconButton · ' + (o.label || name) + (o.to ? ' →' + o.to : ''); return b; }
function badge(estado, en) { return inst('Badge/Status', { Estado: estado }, { Label: en ? STATES_EN[estado] : estado }); }
function tag(label, type = 'Neutral', ic, rem) { const p = { Label: label }; if (ic) { p['Show icon'] = true; p.Icon = icon(ic); } if (rem) p.Removable = true; return inst('Tag', { Type: type }, p); }
function spacer(w) { return F({ n: 'Spacer', h: 1, w: w || 1, fx: w ? null : 'fill' }); }
function card(kids, o = {}) { return F({ n: o.n || 'Card', d: o.d || 'V', g: o.g != null ? o.g : 16, p: o.p != null ? o.p : 24, fx: o.w ? null : (o.fx || 'fill'), w: o.w, r: 12, bg: o.bg || 'bg/surface', st: o.st === false ? null : (o.st || 'border/default'), eff: o.eff === false ? null : (o.eff || 'Elevation/1 · Card'), cx: o.cx, ax: o.ax }, kids); }
function cardHead(title, sub, right = []) { return F({ n: 'Card header', d: 'H', g: 12, fx: 'fill', cx: 'CENTER' }, [F({ n: 't', d: 'V', g: 4, fx: 'fill' }, [T(title, 'Heading/H3', 'text/primary', { fx: 'fill' }), sub ? T(sub, 'Body/MD', 'text/secondary', { fx: 'fill' }) : null]), ...right]); }
function overline(t) { return T(t, 'Label/Overline', 'text/secondary'); }
function findBtn(root, label) { return root.findAll(x => x.type === 'INSTANCE' && x.componentProperties && Object.entries(x.componentProperties).some(([k, v]) => k.split('#')[0] === 'Label' && v.value === label)); }
function linkBtn(root, label, to) { for (const b of findBtn(root, label)) b.name = 'Button · ' + label + ' →' + to; }
function alertN(tipo, title, body, o = {}) { const a = inst('Alert', { Tipo: tipo }, { Title: title, Body: body || ' ', 'Show action': !!o.action, Action: o.action || ' ' }, { fx: 'fill' }); a.name = 'Alert · ' + title + (o.to ? ' →' + o.to : ''); return a; }

// ---------- shell (sidebar + topbar + content)
function shell(o) {
  const R = ROLES[o.role];
  const sb = inst('Sidebar', { Rol: R.v }); sb.name = 'Sidebar';
  for (const n of sb.findAll(x => x.type === 'INSTANCE' && x.name.startsWith('Nav · '))) {
    const lab = n.name.slice(6); setP(n, { State: lab === o.active ? 'Active' : 'Default' });
    if (o.navLabels && o.navLabels[lab]) setP(n, { Label: o.navLabels[lab] });
    n.name = 'Nav · ' + lab + (o.navTo && o.navTo[lab] ? ' →' + o.navTo[lab] : '');
  }
  if (o.en) { txt(sb, 'Menu label', 'Menu'); txt(sb, 'Sistema de Gestión de Cursos', 'Course Management System'); txt(sb, 'Footer', o.role === 'rect' || o.role === 'vice' ? 'Read-only access' : 'Universidad CENFOTEC'); }
  const notif = o.notif != null ? o.notif : 3;
  const tb = inst('Topbar', null, { 'User name': R.name, 'User role': o.userRole || R.role, 'Notif count': String(notif), 'Show notifications badge': notif > 0 }, { fx: 'fill' });
  const av = tb.findOne(x => x.type === 'INSTANCE' && x.componentProperties && Object.keys(x.componentProperties).some(k => k.split('#')[0] === 'Initials'));
  setP(av, { Initials: R.ini });
  const bc = tb.findOne(x => x.type === 'INSTANCE' && x.name === 'Breadcrumbs');
  const cr = o.crumbs || [o.title];
  if (cr.length === 1) setP(bc, { 'Level 1': o.en ? 'Home' : 'Inicio', 'Show level 2': false, 'Show sep 2': false, Current: cr[0] });
  else if (cr.length === 2) setP(bc, { 'Level 1': cr[0], 'Show level 2': false, 'Show sep 2': false, Current: cr[1] });
  else setP(bc, { 'Level 1': cr[0], 'Level 2': cr[1], 'Show level 2': true, 'Show sep 2': true, Current: cr[2] });
  if (o.en) { const ls = tb.findOne(x => x.type === 'INSTANCE' && x.componentProperties && 'Idioma' in x.componentProperties); setP(ls, { Idioma: 'EN' }); }
  const bell = tb.findOne(x => x.name === 'Notifications'); if (bell && o.bellTo) bell.name = 'Notifications →' + o.bellTo;
  const content = F({ n: 'Content', d: 'V', g: 24, p: [28, 32, 40, 32], fx: 'fill' }, [o.noHeader ? null : pageHeader(o), ...(o.body || [])]);
  // No FILL on the vertical axis (Figma re-collapses it): main hugs with a min height and pushes the footer down.
  const top = F({ n: 'Top', d: 'V', fx: 'fill' }, [tb, content]);
  if (o.footer) sz(o.footer, 'fill');
  const main = F({ n: 'Main', d: 'V', fx: 'fill', bg: 'bg/canvas', ax: o.footer ? 'SPACE_BETWEEN' : null }, [top, o.footer || null]);
  main.minHeight = o.minH || 1024;
  const root = F({ n: o.id + ' · ' + o.name, d: 'H', w: o.w || 1440, bg: 'bg/canvas', clip: true }, [sb, main]);
  root.minHeight = o.minH || 1024;
  sb.layoutSizingVertical = 'FILL';
  return root;
}
function pageHeader(o) {
  const meta = [];
  if (o.badge) meta.push(badge(o.badge, o.en));
  for (const t of (o.tags || [])) meta.push(tag(t[0], t[1] || 'Neutral', t[2]));
  if (o.sub) meta.push(T(o.sub, 'Body/MD', 'text/secondary'));
  const left = F({ n: 'Title block', d: 'V', g: 8, fx: 'fill' }, [o.back ? F({ n: 'Back' + (o.backTo ? ' →' + o.backTo : ''), d: 'H', g: 6, cx: 'CENTER' }, [I('arrow-left', 16, 'text/link'), T(o.back, 'Body/MD Medium', 'text/link')]) : null, T(o.title, 'Heading/H1', 'text/primary', { fx: 'fill' }), meta.length ? F({ n: 'Meta', d: 'H', g: 12, cx: 'CENTER', wrap: true, fx: 'fill' }, meta) : null]);
  return F({ n: 'Page header', d: 'H', g: 12, fx: 'fill', cx: 'MAX' }, [left, ...(o.actions || [])]);
}

// ---------- overlays
function overlay(root, node, o = {}) {
  const ov = F({ n: 'Overlay (scrim)' + (o.back ? ' →' + o.back : ''), w: root.width, h: root.height, bg: 'bg/overlay', bgo: 0.48 });
  abs(root, ov, 0, 0);
  abs(root, node, Math.round((root.width - node.width) / 2), o.y || Math.max(120, Math.round(Math.min(root.height, 1024) / 2 - node.height / 2 - 40)));
  return root;
}
function modal(tipo, title, body, confirm, o = {}) {
  const m = inst('Modal', { Tipo: tipo }, { Title: title, Body: body, 'Show detail': !!o.dt, 'Detail title': o.dt || ' ', 'Detail meta': o.dm || ' ' });
  m.name = 'Modal · ' + title;
  const c = m.findOne(x => x.type === 'INSTANCE' && x.name === 'Confirm');
  if (c && confirm) { setP(c, { Label: confirm }); if (o.to) c.name = 'Confirm →' + o.to; }
  if (o.back) for (const b of findBtn(m, 'Cancelar')) b.name = 'Cancel →' + o.back;
  return m;
}
function toastOn(root, tipo, msg) { const t = inst('Toast', { Tipo: tipo }, { Message: msg }); t.name = 'Toast · ' + msg; abs(root, t, root.width - 452, 84); return root; }
function modalFrame(title, sub, kids, actions, o = {}) {
  return F({ n: 'Modal · ' + title, d: 'V', g: 20, p: 24, w: o.w || 560, r: 16, bg: 'bg/surface', eff: 'Elevation/3 · Modal' }, [
    F({ n: 'Header', d: 'H', g: 12, fx: 'fill' }, [F({ n: 't', d: 'V', g: 4, fx: 'fill' }, [T(title, 'Heading/H3', 'text/primary', { fx: 'fill' }), sub ? T(sub, 'Body/MD', 'text/secondary', { fx: 'fill' }) : null]), ib('x', { label: 'Cerrar', to: o.back })]),
    ...kids, F({ n: 'Footer', d: 'H', g: 12, ax: 'MAX', fx: 'fill' }, actions)]);
}

// ---------- data display
function table(cols, rows, o = {}) {
  const head = F({ n: 'Table header', d: 'H', fx: 'fill' }, cols.map(c => { const h = inst('Table/Header Cell', null, { Label: c.h || ' ', Sortable: !!c.sort }); h.name = 'th · ' + c.h; if (c.w) h.resize(c.w, 44); return h; }));
  head.children.forEach((h, i) => { if (!cols[i].w) h.layoutSizingHorizontal = 'FILL'; });
  const body = rows.map((r, ri) => {
    const cells = Array.isArray(r) ? r : r.c;
    const row = F({ n: 'Row' + (r.to ? ' →' + r.to : ''), d: 'H', fx: 'fill', h: o.rh || 56, cx: 'CENTER', bg: o.sel === ri ? 'bg/brand-subtle' : 'bg/surface', st: 'border/subtle', sides: [0, 0, 1, 0] }, cells.map((c, i) => cellN(c, cols[i])));
    row.children.forEach((x, i) => { if (!cols[i].w) x.layoutSizingHorizontal = 'FILL'; });
    return row;
  });
  const kids = [head, ...body];
  if (o.pager) kids.push(inst('Pagination', null, { Summary: o.pager }, { fx: 'fill' }));
  return F({ n: o.n || 'Table', d: 'V', fx: 'fill', r: 12, bg: 'bg/surface', st: 'border/default', clip: true, eff: 'Elevation/1 · Card' }, kids);
}
function cellN(c, col) {
  const f = F({ n: 'Cell', d: 'H', g: 8, p: [0, 16], w: col.w || 120, cx: 'CENTER', ax: col.al === 'R' ? 'MAX' : 'MIN' });
  let k;
  if (c == null) k = T('—', 'Body/MD', 'text/secondary');
  else if (typeof c === 'string') k = T(c, 'Body/MD', 'text/primary', { fx: 'fill', trunc: 1, al: col.al === 'R' ? 'RIGHT' : null });
  else if (c.b) k = badge(c.b, c.en);
  else if (c.tag) k = tag(c.tag, c.type || 'Neutral', c.icon);
  else if (c.s) k = T(c.s, 'Body/MD Strong', 'text/primary', { fx: 'fill', trunc: 1 });
  else if (c.two) k = F({ n: 'two', d: 'V', g: 2, fx: 'fill' }, [T(c.two[0], 'Body/MD Medium', 'text/primary', { fx: 'fill', trunc: 1 }), T(c.two[1], 'Body/SM', 'text/secondary', { fx: 'fill', trunc: 1 })]);
  else if (c.dot) k = F({ n: 'school', d: 'H', g: 8, cx: 'CENTER', fx: 'fill' }, [F({ n: 'School color', w: 8, h: 8, r: 999, bg: c.dot }), T(c.t, 'Body/MD', 'text/primary', { fx: 'fill', trunc: 1 })]);
  else if (c.acts) k = F({ n: 'Actions', d: 'H', g: 4 }, c.acts.map(a => typeof a === 'string' ? ib(a) : a));
  else if (c.node) k = c.node;
  else if (c.m) k = T(c.m, 'Body/MD', 'text/secondary', { fx: 'fill', trunc: 1 });
  else if (c.n2) k = T(c.n2, 'Body/MD Strong', c.col || 'text/primary', { fx: 'fill', al: 'RIGHT' });
  add(f, k);
  return f;
}
function schoolCell(name) { return { dot: SCHOOL[name] || 'border/strong', t: name }; }
function codeCell(code) { return code ? { s: code } : { tag: 'Código pendiente', type: 'Warning', icon: 'hash' }; }
function toolbar(search, filters = [], right = []) {
  const s = inst('Search Field', { State: search.v ? 'Filled' : 'Default' }, { Value: search.v || search.p || 'Buscar…' }, { w: 360 }); s.name = 'Search';
  return F({ n: 'Toolbar', d: 'H', g: 12, cx: 'CENTER', fx: 'fill' }, [s, ...filters.map(f => { const b = inst('Filter Button', { State: f.dis ? 'Disabled' : f.a ? 'Active' : 'Default' }, { Label: f.l }); b.name = 'Filter · ' + f.l; return b; }), spacer(), ...right]);
}
function chips(list) { return F({ n: 'Active filters', d: 'H', g: 8, cx: 'CENTER', fx: 'fill' }, [T('Filtros activos:', 'Body/SM Medium', 'text/secondary'), ...list.map(l => tag(l, 'Brand', null, true)), T('Limpiar todo', 'Body/SM Medium', 'text/link', { u: true })]); }
function kpi(label, value, meta, ic, style = 'Neumórfico') { const k = inst('KPI Card', { Estilo: style }, { Label: label, Value: value, Meta: meta, Icon: icon(ic) }, { fx: 'fill' }); k.name = 'KPI · ' + label; return k; }
function kpiRow(items, style) { return F({ n: 'KPIs', d: 'H', g: 24, fx: 'fill', p: style === 'Plano' ? 0 : [4, 4, 12, 4] }, items.map(i => kpi(i[0], i[1], i[2], i[3], style))); }
function legend(series) { return F({ n: 'Legend', d: 'H', g: 16, wrap: true, cx: 'CENTER' }, series.map(s => STATES.includes(s) ? inst('Chart Legend Item', { Serie: s }) : F({ n: 'Legend item', d: 'H', g: 8, cx: 'CENTER' }, [F({ n: 'sw', w: 12, h: 12, r: 3, bg: s[1] }), T(s[0], 'Body/SM', 'text/primary')]))); }
function stacked(title, sub, cats, data, o = {}) {
  const H = o.h || 240, bw = o.bw || 44;
  const tot = data.map(r => r.reduce((a, b) => a + b, 0)); const max = Math.max(...tot);
  const cols = cats.map((c, ci) => {
    const segs = STATES.map((s, si) => ({ s, v: data[ci][si] })).filter(x => x.v > 0).reverse();
    const stack = F({ n: 'stack', d: 'V', w: bw, r: 4, clip: true }, segs.map(x => F({ n: x.s + ' · ' + x.v, w: bw, h: Math.max(3, Math.round(x.v / max * (H - 28))), bg: CHART[x.s] })));
    const colF = F({ n: 'bar ' + c, d: 'V', g: 6, w: bw + 24, h: H, ax: 'MAX', cx: 'CENTER' }, [T(String(tot[ci]), 'Body/SM Medium', 'text/primary'), stack]);
    return F({ n: 'Category · ' + c, d: 'V', g: 8, cx: 'CENTER', fx: 'fill' }, [colF, T(c, 'Body/SM', 'text/secondary', { al: 'CENTER', w: 110 })]);
  });
  const yAxis = F({ n: 'y-axis', d: 'V', w: 32, h: H, ax: 'SPACE_BETWEEN' }, [T(String(max), 'Body/SM', 'text/secondary'), T(String(Math.round(max / 2)), 'Body/SM', 'text/secondary'), T('0', 'Body/SM', 'text/secondary')]);
  const plot = F({ n: 'Plot', d: 'H', g: 8, fx: 'fill', cx: 'MIN' }, [yAxis, F({ n: 'Bars', d: 'H', g: 8, fx: 'fill', st: 'border/default', sides: [0, 0, 1, 1] }, cols)]);
  return card([cardHead(title, sub, []), legend(STATES), plot, T('Gráfico con valores rotulados; la tabla equivalente presenta los mismos datos (no depende solo del color).', 'Body/SM', 'text/secondary', { fx: 'fill' })], { n: 'Chart · ' + title });
}
function grouped(title, sub, cats, series, o = {}) {
  const H = o.h || 220, bw = o.bw || 14;
  const max = Math.max(...series.flatMap(s => s[2]));
  const cols = cats.map((c, ci) => F({ n: 'Group · ' + c, d: 'V', g: 8, cx: 'CENTER', fx: 'fill' }, [F({ n: 'bars', d: 'H', g: 3, h: H, ax: 'CENTER', cx: 'MAX' }, series.map(s => F({ n: s[0] + ' ' + s[2][ci], w: bw, h: Math.max(3, Math.round(s[2][ci] / max * (H - 8))), r: 3, bg: s[1] }))), T(c, 'Body/SM', 'text/secondary', { al: 'CENTER' })]));
  const yAxis = F({ n: 'y-axis', d: 'V', w: 28, h: H, ax: 'SPACE_BETWEEN' }, [T(String(max), 'Body/SM', 'text/secondary'), T(String(Math.round(max / 2)), 'Body/SM', 'text/secondary'), T('0', 'Body/SM', 'text/secondary')]);
  return card([cardHead(title, sub, []), legend(series.map(s => [s[0], s[1]])), F({ n: 'Plot', d: 'H', g: 8, fx: 'fill' }, [yAxis, F({ n: 'Bars', d: 'H', g: 4, fx: 'fill', st: 'border/default', sides: [0, 0, 1, 1] }, cols)])], { n: 'Chart · ' + title });
}
function kv(label, value, o = {}) { return F({ n: 'Field · ' + label, d: 'V', g: 4, fx: 'fill' }, [T(label, 'Body/SM Medium', 'text/secondary'), typeof value === 'string' ? T(value, 'Body/MD', 'text/primary', { fx: 'fill' }) : value]); }
function kvGrid(pairs, cols = 2) {
  const rows = []; for (let i = 0; i < pairs.length; i += cols) { const r = pairs.slice(i, i + cols).map(p => p.full ? kv(p[0], p[1]) : kv(p[0], p[1])); while (r.length < cols) r.push(spacer()); rows.push(F({ n: 'Row', d: 'H', g: 24, fx: 'fill' }, r)); }
  return F({ n: 'Fields', d: 'V', g: 20, fx: 'fill' }, rows);
}
function kvCard(title, pairs, cols = 2, extra = []) { return card([T(title, 'Heading/H3'), kvGrid(pairs, cols), ...extra], { n: 'Section · ' + title }); }
function timeline(items) { return card([T('Historial del curso', 'Heading/H3'), F({ n: 'Timeline', d: 'V', fx: 'fill' }, items.map((it, i) => inst('Timeline Item', { Estado: it[2] || 'Hecho' }, { Title: it[0], Meta: it[1], Connector: i < items.length - 1 }, { fx: 'fill' })))], { n: 'Historial' }); }
function tabsRow(labels, active, o = {}) { return F({ n: 'Tabs', d: 'H', g: 8, fx: 'fill', st: 'border/default', sides: [0, 0, 1, 0] }, labels.map((l, i) => { const t = inst('Tab', { State: i === active ? 'Active' : 'Default' }, { Label: Array.isArray(l) ? l[0] : l, 'Show count': Array.isArray(l), Count: Array.isArray(l) ? String(l[1]) : '0' }); t.name = 'Tab · ' + (Array.isArray(l) ? l[0] : l) + (o.to && o.to[i] ? ' →' + o.to[i] : ''); return t; })); }
function statePanel(tipo, title, body, action, o = {}) {
  const p = inst('State Panel', { Tipo: tipo }, { Title: title, Body: body });
  const a = p.findOne(x => x.type === 'INSTANCE' && x.name === 'Action');
  if (a) { if (action) { setP(a, { Label: action }); if (o.to) a.name = 'Action →' + o.to; } else a.visible = false; }
  return card([p], { n: 'State · ' + tipo, cx: 'CENTER', p: 48 });
}

// ---------- form fields
function input(label, o = {}) {
  const st = o.err ? 'Error' : o.ro ? 'Read-only' : o.dis ? 'Disabled' : o.focus ? 'Focus' : (o.v != null && o.v !== '') ? 'Filled' : 'Default';
  const i = inst('Input', { State: st }, { Label: label, Value: o.v != null && o.v !== '' ? o.v : (o.ph || ' '), Helper: o.err || o.help || ' ', Required: !!o.req, Optional: !!o.opt, 'Show helper': !!(o.err || o.help), 'Trailing icon': !!(o.ro || o.trail), 'Leading icon': false }, { fx: o.w ? null : 'fill', w: o.w });
  i.name = 'Input · ' + label; return i;
}
function textarea(label, o = {}) {
  const st = o.err ? 'Error' : o.dis ? 'Disabled' : o.focus ? 'Focus' : o.v ? 'Filled' : 'Default';
  const t = inst('Textarea', { State: st }, { Label: label, Value: o.v || o.ph || ' ', Helper: o.err || o.help || ' ', Required: !!o.req, Optional: !!o.opt, Gemini: !!o.ai, Counter: !!o.cnt }, { fx: 'fill' });
  t.name = 'Textarea · ' + label;
    if (o.cnt) { const c = t.findOne(x => x.type === 'INSTANCE' && x.name === 'Counter'); if (c) { const [n, lim] = o.cnt.split('/').map(Number); setP(c, { Estado: n > lim ? 'Excedido' : n >= lim * 0.9 ? 'Cerca del límite' : 'Normal', Count: o.cnt }); } }
  if (o.aiTo) { const a = t.findOne(x => x.name === 'AI'); if (a) a.name = 'AI →' + o.aiTo; }
  return t;
}
function select(label, o = {}) {
  const st = o.err ? 'Error' : o.dis ? 'Disabled' : o.open ? 'Open' : o.v ? 'Filled' : 'Default';
  const s = inst('Select', { State: st }, { Label: label, Value: o.v || o.ph || 'Seleccione una opción', Helper: o.err || o.help || ' ', Required: !!o.req, Optional: !!o.opt, 'Show helper': !!(o.err || o.help) }, { fx: o.w ? null : 'fill', w: o.w });
  s.name = 'Select · ' + label; return s;
}
function dateF(label, o = {}) { const d = inst('Date Field', { State: o.err ? 'Error' : o.v ? 'Filled' : 'Default' }, { Label: label, Value: o.v || 'dd/mm/aaaa', Helper: o.err || o.help || ' ', Required: !!o.req, 'Show helper': !!(o.err || o.help) }, { fx: 'fill' }); d.name = 'Date · ' + label; return d; }
function check(label, on, o = {}) { const c = inst('Checkbox', { Checked: on ? 'On' : 'Off', State: o.dis ? 'Disabled' : 'Default' }, { Label: label }); c.name = 'Checkbox · ' + label; return c; }
function radios(label, options, sel, o = {}) {
  return F({ n: 'Radio group · ' + label, d: 'V', g: 10, fx: 'fill' }, [F({ n: 'Label row', d: 'H', g: 4 }, [T(label, 'Body/MD Medium'), o.req ? T('*', 'Body/MD Strong', 'feedback/error') : null]),
  F({ n: 'Options', d: o.v ? 'V' : 'H', g: o.v ? 8 : 24, wrap: !o.v, fx: 'fill' }, options.map(op => inst('Radio', { Selected: op === sel ? 'On' : 'Off', State: 'Default' }, { Label: op }))), o.help ? T(o.help, 'Body/SM', 'text/secondary', { fx: 'fill' }) : null]);
}
function withCounter(field, count, help) {
  const [n, lim] = count.split('/').map(Number);
  const c = inst('Character Counter', { Estado: n > lim ? 'Excedido' : n >= lim * 0.9 ? 'Cerca del límite' : 'Normal' }, { Count: count });
  return F({ n: 'Field with counter', d: 'V', g: 6, fx: 'fill' }, [field, F({ n: 'Meta', d: 'H', g: 12, fx: 'fill' }, [T(help, 'Body/SM', n > lim ? 'feedback/error' : 'text/secondary', { fx: 'fill' }), c])]);
}
function tagsField(label, tags, o = {}) {
  return F({ n: 'Tags field · ' + label, d: 'V', g: 6, fx: 'fill' }, [F({ n: 'Label row', d: 'H', g: 4 }, [T(label, 'Body/MD Medium'), o.req ? T('*', 'Body/MD Strong', 'feedback/error') : null]),
  F({ n: 'Field', d: 'H', g: 8, p: [8, 12], fx: 'fill', cx: 'CENTER', wrap: true, r: 8, bg: 'bg/surface', st: 'border/strong' }, [...tags.map(t => tag(t, 'Brand', null, true)), T('Escriba y separe con coma…', 'Body/MD', 'text/secondary')]), T(o.help || 'Se guardan como etiquetas individuales, sin duplicados.', 'Body/SM', 'text/secondary', { fx: 'fill' })]);
}
function grid(items, cols = 2) {
  const rows = []; let cur = [];
  const flush_ = () => { if (cur.length) { while (cur.length < cols) cur.push(spacer()); rows.push(cur); cur = []; } };
  for (const it of items) { if (!it) continue; if (it.full) { flush_(); rows.push([it.n]); } else { cur.push(it); if (cur.length === cols) { rows.push(cur); cur = []; } } }
  flush_();
  return F({ n: 'Grid', d: 'V', g: 20, fx: 'fill' }, rows.map(r => F({ n: 'Row', d: 'H', g: 20, fx: 'fill' }, r.map(x => { sz(x, 'fill'); return x; }))));
}
const full = n => ({ full: true, n });
function formCard(title, sub, kids, o = {}) { return card([F({ n: 'Section header', d: 'H', g: 12, fx: 'fill', cx: 'CENTER' }, [F({ n: 't', d: 'V', g: 4, fx: 'fill' }, [T(title, 'Heading/H3'), sub ? T(sub, 'Body/MD', 'text/secondary', { fx: 'fill' }) : null]), ...(o.right || [])]), ...kids], { n: 'Form section · ' + title }); }
function progressBar(pct, w = 232) { return F({ n: 'Progress ' + pct + '%', d: 'V', g: 6, w }, [F({ n: 'lbl', d: 'H', fx: 'fill', ax: 'SPACE_BETWEEN' }, [T('Obligatorios completos', 'Body/SM Medium', 'text/secondary'), T(pct + ' %', 'Body/SM Medium', 'text/primary')]), F({ n: 'Track', w, h: 8, r: 999, bg: 'bg/muted', clip: true }, pct ? [F({ n: 'Fill', w: Math.max(8, Math.round(w * pct / 100)), h: 8, r: 999, bg: pct === 100 ? 'feedback/success' : 'action/primary' })] : [])]); }
function stepper(cur, o = {}) {
  const errs = o.errs || [];
  const items = STEPS.map((s, i) => {
    const st = errs.includes(i) ? 'Con errores' : i === cur ? 'Actual' : (o.done || []).includes(i) || (!o.done && i < cur) ? 'Completo' : 'Pendiente';
    const it = inst('Stepper Item', { Estado: st }, { Title: (i + 1) + '. ' + s, Subtitle: errs.includes(i) ? (o.errSub && o.errSub[i] || 'Campos por corregir') : st === 'Completo' ? 'Completo' : STEP_SUBS[i], Connector: i < STEPS.length - 1 }, { fx: 'fill' });
    txt(it, 'Number', String(i + 1)); it.name = 'Step ' + (i + 1) + (o.to && o.to[i] ? ' →' + o.to[i] : ''); return it;
  });
  return card([T('Secciones del curso', 'Heading/H4'), progressBar(o.pct != null ? o.pct : 45, 232), F({ n: 'Steps', d: 'V', fx: 'fill' }, items)], { n: 'Stepper', w: 280, p: 20, g: 16 });
}
