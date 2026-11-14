// ============================================================================
// 08 — Interactive prototype: wire every "…→ID" node to the screen ID, set
// flow starting points and document the flows in section 08.
// ============================================================================
const FLOWS = [
  ['Flujo 1 · Iniciar sesión y llegar a la vista del rol', 'A-01', 'A-01 → (Google o correo) → P-02 Inicio del Director. Estados: A-02 errores, A-03 credenciales, A-04 no autorizado, A-05 Google sin respuesta.', 'RF-001, RF-002, RF-008'],
  ['Flujo 2 · Crear un usuario', 'U-01', 'U-01 → Registrar usuario → U-03 → Registrar → U-01. Validación: U-04. Eliminar: U-06 → U-08; bloqueado: U-07.', 'RF-003 a RF-007'],
  ['Flujo 3 · Administrar un catálogo', 'K-01', 'K-01 → K-04 Áreas SFIA → Registrar elemento → K-05 (validación) → Guardar → K-04. Eliminar en uso → K-07. Importar CSV → M-01 → M-03 → Ver catálogo.', 'RF-010 a RF-017'],
  ['Flujo 4 · Crear un curso y guardarlo como borrador', 'C-02', 'C-02 → Nuevo curso → F-01 → Guardar borrador → F-02 (borrador creado) → F-03 con confirmación "Borrador guardado".', 'RF-018, RF-019'],
  ['Flujo 5 · Editar un borrador', 'P-02', 'P-02 → Continuar (SOFT-210) → F-02 → navegar por el stepper F-03…F-07 → Guardar borrador.', 'RF-019 a RF-027'],
  ['Flujo 6 · Enviar un curso a revisión', 'F-08', 'F-08 → Listo para enviar → F-12 confirmación → Enviar a revisión → F-13 (En desarrollo, solo lectura). Variante incompleta: F-11.', 'RF-030, RF-036, RF-037'],
  ['Flujo 7 · Revisar y aprobar un curso', 'R-01', 'R-01 → Revisar → R-02 → Validar código → R-05 → Aprobar → R-06 → Pasar a En producción (R-08) / Cambiar a Inactivo (R-09). Código pendiente: R-03; corregir: R-04; error: R-07.', 'RF-031 a RF-035, RF-038'],
  ['Flujo 8 · Consultar cursos aprobados (Vicerrectoría)', 'P-05', 'P-05 → Ver detalle → C-06 (datos para Power Campus con copiar). Correo de aviso: N-04.', 'RF-038 a RF-041'],
  ['Flujo 9 · Consultar reportes', 'P-04', 'P-04 → Ver reportes → RP-01 → Histórico → RP-03 → Comparativo → RP-04; rango inválido: RP-05.', 'RF-042, RF-043'],
  ['Flujo 10 · Asistencia de redacción con IA', 'F-04', 'F-04 → Sugerir con Gemini (Descripción corta) → F-09 propuesta → Usar propuesta / Descartar → F-04. Error: Descripción larga → F-10.', 'RF-028, RF-029, RNF-020, RNF-023'],
  ['Flujo 11 · Director en móvil', 'MB-01', 'MB-01 → MB-02 tarjetas → MB-04 formulario con Gemini → Listo para enviar → MB-05 errores. Menú: MB-09.', 'RNF-032'],
  ['Flujo 12 · Director en tablet', 'TB-01', 'TB-01 → TB-02 → TB-03 → TB-04 formulario con chips de pasos.', 'RNF-032']
];
async function buildPrototype() {
  const page = await pageAt(2);
  const map = {};
  const frames = [];
  for (const s of page.children.filter(n => n.type === 'SECTION')) for (const f of s.children) if (f.type === 'FRAME') { const m = f.name.match(/^([A-Z]{1,2}-\d{2})/); if (m) { map[m[1]] = f; frames.push(f); } }
  let links = 0, misses = 0;
  const reaction = dest => ({ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: dest.id, navigation: 'NAVIGATE', transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.2 }, preserveScrollPosition: false, resetVideoPosition: false }] });
  const done = new Set();
  for (const f of frames) {
    const nodes = f.findAll(n => /→[A-Z]{1,2}-\d{2}/.test(n.name));
    for (const n of nodes) {
      const id = n.name.match(/→([A-Z]{1,2}-\d{2})/)[1]; const dest = map[id];
      if (!dest || dest === f) continue;
      try { await n.setReactionsAsync([reaction(dest)]); links++; }
      catch (e) {
        // Instance sublayer refused: link the nearest ancestor instance only if all
        // links inside it go to the same screen (avoids wiring a whole sidebar to one target).
        let p = n.parent, ok = false;
        while (p && p !== f && !ok) {
          if (p.type === 'INSTANCE' && !done.has(p.id)) {
            const ids = new Set(p.findAll(x => /→[A-Z]{1,2}-\d{2}/.test(x.name)).map(x => x.name.match(/→([A-Z]{1,2}-\d{2})/)[1]));
            if (ids.size === 1) { try { await p.setReactionsAsync([reaction(dest)]); done.add(p.id); links++; ok = true; } catch (e2) { } }
            else break;
          }
          p = p.parent;
        }
        if (!ok) misses++;
      }
    }
  }
  if (misses) ERR.push('Prototipo: ' + misses + ' enlaces dentro de instancias no se pudieron conectar automáticamente (p. ej. ítems del menú lateral). Conéctelos a mano si los necesita; el resto de los flujos funciona.');
  page.flowStartingPoints = FLOWS.filter(fl => map[fl[1]]).map(fl => ({ nodeId: map[fl[1]].id, name: fl[0] }));
  // 08 section: flow index
  const sec = section(page, '08 — Interactive Prototype', 0, 0, 3200, 1600); clearSection(sec);
  const rows = FLOWS.map((fl, i) => F({ n: fl[0], d: 'H', g: 24, p: [16, 20], fx: 'fill', cx: 'MIN', bg: i % 2 ? 'bg/subtle' : 'bg/surface', st: 'border/subtle', sides: [0, 0, 1, 0] }, [T(fl[0], 'Body/MD Strong', 'text/primary', { w: 420 }), tag('Inicio: ' + fl[1], 'Brand', 'play'), T(fl[2], 'Body/MD', 'text/primary', { w: 1500 }), T(fl[3], 'Body/SM Medium', 'text/secondary', { w: 260 })]));
  const doc = F({ n: '08 · Índice de flujos prototipados', d: 'V', g: 24, p: 48, w: 2600, r: 24, bg: 'bg/surface' }, [T('08 — Interactive Prototype', 'Display/XL'), T('Las conexiones viven sobre las pantallas finales (05, 06 y 07) de esta misma página para que el prototipo use los componentes reales. Abra el modo Presentar (▶) y elija un flujo en el panel "Flujos". Cada clic muestra el resultado de la acción (confirmaciones, errores, estados), no solo navegación.', 'Body/LG', 'text/secondary', { w: 2500 }),
  F({ n: 'Stats', d: 'H', g: 16 }, [tag(links + ' conexiones', 'Info', 'external'), tag(FLOWS.length + ' flujos con punto de inicio', 'Brand', 'play'), tag('Transición: disolver 200 ms (respeta reducción de movimiento)', 'Outline')]), F({ n: 'Flows table', d: 'V', fx: 'fill', r: 12, st: 'border/default', clip: true }, rows),
  T('Convención: todo elemento cuyo nombre contiene "→ID" navega a la pantalla con ese ID; los fondos oscuros de modales ("Overlay (scrim) →ID") cierran el modal. Para regenerar conexiones tras editar pantallas, ejecute el comando "08 · Conectar prototipo" del plugin.', 'Body/MD', 'text/secondary', { w: 2500 })]);
  sec.appendChild(doc); doc.x = 80; doc.y = 80; fit(sec);
  return links;
}
