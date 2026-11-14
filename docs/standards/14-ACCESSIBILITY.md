# 14 · Accesibilidad

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define el nivel de accesibilidad exigido, cómo se gestiona el teclado y el foco, cómo se comunican estados y errores a lectores de pantalla, el comportamiento accesible de modales, toasts, menús, carga y tiempo de sesión, y cómo se verifica antes de aprobar una funcionalidad.

Fuera de alcance (se enlazan): marcado de formularios, etiquetas, `aria-describedby` y `aria-invalid` en [04](04-HTML.md); tokens de color y contraste verificado en [06](06-DESIGN-SYSTEM.md); componentes Bootstrap en [07](07-BOOTSTRAP.md); reflujo y tamaños en [15](15-RESPONSIVE-DESIGN.md); herramientas y ejecución de pruebas automatizadas en [16](16-TESTING.md); idioma de la interfaz en [20](20-INTERNATIONALIZATION.md).

## 2. Estándar adoptado

| Referencia | Uso | Estado |
|---|---|---|
| WCAG 2.2, nivel AA | Criterio de aceptación de toda pantalla | **Confirmado (ERS)** — RNF-034 (contraste AA); RNF-033, RNF-035, RNF-036, RNF-037 |
| WAI-ARIA 1.2 y ARIA Authoring Practices Guide | Patrones de modal, menú, pestañas, stepper, botones de alternancia | **Adoptado** |
| Reglas de accesibilidad del handoff (09, "Reglas de accesibilidad WCAG 2.2 AA") | Decisiones de diseño ya verificadas y pendientes de verificar en código | **Adoptado** |

**Declaración de conformidad:** el sistema NO DEBE declararse "conforme con WCAG 2.2 AA" mientras la matriz de §7.1 no tenga evidencia para cada criterio. Hasta entonces se usa "diseñado según WCAG 2.2 AA, verificación en curso".

## 3. Justificación

