// Smoke test: runs code.js against a strict mock of the Figma Plugin API.
// Validates: variant names/values, component property names, tokens, text/effect
// styles, auto-layout sizing rules (FILL/HUG/ABSOLUTE) and enum values.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const code = readFileSync(join(root, 'code.js'), 'utf8');

let idc = 1; const nodes = new Map(); const problems = [];
const ST = ['Borrador', 'En desarrollo', 'Aprobado', 'En producción', 'Inactivo'];
const SPEC = {
  'Button': { v: { Variant: ['Primary', 'Secondary', 'Tertiary', 'Destructive'], State: ['Default', 'Hover', 'Focus', 'Disabled', 'Loading'], Size: ['MD', 'SM'] }, p: { Label: 'TEXT', 'Show icon': 'BOOLEAN', Icon: 'INSTANCE_SWAP' }, k: [['INSTANCE', 'Icon', 'icon/plus'], ['TEXT', 'Label']] },
  'Icon Button': { v: { Style: ['Ghost', 'Outline'], State: ['Default', 'Hover', 'Focus', 'Disabled'] }, p: { Icon: 'INSTANCE_SWAP' } },
  'Badge/Status': { v: { Estado: ST }, p: { Label: 'TEXT' } },
  'Tag': { v: { Type: ['Neutral', 'Info', 'Success', 'Warning', 'Error', 'Brand', 'Outline'] }, p: { Label: 'TEXT', 'Show icon': 'BOOLEAN', Removable: 'BOOLEAN', Icon: 'INSTANCE_SWAP' } },
  'Avatar': { v: { Size: ['SM', 'MD', 'LG'] }, p: { Initials: 'TEXT' } },
  'Language Switch': { v: { Idioma: ['ES', 'EN'] } },
  'Character Counter': { v: { Estado: ['Normal', 'Cerca del límite', 'Excedido'] }, p: { Count: 'TEXT' } },
  'Input': { v: { State: ['Default', 'Hover', 'Focus', 'Filled', 'Error', 'Disabled', 'Read-only'] }, p: { Label: 'TEXT', Value: 'TEXT', Helper: 'TEXT', Required: 'BOOLEAN', Optional: 'BOOLEAN', 'Show helper': 'BOOLEAN', 'Leading icon': 'BOOLEAN', 'Trailing icon': 'BOOLEAN' }, k: [['INSTANCE', 'Trailing icon', 'icon/x-circle'], ['FRAME', 'Helper row']] },
  'Textarea': { v: { State: ['Default', 'Focus', 'Filled', 'Error', 'Disabled'] }, p: { Label: 'TEXT', Value: 'TEXT', Helper: 'TEXT', Required: 'BOOLEAN', Optional: 'BOOLEAN', Gemini: 'BOOLEAN', Counter: 'BOOLEAN' }, k: [['INSTANCE', 'Counter', 'Character Counter'], ['FRAME', 'AI'], ['FRAME', 'Helper row']] },
  'Select': { v: { State: ['Default', 'Hover', 'Focus', 'Filled', 'Error', 'Disabled', 'Open'] }, p: { Label: 'TEXT', Value: 'TEXT', Helper: 'TEXT', Required: 'BOOLEAN', Optional: 'BOOLEAN', 'Show helper': 'BOOLEAN' } },
  'Checkbox': { v: { Checked: ['Off', 'On', 'Indeterminado'], State: ['Default', 'Focus', 'Disabled'] }, p: { Label: 'TEXT' } },
  'Radio': { v: { Selected: ['Off', 'On'], State: ['Default', 'Focus', 'Disabled'] }, p: { Label: 'TEXT' } },
  'Search Field': { v: { State: ['Default', 'Focus', 'Filled'] }, p: { Value: 'TEXT' } },
  'Date Field': { v: { State: ['Default', 'Focus', 'Filled', 'Error'] }, p: { Label: 'TEXT', Value: 'TEXT', Helper: 'TEXT', Required: 'BOOLEAN', 'Show helper': 'BOOLEAN' } },
  'Calendar Popover': {}, 'Skeleton/Table': {},
  'Menu Item': { v: { State: ['Default', 'Hover', 'Selected', 'Destructive'] }, p: { Label: 'TEXT', Icon: 'INSTANCE_SWAP' } },
  'File Dropzone': { v: { State: ['Default', 'Arrastrando', 'Error', 'Subiendo'] } },
  'File Item': { v: { State: ['Subido', 'Subiendo', 'Error', 'Solo lectura'] }, p: { Name: 'TEXT', Meta: 'TEXT' } },
  'Nav Item': { v: { State: ['Default', 'Hover', 'Active', 'Focus'] }, p: { Label: 'TEXT', Count: 'TEXT', 'Show count': 'BOOLEAN', Icon: 'INSTANCE_SWAP' } },
  'Sidebar': { v: { Rol: ['Administrador', 'Desarrollo Curricular', 'Director de Escuela', 'Rectoría', 'Vicerrectoría'] }, sidebar: true },
  'Breadcrumbs': { p: { 'Level 1': 'TEXT', 'Level 2': 'TEXT', Current: 'TEXT', 'Show level 2': 'BOOLEAN', 'Show sep 2': 'BOOLEAN' } },
  'Topbar': { p: { 'User name': 'TEXT', 'User role': 'TEXT', 'Notif count': 'TEXT', 'Show notifications badge': 'BOOLEAN' }, k: [['INSTANCE', 'Breadcrumbs', 'Breadcrumbs'], ['INSTANCE', 'Language Switch', 'Language Switch'], ['FRAME', 'Notifications'], ['INSTANCE', 'Avatar', 'Avatar']] },
  'Tab': { v: { State: ['Default', 'Hover', 'Active', 'Focus'] }, p: { Label: 'TEXT', Count: 'TEXT', 'Show count': 'BOOLEAN' } },
  'Stepper Item': { v: { Estado: ['Completo', 'Actual', 'Pendiente', 'Con errores'] }, p: { Title: 'TEXT', Subtitle: 'TEXT', Connector: 'BOOLEAN' }, k: [['TEXT', 'Number']] },
  'Pagination': { p: { Summary: 'TEXT' } },
  'Table/Header Cell': { p: { Label: 'TEXT', Sortable: 'BOOLEAN' } },
  'Table/Row': { v: { State: ['Default', 'Hover', 'Seleccionada'] } },
  'Form Action Bar': { p: { Status: 'TEXT' }, k: [['BTN', 'Cancelar'], ['BTN', 'Guardar borrador'], ['BTN', 'Listo para enviar']] },
  'Alert': { v: { Tipo: ['Info', 'Éxito', 'Advertencia', 'Error'] }, p: { Title: 'TEXT', Body: 'TEXT', Action: 'TEXT', 'Show action': 'BOOLEAN' } },
  'Toast': { v: { Tipo: ['Éxito', 'Error', 'Info'] }, p: { Message: 'TEXT' } },
  'Modal': { v: { Tipo: ['Confirmación', 'Destructiva', 'Bloqueada'] }, p: { Title: 'TEXT', Body: 'TEXT', 'Detail title': 'TEXT', 'Detail meta': 'TEXT', 'Show detail': 'BOOLEAN' }, k: [['BTN', 'Cancelar'], ['BTN', 'Confirmar', 'Confirm']] },
  'State Panel': { v: { Tipo: ['Vacío', 'Sin resultados', 'Error de red', 'Éxito', 'Acceso denegado', 'Cargando'] }, p: { Title: 'TEXT', Body: 'TEXT' }, k: [['BTN', 'Acción', 'Action']] },
  'KPI Card': { v: { Estilo: ['Neumórfico', 'Plano'] }, p: { Label: 'TEXT', Value: 'TEXT', Meta: 'TEXT', Icon: 'INSTANCE_SWAP' } },
  'Progress Bar': { v: { Valor: ['0', '25', '50', '75', '100'] }, p: { Label: 'TEXT' } },
  'Timeline Item': { v: { Estado: ['Hecho', 'Actual', 'Pendiente'] }, p: { Title: 'TEXT', Meta: 'TEXT', Connector: 'BOOLEAN' } },
  'Notification Item': { v: { Estado: ['No leída', 'Leída'] }, p: { Title: 'TEXT', Body: 'TEXT', Time: 'TEXT', Icon: 'INSTANCE_SWAP' } },
  'AI Suggestion Panel': { v: { Estado: ['Cargando', 'Propuesta', 'Error'] }, k: [['TEXT', 'Proposal'], ['INSTANCE', 'cnt', 'Character Counter'], ['BTN', 'Usar propuesta'], ['BTN', 'Descartar'], ['BTN', 'Cerrar']] },
  'Chart Legend Item': { v: { Serie: ST } },
  'OS Notification': { p: { Title: 'TEXT', Body: 'TEXT' } },
  'Mobile App Bar': { p: { Title: 'TEXT' }, k: [['FRAME', 'menu']] },
  'Bottom Nav Item': { v: { State: ['Default', 'Active'] }, p: { Label: 'TEXT', Icon: 'INSTANCE_SWAP' } },
  'Rail Item': { v: { State: ['Default', 'Active'] }, p: { Label: 'TEXT', Icon: 'INSTANCE_SWAP' } },
  'Filter Button': { v: { State: ['Default', 'Active', 'Disabled'] }, p: { Label: 'TEXT' } }
};
const ICONS = 'home users user layers book inbox chart dashboard bell globe search plus edit trash eye check x chevron-down chevron-up chevron-right chevron-left upload download file sparkles alert-triangle alert-circle info check-circle x-circle clock play archive filter calendar more lock copy send save refresh loader building hash menu arrow-left arrow-right external paperclip tag history mail wifi-off ban monitor key shield-check graduation image sort google'.split(' ');
const NAVS = { 'Administrador': ['Inicio', 'Usuarios', 'Catálogos', 'Importar CSV', 'Cursos', 'Reportes'], 'Desarrollo Curricular': ['Inicio', 'Bandeja de revisión', 'Cursos'], 'Director de Escuela': ['Inicio', 'Mis cursos', 'Reportes'], 'Rectoría': ['Inicio', 'Cursos', 'Reportes'], 'Vicerrectoría': ['Inicio', 'Cursos aprobados', 'Cursos', 'Reportes'] };
const VARS = ['brand/blue-dark', 'brand/blue', 'brand/blue-light', 'brand/gray-light', 'brand/gray', 'brand/yellow', 'brand/amber', 'school/information-systems', 'school/cybersecurity', 'school/intelligent-systems', 'school/information-technology', 'school/computing-fundamentals', 'school/student-affairs', 'school/software-engineering', 'school/business-administration', 'school/alumni', 'blue/50', 'blue/100', 'blue/700', 'neutral/0', 'neutral/25', 'neutral/50', 'neutral/100', 'neutral/200', 'neutral/300', 'neutral/400', 'neutral/450', 'neutral/500', 'neutral/700', 'neutral/900', 'green/50', 'green/700', 'red/50', 'red/700', 'red/800', 'amber/50', 'amber/800', 'stone/50', 'stone/700', 'draft/50',
  'bg/canvas', 'bg/surface', 'bg/subtle', 'bg/muted', 'bg/brand', 'bg/brand-subtle', 'bg/brand-soft', 'bg/overlay', 'text/primary', 'text/secondary', 'text/disabled', 'text/inverse', 'text/brand', 'text/link', 'text/on-brand-muted', 'border/subtle', 'border/default', 'border/strong', 'border/focus', 'border/brand', 'action/primary', 'action/primary-hover', 'action/primary-pressed', 'action/secondary-hover', 'action/disabled', 'action/destructive', 'action/destructive-hover', 'feedback/success', 'feedback/success-bg', 'feedback/error', 'feedback/error-bg', 'feedback/warning', 'feedback/warning-bg', 'feedback/warning-accent', 'feedback/info', 'feedback/info-bg', 'status/draft-fg', 'status/draft-bg', 'status/review-fg', 'status/review-bg', 'status/approved-fg', 'status/approved-bg', 'status/production-fg', 'status/production-bg', 'status/inactive-fg', 'status/inactive-bg', 'focus/ring', 'chart/draft', 'chart/review', 'chart/approved', 'chart/production', 'chart/inactive',
  'space/0', 'space/0-5', 'space/1', 'space/2', 'space/3', 'space/4', 'space/5', 'space/6', 'space/8', 'space/10', 'space/12', 'space/16', 'space/20', 'radius/xs', 'radius/sm', 'radius/md', 'radius/lg', 'radius/xl', 'radius/full'];
