# 06 · Design System

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se traduce el Design System del proyecto (Figma, sección 04, y handoff, sección 09) a código: tokens de color, tipografía, espaciado, radios, elevación y movimiento; inventario de componentes y su implementación; estados; reglas de marca; y el proceso para mantener la fidelidad con Figma.

Fuera de alcance (se enlazan): cómo se escribe el CSS y BEM en [05](05-CSS-AND-BEM.md); cómo se personaliza Bootstrap con estos tokens en [07](07-BOOTSTRAP.md); contraste, foco y teclado en [14](14-ACCESSIBILITY.md); breakpoints y grid en [15](15-RESPONSIVE-DESIGN.md).

## 2. Estándar adoptado

| Referencia | Uso | Estado |
|---|---|---|
| Design System del archivo Figma "SGC CENFOTEC — Sistema de Gestión de Cursos (UX/UI)", sección 04, y su exportación en `wireframes/04-design-system/` | Fuente de verdad visual de tokens y componentes | **Adoptado** |
| Handoff `wireframes/09-handoff/` (especificaciones, comportamientos, decisiones D-01 a D-13, mapeo a Bootstrap) | Comportamiento e implementación esperada | **Adoptado** |
| Libro de Marca CENFOTEC 2022 (primarios y secundarios oficiales) | Identidad visual institucional | **Confirmado (ERS)** — RNF-049 |
| Modelo de tokens en dos niveles (Primitives → Semantic), alineado con el Design Tokens Community Group | Organización de custom properties | **Adoptado** |
| CSS Custom Properties como formato de entrega de tokens | Sin Sass ni herramienta de transformación | **Adoptado** — [ADR-0003](../adr/0003-frontend-mpa-es-modules-bootstrap.md) |

## 3. Justificación

