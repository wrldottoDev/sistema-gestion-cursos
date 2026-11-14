# 07 · Bootstrap

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se incorpora y personaliza Bootstrap 5.3 en el frontend: carga del CSS y del JavaScript bundle, componentes que se usan y su correspondencia con el Design System, grid y utilidades, personalización mediante custom properties y convivencia con el CSS propio en BEM.

Fuera de alcance (se enlazan): capas y BEM en [05](05-CSS-AND-BEM.md); valores de tokens en [06](06-DESIGN-SYSTEM.md); breakpoints y layouts en [15](15-RESPONSIVE-DESIGN.md); comportamiento accesible de modales, toasts y menús en [14](14-ACCESSIBILITY.md); módulos JavaScript en [08](08-JAVASCRIPT.md); CSP en [12](12-SECURITY.md).

## 2. Estándar adoptado

| Decisión | Estado |
|---|---|
| Bootstrap 5.3 como biblioteca de componentes de la Iteración 2 | **Confirmado (ERS)** — §7.1, restricción del curso |
| CSS compilado (`bootstrap.min.css`) y `bootstrap.bundle.min.js` (incluye Popper), sin modificar sus archivos | **Adoptado** |
| Personalización solo con custom properties `--bs-*` en capas propias; sin Sass ni recompilación | **Adoptado** — [ADR-0003](../adr/0003-frontend-mpa-es-modules-bootstrap.md) |
| Bootstrap 5.3.8 servido localmente en `/vendor/bootstrap/`. Mientras no exista `package.json` ni Express, la distribución compilada se copia **sin modificar** en `frontend/vendor/bootstrap/` (`css/bootstrap.min.css`, `js/bootstrap.bundle.min.js`, `LICENSE`); al crear el backend se instala con npm (versión exacta) y Express monta `node_modules/bootstrap/dist/` en la misma URL, sin cambiar HTML ni CSS | **Implementado** (copia temporal) · origen definitivo **Pendiente de validación** — [PV-04](README.md#7-decisiones-pendientes-de-validación) |
| Sin jQuery, sin temas de terceros, sin modo oscuro (`data-bs-theme`) | **Adoptado** |

Estado actual: **no implementado**. No existe `package.json` ni copia de Bootstrap en el repositorio.

## 3. Justificación

- La ERS exige Bootstrap en la Iteración 2; usarlo para lo que ya resuelve (grid, formularios, modales, toasts, offcanvas, dropdowns, paginación) evita reescribir comportamiento complejo y accesible como la trampa de foco de los modales.
- Bootstrap 5.3 expone custom properties en `:root` y por componente (`--bs-btn-bg`, `--bs-table-hover-bg`…), lo que permite aplicar los tokens del Design System sin Sass, coherente con la decisión de no tener paso de build.
- Modificar el CSS fuente o recompilar obligaría a mantener una bifurcación de Bootstrap; las actualizaciones de parche serían manuales y riesgosas.
- Importar Bootstrap en la capa `vendor` hace que el CSS propio gane por orden de capa y no por especificidad ([05](05-CSS-AND-BEM.md)).
- Servirlo localmente evita depender de un CDN para la demo y simplifica la Content Security Policy (`'self'`), a la espera de PV-04.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| BS-01 | El CSS de Bootstrap DEBE cargarse solo desde `main.css` con `@import url('/vendor/bootstrap/css/bootstrap.min.css') layer(vendor);`. Prohibido enlazarlo con `<link>` en el HTML (quedaría fuera de capa y ganaría al CSS propio). |
| BS-02 | El JavaScript DEBE cargarse con `<script src="/vendor/bootstrap/js/bootstrap.bundle.min.js" defer></script>` antes del `<script type="module">` de la página ([04](04-HTML.md)). Ambos se ejecutan en orden de documento después del análisis del HTML. |
| BS-03 | NO DEBEN editarse, copiarse parcialmente ni recompilarse los archivos de Bootstrap. La versión se fija exacta en `package.json` y se actualiza solo con un PR `build(deps): …` que pruebe las pantallas. |
| BS-04 | La personalización global DEBE hacerse en `css/tokens/bootstrap-variables.css` (capa `tokens`) asignando tokens del DS a variables `--bs-*` en `:root`. Las variables RGB que Bootstrap requiere (`--bs-primary-rgb`, `--bs-link-color-rgb`…) se declaran como tripletas con un comentario que indique el token de origen. |
| BS-05 | La personalización por componente DEBE hacerse en `css/components/bootstrap-components.css` (capa `components`) redefiniendo sus variables (`.btn-primary { --bs-btn-bg: … }`) o, si Bootstrap no expone variable (p. ej. `:focus` de `.form-control`, icono de `.is-invalid`), sobrescribiendo la propiedad con el mismo selector de una sola clase. Nunca subiendo especificidad. |
| BS-06 | Si un componente del DS tiene equivalente en Bootstrap (tabla §7.1) DEBE usarse el de Bootstrap. Solo los componentes sin equivalente se crean como bloques BEM propios. |
| BS-07 | Las variantes visuales del DS sobre un componente Bootstrap DEBEN implementarse como bloque o modificador BEM que solo asigna custom properties o tokens, aplicado junto a las clases de Bootstrap: `class="badge rounded-pill status-badge status-badge--approved"`. |
| BS-08 | Las clases propias NO DEBEN usar prefijos reservados por Bootstrap (`btn-`, `form-`, `nav-`, `text-`, `bg-`, `col-`, `row-`, `d-`, `m*-`, `p*-`, `g-`…) para evitar colisiones presentes o futuras. |
| BS-09 | Los componentes interactivos DEBEN inicializarse por atributos `data-bs-*` (`data-bs-toggle="modal"`, `data-bs-target="#confirm-deactivate"`, `data-bs-dismiss="modal"`). La API JavaScript (`bootstrap.Modal.getOrCreateInstance`) se usa solo cuando la apertura depende de lógica (p. ej. confirmar después de validar), encapsulada en `frontend/js/core/` ([08](08-JAVASCRIPT.md)). |
| BS-10 | Los componentes que requieren inicialización explícita (Tooltip, Popover) NO DEBEN usarse para información esencial; si se usan, se inicializan desde JavaScript y la información también está disponible sin hover ([14](14-ACCESSIBILITY.md)). |
| BS-11 | NO DEBEN usarse `data-bs-theme`, componentes de Bootstrap sin correspondencia en el DS (Carousel, Scrollspy, Accordion decorativo) ni plugins de terceros sobre Bootstrap sin aprobación en el PR. |
| BS-12 | La CSP DEBE permitir `img-src data:` porque Bootstrap usa imágenes SVG en `data:` URI para `.form-select`, `.form-check` y `.btn-close` ([12](12-SECURITY.md)). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| BS-13 | Las utilidades de espaciado (`m*-`, `p*-`, `gap-*`) DEBERÍAN usarse en HTML cuando el valor coincide con la escala de Bootstrap (1 = 4 px, 2 = 8 px, 3 = 16 px, 4 = 24 px, 5 = 48 px), que equivale a `space/1`, `space/2`, `space/4`, `space/6` y `space/12` del DS. Los valores del DS sin utilidad (12, 20, 32, 40, 64 px) se aplican en el CSS del componente con tokens. |
| BS-14 | Las utilidades de layout (`d-flex`, `align-items-center`, `justify-content-between`, `flex-wrap`, `d-none d-md-block`) y de accesibilidad (`visually-hidden`, `visually-hidden-focusable`) DEBERÍAN preferirse a CSS propio equivalente. |
| BS-15 | Las utilidades de color (`text-primary`, `bg-success`, `text-bg-*`) NO DEBERÍAN usarse en componentes: el color lo define el componente con tokens semánticos. Se toleran `text-body-secondary` para metadatos y `text-danger` dentro de `invalid-feedback`. |
| BS-16 | El grid (`.container-fluid`, `.row`, `.col-*`, `.g-*`) DEBERÍA usarse para formularios y regiones de contenido; el armazón de la aplicación (sidebar, rail, topbar, bottom nav) es un layout propio con CSS Grid ([15](15-RESPONSIVE-DESIGN.md)). |
| BS-17 | Los íconos de validación que Bootstrap dibuja dentro de `.form-control.is-invalid` DEBERÍAN desactivarse: el DS muestra el icono junto al mensaje bajo el campo, y el SVG de Bootstrap tiene el rojo por defecto compilado. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| BS-18 | PUEDEN usarse las utilidades `.focus-ring` y `.link-*` si se configuran sus variables con los tokens del DS. |
| BS-19 | PUEDE usarse `.stretched-link` en tarjetas móviles de curso para que toda la tarjeta navegue al detalle, manteniendo un enlace real dentro de ella. |

## 5. Nomenclatura

| Elemento | Ubicación o patrón |
|---|---|
| Archivos de Bootstrap servidos | `/vendor/bootstrap/css/bootstrap.min.css`, `/vendor/bootstrap/js/bootstrap.bundle.min.js` (origen: `node_modules/bootstrap/dist/`, montaje en [09](09-NODEJS-BACKEND.md)) |
| Mapeo global DS → Bootstrap | `frontend/css/tokens/bootstrap-variables.css` |
| Overrides por componente | `frontend/css/components/bootstrap-components.css` |
| Bloques propios que acompañan a Bootstrap | BEM en inglés sin prefijos de Bootstrap: `status-badge`, `icon-button`, `app-sidebar` |
| Ids de componentes con `data-bs-target` | kebab-case con propósito: `#confirm-deactivate-course`, `#app-sidebar` |

## 6. Ejemplos

### 6.1 Mapeo global (`tokens/bootstrap-variables.css`)

```css
/* Asigna tokens del DS a las variables globales de Bootstrap 5.3 (capa tokens > vendor). */
:root {
  --bs-body-font-family: var(--font-family-body);
  --bs-body-font-size: var(--font-size-body-md);
  --bs-body-line-height: 1.4286; /* 20/14 de Body/MD */
  --bs-body-color: var(--color-text-primary);
  --bs-body-bg: var(--color-bg-canvas);
  --bs-secondary-color: var(--color-text-secondary);
  --bs-heading-color: var(--color-text-primary);
  --bs-border-color: var(--color-border-default);
  --bs-border-radius: var(--radius-md);
  --bs-border-radius-lg: var(--radius-lg);

  --bs-primary: var(--color-action-primary);
  --bs-primary-rgb: 0, 106, 234; /* action/primary #006AEA */
  --bs-danger: var(--color-feedback-error);
  --bs-danger-rgb: 179, 38, 30; /* feedback/error #B3261E */
  --bs-success: var(--color-feedback-success);
  --bs-success-rgb: 30, 123, 52; /* feedback/success #1E7B34 */

  --bs-link-color: var(--color-text-link);
  --bs-link-color-rgb: 0, 106, 234; /* text/link #006AEA */
  --bs-link-hover-color: var(--color-action-primary-hover);
  --bs-link-hover-color-rgb: 0, 85, 189; /* action/primary-hover #0055BD */

  --bs-form-invalid-color: var(--color-feedback-error);
  --bs-form-invalid-border-color: var(--color-feedback-error);
  --bs-form-valid-color: var(--color-feedback-success);
  --bs-form-valid-border-color: var(--color-feedback-success);
}
```

Nota: cambiar `--bs-primary` no recolorea `.btn-primary` ni `.pagination`, cuyas variables de componente se compilaron con el azul por defecto; por eso existe §6.2.

### 6.2 Overrides por componente (`components/bootstrap-components.css`)

Correcto:

```css
.btn {
  --bs-btn-font-family: var(--font-family-body);
  --bs-btn-font-size: var(--font-size-button-md);
  --bs-btn-font-weight: var(--font-weight-semibold);
  --bs-btn-line-height: var(--line-height-button-md);
  --bs-btn-padding-x: var(--space-4);
  --bs-btn-padding-y: 0.6875rem; /* alto total 44 px: (44 - 20 - 2) / 2 */
  --bs-btn-border-radius: var(--radius-md);
}

.btn-sm {
  --bs-btn-font-size: var(--font-size-button-sm);
  --bs-btn-line-height: var(--line-height-button-sm);
  --bs-btn-padding-y: 0.5625rem; /* alto total 36 px */
}

.btn-primary {
  --bs-btn-bg: var(--color-action-primary);
  --bs-btn-border-color: var(--color-action-primary);
  --bs-btn-hover-bg: var(--color-action-primary-hover);
  --bs-btn-hover-border-color: var(--color-action-primary-hover);
  --bs-btn-active-bg: var(--color-action-primary-pressed);
  --bs-btn-active-border-color: var(--color-action-primary-pressed);
  --bs-btn-disabled-bg: var(--color-action-disabled);
  --bs-btn-disabled-border-color: var(--color-action-disabled);
  --bs-btn-disabled-color: var(--color-text-disabled);
  --bs-btn-disabled-opacity: 1;
}

.btn-danger {
  --bs-btn-bg: var(--color-action-destructive);
  --bs-btn-border-color: var(--color-action-destructive);
  --bs-btn-hover-bg: var(--color-action-destructive-hover);
  --bs-btn-hover-border-color: var(--color-action-destructive-hover);
}

/* Bootstrap aplica outline: 0 en .btn:focus-visible; el DS exige borde de foco visible. */
.btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--focus-ring-halo-color);
}

/* .form-control:focus no expone variables en 5.3: se sobrescribe la propiedad en la capa components. */
.form-control,
.form-select {
  border-color: var(--color-border-strong);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 4px var(--focus-ring-halo-color);
}

/* El DS muestra el icono junto al mensaje, no dentro del campo (BS-17). */
.form-control.is-invalid {
  padding-inline-end: var(--space-3); /* devuelve el padding que Bootstrap reserva para su icono */
  background-image: none;
}

.table {
  --bs-table-hover-bg: var(--color-bg-subtle);
  --bs-table-border-color: var(--color-border-subtle);
}

.pagination {
  --bs-pagination-color: var(--color-text-link);
  --bs-pagination-active-bg: var(--color-action-primary);
  --bs-pagination-active-border-color: var(--color-action-primary);
}
```

Incorrecto:

```css
body .container .btn.btn-primary { background: #006aea !important; }  /* especificidad + !important */
.btn-primary { background-color: blue; }                               /* ignora las variables; rompe hover/active */
```

```bash
# Editar el archivo de Bootstrap
sed -i 's/#0d6efd/#006aea/g' node_modules/bootstrap/dist/css/bootstrap.min.css
```

### 6.3 Variante del DS sobre un componente Bootstrap

```html
<span class="badge rounded-pill status-badge status-badge--in-production">
  <svg class="status-badge__icon" aria-hidden="true" focusable="false" width="14" height="14">…</svg>
  En producción
</span>
```

```css
.status-badge {
  --bs-badge-font-size: var(--font-size-body-sm);
  --bs-badge-font-weight: var(--font-weight-medium);
  --bs-badge-padding-x: var(--space-2);
  --bs-badge-padding-y: var(--space-1);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.status-badge--in-production {
  --bs-badge-color: var(--color-status-production-fg);
  background-color: var(--color-status-production-bg);
}
```

### 6.4 Modal de confirmación destructiva (C-07, R-09)

```html
<button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirm-deactivate-course">
  Cambiar a Inactivo
</button>

<div class="modal fade" id="confirm-deactivate-course" tabindex="-1" aria-labelledby="confirm-deactivate-course-title" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title" id="confirm-deactivate-course-title">¿Cambiar SOFT-101 a Inactivo?</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <p>El curso dejará de aparecer en el listado por defecto. No se elimina: conserva todo su historial.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-danger" data-action="confirm-deactivate">Cambiar a Inactivo</button>
      </div>
    </div>
  </div>
</div>
```

### 6.5 Toast de confirmación de guardado

```html
<div class="toast-container position-fixed top-0 end-0 p-3">
  <div class="toast" role="status" aria-live="polite" aria-atomic="true" data-bs-delay="6000">
    <div class="toast-body">Borrador guardado.</div>
  </div>
</div>
```

El componente Toast de Bootstrap pausa el cierre automático mientras el puntero o el foco están sobre él, como exige el handoff.

### 6.6 Navegación lateral responsive

```html
<nav class="app-sidebar offcanvas-lg offcanvas-start" id="app-sidebar" tabindex="-1" aria-label="Principal">
  <div class="offcanvas-header">
    <button type="button" class="btn-close app-sidebar__close" data-bs-dismiss="offcanvas" data-bs-target="#app-sidebar" aria-label="Cerrar menú"></button>
  </div>
  <div class="offcanvas-body">…</div>
</nav>
```

Sobre el fondo azul, `.app-sidebar__close { filter: var(--bs-btn-close-white-filter); }` aclara la "X" (la clase `.btn-close-white` está obsoleta desde 5.3 y `data-bs-theme` no se usa, BS-11). `.offcanvas-lg` se comporta como panel deslizable por debajo de 992 px y como contenido estático desde `lg`; el rail de tablet y la barra inferior móvil son layout propio ([15](15-RESPONSIVE-DESIGN.md)).

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Mapeo de componentes (handoff 09, "Mapeo a Bootstrap 5")

| Componente Figma | Bootstrap | CSS propio | Notas |
|---|---|---|---|
| Button Primary / Secondary / Tertiary / Destructive | `.btn-primary` / `.btn-outline-primary` / `.btn-link` / `.btn-danger` | Variables en `bootstrap-components.css` | Hover `#0055BD`; foco del DS |
| Input / Textarea / Select | `.form-control` / `.form-select` + `.is-invalid` + `.invalid-feedback` + `.form-text` | `char-counter` | Contador con `aria-describedby` ([04](04-HTML.md)) |
| Checkbox / Radio | `.form-check`, `.form-switch` | — | Grupos con `fieldset`/`legend` |
| Alert / Toast / Modal | `.alert` / `.toast` / `.modal` | Variantes por tipo de feedback | Comportamiento en [14](14-ACCESSIBILITY.md) |
| Table / Pagination | `.table .table-hover` / `.pagination` | `table-filters`; tarjetas en móvil | 10 filas por página |
| Badge / Status / Tag | `.badge .rounded-pill` | `status-badge--*`, `tag` | Tokens `status/*` |
| Tabs / Breadcrumbs / Progress | `.nav-tabs` / `.breadcrumb` / `.progress` | — | `aria-current` ([04](04-HTML.md)) |
| Sidebar / Rail / Bottom nav | `.offcanvas-lg` | `app-sidebar`, `app-rail`, `app-bottom-nav` | Rail en `md`, offcanvas por debajo de `lg` |
| Menú de usuario / idioma | `.dropdown` | `language-switch` | N-06 |
| Skeleton / Spinner | `.placeholder-glow` / `.spinner-border` | — | `aria-busy="true"` en el contenedor |
| Stepper, KPI, Timeline, Panel de Gemini, Estado vacío | — | `course-stepper`, `kpi-card`, `status-timeline`, `ai-suggestion`, `empty-state` | Sin equivalente en Bootstrap |

### 7.2 Convivencia con el CSS propio

| Caso | Qué se hace |
|---|---|
| Componente Bootstrap sin cambios visuales | Solo clases de Bootstrap. |
| Componente Bootstrap con estilo del DS | Clases de Bootstrap + variables en `bootstrap-components.css`. |
| Variante del DS sobre componente Bootstrap | Clases de Bootstrap + bloque BEM que asigna variables (§6.3). |
| Componente sin equivalente | Bloque BEM propio en `components/`. |
| Espaciado y alineación | Utilidades de Bootstrap si coinciden con la escala; si no, tokens en el bloque. |

## 8. Errores frecuentes

- Enlazar `bootstrap.min.css` con `<link>` además de importarlo en `main.css`.
- Esperar que `--bs-primary` cambie el color de `.btn-primary`.
- Usar `!important` o selectores largos para ganar a Bootstrap en vez de la capa correcta.
- Cargar `bootstrap.min.js` (sin Popper) y romper dropdowns.
- Cargar el bundle con `type="module"` o después del módulo de la página.
- Usar `text-white bg-primary` en un componente en vez de tokens.
- Mantener el icono de validación de Bootstrap dentro del campo con el rojo por defecto.
- Crear clases propias como `.btn-icon` o `.form-counter` que invaden el espacio de nombres de Bootstrap.
- Inicializar a mano componentes que funcionan con `data-bs-*`.

## 9. Checklist

- [ ] Bootstrap importado solo en `main.css` con `layer(vendor)`.
- [ ] `bootstrap.bundle.min.js` con `defer` antes del módulo de la página.
- [ ] Ningún archivo de Bootstrap modificado; versión exacta fijada.
- [ ] Personalización global solo en `bootstrap-variables.css`; por componente solo en `bootstrap-components.css`.
- [ ] Componentes con equivalente en Bootstrap no recreados en BEM.
- [ ] Clases propias sin prefijos de Bootstrap.
- [ ] Interacciones por `data-bs-*`; API JS solo encapsulada en `js/core/`.
- [ ] Foco visible del DS en botones y campos (Bootstrap lo quita o lo cambia).
- [ ] Sin utilidades de color en componentes.
- [ ] CSP con `img-src 'self' data:`.

## 10. Referencias

- Bootstrap 5.3: https://getbootstrap.com/docs/5.3/
- CSS variables de Bootstrap: https://getbootstrap.com/docs/5.3/customize/css-variables/
- Introducción y JavaScript bundle: https://getbootstrap.com/docs/5.3/getting-started/javascript/
- Botones (variables `--bs-btn-*`): https://getbootstrap.com/docs/5.3/components/buttons/#variables
- Validación de formularios: https://getbootstrap.com/docs/5.3/forms/validation/
- Offcanvas responsive: https://getbootstrap.com/docs/5.3/components/offcanvas/#responsive
- Utilidades de espaciado: https://getbootstrap.com/docs/5.3/utilities/spacing/
- MDN `@layer`: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
