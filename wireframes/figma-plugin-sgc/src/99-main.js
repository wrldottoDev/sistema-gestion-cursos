// ============================================================================
// Entry point · menu commands
// ============================================================================
async function ensureDS() {
  if (S.cn['Filter Button']) return;
  const page = await pageAt(1);
  const sec = page.children.find(n => n.type === 'SECTION' && n.name === '04 — Design System');
  if (!sec) throw new Error('No existe la sección "04 — Design System".');
  const comps = ['Default', 'Active', 'Disabled'].map(st => {
    const a = st === 'Active', d = st === 'Disabled';
    const fr = F({ n: 'Filter', d: 'H', g: 8, p: [0, 12], h: 40, cx: 'CENTER', r: 8, bg: a ? 'bg/brand-subtle' : d ? 'bg/muted' : 'bg/surface', st: a ? 'border/brand' : d ? 'border/default' : 'border/strong' }, [I(d ? 'lock' : 'filter', 16, d ? 'text/disabled' : a ? 'text/brand' : 'text/secondary'), T('Filtro: Todos', 'Body/MD Medium', d ? 'text/disabled' : a ? 'text/brand' : 'text/primary', { n: 'Label' }), I('chevron-down', 16, d ? 'text/disabled' : 'text/secondary')]);
    const c = figma.createComponentFromNode(fr); c.name = 'State=' + st; return c;
  });
  const holder = F({ n: 'DS / Filtros de tabla', d: 'V', g: 24, p: 48, bg: 'bg/surface', r: 24, w: 900 }, [T('Filtros de tabla', 'Heading/H1'), T('Botón de filtro con su valor visible. Active = valor distinto de "Todos". Disabled = filtro fijo por rol (Director: Escuela, RF-041 CA3 / RF-042 CA3).', 'Body/LG', 'text/secondary', { fx: 'fill' })]);
  sec.appendChild(holder);
  const set = figma.combineAsVariants(comps, holder);
  set.name = 'Filter Button'; set.layoutMode = 'HORIZONTAL'; set.itemSpacing = 16;
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 24;
  set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';
  set.fills = [P('bg/surface')]; set.strokes = [P('#9747FF')]; set.dashPattern = [6, 4]; set.cornerRadius = 12;
  const key = set.addComponentProperty('Label', 'TEXT', 'Filtro: Todos');
  for (const c of set.children) { const t = c.findOne(n => n.type === 'TEXT' && n.name === 'Label'); if (t) t.componentPropertyReferences = { characters: key }; }
  set.description = 'Filtro de tabla (RF-007 CA2, RF-016 CA2, RF-041 CA2/CA3, RF-042 CA2/CA3).';
  let my = 0; for (const c of sec.children) if (c !== holder && Math.abs(c.x - 80) < 5) my = Math.max(my, c.y + c.height);
  holder.x = 80; holder.y = my + 80;
  fit(sec);
  reg({ 'Filter Button': set });
  await flush();
}
async function errorReport() {
  const page = await pageAt(2);
  const old = page.children.find(n => n.name === 'Reporte del plugin'); if (old) old.remove();
  if (!ERR.length) return;
  const uniq = [...new Set(ERR)].slice(0, 120);
  const f = F({ n: 'Reporte del plugin', d: 'V', g: 6, p: 32, w: 1400, r: 16, bg: 'bg/surface', st: 'feedback/error', sw: 2 }, [T('Avisos del plugin (' + ERR.length + ')', 'Heading/H2', 'feedback/error'), T('Copie este texto y compártalo para corregir. El resto de pantallas se generó normalmente.', 'Body/MD', 'text/secondary', { w: 1336 }), ...uniq.map(e => T('• ' + e, 'Body/SM', 'text/primary', { w: 1336 }))]);
  page.appendChild(f); f.x = -1700; f.y = 0;
  await flush();
}
async function main() {
  const cmd = figma.command || 'all';
  const out = [];
  try {
    await init();
    await ensureDS();
    if (cmd === 'wf' || cmd === 'all') out.push('03 Wireframes: ' + await buildWireframes());
    if (cmd === 'desk' || cmd === 'all') out.push('05 Desktop: ' + await buildDesktop());
    if (cmd === 'resp' || cmd === 'all') out.push('06–07 Responsive: ' + await buildResponsive());
    if (cmd === 'proto' || cmd === 'all') out.push('08 Conexiones: ' + await buildPrototype());
    if (cmd === 'docs' || cmd === 'all') out.push('00–02/09 Tableros: ' + await buildDocs());
    cleanupOrphans();
    const p2 = await pageAt(2);
    stackSections(p2, ['05 — High Fidelity Desktop', '06 — High Fidelity Tablet', '07 — High Fidelity Mobile', '08 — Interactive Prototype', '09 — UX Documentation & Handoff'], 800);
    await errorReport();
    figma.closePlugin('SGC ✓ ' + out.join(' · ') + (ERR.length ? ' · ' + ERR.length + ' avisos (frame "Reporte del plugin")' : ''));
  } catch (e) {
    try { ERR.unshift('FATAL: ' + (e && e.message ? e.message : e)); await errorReport(); } catch (e2) { }
    figma.closePlugin('SGC ✗ ' + (e && e.message ? e.message : e));
  }
}
main();
