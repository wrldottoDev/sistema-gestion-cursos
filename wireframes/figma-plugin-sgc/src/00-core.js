// ============================================================================
// SGC CENFOTEC · Figma plugin · CORE helpers
// Same helpers used through the Figma MCP (lib1), adapted for a local plugin:
// - no eval, style ids applied sync when allowed, else deferred (dynamic-page)
// ============================================================================
const S = { v: {}, ts: {}, es: {}, cn: {} };
const PEND = [];
const ERR = [];
const SPV = { 0: 'space/0', 2: 'space/0-5', 4: 'space/1', 8: 'space/2', 12: 'space/3', 16: 'space/4', 20: 'space/5', 24: 'space/6', 32: 'space/8', 40: 'space/10', 48: 'space/12', 64: 'space/16', 80: 'space/20' };
const RAV = { 4: 'radius/xs', 6: 'radius/sm', 8: 'radius/md', 12: 'radius/lg', 16: 'radius/xl', 999: 'radius/full' };
const SZ = new Map();
const TRUNC = new Map();
const CREATED = [];
const SZM = { fill: 'FILL', hug: 'HUG', fixed: 'FIXED' };
const FONTS = [['Barlow', 'Bold'], ['Barlow', 'SemiBold'], ['Figtree', 'Regular'], ['Figtree', 'Medium'], ['Figtree', 'SemiBold'], ['Figtree', 'Bold'], ['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Bold']];

const hx = h => { h = h.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }; };

async function init() {
  await Promise.all(FONTS.map(([family, style]) => figma.loadFontAsync({ family, style })));
  for (const v of await figma.variables.getLocalVariablesAsync()) S.v[v.name] = v;
  for (const s of await figma.getLocalTextStylesAsync()) S.ts[s.name] = s;
  for (const s of await figma.getLocalEffectStylesAsync()) S.es[s.name] = s;
  const c = figma.root.getSharedPluginData('sgc', 'comp');
  const ids = c ? JSON.parse(c) : {};
  await Promise.all(Object.entries(ids).map(async ([n, id]) => { const nd = await figma.getNodeByIdAsync(id); if (nd) S.cn[n] = nd; }));
  if (!S.cn['Button']) throw new Error('No se encontró el Design System (pluginData sgc/comp). Ejecute el plugin en el archivo "SGC CENFOTEC — Sistema de Gestión de Cursos (UX/UI)".');
}

// Paint bound to a variable (semantic token) or raw hex.
function P(tok, op) {
  let p;
  if (tok[0] === '#') { p = { type: 'SOLID', color: hx(tok) }; if (op != null && op < 1) p.opacity = op; return p; }
  const v = S.v[tok];
  p = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } };
  if (op != null && op < 1) p.opacity = op;
  if (!v) { ERR.push('Token inexistente: ' + tok); return p; }
  try { const bp = figma.variables.setBoundVariableForPaint(p, 'color', v); return (op != null && op < 1) ? Object.assign({}, bp, { opacity: op }) : bp; } catch (e) { return p; }
}
function bn(n, prop, val) { const nm = SPV[val]; const v = nm && S.v[nm]; if (v) { try { n.setBoundVariable(prop, v); return; } catch (e) { } } n[prop] = val; }
function radius(n, r) { const nm = RAV[r]; const v = nm && S.v[nm]; if (v) { try { for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, v); return; } catch (e) { } } n.cornerRadius = r; }
function sz(n, fx, fy) { if (fx || fy) SZ.set(n, [fx, fy]); return n; }
function add(p, k) {
  if (!k) return;
  p.appendChild(k);
  const s = SZ.get(k);
  if (s && p.layoutMode && p.layoutMode !== 'NONE') {
    if (s[0]) { if (k.type === 'TEXT' && s[0] === 'fill') k.textAutoResize = 'HEIGHT'; k.layoutSizingHorizontal = SZM[s[0]]; }
    if (s[1]) k.layoutSizingVertical = SZM[s[1]];
  }
  // FILL/HEIGHT resets truncation in Figma: re-apply it
  if (k.type === 'TEXT' && TRUNC.has(k)) { k.textTruncation = 'ENDING'; k.maxLines = TRUNC.get(k); }
}
function setEffect(n, name) {
  const s = S.es[name]; if (!s) { ERR.push('Estilo de efecto inexistente: ' + name); return; }
  try { n.effectStyleId = s.id; } catch (e) { PEND.push(['e', n, s.id]); }
}
function setTextStyle(t, name) {
  const s = S.ts[name]; if (!s) { ERR.push('Estilo de texto inexistente: ' + name); return; }
  try { t.textStyleId = s.id; } catch (e) {
    // dynamic-page fallback: apply font now so characters can be set, style later
    t.fontName = s.fontName; t.fontSize = s.fontSize; t.lineHeight = s.lineHeight; t.letterSpacing = s.letterSpacing;
    PEND.push(['t', t, s.id]);
  }
}
async function flush() {
  while (PEND.length) {
    const [k, n, id] = PEND.shift();
    try { if (k === 't') await n.setTextStyleIdAsync(id); else await n.setEffectStyleIdAsync(id); } catch (e) { }
  }
}