- La ERS fija métricas verificables: recorrido completo con Tab/Shift+Tab (RNF-033), cero fallos AA de contraste (RNF-034), nombre accesible en el 100 % de campos (RNF-035), foco perceptible (RNF-036) y texto alternativo (RNF-037).
- El público incluye autoridades y personal administrativo que trabajan largas sesiones con formularios de unos 30 campos; teclado, mensajes claros y prevención de pérdida de datos impactan directamente la productividad.
- WCAG 2.2 agrega criterios que afectan este sistema: foco no oculto por la barra fija del formulario (2.4.11), tamaño de objetivo (2.5.8), autenticación accesible (3.3.8) y movimientos de arrastre (2.5.7, carga de archivos y CSV).
- Bootstrap resuelve parte del trabajo (trampa de foco en modales, Esc, toasts que se pausan), pero también lo deshace en otros puntos (quita el `outline` de `.btn:focus-visible`), por lo que se necesitan reglas explícitas.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla | WCAG |
|---|---|---|
| A11Y-01 | Toda funcionalidad DEBE operarse solo con teclado: Tab/Shift+Tab para moverse, Enter/Espacio para activar, flechas en grupos de radios, pestañas, menús y stepper, Esc para cerrar modales, menús y offcanvas. Sin trampas de teclado fuera de los modales. | 2.1.1, 2.1.2 |
| A11Y-02 | El orden de foco DEBE seguir el orden visual y lógico. Prohibido `tabindex` positivo. `tabindex="-1"` solo en destinos de foco programático (`main`, encabezados, contenedores de modal). | 2.4.3 |
| A11Y-03 | Todo elemento interactivo DEBE mostrar el foco del DS: borde de 2 px `--color-border-focus` (`#164A98`) mediante `outline` más halo `--focus-ring-halo-color` (`#9CC8FF`). El `outline` es obligatorio porque se conserva en modo de alto contraste; el halo (`box-shadow`) es complementario. | 2.4.7 |
| A11Y-04 | El elemento con foco NO DEBE quedar oculto por elementos fijos (barra de acciones del formulario, topbar, barra inferior móvil): se reserva su espacio con `scroll-padding-block-start` y `scroll-padding-block-end` en `html`. | 2.4.11 |
| A11Y-05 | El foco DEBE gestionarse tras cada acción: (a) al cargar una vista, queda en el inicio del documento (el enlace "Saltar al contenido" es el primer Tab); (b) al fallar "Listo para enviar", va al primer campo inválido (RF-030 CA2); (c) al cerrar un modal, vuelve al control que lo abrió; (d) al eliminar o inactivar una fila, va a la fila siguiente o, si no hay, al título de la tabla; (e) al mostrar un toast, el foco NO se mueve. | 2.4.3, 3.3.1 |
| A11Y-06 | Los contrastes DEBEN cumplir 4,5:1 para texto normal, 3:1 para texto grande (≥ 24 px o ≥ 18,66 px en negrita) y 3:1 para bordes de controles, iconos informativos y anillo de foco. Solo se usan las combinaciones de la tabla de contraste del DS ([06](06-DESIGN-SYSTEM.md)); una combinación nueva se mide antes del PR. | 1.4.3, 1.4.11 |
| A11Y-07 | La información NO DEBE transmitirse solo con color: estados con texto (e icono), errores con icono y mensaje, gráficos con valores visibles y tabla equivalente, campos obligatorios con `*` y texto oculto. | 1.4.1 |
| A11Y-08 | Los objetivos táctiles y de puntero DEBEN medir al menos 24 × 24 px (WCAG); el DS fija 44 px para botones MD, 36 px para SM, 40 px para icon buttons y 56 px para filas de tabla. | 2.5.8 |
| A11Y-09 | Los mensajes de estado DEBEN anunciarse sin mover el foco: confirmaciones y resultados de búsqueda en una región `role="status"` (`aria-live="polite"`); errores bloqueantes del servidor en `role="alert"`. La región existe en el DOM antes de recibir texto. | 4.1.3 |
| A11Y-10 | Los errores de formulario DEBEN identificar el campo y explicar cómo corregirlo ("Máximo 40 caracteres (lleva 45)", "Use su correo institucional @ucenfotec.ac.cr"), con el marcado de [04](04-HTML.md). El inicio de sesión fallido usa el mensaje genérico de RNF-011 en `role="alert"`. | 3.3.1, 3.3.3 |
| A11Y-11 | Los modales DEBEN: tener `aria-labelledby` al título y, en confirmaciones, `aria-describedby` al texto de consecuencia; atrapar el foco; cerrarse con Esc y con un botón visible; devolver el foco al disparador; y, en acciones destructivas, enfocar inicialmente "Cancelar" (en el evento `shown.bs.modal`, porque `autofocus` no funciona dentro de los modales de Bootstrap). El botón destructivo nombra la acción ("Cambiar a Inactivo", "Eliminar usuario"), nunca "Aceptar". | 2.4.3, 3.3.4, 4.1.2 |
| A11Y-12 | Los toasts DEBEN durar 6 s, pausarse con hover o foco y contener solo confirmaciones no esenciales. Un error que impide continuar (p. ej. fallo al aprobar, R-07) se muestra como alerta persistente en la página, no como toast. | 2.2.1, 4.1.3 |
| A11Y-13 | Toda operación asíncrona visible (listados, guardado, Gemini, importación CSV) DEBE marcar su contenedor con `aria-busy="true"` mientras carga y anunciar el inicio y el resultado en la región de estado. Si Gemini tarda más de 1 s, se muestra el indicador de progreso (RNF-020) y el texto "Generando propuesta… Su texto actual se conserva". | 4.1.3 |
| A11Y-14 | Si la sesión expira por inactividad ([13](13-AUTHENTICATION-AUTHORIZATION.md), [PV-03](README.md#7-decisiones-pendientes-de-validación)), la interfaz DEBE avisar al menos 60 s antes con un diálogo accesible que permita extenderla con una sola acción ("Seguir conectado"). | 2.2.1 |
| A11Y-15 | El inicio de sesión NO DEBE exigir pruebas cognitivas (transcribir códigos, CAPTCHA de imagen) y DEBE permitir pegar y usar gestores de contraseñas (`autocomplete` correcto, sin bloquear `paste`). | 3.3.8 |
| A11Y-16 | Las zonas de arrastrar y soltar (adjuntos, CSV) DEBEN tener alternativa con `<input type="file">` y botón; ninguna función depende de arrastrar. | 2.5.7 |
| A11Y-17 | Cada página DEBE tener `<title>` descriptivo, `lang` del idioma activo (actualizado al cambiar de idioma, RF-044), un solo `h1`, landmarks y enlace "Saltar al contenido" ([04](04-HTML.md)). | 2.4.1, 2.4.2, 3.1.1 |
| A11Y-18 | Las imágenes informativas DEBEN tener `alt`; las decorativas `alt=""`; los SVG decorativos `aria-hidden="true"`; los botones de solo icono, nombre accesible que incluya el objeto ("Editar usuario Ana Mora"). El nombre accesible contiene el texto visible. | 1.1.1, 2.5.3, 4.1.2 |
| A11Y-19 | Los botones de alternancia (mostrar contraseña, selector ES/EN) DEBEN exponer su estado con `aria-pressed`; los disparadores de menús y offcanvas con `aria-expanded` (Bootstrap lo gestiona con `data-bs-toggle`). | 4.1.2 |
| A11Y-20 | El contenido que aparece con hover o foco (tooltips, menús) DEBE poder descartarse con Esc, permanecer visible mientras el puntero está sobre él y no contener información que no esté disponible de otra forma. | 1.4.13 |
| A11Y-21 | Las animaciones y transiciones DEBEN respetar `prefers-reduced-motion` ([05](05-CSS-AND-BEM.md)). | 2.3.3 (buena práctica), 2.2.2 |
| A11Y-22 | La interfaz DEBE ser usable con zoom del 200 % y reflujo a 320 px de ancho CSS sin pérdida de contenido ni scroll horizontal (salvo tablas de datos, que pasan a tarjetas, [15](15-RESPONSIVE-DESIGN.md)); con espaciado de texto aumentado no debe recortarse contenido. | 1.4.4, 1.4.10, 1.4.12 |
| A11Y-23 | La navegación, la ubicación de acciones y las etiquetas de acciones equivalentes DEBEN ser consistentes entre módulos (mismo texto "Guardar borrador", "Limpiar filtros" en todas las vistas). | 3.2.3, 3.2.4 (RNF-031) |
| A11Y-24 | Las notificaciones de escritorio (RF-037) DEBEN solicitar permiso solo tras una acción del usuario con explicación previa, y su contenido debe estar también disponible dentro del sistema (bandeja de revisión) para quien no conceda permiso (RF-037 CA2). | 3.3.2 |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| A11Y-25 | Los contadores de caracteres DEBERÍAN actualizarse visualmente en cada pulsación pero anunciarse solo al cruzar el límite (región `role="status"` separada con "Superó el límite de 40 caracteres" / "Dentro del límite"), para no saturar al lector de pantalla. |
| A11Y-26 | Al aplicar búsqueda o filtros DEBERÍA anunciarse el número de resultados ("12 cursos encontrados", "No hay cursos que coincidan") en la región de estado. |
| A11Y-27 | Los gráficos de reportes DEBERÍAN acompañarse de una tabla de datos equivalente (visible o desplegable) y de un resumen textual. |
| A11Y-28 | Cuando la interfaz está en inglés, los contenedores con datos institucionales en español (nombre y descripciones del curso) DEBERÍAN llevar `lang="es"` para su correcta pronunciación. |
| A11Y-29 | Los iconos y bordes DEBERÍAN usar `currentColor` o tokens que sigan siendo visibles en `forced-colors: active` (modo de alto contraste de Windows). |
| A11Y-30 | El modal de confirmación destructiva DEBERÍA enlazar el texto de consecuencia con `aria-describedby`. No se usa `role="alertdialog"`: Bootstrap 5.3 fuerza `role="dialog"` al mostrar el modal y el atributo se perdería. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| A11Y-31 | PUEDEN añadirse atajos de teclado para acciones frecuentes, siempre desactivables y sin usar teclas de un solo carácter (2.1.4). |
| A11Y-32 | PUEDE ofrecerse un resumen de errores con enlaces además del foco al primer campo inválido ([04](04-HTML.md) §7.1). |

## 5. Nomenclatura

| Elemento | Convención |
|---|---|
| Región de estado global | `<div class="visually-hidden" id="app-status" role="status" aria-live="polite"></div>` en cada página |
| Región de alertas global | `<div id="app-alert" role="alert"></div>` |
| Ids de títulos de modal | `<modal-id>-title`; descripción: `<modal-id>-description` |
| Textos para lectores de pantalla | Clase de Bootstrap `visually-hidden`; nunca `display:none` para texto que debe leerse |

## 6. Ejemplos

### 6.1 Foco del DS

Correcto (`base/base.css`):

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--focus-ring-halo-color);
}