const TS = ['Display/XL', 'Heading/H1', 'Heading/H2', 'Heading/H3', 'Heading/H4', 'Data/KPI', 'Body/LG', 'Body/MD', 'Body/MD Medium', 'Body/MD Strong', 'Body/SM', 'Body/SM Medium', 'Label/Overline', 'Button/MD', 'Button/SM', 'Wireframe/Title', 'Wireframe/Body', 'Wireframe/Label'];
const ES = ['Elevation/1 · Card', 'Elevation/2 · Raised', 'Elevation/3 · Modal', 'Neumorphic/Soft', 'Neumorphic/Inset', 'Focus/Ring'];
const ENUMS = { layoutMode: ['NONE', 'HORIZONTAL', 'VERTICAL'], primaryAxisAlignItems: ['MIN', 'CENTER', 'MAX', 'SPACE_BETWEEN'], counterAxisAlignItems: ['MIN', 'CENTER', 'MAX', 'BASELINE'], primaryAxisSizingMode: ['FIXED', 'AUTO'], counterAxisSizingMode: ['FIXED', 'AUTO'], layoutSizingHorizontal: ['FIXED', 'HUG', 'FILL'], layoutSizingVertical: ['FIXED', 'HUG', 'FILL'], strokeAlign: ['INSIDE', 'OUTSIDE', 'CENTER'], textAlignHorizontal: ['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'], textAutoResize: ['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'], layoutWrap: ['NO_WRAP', 'WRAP'], layoutPositioning: ['AUTO', 'ABSOLUTE'], textTruncation: ['DISABLED', 'ENDING'] };