// Frame / auto-layout builder
function F(o = {}, kids = []) {
  const f = figma.createFrame(); CREATED.push(f);
  f.name = o.n || 'Frame';
  f.fills = o.bg ? [P(o.bg, o.bgo)] : [];
  // Figma drops the opacity of a variable-bound paint on first assignment: re-assign once bound
  if (o.bg && o.bgo != null && o.bgo < 1 && o.bg[0] !== '#') { const fl = JSON.parse(JSON.stringify(f.fills)); fl[0].opacity = o.bgo; f.fills = fl; }
  if (o.d) {
    f.layoutMode = o.d === 'H' ? 'HORIZONTAL' : 'VERTICAL';
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    if (o.g) bn(f, 'itemSpacing', o.g);
    let p = o.p == null ? 0 : o.p;
    p = typeof p === 'number' ? [p, p, p, p] : p.length === 2 ? [p[0], p[1], p[0], p[1]] : p;
    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach((k, i) => { if (p[i]) bn(f, k, p[i]); });
    if (o.ax) f.primaryAxisAlignItems = o.ax;
    if (o.cx) f.counterAxisAlignItems = o.cx;
    if (o.wrap) { f.layoutWrap = 'WRAP'; f.counterAxisSpacing = o.cg != null ? o.cg : (o.g || 0); }
  }
  if (o.w || o.h) {
    f.resize(o.w || 100, o.h || 100);
    if (o.d) { const H = f.layoutMode === 'HORIZONTAL'; f.primaryAxisSizingMode = (H ? o.w : o.h) ? 'FIXED' : 'AUTO'; f.counterAxisSizingMode = (H ? o.h : o.w) ? 'FIXED' : 'AUTO'; }
  }
  if (o.r) radius(f, o.r);
  if (o.st) {
    f.strokes = [P(o.st)]; f.strokeAlign = o.sa || 'INSIDE';
    if (o.sides) { const [t, r, b, l] = o.sides; f.strokeTopWeight = t; f.strokeRightWeight = r; f.strokeBottomWeight = b; f.strokeLeftWeight = l; }
    else f.strokeWeight = o.sw || 1;
    if (o.dash) f.dashPattern = o.dash;
  }
  if (o.eff) setEffect(f, o.eff);
  f.clipsContent = !!o.clip;
  if (o.op != null) f.opacity = o.op;
  for (const k of kids) add(f, k);
  sz(f, o.fx, o.fy);
  if (o.x != null) f.x = o.x;
  if (o.y != null) f.y = o.y;
  return f;
}
// Text with style + color token
function T(s, st = 'Body/MD', col = 'text/primary', o = {}) {
  const t = figma.createText(); CREATED.push(t);
  setTextStyle(t, st);
  t.characters = String(s);
  t.fills = [P(col)];
  t.name = o.n || String(s).slice(0, 40);
  if (o.al) t.textAlignHorizontal = o.al;
  if (o.w) { t.resize(o.w, t.height); t.textAutoResize = 'HEIGHT'; }
  if (o.trunc) { t.textAutoResize = 'HEIGHT'; t.textTruncation = 'ENDING'; t.maxLines = o.trunc; TRUNC.set(t, o.trunc); }
  if (o.u) t.textDecoration = 'UNDERLINE';
  sz(t, o.fx, null);
  return t;
}
function recolor(n, col) { const p = [P(col)]; for (const v of n.findAll(x => 'strokes' in x && x.strokes.length > 0 && x.type !== 'FRAME' && x.type !== 'INSTANCE')) v.strokes = p; return n; }
function I(name, size = 20, col) {
  const c = S.cn['icon/' + name];
  if (!c) { ERR.push('Icono inexistente: ' + name); return F({ n: 'icon/' + name + ' (missing)', w: size, h: size }); }
  const i = c.createInstance(); CREATED.push(i); if (size !== 24) i.rescale(size / 24); if (col) recolor(i, col); return i;
}
function pick(set, v) { const e = Object.entries(v || {}); const m = set.children.find(ch => e.every(([k, x]) => ch.variantProperties && ch.variantProperties[k] === x)); if (!m && e.length) ERR.push('Variante inexistente: ' + set.name + ' ' + JSON.stringify(v)); return m || set.defaultVariant; }
function setP(i, props) {
  if (!i || i.type !== 'INSTANCE') return i;
  const defs = i.componentProperties; const o = {};
  for (const [k, val] of Object.entries(props)) { const key = Object.keys(defs).find(d => d === k || d.split('#')[0] === k); if (key) o[key] = val; else ERR.push('Propiedad inexistente: ' + k + ' en ' + i.name); }
  if (Object.keys(o).length) i.setProperties(o);
  return i;
}
function txt(n, layer, val) { const t = n.findOne(x => x.type === 'TEXT' && x.name === layer); if (t) t.characters = String(val); return n; }
function inst(name, variant, props, o = {}) {
  const c = S.cn[name];
  if (!c) { ERR.push('Componente inexistente: ' + name); return F({ n: name + ' (missing)', w: 40, h: 20 }); }
  const comp = c.type === 'COMPONENT_SET' ? pick(c, variant) : c;
  const i = comp.createInstance(); CREATED.push(i);
  if (props) setP(i, props);
  if (o.t) for (const [l, v] of Object.entries(o.t)) txt(i, l, v);
  if (o.w) i.resize(o.w, i.height);
  if (o.n) i.name = o.n;
  sz(i, o.fx, o.fy);
  return i;
}
function reg(map) {
  const c = figma.root.getSharedPluginData('sgc', 'comp'); const ids = c ? JSON.parse(c) : {};
  for (const [n, node] of Object.entries(map)) { ids[n] = node.id; S.cn[n] = node; }
  figma.root.setSharedPluginData('sgc', 'comp', JSON.stringify(ids));
}
function section(page, name, x, y, w, h) {
  let s = page.children.find(n => n.type === 'SECTION' && n.name === name);
  if (!s) { s = figma.createSection(); s.name = name; page.appendChild(s); s.x = x; s.y = y; s.resizeWithoutConstraints(w, h); s.fills = [P('#F7F8FA')]; }
  return s;
}
function fit(sec, pad = 160) {
  let mw = 0, mh = 0;
  for (const c of sec.children) { mw = Math.max(mw, c.x + c.width); mh = Math.max(mh, c.y + c.height); }
  sec.resizeWithoutConstraints(Math.max(400, mw + pad), Math.max(400, mh + pad));
}
function clearSection(sec) { for (const c of [...sec.children]) c.remove(); }
// absolute child inside an auto-layout parent
function abs(parent, node, x, y) { parent.appendChild(node); node.layoutPositioning = 'ABSOLUTE'; node.x = x; node.y = y; return node; }
// run a builder safely: errors are collected instead of aborting the whole run
async function safe(label, fn) {
  try { const r = await fn(); await flush(); return r; }
  catch (e) { ERR.push(label + ': ' + (e && e.message ? e.message : String(e))); await flush(); return null; }
}
// Builders sometimes create nodes they end up not using: remove the ones left at page root.
function cleanupOrphans() { let n = 0; for (const c of CREATED) { try { if (!c.removed && c.parent && c.parent.type === 'PAGE') { c.remove(); n++; } } catch (e) { } } CREATED.length = 0; return n; }
async function pageAt(i) { const p = figma.root.children[i]; await figma.setCurrentPageAsync(p); return p; }