html {
  scroll-padding-block-start: var(--layout-topbar-height);
  scroll-padding-block-end: var(--layout-action-bar-height); /* barra fija Guardar/Enviar (2.4.11) */
}
```

Incorrecto:

```css
*:focus { outline: none; }                 /* elimina el foco sin sustituto */
.btn:focus { box-shadow: none; }            /* el foco solo existía en box-shadow */
```

### 6.2 Anuncio de estado sin mover el foco

```html
<div class="visually-hidden" id="app-status" role="status" aria-live="polite"></div>
```

```js
// La región existe desde la carga; solo se cambia su texto.
statusRegion.textContent = t('courses.list.resultsCount', { count: 12 });
```

Incorrecto: crear el contenedor `aria-live` en el mismo momento en que se inserta el mensaje (muchos lectores no lo anuncian), o usar `alert()` del navegador.

### 6.3 Confirmación destructiva con foco inicial en "Cancelar"

```html
<div class="modal fade" id="confirm-delete-user" tabindex="-1"
     aria-labelledby="confirm-delete-user-title" aria-describedby="confirm-delete-user-description" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title" id="confirm-delete-user-title">¿Eliminar a Ana Mora?</h2>
      </div>
      <p class="modal-body" id="confirm-delete-user-description">Se eliminarán sus datos personales y no podrá iniciar sesión.</p>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" data-initial-focus>Cancelar</button>
        <button type="button" class="btn btn-danger" data-action="confirm-delete-user">Eliminar usuario</button>
      </div>
    </div>
  </div>
