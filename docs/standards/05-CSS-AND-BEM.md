# 05 · CSS y BEM

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se organiza y escribe el CSS propio de `frontend/css/`: capas de cascada, carpetas, nomenclatura BEM, selectores y especificidad, unidades, reset, media queries y prohibiciones (estilos inline, `!important`, IDs).

Fuera de alcance (se enlazan): valores de tokens y componentes del Design System en [06](06-DESIGN-SYSTEM.md); personalización de Bootstrap en [07](07-BOOTSTRAP.md); valores de breakpoints y layouts por tamaño en [15](15-RESPONSIVE-DESIGN.md); foco, contraste y movimiento reducido en [14](14-ACCESSIBILITY.md).

## 2. Estándar adoptado

| Referencia | Uso | Estado |
|---|---|---|
| CSS Cascading and Inheritance Level 5 (`@layer`) | Orden de precedencia entre Bootstrap y CSS propio | **Adoptado** |
| CSS Custom Properties | Tokens del Design System y personalización de Bootstrap | **Adoptado** |
| BEM (Block, Element, Modifier) | Nomenclatura de componentes propios, en inglés y kebab-case | **Adoptado** |
| Mobile-first con `min-width` | Media queries | **Adoptado** |
| Bootstrap 5.3 (Reboot como reset) | Base de estilos de terceros, sin modificar | **Confirmado (ERS)** — restricción de la Iteración 2; [07](07-BOOTSTRAP.md) |
| CSS sin preprocesador (sin Sass) | Sin paso de compilación | **Adoptado** — [ADR-0003](../adr/0003-frontend-mpa-es-modules-bootstrap.md) |

## 3. Justificación