- Los componentes consumen **tokens semánticos** (`--color-text-secondary`), no colores de marca ni hexadecimales. Así un cambio de paleta se hace en un archivo y se garantiza que solo se usan combinaciones con contraste verificado (tabla de contraste del DS, sección 04-12).
- Los nombres de custom properties se derivan 1:1 de las rutas de variables de Figma; un diseñador y un desarrollador hablan del mismo token sin tabla de traducción.
- La ERS exige identidad institucional (RNF-049), contraste AA (RNF-034) y consistencia de navegación y acciones (RNF-031); un sistema de tokens y componentes únicos es la forma verificable de cumplirlo.
- Los tokens implementados hoy (Iteración 1, nombres en español y paleta anterior) no coinciden con el DS aprobado (deuda D3); mantener dos paletas generaría inconsistencias visibles.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| DS-01 | Los componentes, layouts y utilidades DEBEN consumir solo tokens **semánticos** (`--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-action-*`, `--color-feedback-*`, `--color-status-*`) y tokens de escala (`--space-*`, `--radius-*`, `--font-*`, `--shadow-*`, `--duration-*`). Los primitivos (`--color-brand-*`, `--color-school-*`) solo se usan dentro de `tokens/semantic.css`, en marcadores de escuela y en el logotipo. |
| DS-02 | El nombre de cada custom property DEBE derivarse de la ruta de la variable Figma: prefijo de categoría + ruta con `/` reemplazado por `-` (`bg/canvas` → `--color-bg-canvas`, `space/4` → `--space-4`, `radius/md` → `--radius-md`, `Heading/H1` → `--font-size-heading-h1`). |
| DS-03 | NO DEBEN introducirse colores, tamaños o sombras fuera de los tokens. Si una pantalla de Figma usa un valor que no es token, se usa el token más cercano y se reporta en el PR para corregir Figma o crear el token. |
| DS-04 | Un token nuevo o modificado DEBE agregarse primero a Figma (o documentarse como propuesta), luego a `tokens/*.css` y a las tablas de este documento en el mismo PR (`feat(ui): …`). |
| DS-05 | Los colores `#9CC8FF` (brand/blue-light) y `#D2D2D2` (brand/gray-light) NO DEBEN usarse para texto; `#7C7B75` (brand/gray) solo para texto grande (≥ 24 px, o ≥ 18,66 px en negrita) o iconos (tabla de contraste del DS). |
| DS-06 | Los colores secundarios por escuela DEBEN usarse solo como marcador o etiqueta puntual junto al nombre de la escuela, nunca como fondo principal ni en mayor proporción que los primarios (handoff D-04, Libro de Marca). |
| DS-07 | Los estados del curso DEBEN representarse con el componente Status (badge) usando sus tokens `status/*` y siempre con texto: `draft` → status/draft, `in_development` → status/review, `approved` → status/approved, `in_production` → status/production, `inactive` → status/inactive. |
| DS-08 | Las fuentes DEBEN ser Barlow (títulos) y Figtree (cuerpo), sustitutos documentados de DIN Alternate Bold y Circular Std (handoff D-12), con pila de respaldo del sistema. Solo se cargan los pesos usados (Barlow 600 y 700; Figtree 400, 500 y 600) en formato `woff2` con `font-display: swap`. |
| DS-09 | Cada pantalla DEBE implementarse a partir de su versión de alta fidelidad (secciones 05 desktop, 06 tablet, 07 móvil), no del wireframe en grises (sección 03). El PR DEBE citar los IDs de pantalla implementados (p. ej. `C-01`, `MB-02`) para la trazabilidad de [22](22-REQUIREMENTS-TRACEABILITY.md). |
| DS-10 | Cada componente del inventario (§7.1) DEBE implementarse una sola vez (Bootstrap con tokens o bloque BEM) y reutilizarse; prohibido recrear variantes locales de un botón, badge o campo en una pantalla. |
| DS-11 | El neumorfismo (Neumorphic Soft/Inset) DEBE limitarse a KPI y paneles resumen de Inicio sobre `bg/canvas`; nunca en campos, tablas, errores ni navegación (handoff D-05, especificación de elevación). |
| DS-12 | El logotipo DEBE ser el oficial (`frontend/img/logo-horizontal-color.png` o `logo-horizontal-blanco.png`, o el vector exportado de Figma), sin deformar, recolorear ni añadir efectos; en la barra lateral azul se usa la versión blanca con ancho mínimo de 94 px (handoff D-03). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| DS-13 | La interfaz DEBERÍA usar Body/MD (14/20) como texto base de UI y Body/LG (16/24) para textos largos de lectura (descripciones, detalle de curso). |
| DS-14 | Cada vista DEBERÍA tener una sola acción primaria (`action/primary`); las demás acciones son secundarias, terciarias o destructivas (handoff, objetivos UX). |
| DS-15 | Los iconos DEBERÍAN ser lineales de 24 px estilo Lucide (los del DS), como SVG en línea o sprite propio, con `aria-hidden="true"` cuando acompañan texto ([04](04-HTML.md)). No se agrega una biblioteca de iconos completa para usar unos pocos. |
| DS-16 | Las propuestas UX no confirmadas por la ERS (Inicio por rol, panel de avisos, aviso "¿Salir sin guardar?", copiar datos para Power Campus) DEBERÍAN implementarse detrás de una decisión explícita ([PV-15](README.md#7-decisiones-pendientes-de-validación)) y nunca reemplazar la vista inicial que fija la ERS (RF-002 CA1). |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| DS-17 | PUEDE mantenerse una página interna `frontend/pages/design-system.html` (solo en desarrollo) que muestre tokens y componentes para revisión visual rápida. |
| DS-18 | PUEDEN reemplazarse Barlow y Figtree por las fuentes oficiales si la universidad provee licencia web, cambiando solo `--font-family-heading` y `--font-family-body`. |

## 5. Nomenclatura

| Categoría Figma | Patrón de custom property | Archivo | Ejemplo |
|---|---|---|---|
| `brand/*`, `school/*` (primitivos) | `--color-<ruta>` | `tokens/primitives.css` | `--color-brand-blue-dark`, `--color-school-cybersecurity` |
| `bg/*`, `text/*`, `border/*`, `action/*`, `feedback/*`, `status/*`, `chart/*` (semánticos) | `--color-<ruta>` | `tokens/semantic.css` | `--color-text-primary`, `--color-status-draft-bg` |
| Estilos de texto (`Display/XL`, `Heading/H1`, `Body/MD`…) | `--font-size-<estilo>`, `--line-height-<estilo>` | `tokens/typography.css` | `--font-size-body-md`, `--line-height-body-md` |
| Familias y pesos | `--font-family-heading|body`, `--font-weight-regular|medium|semibold|bold` | `tokens/typography.css` | `--font-family-heading` |
| `space/*` | `--space-<n>` | `tokens/spacing.css` | `--space-4` |
| `radius/*` | `--radius-<tamaño>` | `tokens/spacing.css` | `--radius-md` |
| Estilos de efecto (Elevation, Neumorphic, Focus/Ring) | `--shadow-<n>`, `--shadow-neumorphic-soft|inset`, `--focus-ring-*` | `tokens/elevation.css` | `--shadow-2` |
| Movimiento | `--duration-fast|base`, `--easing-out` | `tokens/elevation.css` | `--duration-base` |

## 6. Ejemplos

### 6.1 Tokens de color

Primitivos oficiales (Libro de Marca) — **Adoptado**:

| Figma | Custom property | Valor | Uso |
|---|---|---|---|
| brand/blue-dark | `--color-brand-blue-dark` | `#164A98` | Base de `bg/brand`, `text/brand`, `border/focus` |
| brand/blue | `--color-brand-blue` | `#006AEA` | Base de `action/primary`, `text/link` |
| brand/blue-light | `--color-brand-blue-light` | `#9CC8FF` | Halo de foco y decoración; nunca texto |
| brand/gray-light | `--color-brand-gray-light` | `#D2D2D2` | Divisores decorativos; nunca texto |
| brand/gray | `--color-brand-gray` | `#7C7B75` | Texto grande o iconos |
| brand/yellow | `--color-brand-yellow` | `#FFF200` | Acento puntual |
| brand/amber | `--color-brand-amber` | `#FFC63E` | Acento puntual; base de `feedback/warning-accent` |

Secundarios por escuela (solo marcadores):

| Figma | Custom property | Valor |
|---|---|---|
| school/information-systems | `--color-school-information-systems` | `#2B93D1` |
| school/cybersecurity | `--color-school-cybersecurity` | `#F05323` |
| school/intelligent-systems | `--color-school-intelligent-systems` | `#00734A` |
| school/information-technology | `--color-school-information-technology` | `#4AA147` |
| school/computing-fundamentals | `--color-school-computing-fundamentals` | `#D2232A` |
| school/student-affairs | `--color-school-student-affairs` | `#00928D` |
| school/software-engineering | `--color-school-software-engineering` | `#C81F66` |
| school/business-administration | `--color-school-business-administration` | `#C7AC19` |
| school/alumni | `--color-school-alumni` | `#712C86` |

Semánticos (consumo en UI):

| Figma | Custom property | Valor | Uso |
|---|---|---|---|
| bg/canvas | `--color-bg-canvas` | `#F4F6FA` | Fondo de la aplicación |
| bg/surface | `--color-bg-surface` | `#FFFFFF` | Tarjetas, tablas, modales, campos |
| bg/subtle | `--color-bg-subtle` | `#F1F4F9` | Filas alternas, secciones secundarias |
| bg/muted | `--color-bg-muted` | `#E6EAF0` | Encabezados de tabla, campos deshabilitados |
| bg/brand | `--color-bg-brand` | `#164A98` | Barra lateral, barra superior móvil |
| bg/brand-subtle | `--color-bg-brand-subtle` | `#EEF5FF` | Selección, aviso no leído |
| bg/brand-soft | `--color-bg-brand-soft` | `#DCEBFF` | Resaltado suave de marca |
| bg/overlay | `--color-bg-overlay` | `#101828` | Fondo de modal (con opacidad) |
| text/primary | `--color-text-primary` | `#101828` | Texto principal (17,2:1) |
| text/secondary | `--color-text-secondary` | `#5A6472` | Ayudas, metadatos (6,0:1) |
| text/disabled | `--color-text-disabled` | `#8C95A3` | Solo controles deshabilitados |
| text/inverse | `--color-text-inverse` | `#FFFFFF` | Texto sobre `bg/brand` o `action/primary` |
| text/brand | `--color-text-brand` | `#164A98` | Títulos de marca (8,5:1) |
| text/link | `--color-text-link` | `#006AEA` | Enlaces (4,9:1) |
| text/on-brand-muted | `--color-text-on-brand-muted` | `#DCEBFF` | Navegación sobre la barra lateral (7,0:1) |
| border/subtle | `--color-border-subtle` | `#E6EAF0` | Divisores |
| border/default | `--color-border-default` | `#D5DBE3` | Bordes de tarjetas y tablas |
| border/strong | `--color-border-strong` | `#7C8597` | Borde de campos (3,7:1, WCAG 1.4.11) |
| border/focus | `--color-border-focus` | `#164A98` | Anillo de foco |
| border/brand | `--color-border-brand` | `#006AEA` | Borde de elementos seleccionados |
| action/primary | `--color-action-primary` | `#006AEA` | Botón primario |
| action/primary-hover | `--color-action-primary-hover` | `#0055BD` | Hover del primario |
| action/primary-pressed | `--color-action-primary-pressed` | `#164A98` | Activo del primario |
| action/secondary-hover | `--color-action-secondary-hover` | `#EEF5FF` | Hover del secundario |
| action/disabled | `--color-action-disabled` | `#E6EAF0` | Fondo de botón deshabilitado |
| action/destructive | `--color-action-destructive` | `#B3261E` | Eliminar, cambiar a Inactivo |
| action/destructive-hover | `--color-action-destructive-hover` | `#8F1E18` | Hover destructivo |
| feedback/success | `--color-feedback-success` | `#1E7B34` | Mensajes de éxito |
| feedback/success-bg | `--color-feedback-success-bg` | `#E7F5EC` | Fondo de éxito |
| feedback/error | `--color-feedback-error` | `#B3261E` | Errores de validación (6,5:1) |
| feedback/error-bg | `--color-feedback-error-bg` | `#FDECEA` | Fondo de error |
| feedback/warning | `--color-feedback-warning` | `#8A5A00` | Advertencias (5,6:1 sobre su fondo) |
| feedback/warning-bg | `--color-feedback-warning-bg` | `#FFF6E0` | Fondo de advertencia |
| feedback/warning-accent | `--color-feedback-warning-accent` | `#FFC63E` | Barra lateral de alerta |
| feedback/info | `--color-feedback-info` | `#164A98` | Información |
| feedback/info-bg | `--color-feedback-info-bg` | `#EEF5FF` | Fondo de información |
| status/draft-fg · bg | `--color-status-draft-fg` · `-bg` | `#344054` · `#EEF0F3` | Borrador (9,2:1) |
| status/review-fg · bg | `--color-status-review-fg` · `-bg` | `#164A98` · `#DCEBFF` | En desarrollo |
| status/approved-fg · bg | `--color-status-approved-fg` · `-bg` | `#1E7B34` · `#E7F5EC` | Aprobado (4,8:1) |
| status/production-fg · bg | `--color-status-production-fg` · `-bg` | `#FFFFFF` · `#164A98` | En producción |
| status/inactive-fg · bg | `--color-status-inactive-fg` · `-bg` | `#5A5955` · `#F2F2F0` | Inactivo (6,3:1) |
| chart/draft, review, approved, production, inactive | `--color-chart-*` | Aproximados en `tokens/semantic.css` desde P-01 y RP-01 | Leyenda y gráficos de reportes — valores exactos a extraer de Figma ([PV-22](README.md#7-decisiones-pendientes-de-validación)) |

Los ratios entre paréntesis provienen de la tabla "Contraste verificado (WCAG 2.2 AA)" del DS (04-12) y se verifican de nuevo en código según [14](14-ACCESSIBILITY.md).

### 6.2 Tipografía

| Estilo Figma | Familia y peso | Tamaño / interlínea | Tokens |
|---|---|---|---|
| Display/XL | Barlow Bold | 40/48 | `--font-size-display-xl: 2.5rem` · `--line-height-display-xl: 3rem` |
| Heading/H1 | Barlow Bold | 30/36 | `1.875rem` · `2.25rem` |
| Heading/H2 | Barlow Bold | 22/28 | `1.375rem` · `1.75rem` |
| Heading/H3 | Barlow SemiBold | 18/24 | `1.125rem` · `1.5rem` |
| Heading/H4 | Figtree SemiBold | 16/24 | `1rem` · `1.5rem` |
| Data/KPI | Barlow SemiBold | 34/40 | `2.125rem` · `2.5rem` |
| Body/LG | Figtree Regular | 16/24 | `1rem` · `1.5rem` |
| Body/MD (Regular, Medium, Strong = SemiBold) | Figtree | 14/20 | `0.875rem` · `1.25rem` |
| Body/SM (Regular, Medium) | Figtree | 12/16 | `0.75rem` · `1rem` |
| Label/Overline | Figtree SemiBold, mayúsculas | 12/16 | `0.75rem` · `1rem` |
| Button/MD | Figtree SemiBold | 15/20 | `0.9375rem` · `1.25rem` |
| Button/SM | Figtree SemiBold | 13/16 | `0.8125rem` · `1rem` |

Pesos: `--font-weight-regular: 400`, `--font-weight-medium: 500`, `--font-weight-semibold: 600`, `--font-weight-bold: 700`. Los archivos `woff2` se autoalojan en `frontend/fonts/` mientras [PV-04](README.md#7-decisiones-pendientes-de-validación) no indique otra cosa.

### 6.3 Espaciado, radios, elevación y movimiento

| Figma | Custom property | Valor |
|---|---|---|
| space/0 · 0-5 · 1 · 2 · 3 · 4 | `--space-0` · `--space-0-5` · `--space-1` · `--space-2` · `--space-3` · `--space-4` | `0` · `0.125rem` · `0.25rem` · `0.5rem` · `0.75rem` · `1rem` |
| space/5 · 6 · 8 · 10 · 12 · 16 · 20 | `--space-5` · `--space-6` · `--space-8` · `--space-10` · `--space-12` · `--space-16` · `--space-20` | `1.25rem` · `1.5rem` · `2rem` · `2.5rem` · `3rem` · `4rem` · `5rem` |
| radius/xs · sm · md · lg · xl · full | `--radius-xs` · `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-xl` · `--radius-full` | `4px` · `6px` · `8px` (controles) · `12px` · `16px` (tarjetas) · `999px` |
| Elevation/1 Card · 2 Raised · 3 Modal | `--shadow-1` · `--shadow-2` · `--shadow-3` | Aproximadas en `tokens/elevation.css`; valores exactos a extraer de los estilos de efecto de Figma (mismo tratamiento que [PV-22](README.md#7-decisiones-pendientes-de-validación)) |
| Neumorphic/Soft · Inset | `--shadow-neumorphic-soft` · `--shadow-neumorphic-inset` | Aproximadas en `tokens/elevation.css`; pendiente extraer de Figma |
| Focus/Ring | `--focus-ring-width: 2px` · `--focus-ring-color: var(--color-border-focus)` · `--focus-ring-halo-color: var(--color-brand-blue-light)` | Borde 2 px `#164A98` + halo `#9CC8FF` |
| Movimiento | `--duration-fast: 150ms` · `--duration-base: 200ms` · `--easing-out: ease-out` | Transiciones 150–200 ms (handoff 09) |

### 6.4 `tokens/semantic.css`

Correcto:

```css
/* Tokens semánticos del DS (Figma, sección 04). Los componentes solo consumen estos. */
:root {
  --color-bg-canvas: #f4f6fa;
  --color-bg-surface: #ffffff;
  --color-bg-brand: var(--color-brand-blue-dark);

  --color-text-primary: #101828;
  --color-text-secondary: #5a6472;
  --color-text-inverse: #ffffff;
  --color-text-link: var(--color-brand-blue);

  --color-border-default: #d5dbe3;
  --color-border-strong: #7c8597;
  --color-border-focus: var(--color-brand-blue-dark);

  --color-action-primary: var(--color-brand-blue);
  --color-action-primary-hover: #0055bd;
  --color-action-destructive: #b3261e;

  --color-feedback-error: #b3261e;
  --color-feedback-error-bg: #fdecea;

  --color-status-draft-fg: #344054;
  --color-status-draft-bg: #eef0f3;
  --color-status-review-fg: var(--color-brand-blue-dark);
  --color-status-review-bg: #dcebff;
  /* … resto de la tabla §6.1 */
}
```

Uso en un componente (`components/status-badge.css`):

```css
.status-badge--draft {
  color: var(--color-status-draft-fg);
  background-color: var(--color-status-draft-bg);
}
```

Incorrecto:

```css
.status-badge--draft { color: #344054; background: #eef0f3; }   /* hexadecimales en componente */
.sidebar { background: var(--color-school-cybersecurity); }       /* color de escuela como fondo */
.help { color: var(--color-brand-blue-light); }                  /* #9CC8FF como texto: 1,7:1 */
```

### 6.5 Migración de los tokens implementados (deuda D3)

**Realizada el 14 nov 2026** en la fase visual: los archivos de la Iteración 1 se reemplazaron por los de §5 y la verificación de abajo no devuelve resultados. Se conserva la descripción como registro.

Los archivos actuales `frontend/css/tokens/colors.css`, `spacing.css` y `typography.css` (**Implementado**) contienen la paleta de la Iteración 1 con nombres en español. Se reemplazan en un único PR (`refactor(ui): migrate tokens to design system`) que crea los archivos de §5, actualiza los usos y elimina los antiguos. Verificación: `grep -rwE -- '--(color-(primario|acento|fondo|superficie|texto|borde|error|exito|foco)(-[a-z]+)*|fuente|texto-[a-z]+)' frontend/` sin resultados (`-w` evita el falso positivo de `--color-border-*`).

| Token actual | Valor actual | Token nuevo | Valor nuevo | Nota |
|---|---|---|---|---|
| `--color-primario` | `#164a98` | `--color-bg-brand` / `--color-text-brand` / `--color-action-primary-pressed` | `#164A98` | Según uso; el botón primario pasa a `--color-action-primary` `#006AEA` |
| `--color-primario-hover` | `#0f3672` | `--color-action-primary-hover` | `#0055BD` | Cambia valor |
| `--color-primario-suave` | `#eef4fc` | `--color-bg-brand-subtle` | `#EEF5FF` | Cambia valor |
| `--color-acento` | `#ffc63e` | `--color-feedback-warning-accent` (o `--color-brand-amber`) | `#FFC63E` | Igual |
| `--color-fondo` | `#f6f7f9` | `--color-bg-canvas` | `#F4F6FA` | Cambia valor |
| `--color-superficie` | `#ffffff` | `--color-bg-surface` | `#FFFFFF` | Igual |
| `--color-texto` | `#111827` | `--color-text-primary` | `#101828` | Cambia valor |
| `--color-texto-secundario` | `#4b5563` | `--color-text-secondary` | `#5A6472` | Cambia valor |
| `--color-texto-terciario` | `#6b7280` | `--color-text-secondary` | `#5A6472` | Sin equivalente; `text/disabled` es solo para deshabilitados |
| `--color-borde` | `#e5e7eb` | `--color-border-subtle` | `#E6EAF0` | Cambia valor |
| `--color-borde-fuerte` | `#d1d5db` | `--color-border-default` | `#D5DBE3` | Bordes de campos usan `--color-border-strong` |
| `--color-error` | `#b42318` | `--color-feedback-error` | `#B3261E` | Cambia valor |
| `--color-error-fondo` | `#fef3f2` | `--color-feedback-error-bg` | `#FDECEA` | Cambia valor |
| `--color-error-borde` | `#fecdca` | — | — | Se elimina; el borde de error usa `--color-feedback-error` |
| `--color-exito` | `#067647` | `--color-feedback-success` | `#1E7B34` | Cambia valor |
| `--color-exito-fondo` | `#ecfdf3` | `--color-feedback-success-bg` | `#E7F5EC` | Cambia valor |
| `--color-exito-borde` | `#abefc6` | — | — | Se elimina |
| `--color-foco` | `#006aea` | `--color-border-focus` | `#164A98` | Cambia valor: el foco del DS es azul oscuro |
| `--fuente` | Segoe UI, system-ui… | `--font-family-body` / `--font-family-heading` | Figtree / Barlow + respaldo | Cambia familia |
| `--texto-base` (en `spacing.css`) | `1rem` | `--font-size-body-lg` | `1rem` | Se mueve a `typography.css`; la base de UI es `--font-size-body-md` |
| `--texto-pequeno` (en `spacing.css`) | `0.875rem` | `--font-size-body-md` | `0.875rem` | Se mueve a `typography.css` |

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Inventario de componentes e implementación

| Componente del DS | Implementación | Pantallas de referencia |
|---|---|---|
| Button (Primary, Secondary, Tertiary, Destructive; MD 44 px, SM 36 px) | Bootstrap `.btn-primary`, `.btn-outline-primary`, `.btn-link`, `.btn-danger`; `.btn-sm` para SM ([07](07-BOOTSTRAP.md)) | Todas |
| Icon Button (40 px) | `.btn` + bloque `icon-button` | Acciones de tabla, topbar |
| Input, Textarea, Select | `.form-control`, `.form-select`, `.form-label`, `.form-text`, `.is-invalid`, `.invalid-feedback` | F-01 a F-08, U-03, K-05 |
| Checkbox, Radio, Switch | `.form-check` (`.form-switch`) en `fieldset` | F-03, F-06, U-03 |
| Contador de caracteres | Bloque `char-counter` (`--exceeded`) | F-04, MB-04 |
| Status / Badge / Tag | `.badge.rounded-pill` + bloque `status-badge--<estado>`; etiquetas con bloque `tag` | C-01, C-05, R-01 |
| Avatar | Bloque `avatar` (iniciales) | Topbar, U-01 |
| Alert | `.alert` con variantes por tipo de feedback | F-11, M-02 |
| Toast | `.toast` en `.toast-container` superior derecha, 6 s | Guardado, aprobación |
| Modal (confirmación, destructivo) | `.modal` ([14](14-ACCESSIBILITY.md)) | U-06, C-07, F-12, R-05, R-08, R-09 |
| Table, Pagination, Filtros de tabla | `.table.table-hover`, `.pagination`; bloque `table-filters` | C-01, U-01, K-02 a K-08, R-01 |
| Tabs, Breadcrumbs, Progress | `.nav-tabs`, `.breadcrumb`, `.progress` | C-05, RP-01, M-03 |
| Stepper de secciones | Bloque `course-stepper` (completado, actual, pendiente, con error) | F-01 a F-08 |
| Sidebar, Rail, Topbar, Bottom nav, Nav Item | Bloques de layout `app-sidebar` (`.offcanvas-lg`), `app-rail`, `app-topbar`, `app-bottom-nav` ([15](15-RESPONSIVE-DESIGN.md)) | Todas, MB-09 |
| Language Switch (ES/EN) | Bloque `language-switch` (dos botones con `aria-pressed`) | N-05, N-06 |
| Menú de usuario | `.dropdown` | N-06 |
| KPI (plano y Soft) | Bloque `kpi-card` (`--soft` solo en Inicio) | P-01 a P-05, RP-01 |
| Timeline de estados | Bloque `status-timeline` (`<ol>`) | C-05, R-06 |
| Panel de Gemini (cargando, propuesta, error) | Bloque `ai-suggestion` (`--loading`, `--error`) con "Generado por IA · revise antes de usar" | F-09, F-10, MB-04 |
| Avisos (propuesta UX) | Bloque `notification-list` en `.dropdown` u `.offcanvas` ([PV-15](README.md#7-decisiones-pendientes-de-validación)) | N-01, MB-08 |
| Leyenda de gráficos | Bloque `chart-legend` (tokens `chart/*`, PV-22) | RP-01 a RP-04 |
| Skeleton, Spinner | `.placeholder-glow`, `.spinner-border` + `aria-busy` | C-04 |
| Estado vacío / sin resultados | Bloque `empty-state` con acción ("Nuevo curso", "Limpiar filtros") | C-03, U-02 |
| Lista de adjuntos | Bloque `attachment-list` + `input type="file"` | F-07, R-02 |
| Correos HTML (N-03, N-04) | Plantillas del servidor ([09](09-NODEJS-BACKEND.md)); usan estilos en línea y tablas de maquetación por compatibilidad con clientes de correo: excepción documentada a [04](04-HTML.md) y [05](05-CSS-AND-BEM.md), limitada a esas plantillas | N-03, N-04 |

### 7.2 Fidelidad con Figma

1. Implementar desde la alta fidelidad (05/06/07) del ID de pantalla; consultar el wireframe (03) solo para anotaciones de rol, estados y RF.
2. Medir con las herramientas de inspección de Figma y traducir cada valor a su token; los valores sin token se reportan (DS-03).
3. Incluir en el PR capturas a 360, 768 y 1440 px junto a la referencia de Figma ([15](15-RESPONSIVE-DESIGN.md)).
4. Las diferencias intencionales (p. ej. por limitaciones de Bootstrap) se documentan en el PR; si son permanentes, se actualiza Figma.
5. Las contradicciones entre diseño y ERS se resuelven a favor de la ERS (handoff X-01 a X-15).

### 7.3 Reglas de marca aplicadas

| Decisión del handoff | Aplicación |
|---|---|
| D-03 Sidebar azul institucional con logo blanco ≥ 94 px | `app-sidebar` con `--color-bg-brand`, navegación en `--color-text-on-brand-muted` (7,0:1) |
| D-04 Colores de escuela solo como marcador | Bloque `school-marker` (punto de 8 px junto al nombre) |
| D-05 Neumorfismo solo en KPI de Inicio | `kpi-card--soft` solo en P-01 a P-05 |
| D-12 Barlow y Figtree como sustitutos | DS-08 |

## 8. Errores frecuentes

- Usar `--color-brand-blue` directamente en un botón en lugar de `--color-action-primary`.
- Copiar el hexadecimal desde Figma en vez del token.
- Crear "un badge un poco distinto" para una pantalla.
- Usar el color de la escuela como fondo de la fila o de la tarjeta.
- Mostrar el estado solo con un punto de color.
- Implementar desde el wireframe en grises.
- Mantener los tokens antiguos "por si acaso" junto a los nuevos.
- Cargar todos los pesos de Barlow y Figtree.

## 9. Checklist

- [ ] Solo tokens semánticos y de escala en componentes; primitivos solo en `semantic.css`, marcadores de escuela y logo.
- [ ] Nombres de custom properties derivados de Figma según DS-02.
- [ ] Ningún valor visual literal fuera de `tokens/`.
- [ ] `#9CC8FF` y `#D2D2D2` nunca como texto; `#7C7B75` solo texto grande o iconos.
- [ ] Estados de curso con `status-badge` y texto.
- [ ] Componente reutilizado del inventario §7.1 (no recreado).
- [ ] Pantalla implementada desde alta fidelidad; IDs de pantalla citados en el PR.
- [ ] Capturas 360/768/1440 comparadas con Figma.
- [ ] Neumorfismo solo en KPI de Inicio; logo oficial sin alterar.
- [ ] Fuentes autoalojadas, solo pesos usados, `font-display: swap`.
- [ ] Si se tocó un token: Figma, `tokens/*.css` y tablas de este documento actualizados en el mismo PR.

## 10. Referencias

- Archivo Figma del proyecto: https://www.figma.com/design/O47fA9hgACwiOjxStzpLpX
- Exportación versionada: `wireframes/04-design-system/` y `wireframes/09-handoff/`
- Design Tokens Community Group: https://www.designtokens.org/
- MDN CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- Bootstrap 5.3 CSS variables: https://getbootstrap.com/docs/5.3/customize/css-variables/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Google Fonts, Barlow: https://fonts.google.com/specimen/Barlow · Figtree: https://fonts.google.com/specimen/Figtree
- Lucide (referencia de estilo de iconos): https://lucide.dev/