class N {
  constructor(type, name = type) { this.id = (this._inInst ? 'I' : '') + '1:' + (idc++); this.type = type; this._name = name; this.children = []; this.parent = null; this.width = 100; this.height = type === 'TEXT' ? 20 : 100; this.x = 0; this.y = 0; this._p = {}; this.fills = []; this.strokes = []; this.visible = true; this.reactions = []; nodes.set(this.id, this); }
  get name() { return this._name; } set name(v) { this._name = String(v); }
  appendChild(c) { if (!c) throw new Error('appendChild(null)'); if (c.parent) c.parent.children.splice(c.parent.children.indexOf(c), 1); c.parent = this; this.children.push(c); }
  insertChild(i, c) { this.appendChild(c); }
  remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; }
  findAll(fn) { const out = []; const walk = n => { for (const c of n.children) { if (!fn || fn(c)) out.push(c); walk(c); } }; walk(this); return out; }
  findOne(fn) { return this.findAll(fn)[0] || null; }
  resize(w, h) { if (!(w > 0 && h > 0)) throw new Error('resize invalid ' + w + 'x' + h + ' on ' + this.name); this.width = w; this.height = h; }
  resizeWithoutConstraints(w, h) { this.resize(w, h); }
  rescale(s) { this.width *= s; this.height *= s; }
  setBoundVariable(prop, v) { if (!v || !v.id) throw new Error('bad var'); this._p[prop] = 4; }
  async setReactionsAsync(r) { if (this.id.startsWith('I')) throw new Error('instance sublayer'); this.reactions = r; }
  async setTextStyleIdAsync(id) { } async setEffectStyleIdAsync(id) { }
  clone() { const c = new N(this.type, this.name); return c; }
}
const ALIGN_PROPS = Object.keys(ENUMS);
for (const p of ALIGN_PROPS) {
  Object.defineProperty(N.prototype, p, {
    get() { return this._p[p] ?? (p === 'layoutMode' ? 'NONE' : undefined); },
    set(v) {
      if (!ENUMS[p].includes(v)) throw new Error(`Invalid ${p}=${v} on ${this.name}`);
      const isAL = n => n && (n.type === 'FRAME' || n.type === 'COMPONENT' || n.type === 'INSTANCE' || n.type === 'COMPONENT_SET') && n.layoutMode && n.layoutMode !== 'NONE';
      if ((p === 'layoutSizingHorizontal' || p === 'layoutSizingVertical')) {
        if (v === 'FILL' && !isAL(this.parent)) throw new Error(`FILL can only be set on children of auto-layout frames (${this.name})`);
        if (v === 'HUG' && !(isAL(this) || (this.type === 'TEXT' && isAL(this.parent)))) throw new Error(`HUG invalid on ${this.name}`);
      }
      if (p === 'layoutPositioning' && v === 'ABSOLUTE' && !isAL(this.parent)) throw new Error('ABSOLUTE requires auto-layout parent: ' + this.name);
      this._p[p] = v;
    }
  });
}
Object.defineProperty(N.prototype, 'minHeight', { get() { return this._p.minHeight; }, set(v) { if (!(this.layoutMode && this.layoutMode !== 'NONE')) throw new Error('minHeight on non auto-layout: ' + this.name); this._p.minHeight = v; this.height = Math.max(this.height, v); } });
Object.defineProperty(N.prototype, 'characters', { get() { return this._p.characters || ''; }, set(v) { if (this.type !== 'TEXT') throw new Error('characters on ' + this.type); if (typeof v !== 'string') throw new Error('characters must be string'); this._p.characters = v; } });
Object.defineProperty(N.prototype, 'textStyleId', { get() { return this._p.ts; }, set(v) { if (this.type !== 'TEXT') throw new Error('textStyleId on non-text'); this._p.ts = v; } });
for (const p of ['fills', 'strokes']) Object.defineProperty(N.prototype, p, { get() { return this._p[p] || []; }, set(v) { if (!Array.isArray(v)) throw new Error(p + ' must be array'); for (const x of v) { if (x.color && ['r', 'g', 'b'].some(k => !(x.color[k] >= 0 && x.color[k] <= 1))) throw new Error('bad color'); if (x.color && 'a' in x.color) throw new Error('paint color has a'); } this._p[p] = v; } });

