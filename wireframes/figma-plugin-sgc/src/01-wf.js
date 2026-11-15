// ============================================================================
// Low-fidelity wireframe generator (grayscale, Inter, ERS labels, annotations)
// ============================================================================
const WST = { t: 'Wireframe/Title', b: 'Wireframe/Body', l: 'Wireframe/Label' };
const wtx = (s, st = 'b', c = 'text/primary', o = {}) => T(s, WST[st], c, o);
const WNAV = { admin: ['Inicio', 'Usuarios', 'Catálogos', 'Importar CSV', 'Cursos', 'Reportes'], dc: ['Inicio', 'Bandeja de revisión', 'Cursos'], dir: ['Inicio', 'Mis cursos', 'Reportes'], rect: ['Inicio', 'Cursos', 'Reportes'], vice: ['Inicio', 'Cursos aprobados', 'Cursos', 'Reportes'] };
const WROLE = { admin: 'Administrador', dc: 'Desarrollo Curricular', dir: 'Director de Escuela', rect: 'Rectoría', vice: 'Vicerrectoría' };

function wbtn(l, k = 's') { const dark = k === 'p' || k === 'd'; return F({ n: 'btn ' + l, d: 'H', p: [0, 16], h: 40, cx: 'CENTER', ax: 'CENTER', r: 6, bg: dark ? (k === 'd' ? 'text/secondary' : 'status/draft-fg') : 'bg/surface', st: dark ? null : 'border/strong', dash: k === 'x' ? [4, 3] : null }, [wtx(l, 'l', dark ? 'text/inverse' : 'text/primary')]); }
function wpill(s) { return F({ n: 'pill', d: 'H', p: [2, 8], r: 999, st: 'border/strong', bg: 'bg/muted' }, [wtx(s, 'l')]); }
function wcell(s, w) { const c = F({ n: 'cell', d: 'H', p: [0, 12], h: 44, cx: 'CENTER', w: w || 100, clip: true }, []); if (s && s[0] === '[') add(c, wpill(s.slice(1, -1))); else add(c, wtx(s || '—', 'b', 'text/primary', { trunc: 1, fx: 'fill' })); return c; }
function wfield(spec) {
  const [lab, type = 'input', hint = '', ...fl] = spec.split('|');
  const ai = fl.includes('ai'); const err = (fl.find(f => f[0] === '!') || '').slice(1); const cnt = (fl.find(f => f.startsWith('cnt:')) || '').slice(4);
  const head = F({ n: 'lab', d: 'H', g: 6, fx: 'fill', cx: 'CENTER' }, [wtx(lab, 'l', lab.endsWith('*') ? 'text/primary' : 'text/secondary', { fx: 'fill' }), ai ? F({ n: 'ai', d: 'H', p: [2, 6], r: 4, st: 'border/strong' }, [wtx('✦ Sugerir con IA', 'l', 'text/secondary')]) : null]);
  if (type === 'check') return F({ n: 'f ' + lab, d: 'H', g: 8, cx: 'CENTER', fx: 'fill', p: [8, 0] }, [F({ n: 'box', w: 16, h: 16, r: 3, st: 'border/strong', bg: hint === 'on' ? 'status/draft-fg' : 'bg/surface' }), wtx(lab.replace('*', ''), 'b')]);
  let ctrl; const bw = err ? 'feedback/error' : 'border/strong';
  if (type === 'radio') ctrl = F({ n: 'opts', d: 'H', g: 16, wrap: true, fx: 'fill', p: [8, 0] }, hint.split(';').map(o => F({ n: 'o', d: 'H', g: 6, cx: 'CENTER' }, [F({ n: 'r', w: 16, h: 16, r: 999, st: 'border/strong', bg: o.endsWith('•') ? 'status/draft-fg' : 'bg/surface' }), wtx(o.replace('•', ''))])));
  else if (type === 'textarea') ctrl = F({ n: 'ta', d: 'V', p: 10, h: 84, fx: 'fill', r: 6, st: bw, sw: err ? 2 : 1, bg: 'bg/surface' }, [wtx(hint, 'b', hint ? 'text/primary' : 'text/secondary', { fx: 'fill' })]);
  else if (type === 'file') ctrl = F({ n: 'file', d: 'V', p: 16, g: 4, fx: 'fill', cx: 'CENTER', r: 6, st: 'border/strong', dash: [6, 4] }, [wtx('Arrastre o seleccione archivo', 'b', 'text/secondary'), wtx(hint, 'l', 'text/secondary')]);
  else if (type === 'tags') ctrl = F({ n: 'tags', d: 'H', g: 6, p: [0, 8], h: 40, fx: 'fill', cx: 'CENTER', r: 6, st: 'border/strong' }, hint.split(';').map(wpill));
  else ctrl = F({ n: 'ctl', d: 'H', p: [0, 10], h: 40, fx: 'fill', cx: 'CENTER', r: 6, st: type === 'calc' ? 'border/default' : bw, sw: err ? 2 : 1, dash: type === 'calc' ? [4, 3] : null, bg: type === 'calc' || type === 'ro' ? 'bg/subtle' : 'bg/surface' }, [wtx(hint, 'b', type === 'calc' || type === 'ro' || !hint ? 'text/secondary' : 'text/primary', { fx: 'fill' }), type === 'select' ? wtx('▾', 'b', 'text/secondary') : type === 'date' ? wtx('▦', 'b', 'text/secondary') : type === 'calc' ? wtx('auto', 'l', 'text/secondary') : null]);
  const kids = [head, ctrl];
  if (cnt || err) kids.push(F({ n: 'meta', d: 'H', fx: 'fill', ax: 'SPACE_BETWEEN' }, [wtx(err ? '⚠ ' + err : '', 'l', err ? 'feedback/error' : 'text/secondary'), wtx(cnt, 'l', cnt && err ? 'feedback/error' : 'text/secondary')]));
  return F({ n: 'f ' + lab, d: 'V', g: 6, fx: 'fill' }, kids);
}
function wgrid(fields, cols) {
  const rows = []; let cur = [];
  for (const f of fields) { const full = f.includes('|full'); if (full) { if (cur.length) rows.push(cur); rows.push([f]); cur = []; } else { cur.push(f); if (cur.length === cols) { rows.push(cur); cur = []; } } }
  if (cur.length) rows.push(cur);
  return rows.map(r => F({ n: 'row', d: 'H', g: 20, fx: 'fill' }, r.map(wfield)));
}
function wcard(kids, o = {}) { return F({ n: o.n || 'card', d: 'V', g: o.g != null ? o.g : 16, p: o.p || 20, fx: 'fill', r: 8, st: 'border/default', bg: 'bg/surface' }, kids); }
function WB(b) {
  const [k, ...a] = b;
  switch (k) {
    case 'toolbar': return F({ n: 'toolbar', d: 'H', g: 12, fx: 'fill', cx: 'CENTER' }, [F({ n: 'search', d: 'H', p: [0, 10], h: 40, w: 360, cx: 'CENTER', r: 6, st: 'border/strong' }, [wtx('⌕  ' + a[0], 'b', 'text/secondary')]), ...(a[1] || []).map(f => F({ n: 'filter', d: 'H', g: 8, p: [0, 10], h: 40, cx: 'CENTER', r: 6, st: 'border/strong' }, [wtx(f, 'b'), wtx('▾', 'b', 'text/secondary')])), F({ n: 'sp', h: 1, w: 1, fx: 'fill' }), ...(a[2] || []).map(x => wbtn(x, 'x'))]);
    case 'table': {
      const [cols, rows, wid] = a; const ws = wid || cols.map(() => null);
      const head = F({ n: 'thead', d: 'H', fx: 'fill', bg: 'bg/muted' }, cols.map((c, i) => wcell(c, ws[i] || 160)));
      head.children.forEach((c, i) => { if (!ws[i]) c.layoutSizingHorizontal = 'FILL'; });
      const body = (typeof rows === 'number' ? Array.from({ length: rows }, () => cols.map(() => 'Texto')) : rows).map(r => { const row = F({ n: 'tr', d: 'H', fx: 'fill', st: 'border/default', sides: [0, 0, 1, 0] }, r.map((c, i) => wcell(c, ws[i] || 160))); row.children.forEach((c, i) => { if (!ws[i]) c.layoutSizingHorizontal = 'FILL'; }); return row; });
      return F({ n: 'table', d: 'V', fx: 'fill', r: 8, st: 'border/default', clip: true }, [head, ...body, F({ n: 'pager', d: 'H', p: [10, 12], fx: 'fill', ax: 'SPACE_BETWEEN', cx: 'CENTER' }, [wtx('Mostrando 1–10 de 48', 'l', 'text/secondary'), wtx('‹  1  2  3  …  5  ›', 'l', 'text/secondary')])]);
    }
    case 'kpis': return F({ n: 'kpis', d: 'H', g: 16, fx: 'fill' }, a[0].map(s => { const [l, v] = s.split('='); return F({ n: 'kpi', d: 'V', g: 4, p: 16, r: 8, st: 'border/default', fx: 'fill' }, [wtx(l, 'l', 'text/secondary'), wtx(v, 't')]); }));
    case 'form': return wcard([a[0] ? wtx(a[0], 'l', 'text/secondary') : null, ...wgrid(a[1], a[2] || 2)], { n: 'form ' + (a[0] || '') });
    case 'panel': return wcard([wtx(a[0], 'l', 'text/secondary'), ...a[1].map(WB)], { n: 'panel ' + a[0] });
    case 'detail': return F({ n: 'detail', d: 'V', g: 16, fx: 'fill' }, a[0].map(([t, kv]) => wcard([wtx(t, 'l', 'text/secondary'), ...(() => { const rows = []; const c = a[1] || 2; for (let i = 0; i < kv.length; i += c) rows.push(F({ n: 'kvrow', d: 'H', g: 20, fx: 'fill' }, kv.slice(i, i + c).map(([k2, v]) => F({ n: 'kv', d: 'V', g: 2, fx: 'fill' }, [wtx(k2, 'l', 'text/secondary'), v && v[0] === '[' ? wpill(v.slice(1, -1)) : wtx(v, 'b', 'text/primary', { fx: 'fill' })])))); return rows; })()], { n: 'd ' + t })));
    case 'alert': return F({ n: 'alert', d: 'H', g: 8, p: [12, 14], fx: 'fill', r: 6, st: a[1] === 'e' ? 'feedback/error' : 'border/strong', sides: [1, 1, 1, 4], bg: 'bg/subtle' }, [wtx((a[1] === 'e' ? '⚠ ' : a[1] === 'ok' ? '✓ ' : 'ⓘ ') + a[0], 'b', 'text/primary', { fx: 'fill' })]);
    case 'note': return wtx('Nota: ' + a[0], 'l', 'text/secondary', { fx: 'fill' });
    case 'empty': return wcard([F({ n: 'ic', w: 56, h: 56, r: 999, bg: 'bg/muted' }), wtx(a[0], 't'), wtx(a[1], 'b', 'text/secondary'), a[2] ? wbtn(a[2], 'p') : null], { n: 'empty', p: 48 });
    case 'chart': {
      const n = a[2] || 8;
      const bars = Array.from({ length: n }, (_, i) => { const h = 40 + ((i * 37) % 120); return a[1] === 'stack' ? F({ n: 'stack', d: 'V', w: 28 }, [F({ n: 's', w: 28, h: Math.round(h * 0.3), bg: 'border/strong' }), F({ n: 's', w: 28, h: Math.round(h * 0.5), bg: 'text/secondary' }), F({ n: 's', w: 28, h: Math.round(h * 0.2), bg: 'bg/muted' })]) : F({ n: 'bar', w: 28, h, bg: i % 2 ? 'border/strong' : 'text/secondary' }); });
      return wcard([F({ n: 'h', d: 'H', fx: 'fill', ax: 'SPACE_BETWEEN' }, [wtx(a[0], 'l', 'text/secondary'), wtx('■ Borrador ■ En desarrollo ■ Aprobado ■ En producción ■ Inactivo', 'l', 'text/secondary')]), F({ n: 'plot', d: 'H', g: 24, p: [0, 8], h: 200, fx: 'fill', cx: 'MAX', st: 'border/default', sides: [0, 0, 1, 1] }, bars)], { n: 'chart' });
    }
    case 'tabs': return F({ n: 'tabs', d: 'H', g: 24, fx: 'fill', st: 'border/default', sides: [0, 0, 1, 0] }, a[0].map((t, i) => F({ n: 'tab', d: 'V', p: [10, 2], st: i === a[1] ? 'status/draft-fg' : null, sides: [0, 0, 3, 0] }, [wtx(t, i === a[1] ? 'l' : 'b')])));
    case 'wizard': {
      const steps = a[0].map((s, i) => { const err = a[4] && a[4].includes(i); return F({ n: 'step', d: 'H', g: 10, p: [8, 10], cx: 'CENTER', fx: 'fill', r: 6, bg: i === a[1] ? 'bg/muted' : null }, [F({ n: 'n', d: 'H', w: 24, h: 24, r: 999, ax: 'CENTER', cx: 'CENTER', bg: i < a[1] && !err ? 'status/draft-fg' : 'bg/surface', st: err ? 'feedback/error' : 'border/strong' }, [wtx(err ? '!' : i < a[1] ? '✓' : String(i + 1), 'l', i < a[1] && !err ? 'text/inverse' : err ? 'feedback/error' : 'text/primary')]), wtx(s, i === a[1] ? 'l' : 'b', i === a[1] ? 'text/primary' : 'text/secondary', { fx: 'fill' })]); });
      return F({ n: 'wizard', d: 'H', g: 24, fx: 'fill' }, [F({ n: 'stepper', d: 'V', g: 4, w: 260, p: 12, r: 8, st: 'border/default' }, [wtx('Progreso: ' + (a[3] || '40 %'), 'l', 'text/secondary'), F({ n: 'prog', h: 6, w: 236, r: 999, bg: 'bg/muted' }), ...steps]), F({ n: 'content', d: 'V', g: 16, fx: 'fill' }, a[2].map(WB))]);
    }
    case 'split': return F({ n: 'split', d: 'H', g: 24, fx: 'fill' }, [F({ n: 'L', d: 'V', g: 16, fx: 'fill' }, a[0].map(WB)), F({ n: 'R', d: 'V', g: 16, w: a[2] || 380 }, a[1].map(WB))]);
    case 'side': return F({ n: 'side', d: 'H', g: 24, fx: 'fill' }, [F({ n: 'L', d: 'V', g: 12, w: a[2] || 240 }, a[0].map(WB)), F({ n: 'R', d: 'V', g: 16, fx: 'fill' }, a[1].map(WB))]);
    case 'timeline': return wcard([wtx('Historial', 'l', 'text/secondary'), ...a[0].map(s => F({ n: 'ti', d: 'H', g: 10, cx: 'CENTER', fx: 'fill' }, [F({ n: 'dot', w: 12, h: 12, r: 999, bg: 'text/secondary' }), wtx(s, 'b', 'text/primary', { fx: 'fill' })]))], { n: 'timeline' });
    case 'actionbar': return F({ n: 'actionbar', d: 'H', g: 12, p: [14, 16], fx: 'fill', cx: 'CENTER', r: 8, st: 'border/strong', bg: 'bg/subtle' }, [wtx(a[0], 'l', 'text/secondary', { fx: 'fill' }), ...a[1].map((x, i) => wbtn(x, i === a[1].length - 1 ? 'p' : 's'))]);
    case 'list': return wcard(a[0].map(s => F({ n: 'li', d: 'H', g: 10, p: [10, 0], fx: 'fill', cx: 'CENTER', st: 'border/default', sides: [0, 0, 1, 0] }, [F({ n: 'ic', w: 32, h: 32, r: 999, bg: 'bg/muted' }), wtx(s, 'b', 'text/primary', { fx: 'fill' })])), { n: 'list', g: 0 });
    case 'row': return F({ n: 'row', d: 'H', g: 16, fx: 'fill' }, a[0].map(WB));
    case 'btns': return F({ n: 'btns', d: 'H', g: 12, fx: 'fill', ax: a[1] || 'MIN' }, a[0].map((x, i) => wbtn(x, i === a[0].length - 1 ? 'p' : 's')));
    case 'email': return F({ n: 'email', d: 'V', g: 0, w: 640, r: 8, st: 'border/strong', clip: true }, [F({ n: 'hdr', d: 'H', p: 20, fx: 'fill', bg: 'bg/muted' }, [wtx('LOGO OFICIAL · Universidad CENFOTEC', 'l', 'text/secondary')]), F({ n: 'body', d: 'V', g: 12, p: 28, fx: 'fill' }, [wtx(a[0], 't'), ...a[1].map(l => wtx(l, 'b', 'text/primary', { fx: 'fill' })), wbtn(a[2], 'p')]), F({ n: 'ftr', d: 'H', p: 16, fx: 'fill', bg: 'bg/subtle' }, [wtx('Mensaje automático del SGC · no responder', 'l', 'text/secondary')])]);
    default: return wtx('[' + k + ']');
  }
}
function woverlay(root, b) {
  const [k, ...a] = b;
  if (k === 'modal') {
    const m = F({ n: 'modal', d: 'V', g: 14, p: 24, w: 520, r: 10, bg: 'bg/surface', st: 'border/strong' }, [wtx(a[0], 't', 'text/primary', { w: 472 }), wtx(a[1], 'b', 'text/secondary', { fx: 'fill' }), ...(a[3] ? a[3].map(WB) : []), F({ n: 'acts', d: 'H', g: 12, fx: 'fill', ax: 'MAX' }, a[2].map((x, i) => wbtn(x, i === a[2].length - 1 ? (a[4] || 'p') : 's')))]);
    const o = F({ n: 'overlay', w: root.width, h: root.height, bg: 'text/primary', bgo: 0.35 });
    abs(root, o, 0, 0); abs(root, m, (root.width - 520) / 2, Math.max(140, (root.height - m.height) / 2 - 60));
  }
  if (k === 'toast') { const o = F({ n: 'toast', d: 'H', g: 10, p: [12, 16], w: 380, r: 8, bg: 'bg/surface', st: 'border/strong' }, [wtx('✓', 't'), wtx(a[0], 'b', 'text/primary', { fx: 'fill' })]); abs(root, o, root.width - 412, 80); }
  if (k === 'drawer') { const w = a[1] || 440; const o = F({ n: 'drawer', d: 'V', g: 16, p: 24, w, h: root.height, bg: 'bg/surface', st: 'border/strong', sides: [0, 0, 0, 1] }, [wtx(a[0], 't'), ...a[2].map(WB)]); abs(root, o, root.width - w, 0); }
  if (k === 'popover') { const o = F({ n: 'popover', d: 'V', g: 12, p: 16, w: a[1] || 360, r: 8, bg: 'bg/surface', st: 'border/strong' }, [wtx(a[0], 'l', 'text/secondary'), ...a[2].map(WB)]); abs(root, o, root.width - (a[1] || 360) - 24, 60); }
}
function wscreen(s) {
  const main = F({ n: 'main', d: 'V', fx: 'fill' });
  if (s.nav) {
    add(main, F({ n: 'topbar', d: 'H', g: 16, p: [0, 24], h: 56, fx: 'fill', cx: 'CENTER', st: 'border/default', sides: [0, 0, 1, 0] }, [wtx(s.crumbs || s.title, 'l', 'text/secondary', { fx: 'fill' }), wtx('ES | EN', 'l'), wtx('Avisos (3)', 'l'), F({ n: 'u', w: 28, h: 28, r: 999, bg: 'bg/muted' }), wtx(WROLE[s.nav], 'l')]));
    const head = F({ n: 'pagehead', d: 'H', g: 12, fx: 'fill', cx: 'MAX' }, [F({ n: 't', d: 'V', g: 4, fx: 'fill' }, [s.title ? wtx(s.title, 't') : null, s.sub ? wtx(s.sub, 'b', 'text/secondary', { fx: 'fill' }) : null]), ...(s.head || []).map((h, i, arr) => wbtn(h, i === arr.length - 1 ? 'p' : 's'))]);
    add(main, F({ n: 'content', d: 'V', g: 20, p: [28, 32], fx: 'fill' }, [head, ...(s.blocks || []).map(WB)]));
  } else add(main, F({ n: 'content', d: 'V', g: 20, p: [40, 32], fx: 'fill', cx: 'CENTER' }, (s.blocks || []).map(WB)));
  const kids = [];
  if (s.nav) {
    const items = WNAV[s.nav].map(x => F({ n: 'item', d: 'H', g: 10, p: [8, 10], fx: 'fill', r: 6, bg: x === s.active ? 'bg/muted' : null, cx: 'CENTER' }, [F({ n: 'i', w: 16, h: 16, r: 3, st: 'border/strong' }), wtx(x, x === s.active ? 'l' : 'b', x === s.active ? 'text/primary' : 'text/secondary')]));
    kids.push(F({ n: 'nav', d: 'V', g: 6, p: [20, 14], w: 232, fy: 'fill', st: 'border/default', sides: [0, 1, 0, 0], bg: 'bg/subtle' }, [F({ n: 'logo', d: 'H', h: 56, fx: 'fill', r: 6, st: 'border/strong', dash: [4, 3], ax: 'CENTER', cx: 'CENTER' }, [wtx('LOGO OFICIAL', 'l', 'text/secondary')]), F({ n: 'gap', h: 12, w: 1 }), ...items]));
  }
  kids.push(main);
  const root = F({ n: 'WF ' + s.id, d: 'H', w: s.w || 1440, bg: 'bg/surface', clip: true }, kids);
  root.minHeight = s.h || 900; main.minHeight = s.h || 900;
  for (const ov of (s.ov || [])) woverlay(root, ov);
  const ann = F({ n: 'Anotación', d: 'V', g: 12, p: 24, w: 420, fy: 'fill', bg: 'bg/subtle', st: 'border/default', sides: [0, 0, 0, 1] }, [wtx(s.id, 'l', 'text/secondary'), wtx(s.name, 't', 'text/primary', { fx: 'fill' }),
  ...[['Rol autorizado', s.role], ['Objetivo', s.goal], ['Elementos principales', s.els], ['Acciones disponibles', s.acts], ['Estados relevantes', s.states], ['Requerimientos', s.refs]].map(([k, v]) => F({ n: k, d: 'V', g: 2, fx: 'fill' }, [wtx(k.toUpperCase(), 'l', 'text/secondary'), wtx(v || '—', 'b', 'text/primary', { fx: 'fill' })]))]);
  return F({ n: 'WF · ' + s.id + ' · ' + s.name, d: 'H', r: 12, st: 'border/default', clip: true, bg: 'bg/surface' }, [root, ann]);
}
function wplace(sec, list, title, perRow = 3) {
  let my = 0; for (const c of sec.children) my = Math.max(my, c.y + c.height);
  const y0 = my + (my ? 160 : 80);
  const lbl = T(title, 'Heading/H1', 'text/primary'); sec.appendChild(lbl); lbl.x = 80; lbl.y = y0;
  let x = 80, y = y0 + 80, rowH = 0, i = 0;
  for (const w of list) { if (!w) continue; sec.appendChild(w); w.x = x; w.y = y; rowH = Math.max(rowH, w.height); i++; if (i % perRow === 0) { x = 80; y += rowH + 100; rowH = 0; } else x += w.width + 100; }
  return y + rowH;
}