- **Cascade layers** resuelven el problema clásico de Bootstrap: para sobrescribir `.form-control:focus` o `.btn:focus-visible` hoy hay que igualar o superar su especificidad. Con `@layer vendor, …, components` cualquier regla de una capa posterior gana a Bootstrap sin importar especificidad, lo que permite mantener selectores de una sola clase.
- **BEM** hace explícita la relación entre piezas de un componente, evita colisiones con las clases de Bootstrap (que no usan `__` ni `--`) y mantiene la especificidad plana en (0,1,0).
- **Custom properties** permiten consumir los tokens del Design System y personalizar Bootstrap 5.3 en tiempo de ejecución sin Sass, coherente con la decisión de no tener paso de build.
- **Mobile-first** coincide con el modelo de Bootstrap y con la exigencia de 360 px sin scroll horizontal (RNF-032).
- El código actual demuestra el costo de no tener reglas: `reset.css` aplica `display: block` a todo (deuda D1) y los tokens mezclan categorías (deuda D3).

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| CSS-01 | `frontend/css/main.css` DEBE ser el único CSS enlazado por las páginas. Declara primero el orden de capas y luego importa cada archivo en su capa (ver §6.1). |
| CSS-02 | El orden de capas DEBE ser exactamente `@layer vendor, tokens, base, layout, components, utilities;`. Bootstrap va en `vendor`; nunca se escriben reglas propias fuera de una capa. |
| CSS-03 | Cada archivo DEBE pertenecer a una sola carpeta y capa: `tokens/` (solo custom properties y `@font-face`), `base/` (elementos HTML sin clase: `body`, `h1`–`h6`, `a`, `:focus-visible`), `layout/` (estructura de página: shell, sidebar, topbar, regiones), `components/` (un archivo por bloque BEM), `utilities/` (clases de propósito único que Bootstrap no ofrece). |
| CSS-04 | NO DEBE existir un reset propio: Bootstrap Reboot es el reset. `frontend/css/base/reset.css` (deuda D1: `* { display: block }`) se elimina al integrar Bootstrap. |
| CSS-05 | Los componentes propios DEBEN nombrarse con BEM en inglés y kebab-case: `.block`, `.block__element`, `.block--modifier`, `.block__element--modifier`. Un modificador nunca va solo: siempre acompaña a su bloque o elemento (`class="char-counter char-counter--exceeded"`). |
| CSS-06 | NO DEBE haber elementos de elementos (`.card__header__title`). Si un elemento necesita hijos con nombre propio, se aplana (`.card__title`) o se crea un bloque nuevo. Deuda actual: `.container__logo__cenfo`. |
| CSS-07 | Los selectores DEBEN tener especificidad máxima (0,2,0). Prohibidos: IDs en selectores, selectores de etiqueta calificados (`div.card`, `ul.menu`), cadenas descendientes de más de 3 niveles y `!important` fuera de `utilities/`. |
| CSS-08 | Los valores de color, espaciado, radio, sombra, tipografía y duración DEBEN venir de tokens (`var(--color-text-secondary)`, `var(--space-4)`). Valores literales solo para `0`, `1px` de borde, `100%` y cálculos con tokens. |
| CSS-09 | NO DEBEN modificarse las clases de Bootstrap con selectores propios que cambien su significado (`.btn { … }` global); la personalización se hace con custom properties `--bs-*` según [07](07-BOOTSTRAP.md). |
| CSS-10 | Prohibidos los estilos inline en HTML (`style="…"`) y la asignación de propiedades visuales desde JavaScript (`el.style.color = …`). Única excepción: valores calculados en tiempo de ejecución expuestos como custom property (`el.style.setProperty('--progress', '75%')`), con comentario que lo justifique. Los estados visuales se cambian con clases o atributos (`.is-invalid`, `aria-expanded`). Las plantillas de correo del servidor quedan fuera de esta regla ([06 §7.1](06-DESIGN-SYSTEM.md#71-inventario-de-componentes-e-implementación)). |
| CSS-11 | Las media queries DEBEN ser mobile-first (`@media (min-width: …)`) con los breakpoints de Bootstrap definidos en [15](15-RESPONSIVE-DESIGN.md). Prohibido `max-width` salvo para rangos acotados justificados. |
| CSS-12 | El foco visible NO DEBE eliminarse (`outline: none` sin sustituto). El anillo de foco del Design System se define una vez en `base/` ([14](14-ACCESSIBILITY.md)). |
| CSS-13 | Toda animación o transición DEBE desactivarse o reducirse con `@media (prefers-reduced-motion: reduce)`. |
| CSS-14 | Los nombres de archivo DEBEN coincidir con el bloque que contienen: `components/char-counter.css` contiene solo `.char-counter*`. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| CSS-15 | Tipografía y espaciado DEBERÍAN expresarse en `rem` (vía tokens); bordes y sombras en `px`; anchos de lectura en `ch` (`max-inline-size: 70ch`); layouts con `%`, `fr`, `minmax()`; alturas de viewport con `dvh` y respaldo en `vh`. No se cambia el `font-size` de `html` (respeta el zoom del usuario). |
| CSS-16 | Los estados DEBERÍAN reflejarse con atributos ARIA cuando existan (`[aria-expanded="true"]`, `[aria-current="page"]`, `[aria-invalid="true"]`) y con clases `is-*` solo cuando no haya atributo (`.is-loading`). Las clases `is-*` nunca se usan solas: van combinadas con un bloque (`.course-form.is-saving`). |
| CSS-17 | El anidamiento CSS nativo DEBERÍA limitarse a pseudo-clases, estados y media queries del mismo selector (`&:hover`, `&[aria-current="page"]`, `@media`). No se anidan elementos BEM (`&__title`) porque CSS nativo no concatena nombres como Sass. |
| CSS-18 | Las propiedades lógicas DEBERÍAN preferirse (`margin-block`, `padding-inline`, `inset-inline-start`) para consistencia, aunque ambos idiomas sean LTR. |
| CSS-19 | Las utilidades de Bootstrap (`d-flex`, `gap-3`, `mb-3`, `visually-hidden`) DEBERÍAN usarse en HTML para layout y espaciado cuando el valor coincide con la escala; no se reimplementan en `utilities/` ([07](07-BOOTSTRAP.md)). |
| CSS-20 | Los selectores DEBERÍAN escribirse en orden: custom properties locales, posición/display, modelo de caja, tipografía, color/fondo, borde, efectos, transiciones. Prettier formatea, pero no ordena propiedades. |
| CSS-21 | Un componente DEBERÍA exponer sus variaciones mediante custom properties locales (`--kpi-card-accent`) y modificadores, no mediante selectores de contexto (`.sidebar .kpi-card`). |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| CSS-22 | PUEDE usarse `:where()` para bajar a (0,0,0) la especificidad de selectores base o de utilidades. |
| CSS-23 | PUEDE usarse `:has()` para estados de contenedor (`.form-field:has(.is-invalid)`), considerando que los navegadores objetivo (RNF-041 a RNF-044) lo soportan en sus dos últimas versiones. |
| CSS-24 | PUEDE usarse `clamp()` para tamaños fluidos, siempre que los extremos sean tokens del Design System. |

## 5. Nomenclatura

### 5.1 Carpetas y archivos

```
frontend/css/
├── main.css                      # orden de capas + @import (único CSS enlazado)
├── tokens/
│   ├── primitives.css            # brand/*, school/*
│   ├── semantic.css              # bg/*, text/*, border/*, action/*, feedback/*, status/*
│   ├── typography.css            # @font-face, familias, escala tipográfica
│   ├── spacing.css               # space/*, radius/*
│   ├── elevation.css             # sombras, foco, duraciones
│   └── bootstrap-variables.css   # mapeo de tokens a --bs-* en :root (07)
├── base/
│   └── base.css                  # body, encabezados, enlaces, :focus-visible, reduced motion
├── layout/
│   ├── app-shell.css             # rejilla sidebar/rail/contenido
│   ├── app-sidebar.css
│   ├── app-topbar.css
│   └── page-header.css
├── components/
│   ├── bootstrap-components.css  # --bs-* por componente y overrides de foco (07)
│   ├── status-badge.css
│   ├── char-counter.css
│   ├── course-stepper.css
│   ├── kpi-card.css
│   └── …                         # un archivo por bloque BEM
└── utilities/
    └── utilities.css             # solo lo que Bootstrap no ofrece
```

Estado: **Implementado** solo `main.css`, `base/reset.css` y `tokens/{colors,spacing,typography}.css` (Iteración 1, a migrar según [06](06-DESIGN-SYSTEM.md)). El resto es **Adoptado** como estructura objetivo.

### 5.2 BEM

| Pieza | Patrón | Ejemplo |
|---|---|---|
| Bloque | sustantivo en inglés, kebab-case | `course-stepper` |
| Elemento | `bloque__elemento` | `course-stepper__step`, `course-stepper__label` |
| Modificador | `bloque--modificador` o `bloque__elemento--modificador` | `course-stepper__step--completed`, `status-badge--in-production` |
| Estado | atributo ARIA o `is-*` combinado | `.course-stepper__step[aria-current="step"]`, `.course-form.is-saving` |
| Gancho JS | atributo `data-*`, nunca clase | `data-action="save-draft"` |

Los modificadores de estado de curso usan el valor del [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) en kebab-case: `--draft`, `--in-development`, `--approved`, `--in-production`, `--inactive`.

## 6. Ejemplos

### 6.1 `main.css`

Correcto:

```css
/* Orden de capas: lo posterior gana, sin importar especificidad. */
@layer vendor, tokens, base, layout, components, utilities;

@import url('/vendor/bootstrap/css/bootstrap.min.css') layer(vendor);

@import url('/css/tokens/primitives.css') layer(tokens);
@import url('/css/tokens/semantic.css') layer(tokens);
@import url('/css/tokens/typography.css') layer(tokens);
@import url('/css/tokens/spacing.css') layer(tokens);
@import url('/css/tokens/elevation.css') layer(tokens);
@import url('/css/tokens/bootstrap-variables.css') layer(tokens);

@import url('/css/base/base.css') layer(base);

@import url('/css/layout/app-shell.css') layer(layout);

@import url('/css/components/bootstrap-components.css') layer(components);
@import url('/css/components/status-badge.css') layer(components);
@import url('/css/components/char-counter.css') layer(components);

@import url('/css/utilities/utilities.css') layer(utilities);
```

Incorrecto (estado actual, deudas D1 y D3):

```css
/* main.css: sin capas; Bootstrap cargado aparte ganaría o perdería según especificidad. */
@import url('/css/base/reset.css');

/* reset.css: rompe elementos inline (span, a, img, input) y hace visibles head, title y script. */
* {
  padding: 0;
  margin: 0;
  display: block;
}
```

### 6.2 Componente BEM

Correcto (`components/char-counter.css`):

```css
.char-counter {
  margin-block-start: var(--space-1);
  font-size: var(--font-size-body-sm);
  line-height: var(--line-height-body-sm);
  color: var(--color-text-secondary);
  text-align: end;
}

.char-counter--exceeded {
  color: var(--color-feedback-error);
  font-weight: var(--font-weight-semibold);
}
```

Incorrecto:

```css
#power-campus-name + div span.counter.red {   /* ID, etiqueta calificada, 4 niveles */
  color: #ff0000 !important;                   /* literal fuera de tokens, !important */
}
.contador--rojo { color: red; }                /* español, modificador sin bloque */
```

### 6.3 Estados con ARIA y anidamiento permitido

```css
.app-sidebar__link {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-on-brand-muted);
  border-radius: var(--radius-md);

  &:hover {
    background-color: rgb(255 255 255 / 0.08);
  }

  &[aria-current='page'] {
    color: var(--color-text-inverse);
    background-color: rgb(255 255 255 / 0.12);
  }
}
```

### 6.4 Media query mobile-first

Correcto:

```css
.course-list__card {
  display: block;               /* móvil: tarjeta apilada */
}

@media (min-width: 768px) {
  .course-list__card {
    display: none;              /* tablet en adelante: se usa la tabla */
  }
}
```

Incorrecto:

```css
@media (max-width: 767px) { … }   /* desktop-first */
@media (min-width: 800px) { … }   /* breakpoint fuera de la escala */
```

### 6.5 Valor dinámico desde JavaScript

Correcto:

```css
.import-progress__bar {
  inline-size: var(--progress, 0%);
}
```

```js
// Valor calculado en runtime: se expone como custom property (CSS-10).
bar.style.setProperty('--progress', `${percent}%`);
```

Incorrecto:

```js
bar.style.width = percent + '%';
bar.style.backgroundColor = 'green';
```

### 6.6 Movimiento reducido

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Esta regla vive en `base/base.css` y es la única excepción documentada de `!important` fuera de `utilities/` (CSS-07): debe ganar a cualquier transición de componente.

## 7. Aplicación en el sistema CENFOTEC

| Caso | Aplicación |
|---|---|
| Estados del curso | Bloque `status-badge` con modificadores `--draft`, `--in-development`, `--approved`, `--in-production`, `--inactive`, usando los tokens `status/*` ([06](06-DESIGN-SYSTEM.md)). Siempre con texto. |
| Contadores RF-022 | Bloque `char-counter` + modificador `--exceeded` (rojo e icono) cuando se supera 40, 250 o 155 caracteres. |
| Formulario de curso | Bloques `course-stepper` (8 secciones, estados completado/actual/pendiente/con error) y `form-action-bar` (barra fija Guardar/Enviar); la barra reserva espacio con `scroll-padding-block-end` para no tapar el foco ([14](14-ACCESSIBILITY.md)). |
| Marcadores de escuela | Bloque `school-marker` con custom property local `--school-marker-color: var(--color-school-software-engineering)`; los colores de escuela nunca son fondo principal (handoff D-04). |
| KPI de Inicio | Bloque `kpi-card` con modificador `--soft` (neumorfismo) solo en Inicio (handoff D-05); reportes usan `kpi-card` plano. |
| Panel de Gemini | Bloque `ai-suggestion` con elementos `__header`, `__body`, `__actions` y modificador `--error`. |
| Login actual | Las clases `container__logo__cenfo`, `container__form`, `form-field` y `boton boton--secundario boton--bloque` (deuda D2) se reemplazan por componentes Bootstrap y bloques BEM en inglés al reconstruir A-01. |

## 8. Errores frecuentes

- Escribir CSS propio fuera de una capa: queda por encima de todas las capas y rompe el orden.
- Cargar Bootstrap con `<link>` aparte en vez de importarlo en `layer(vendor)`: Bootstrap sin capa ganaría a todo el CSS propio.
- Subir especificidad (`.page .card .btn`) para "ganarle" a Bootstrap en lugar de usar la capa o la custom property correcta.
- Usar `!important` para arreglar un conflicto de orden.
- Nombrar por apariencia (`.blue-box`, `.big-text`) en vez de por función (`.kpi-card`, `.page-header__title`).
- Elementos de elementos y modificadores sueltos.
- Duplicar utilidades que Bootstrap ya trae (`.mt-16`, `.flex`).
- Valores hexadecimales o `px` sueltos en componentes.
- Quitar `outline` en `:focus` "porque se ve feo".

## 9. Checklist

- [ ] Ningún archivo CSS nuevo fuera de `tokens/`, `base/`, `layout/`, `components/` o `utilities/`.
- [ ] Todo archivo nuevo importado en `main.css` en su capa.
- [ ] Clases nuevas en BEM, inglés, kebab-case; sin elemento de elemento; modificadores acompañados de su bloque.
- [ ] Sin IDs en selectores, sin etiquetas calificadas, especificidad ≤ (0,2,0).
- [ ] Sin `!important` fuera de `utilities/` y de la regla de movimiento reducido.
- [ ] Sin valores literales de color, espaciado, radio, sombra o tipografía: todo con tokens.
- [ ] Sin `style=""` ni `el.style.<propiedad>` (salvo custom properties justificadas).
- [ ] Media queries con `min-width` y breakpoints de [15](15-RESPONSIVE-DESIGN.md).
- [ ] Foco visible conservado; transiciones con alternativa `prefers-reduced-motion`.
- [ ] Bootstrap personalizado solo con `--bs-*` ([07](07-BOOTSTRAP.md)).

## 10. Referencias

- MDN `@layer`: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- MDN `@import` con `layer()`: https://developer.mozilla.org/en-US/docs/Web/CSS/@import
- MDN CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- MDN CSS nesting: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting
- BEM: https://getbem.com/
- Bootstrap 5.3 Reboot: https://getbootstrap.com/docs/5.3/content/reboot/
- Bootstrap 5.3 CSS variables: https://getbootstrap.com/docs/5.3/customize/css-variables/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