// components
const comps = {}; const instOf = new Map();
function mkInstanceChildren(inst, name, variant) {
  const sp = SPEC[name] || {};
  for (const [t, nm, ref] of (sp.k || [])) {
    if (t === 'TEXT') { const c = new N('TEXT', nm); inst.appendChild(c); }
    else if (t === 'FRAME') { const c = new N('FRAME', nm); c._p.layoutMode = 'HORIZONTAL'; inst.appendChild(c); c.appendChild(new N('TEXT', 'helper text')); }
    else if (t === 'INSTANCE') { const c = createInst(ref, null); c.name = nm; inst.appendChild(c); }
    else if (t === 'BTN') { const c = createInst('Button', { Variant: 'Primary', State: 'Default', Size: 'MD' }); c.name = ref || 'Button'; c._props['Label#1:0'].value = nm; inst.appendChild(c); }
  }
  if (sp.sidebar) for (const l of NAVS[variant.Rol]) { const c = createInst('Nav Item', { State: 'Default' }); c.name = 'Nav · ' + l; inst.appendChild(c); }
  if (sp.sidebar) for (const t of ['Menu label', 'Sistema de Gestión de Cursos', 'Footer']) inst.appendChild(new N('TEXT', t));
  for (const c of inst.findAll()) { if (!c.id.startsWith('I')) { nodes.delete(c.id); c.id = 'I' + c.id; nodes.set(c.id, c); } }
}
function createInst(name, variant) {
  const i = new N('INSTANCE', name); i._p.layoutMode = 'HORIZONTAL'; i._comp = name; const sp = SPEC[name] || {};
  i._props = {}; let n = 1;
  for (const [k, vals] of Object.entries(sp.v || {})) i._props[k] = { type: 'VARIANT', value: (variant && variant[k]) || vals[0] };
  for (const [k, t] of Object.entries(sp.p || {})) i._props[k + '#1:' + (n++ - 1)] = { type: t, value: t === 'BOOLEAN' ? false : 'x' };
  Object.defineProperty(i, 'componentProperties', { get() { return i._props; } });
  i.setProperties = (o) => { for (const [k, v] of Object.entries(o)) { if (!(k in i._props)) throw new Error('setProperties unknown ' + k + ' on ' + name); const d = i._props[k]; if (d.type === 'VARIANT' && !SPEC[name].v[k].includes(v)) throw new Error(`variant value ${k}=${v} invalid on ${name}`); if (d.type === 'BOOLEAN' && typeof v !== 'boolean') throw new Error('bool prop ' + k + ' got ' + typeof v); if (d.type === 'TEXT' && (typeof v !== 'string' || v === '')) problems.push('Empty/non-string TEXT prop ' + k + ' on ' + name + ' = ' + JSON.stringify(v)); if (d.type === 'INSTANCE_SWAP' && !nodes.has(v)) throw new Error('swap id unknown ' + v); d.value = v; } };
  i.swapComponent = c => { if (!c) throw new Error('swap null'); };
  if (variant !== undefined) mkInstanceChildren(i, name, variant || {});
  return i;
}
function mkSet(name) {
  const sp = SPEC[name];
  if (!sp.v) { const c = new N('COMPONENT', name); c.createInstance = () => createInst(name, {}); c.componentPropertyDefinitions = {}; c.description = ''; return c; }
  const set = new N('COMPONENT_SET', name); set.description = ''; set.componentPropertyDefinitions = Object.fromEntries(Object.entries(sp.v).map(([k, v]) => [k, { type: 'VARIANT', variantOptions: v }]));
  const keys = Object.keys(sp.v); const combos = [{}];
  for (const k of keys) { const nx = []; for (const c of combos) for (const v of sp.v[k]) nx.push({ ...c, [k]: v }); combos.splice(0, combos.length, ...nx); }
  for (const vp of combos) { const c = new N('COMPONENT', Object.entries(vp).map(([k, v]) => k + '=' + v).join(', ')); c.variantProperties = vp; c.createInstance = () => createInst(name, vp); set.appendChild(c); }
  set.defaultVariant = set.children[0];
  return set;
}
const compIds = {};
for (const n of Object.keys(SPEC)) { if (n === 'Filter Button') continue; // created by ensureDS
  const s = mkSet(n); compIds[n] = s.id; }