</div>
```

```js
modal.addEventListener('shown.bs.modal', () => {
  modal.querySelector('[data-initial-focus]')?.focus();
});
```

### 6.4 Panel de Gemini accesible

```html
<section class="ai-suggestion" aria-labelledby="ai-suggestion-title" aria-busy="true">
  <h3 class="ai-suggestion__title" id="ai-suggestion-title">Propuesta de Gemini</h3>
  <p class="ai-suggestion__badge">Generado por IA · revise antes de usar</p>
  <p class="ai-suggestion__status">Generando propuesta… Su texto actual se conserva.</p>
</section>
```

Al recibir error se retira `aria-busy`, se agrega el modificador `--error` y se publica "Gemini no respondió. No se modificó su texto." en `#app-alert` (RNF-023).

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Matriz de verificación

Estado inicial tomado del handoff 09; "Verificar en código" significa que el diseño lo resuelve pero aún no existe implementación.

| Criterio WCAG 2.2 | Regla del sistema | Cómo se verifica | Estado |
|---|---|---|---|
| 1.1.1 Contenido no textual | A11Y-18 | axe + revisión de `alt` y `aria-hidden` | Verificar en código |
| 1.3.1 Información y relaciones | [04](04-HTML.md) (tablas, `fieldset`, landmarks) | axe + Nu Html Checker | Verificar en código |
| 1.3.5 Propósito de los campos | [04](04-HTML.md) HTML-25 | Revisión de `autocomplete` | Verificar en código |
| 1.4.1 Uso del color | A11Y-07 | Revisión visual en escala de grises | Verificado en diseño |
| 1.4.3 / 1.4.11 Contraste | A11Y-06, tabla de [06](06-DESIGN-SYSTEM.md) | axe + medición manual de combinaciones nuevas | Verificado en diseño |
| 1.4.10 / 1.4.4 Reflujo y zoom | A11Y-22 | Zoom 200 % y 400 % en 1280 px | Verificar en código |
| 2.1.1 Teclado | A11Y-01 | Recorrido manual sin ratón por flujo | Verificar en código |
| 2.4.3 Orden del foco | A11Y-02, A11Y-05 | Recorrido manual | Verificar en código |
| 2.4.7 / 2.4.11 Foco visible y no oculto | A11Y-03, A11Y-04 | Recorrido manual en formulario con barra fija | Verificar en código |
| 2.5.8 Tamaño del objetivo | A11Y-08 | Medición en DevTools | Verificado en diseño |
| 3.1.1 / 3.1.2 Idioma | A11Y-17, A11Y-28 | Inspección de `lang` tras cambiar a EN | Verificar en código |
| 3.3.1–3.3.3 Errores y etiquetas | A11Y-10, [04](04-HTML.md) | Prueba con datos inválidos por formulario | Verificado en diseño |
| 3.3.8 Autenticación accesible | A11Y-15 | Pegar contraseña y usar gestor | Verificar en código |
| 4.1.2 Nombre, rol y valor | A11Y-11, A11Y-19 | axe + lector de pantalla | Verificar en código |
| 4.1.3 Mensajes de estado | A11Y-09, A11Y-13 | Lector de pantalla en guardado, búsqueda y Gemini | Verificar en código |

### 7.2 Procedimiento de verificación por PR de interfaz

