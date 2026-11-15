# 15 · Diseño responsive

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define los breakpoints, el armazón de la aplicación por tamaño de pantalla (sidebar, rail, offcanvas, barra inferior), los patrones de adaptación de tablas, formularios y navegación, y el procedimiento de pruebas visuales para cumplir RNF-032.

Fuera de alcance (se enlazan): sintaxis de media queries y unidades en [05](05-CSS-AND-BEM.md); grid y utilidades de Bootstrap en [07](07-BOOTSTRAP.md); tokens de espaciado en [06](06-DESIGN-SYSTEM.md); reflujo y zoom como criterio de accesibilidad en [14](14-ACCESSIBILITY.md); ejecución automatizada de capturas en [16](16-TESTING.md).

## 2. Estándar adoptado

| Decisión | Estado |
|---|---|
| Vistas principales utilizables a 360, 768 y 1440 px sin desplazamiento horizontal innecesario | **Confirmado (ERS)** — RNF-032 |
| Compatibilidad con las dos últimas versiones estables de Chrome, Edge, Firefox y Safari | **Confirmado (ERS)** — RNF-041 a RNF-044 |
| Mobile-first con los breakpoints de Bootstrap 5.3 | **Adoptado** |
| Tamaños de referencia y grid del Design System: móvil 390, tablet 768, laptop 1280, desktop 1440 | **Adoptado** — DS 04-14 y handoff 09 |
| Tablas a tarjetas en móvil; dos líneas o scroll controlado en tablet | **Adoptado** — handoff D-11 |
| Ancho del rail de tablet: 72 px | **Pendiente de validación** — [PV-17](README.md#7-decisiones-pendientes-de-validación) |

## 3. Justificación

- Los breakpoints de Bootstrap ya gobiernan su grid, `.offcanvas-lg` y utilidades `d-md-*`; definir otros obligaría a duplicar lógica y generaría saltos inconsistentes.
- El handoff pide no escalar el escritorio: cada tamaño tiene un patrón propio (D-11) y pantallas específicas (TB-01 a TB-07, MB-01 a MB-09).
- Directores y autoridades consultan cursos y reportes desde teléfono; un listado con scroll horizontal o un formulario con la barra de acciones tapada vuelve la vista inutilizable.
- Mobile-first produce CSS más corto: el caso móvil es el base y los tamaños mayores agregan columnas.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| RWD-01 | Las media queries DEBEN usar solo los breakpoints de §5.1 con `min-width` ([05](05-CSS-AND-BEM.md) CSS-11). |
| RWD-02 | Ninguna vista DEBE producir desplazamiento horizontal de la página entre 320 y 1920 px. El contenido ancho (tablas en tablet) se desplaza dentro de su propio contenedor, nunca la página. |
| RWD-03 | El viewport DEBE declararse `width=device-width, initial-scale=1` sin `maximum-scale` ni `user-scalable=no` (el usuario puede ampliar). |
| RWD-04 | El armazón DEBE seguir §5.2: barra superior + barra inferior + menú offcanvas por debajo de 768 px; rail de 72 px entre 768 y 991 px; sidebar fija de 264 px desde 992 px. |
| RWD-05 | Las tablas de datos DEBEN presentarse como tarjetas por debajo de 768 px (C-01, C-02, U-01, R-01, K-*), con los mismos datos clave (RF-039 CA3: código, nombre, escuela, estado, última modificación) y un enlace real al detalle. Entre 768 y 991 px se permiten dos líneas por celda o scroll horizontal dentro de `.table-responsive`. |
| RWD-06 | Un contenedor con scroll horizontal propio DEBE ser alcanzable y desplazable con teclado: `tabindex="0"`, `role="region"` y `aria-label` ("Tabla de cursos, desplazable"). |
| RWD-07 | Los formularios DEBEN apilarse en una columna por debajo de 768 px; la barra de acciones (Guardar borrador / Listo para enviar) permanece visible y su altura se reserva con `scroll-padding` ([14](14-ACCESSIBILITY.md) A11Y-04). |
| RWD-08 | Ninguna funcionalidad DEBE depender de `hover`: los efectos de hover se declaran dentro de `@media (hover: hover)` y toda acción tiene alternativa táctil y de teclado. |
| RWD-09 | Los objetivos táctiles DEBEN respetar las medidas del DS (botones 44 px, icon buttons 40 px) también en móvil; no se reducen para "caber". |
| RWD-10 | Las imágenes DEBEN declarar `width` y `height` (evitan saltos de diseño) y escalar con `max-inline-size: 100%; block-size: auto`. |
| RWD-11 | La tipografía DEBE usar los tamaños fijos del DS (tokens en `rem`); los encabezados fluidos de Bootstrap (RFS con `calc(… + vw)`) se reemplazan por los tokens en `base/` ([06](06-DESIGN-SYSTEM.md)). |
| RWD-12 | Toda pantalla nueva o modificada DEBE verificarse a 360, 768 y 1440 px (RNF-032) y adjuntar capturas a esos anchos en el PR. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| RWD-13 | El armazón DEBERÍA construirse con CSS Grid (`grid-template-areas`) y el contenido interno con el grid de Bootstrap (`.row`, `.col-*`) o Flexbox. |
| RWD-14 | El gutter del grid DEBERÍA ser `g-3` (16 px) en móvil y tablet y `g-lg-4` (24 px) desde `lg`. El DS pide 12 px en móvil, valor que Bootstrap no ofrece; la diferencia de 4 px se acepta y se documenta (DS-03). No se redefine `--bs-gutter-x` sobre `.row` de forma global: al estar en una capa posterior anularía las clases `g-*`. |
| RWD-15 | El stepper del formulario de curso DEBERÍA compactarse en móvil ("Sección 3 de 8" + lista desplegable o desplazamiento horizontal) en lugar de mostrar las 8 etiquetas. |
| RWD-16 | La barra inferior móvil DEBERÍA mostrar como máximo 5 destinos del rol; el resto queda en el menú offcanvas (MB-09). |
| RWD-17 | Los reportes en móvil DEBERÍAN mostrar primero los KPI y luego los gráficos a ancho completo con su tabla equivalente ([14](14-ACCESSIBILITY.md) A11Y-27). |
| RWD-18 | Las alturas a pantalla completa DEBERÍAN usar `100dvh` con respaldo `100vh` para evitar el recorte por la barra de direcciones móvil. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| RWD-19 | PUEDEN usarse container queries (`@container`) en componentes reutilizados en contextos de ancho distinto (p. ej. `kpi-card` en Inicio y en Reportes). |
| RWD-20 | PUEDEN automatizarse capturas a los tres anchos con Playwright ([16](16-TESTING.md)). |

## 5. Nomenclatura

### 5.1 Breakpoints

| Nombre (Bootstrap) | Desde | Referencia del DS | Armazón | Grid de diseño (DS) |
|---|---|---|---|---|
| xs | 0 | Móvil 390 (mínimo 360; reflujo 320) | Topbar móvil + barra inferior + offcanvas | 4 col · margen 16 · gutter 12 |
| sm | 576 px | Móvil grande | Igual que xs | 4 col |
| md | 768 px | Tablet 768 | Rail 72 px + topbar | 8 col · margen 24 · gutter 16 |
| lg | 992 px | — | Sidebar 264 px + topbar | 12 col · margen 32 · gutter 24 |
| xl | 1200 px | Laptop 1280 | Sidebar 264 px | 12 col · margen 32 · gutter 24 |
| xxl | 1400 px | Desktop 1440 (diseño base) | Sidebar 264 px, contenido máx. 1112 px | 12 col · margen 32 · gutter 24 |

Los "grids de diseño" de 4 y 8 columnas del DS son guías de composición en Figma; en código se implementan con las 12 columnas de Bootstrap (4 col de diseño = `col-12`/`col-6`/`col-3`; 8 col = múltiplos de `col-md-*`).

### 5.2 Variables y bloques de layout

| Elemento | Nombre |
|---|---|
| Armazón | `.app-shell` (`layout/app-shell.css`) |
| Navegación | `.app-sidebar` (con `.offcanvas-lg`), `.app-rail`, `.app-bottom-nav`, `.app-topbar` |
| Región principal | `.app-main` |
| Custom properties de layout (locales a `.app-shell` o `:root` en `layout/`) | `--layout-sidebar-width: 16.5rem` (264 px), `--layout-rail-width: 4.5rem` (72 px, PV-17), `--layout-content-max-width: 69.5rem` (1112 px), `--layout-topbar-height`, `--layout-bottom-nav-height`, `--layout-action-bar-height` |

## 6. Ejemplos

### 6.1 Armazón mobile-first

Correcto (`layout/app-shell.css`):

```css
.app-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'topbar'
    'main'
    'bottom-nav';
  min-block-size: 100vh;
  min-block-size: 100dvh;
}

.app-main {
  grid-area: main;
  padding: var(--space-4); /* margen móvil 16 px */
}

@media (min-width: 768px) {
  .app-shell {
    grid-template-columns: var(--layout-rail-width) minmax(0, 1fr);
    grid-template-areas:
      'rail topbar'
      'rail main';
  }

  .app-main {
    padding: var(--space-6); /* margen tablet 24 px */
  }
}

@media (min-width: 992px) {
  .app-shell {
    grid-template-columns: var(--layout-sidebar-width) minmax(0, 1fr);
    grid-template-areas:
      'sidebar topbar'
      'sidebar main';
  }

  .app-main {
    padding: var(--space-8); /* margen desktop 32 px */
  }
}

.app-main__content {
  max-inline-size: var(--layout-content-max-width);
}
```

Visibilidad de cada navegación con utilidades de Bootstrap:

```html
<nav class="app-sidebar offcanvas-lg offcanvas-start" id="app-sidebar" tabindex="-1" aria-label="Principal">…</nav>
<nav class="app-rail d-none d-md-flex d-lg-none" aria-label="Principal">…</nav>
<nav class="app-bottom-nav d-md-none" aria-label="Accesos principales">…</nav>
```

Incorrecto:

```css
.sidebar { width: 264px; }
@media (max-width: 1024px) { .sidebar { width: 200px; } }  /* desktop-first, breakpoint ajeno */
@media (max-width: 600px) { .sidebar { display: none; } }  /* el menú desaparece sin alternativa */
```

### 6.2 Tabla en escritorio y tarjetas en móvil

El mismo módulo de vista ([08](08-JAVASCRIPT.md)) genera ambas representaciones a partir de los mismos datos; CSS muestra una sola y la oculta queda fuera del árbol de accesibilidad (`display: none`).

```html
<ul class="course-cards d-md-none" aria-label="Cursos">
  <li class="course-card">
    <a class="course-card__link stretched-link" href="/pages/course-detail.html?id=6745f0c2a1b2c3d4e5f60718">SOFT-101 · Fundamentos de programación</a>
    <p class="course-card__meta">Ingeniería del Software · actualizado el 20 nov 2026</p>
    <span class="badge rounded-pill status-badge status-badge--draft">Borrador</span>
  </li>
</ul>

<div class="table-responsive d-none d-md-block" tabindex="0" role="region" aria-label="Tabla de cursos, desplazable">
  <table class="table table-hover">…</table>
</div>
```

Incorrecto: forzar la tabla a 360 px con `font-size: 10px` o dejar que la página entera se desplace horizontalmente.

### 6.3 Hover solo donde existe

```css
@media (hover: hover) {
  .course-card:hover {
    background-color: var(--color-bg-subtle);
  }
}
```

### 6.4 Formulario de curso en móvil

```html
<div class="row g-3 g-lg-4">
  <div class="col-12 col-md-6">…Créditos…</div>
  <div class="col-12 col-md-6">…Modalidad…</div>
  <div class="col-6 col-md-4">…Horas clase…</div>
  <div class="col-6 col-md-4">…Horas extra clase…</div>
  <div class="col-12 col-md-4">…Total de horas (output)…</div>
</div>
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Pantallas con versión específica

| Pantalla desktop | Tablet | Móvil | Patrón |
|---|---|---|---|
| A-01 Inicio de sesión | TB-01 | MB-01 | Formulario centrado de una columna |
| P-02 Inicio Director | TB-02 | — | KPI en 2 columnas en tablet |
| C-02 Mis cursos | TB-03 | MB-02 | Tabla → tarjetas |
| C-05 Detalle de curso | — | MB-03 | `<dl>` apilado, acciones al final |
| F-03 Carga académica | TB-04 | — | Campos en 2 columnas, total calculado visible |
| F-04 Textos con Gemini | — | MB-04 | Panel de Gemini a ancho completo bajo el campo |
| F-11 Envío bloqueado | — | MB-05 | Resumen de errores arriba, barra de acciones fija |
| R-01 Bandeja de revisión | — | MB-06 | Tarjetas ordenadas de la más antigua a la más reciente |
| R-02 Revisión de curso | TB-05 | MB-03 | Datos de solo lectura + panel de código |
| RP-01 Reporte de producción | TB-06 | MB-07 | KPI primero, gráficos a ancho completo |
| U-01 Usuarios | TB-07 | — | Tabla con dos líneas por celda |
| N-01 Avisos (propuesta, PV-15) | — | MB-08 | Lista a pantalla completa |
| Menú lateral | — | MB-09 | Offcanvas desde la izquierda |

Las pantallas sin versión específica aplican los patrones generales: tarjetas para tablas, formularios en una columna, acciones al final y offcanvas para la navegación completa.

### 7.2 Procedimiento de prueba visual

1. **Anchos obligatorios:** 360, 768 y 1440 px (RNF-032). Recomendados además: 390 (referencia móvil), 1280 (laptop) y 320 (reflujo, [14](14-ACCESSIBILITY.md) A11Y-22).
2. **Navegadores:** Chrome y Firefox en el modo de diseño adaptable de DevTools; Safari (macOS o iOS) al menos una vez por pantalla antes de la entrega, por RNF-044; Edge comparte motor con Chrome y se verifica en la suite de aceptación final.
3. **Dispositivo real:** al menos un teléfono físico por integrante para el flujo principal de su módulo.
4. **Sin scroll horizontal:** en la consola, `document.documentElement.scrollWidth <= window.innerWidth` debe ser `true` en cada ancho.
5. **Comparación con Figma:** capturas lado a lado con 05 (desktop), 06 (tablet) y 07 (móvil); desviaciones documentadas en el PR ([06](06-DESIGN-SYSTEM.md) §7.2).
6. **Evidencia:** capturas de 360, 768 y 1440 px en la plantilla de PR.

## 8. Errores frecuentes

- Diseñar primero para 1440 y "arreglar" el móvil con `max-width`.
- Inventar breakpoints (600, 800, 1024) que no coinciden con Bootstrap.
- Ocultar la navegación en móvil sin alternativa.
- Tablas que fuerzan scroll horizontal de toda la página.
- Contenedores con scroll interno que no se pueden desplazar con teclado.
- Barra de acciones fija que tapa el último campo o el foco.
- Botones reducidos a 32 px en móvil.
- Efectos de hover que esconden acciones en pantallas táctiles.
- Redefinir `--bs-gutter-x` en `.row` y anular las clases `g-*`.

## 9. Checklist

- [ ] Media queries solo con `min-width` y breakpoints de §5.1.
- [ ] Sin scroll horizontal de página entre 320 y 1920 px.
- [ ] Armazón correcto: barra inferior + offcanvas (< 768), rail (768–991), sidebar (≥ 992).
- [ ] Tablas como tarjetas en móvil con enlace al detalle; scroll interno accesible en tablet.
- [ ] Formularios en una columna en móvil; barra de acciones visible sin tapar el foco.
- [ ] Hover solo dentro de `@media (hover: hover)`.
- [ ] Objetivos táctiles del DS respetados en móvil.
- [ ] Imágenes con `width` y `height`.
- [ ] Capturas a 360, 768 y 1440 px en el PR, comparadas con Figma.
- [ ] Verificado al menos una vez en Safari antes de la entrega.

## 10. Referencias

- Bootstrap 5.3, breakpoints: https://getbootstrap.com/docs/5.3/layout/breakpoints/
- Bootstrap 5.3, grid y gutters: https://getbootstrap.com/docs/5.3/layout/gutters/
- Bootstrap 5.3, tablas responsive: https://getbootstrap.com/docs/5.3/content/tables/#responsive-tables
- Bootstrap 5.3, offcanvas responsive: https://getbootstrap.com/docs/5.3/components/offcanvas/#responsive
- MDN, CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- MDN, media query `hover`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
- MDN, container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- WCAG 2.2, 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