for (const ic of ICONS) { const c = new N('COMPONENT', 'icon/' + ic); c.createInstance = () => { const i = new N('INSTANCE', 'icon/' + ic); const v = new N('VECTOR', 'Vector'); v.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; i.appendChild(v); i.componentProperties = {}; i.swapComponent = () => { }; return i; }; compIds['icon/' + ic] = c.id; }
for (const b of ['brand/logo-color', 'brand/logo-white']) { const c = new N('COMPONENT', b); c.width = 748; c.height = 329; c.createInstance = () => { const i = new N('INSTANCE', b); i.width = 748; i.height = 329; return i; }; compIds[b] = c.id; }

// pages
const pages = ['00–02 · Overview · IA · Flujos', '03–04 · Wireframes · Design System', '05–09 · Hi-Fi · Responsive · Prototipo · Handoff'].map(n => { const p = new N('PAGE', n); return p; });
const dsSec = new N('SECTION', '04 — Design System'); pages[1].appendChild(dsSec);
const shared = { comp: JSON.stringify(compIds) };
const figma = {
  command: process.argv[2] || 'all',
  root: { children: pages, getSharedPluginData: (ns, k) => shared[k] || '', setSharedPluginData: (ns, k, v) => { shared[k] = v; } },
  currentPage: pages[0],
  async setCurrentPageAsync(p) { this.currentPage = p; },
  async loadFontAsync() { },
  async getNodeByIdAsync(id) { return nodes.get(id) || null; },
  async getLocalTextStylesAsync() { return TS.map((n, i) => ({ id: 'S:t' + i, name: n, fontName: { family: 'Figtree', style: 'Regular' }, fontSize: 14, lineHeight: { unit: 'PIXELS', value: 20 }, letterSpacing: { unit: 'PERCENT', value: 0 } })); },
  async getLocalEffectStylesAsync() { return ES.map((n, i) => ({ id: 'S:e' + i, name: n, description: 'desc ' + n })); },
  variables: { async getLocalVariablesAsync() { return VARS.map((n, i) => ({ id: 'V:' + i, name: n })); }, setBoundVariableForPaint(p, f, v) { if (!v) throw new Error('no var'); return { ...p, boundVariables: { color: v.id } }; } },
  createFrame() { const f = new N('FRAME', 'Frame'); this.currentPage.appendChild(f); return f; },
  createText() { const t = new N('TEXT', 'Text'); this.currentPage.appendChild(t); return t; },
  createSection() { const s = new N('SECTION', 'Section'); this.currentPage.appendChild(s); return s; },
  createComponentFromNode(n) { const c = new N('COMPONENT', n.name); c.children = n.children; c.children.forEach(k => k.parent = c); c._p = n._p; c.addComponentProperty = () => 'p#1:1'; if (n.parent) { n.parent.children[n.parent.children.indexOf(n)] = c; c.parent = n.parent; } return c; },
  combineAsVariants(cs, parent) { const s = new N('COMPONENT_SET', 'set'); for (const c of cs) { c.variantProperties = Object.fromEntries(c.name.split(', ').map(x => x.split('='))); const vp = c.variantProperties; c.createInstance = () => createInst('Filter Button', vp); s.appendChild(c); } s.defaultVariant = cs[0]; parent.appendChild(s); s.addComponentProperty = () => 'Label#9:9'; s.componentPropertyDefinitions = {}; return s; },
  closePlugin(msg) { console.log('closePlugin:', msg); }
};
Object.defineProperty(figma.currentPage, 'flowStartingPoints', { set(v) { }, get() { return []; }, configurable: true });
for (const p of pages) Object.defineProperty(p, 'flowStartingPoints', { set(v) { if (!Array.isArray(v)) throw new Error('flows'); p._flows = v; }, get() { return p._flows || []; } });
globalThis.figma = figma;
const t0 = Date.now();
await (new Function('figma', code + '\n;return new Promise(r=>setTimeout(r,50));'))(figma);
await new Promise(r => setTimeout(r, 3000));
// collect plugin ERR via report frame
const rep = pages[2].children.find(n => n.name === 'Reporte del plugin');
const msgs = rep ? rep.children.filter(c => c.type === 'TEXT').map(c => c.characters).slice(2) : [];
console.log('nodes created:', nodes.size, 'time', Date.now() - t0, 'ms');
console.log('plugin warnings:', msgs.length); for (const m of msgs.slice(0, 80)) console.log('  ', m);
console.log('mock problems:', problems.length); for (const m of [...new Set(problems)].slice(0, 40)) console.log('  ', m);
const secs = pages.flatMap(p => p.children.filter(c => c.type === 'SECTION').map(s => `${p.name.slice(0, 5)} | ${s.name}: ${s.children.filter(c => c.type === 'FRAME').length} frames`));
console.log(secs.join('\n'));
const links = pages[2].findAll(n => n.reactions && n.reactions.length).length; console.log('nodes with reactions:', links, 'flows:', (pages[2]._flows || []).length);