1. **Automático:** axe sin violaciones `serious` ni `critical` en las pantallas tocadas (ejecución definida en [16](16-TESTING.md)). Lighthouse PUEDE usarse como verificación rápida, pero no reemplaza a axe.
2. **Teclado:** completar el flujo principal de la pantalla sin ratón; anotar en el PR el recorrido realizado.
3. **Lector de pantalla (prueba de humo):** NVDA con Firefox o Chrome en Windows, o VoiceOver con Safari en macOS; verificar nombre de campos, errores, estados y anuncios.
4. **Zoom y reflujo:** 200 % en escritorio y ancho de 320 px.
5. **Contraste:** medir solo combinaciones nuevas que no estén en la tabla del DS.
6. Registrar el resultado en la sección de accesibilidad de la plantilla de PR y actualizar la matriz §7.1 cuando un criterio pase a "Verificado en código".

### 7.3 Puntos sensibles por pantalla

| Pantalla | Riesgo | Regla |
|---|---|---|
| F-01 a F-13 Formulario de curso | Barra fija tapa el foco; 30 campos; contadores | A11Y-04, A11Y-05 (b), A11Y-25 |
| F-09/F-10 Gemini | Carga sin anuncio; pérdida de texto | A11Y-13, RNF-020, RNF-023 |
| C-07, R-05, R-08, R-09, U-06 Confirmaciones | Foco inicial en acción destructiva | A11Y-11, A11Y-30 |
| C-01, U-01, K-* Listados | Resultados de búsqueda sin anuncio; filas sin enlace | A11Y-26, [04](04-HTML.md) HTML-17 |
| M-01 Importar CSV, F-07 Adjuntos | Dependencia de arrastrar | A11Y-16 |
| A-01 Inicio de sesión | Mensaje de error sin anuncio; bloqueo de pegado | A11Y-10, A11Y-15 |
| RP-01 a RP-04 Reportes | Gráficos solo de color | A11Y-07, A11Y-27 |
| N-02 Notificación de escritorio | Información solo en notificación | A11Y-24 |

## 8. Errores frecuentes

- Quitar el `outline` y dejar el foco solo en `box-shadow` (desaparece en alto contraste).
- Confiar en que `autofocus` funciona dentro de un modal de Bootstrap.
- Usar toasts para errores que exigen acción.
- Crear regiones `aria-live` dinámicamente o anunciar cada pulsación de un contador.
- Botones de icono con `title` como única etiqueta (deuda actual del botón deshabilitado de Google en `frontend/index.html`).
- Mover el foco al toast o al principio de la página tras guardar.
- Marcar el modal destructivo con "Aceptar" / "Cancelar" sin nombrar la acción.
- Probar solo con axe: los problemas de orden de foco y de anuncios solo aparecen con teclado y lector de pantalla.
- Declarar "cumple WCAG" sin la matriz con evidencia.

## 9. Checklist

- [ ] Flujo completo operable solo con teclado; sin `tabindex` positivo.
- [ ] Foco visible con `outline` del DS en todos los controles, incluidos los de Bootstrap.
- [ ] Foco no tapado por topbar, barra inferior ni barra de acciones.
- [ ] Gestión de foco tras enviar con errores, cerrar modal, eliminar fila y cambiar de vista.
- [ ] Contrastes dentro de la tabla del DS o medidos.
- [ ] Ningún estado o error transmitido solo por color.
- [ ] Objetivos ≥ 24 px (DS: 44/36/40/56 px).
- [ ] Regiones `role="status"` y `role="alert"` presentes desde la carga y usadas para anuncios.
- [ ] Modales con título asociado, Esc, retorno de foco y foco inicial seguro en destructivos.
- [ ] Toasts solo para confirmaciones; errores bloqueantes como alerta persistente.
- [ ] `aria-busy` e indicador en cargas; Gemini con aviso a partir de 1 s.
- [ ] Aviso previo a la expiración de sesión con opción de extender.
- [ ] Inicio de sesión sin pruebas cognitivas; pegado permitido.
- [ ] `lang` actualizado al cambiar de idioma.
- [ ] axe sin violaciones serias o críticas; recorrido de teclado y prueba de humo con lector de pantalla registrados en el PR.

## 10. Referencias

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/
- ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- Patrón de diálogo modal (APG): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Bootstrap 5.3, accesibilidad: https://getbootstrap.com/docs/5.3/getting-started/accessibility/
- Bootstrap 5.3, modal: https://getbootstrap.com/docs/5.3/components/modal/
- axe-core: https://github.com/dequelabs/axe-core
- Playwright, pruebas de accesibilidad: https://playwright.dev/docs/accessibility-testing
