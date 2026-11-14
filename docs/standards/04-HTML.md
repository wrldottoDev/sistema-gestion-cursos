# 04 · HTML

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se escribe el marcado de todas las páginas de `frontend/`: estructura del documento, elementos semánticos, landmarks, encabezados, enlaces y botones, formularios (incluido su comportamiento de validación), tablas, navegación, imágenes e iconos.

Fuera de alcance (se enlazan): estilos y clases BEM en [05](05-CSS-AND-BEM.md); clases de componentes Bootstrap en [07](07-BOOTSTRAP.md); criterios WCAG, foco, teclado, modales y pruebas de accesibilidad en [14](14-ACCESSIBILITY.md); textos traducibles en [20](20-INTERNATIONALIZATION.md); lógica JavaScript en [08](08-JAVASCRIPT.md); sanitización y CSP en [12](12-SECURITY.md).

## 2. Estándar adoptado

| Referencia | Uso | Estado |
|---|---|---|
| HTML Living Standard (WHATWG) | Elementos, atributos, modelo de contenido y validación de formularios | **Adoptado** |
| WAI-ARIA 1.2 y ARIA Authoring Practices Guide (APG) | Solo cuando no existe un elemento nativo equivalente ("primera regla de ARIA") | **Adoptado** |
| WCAG 2.2 AA | Criterio de aceptación del marcado (detalle en [14](14-ACCESSIBILITY.md)) | **Confirmado (ERS)** — RNF-033 a RNF-037 |
| Páginas HTML estáticas + ES Modules (MPA) | Una página HTML por vista, sin plantillas de servidor | **Adoptado** — [ADR-0003](../adr/0003-frontend-mpa-es-modules-bootstrap.md) |

## 3. Justificación

- El marcado semántico da accesibilidad "gratis": los elementos nativos (`button`, `a`, `label`, `fieldset`, `table`, `nav`, `main`, `dialog`) ya traen rol, nombre, foco y teclado. Cada `div` con `onclick` obliga a reimplementar eso y suele hacerlo mal.
- La ERS exige etiquetas programáticas (RNF-035), navegación por teclado (RNF-033), mensajes de validación junto al campo (RNF-029), indicador de obligatorio (RNF-028) y texto alternativo (RNF-037): todo eso se resuelve en el HTML antes que en CSS o JS.
- Las reglas de validación del curso distinguen **guardar borrador** (formatos y límites) de **enviar a revisión** (todo lo obligatorio) (RF-019 CA1, RF-030). El marcado debe expresar "obligatorio para enviar" sin que el navegador bloquee el borrador; por eso la validación nativa se desactiva con `novalidate` y se reemplaza por validación propia (handoff 09).

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| HTML-01 | Toda página DEBE empezar con `<!doctype html>`, `<html lang="…">` con el idioma activo (`es` o `en`, ver [20](20-INTERNATIONALIZATION.md)), `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">` y un `<title>` único con el patrón `Vista · Sistema de Gestión de Cursos`. |
| HTML-02 | Las rutas a recursos propios DEBEN ser absolutas desde la raíz del sitio (`/css/main.css`, `/js/pages/course-list.page.js`, `/img/logo-horizontal-color.png`). Express sirve `frontend/` como raíz ([03](03-PROJECT-ARCHITECTURE.md)). No se usan rutas relativas `../`. |
| HTML-03 | El JavaScript de la página DEBE cargarse con un único `<script type="module" src="/js/pages/<page>.page.js">` en `<head>`. El bundle de Bootstrap se carga antes con `defer` ([07](07-BOOTSTRAP.md)). Prohibidos `<script>` inline y atributos `on*=` (CSP, [12](12-SECURITY.md)). |
| HTML-04 | La estructura DEBE usar landmarks: un `<header>` de aplicación, un `<nav>` principal con `aria-label`, un único `<main id="main">` y, si aplica, `<aside>` y `<footer>`. Cada `<nav>` adicional (breadcrumbs, stepper, paginación) lleva `aria-label` distinto. |
| HTML-05 | La primera posición tabulable DEBE ser un enlace "Saltar al contenido principal" hacia `#main` (`class="visually-hidden-focusable"`). |
| HTML-06 | Cada página DEBE tener exactamente un `<h1>` (el título de la vista, p. ej. "Cursos") y encabezados sin saltos de nivel (`h2` después de `h1`, nunca `h4` después de `h2`). El nivel se elige por estructura, no por tamaño visual. |
| HTML-07 | Una acción que cambia de página o de URL DEBE ser `<a href>`; una acción en la misma página (guardar, abrir modal, mostrar contraseña) DEBE ser `<button type="button">` o `<button type="submit">`. Prohibido `<a href="#">`, `<a>` sin `href` o `div`/`span` clicables. |
| HTML-08 | Todo `<button>` DEBE declarar `type` explícito. |
| HTML-09 | Cada control de formulario DEBE tener un `<label for="id">` visible asociado a un `id` único. El `placeholder` no reemplaza a la etiqueta. Botones solo con icono DEBEN tener nombre accesible (`aria-label` o texto `visually-hidden`) que incluya el objeto ("Editar usuario Ana Mora"). |
| HTML-10 | Los grupos de radios o checkboxes (Modalidad, Sexo, E-commerce abierto, Pertenece a un programa) DEBEN ir en `<fieldset>` con `<legend>`. Cada sección del formulario de curso es un `<fieldset>` o `<section aria-labelledby>` con su título. |
| HTML-11 | Los formularios con validación propia DEBEN llevar `novalidate`. Los atributos nativos (`required`, `type`, `min`, `max`, `step`, `inputmode`, `autocomplete`) se mantienen porque informan a tecnologías de asistencia y teclados móviles. |
| HTML-12 | Los campos obligatorios para enviar DEBEN llevar `required` y el indicador visual `*` dentro del `<label>` con texto oculto equivalente; el formulario DEBE incluir al inicio la nota "Los campos marcados con * son obligatorios para enviar a revisión" (RNF-028, RF-018 CA4). |
| HTML-13 | Ayuda, error y contador de un campo DEBEN asociarse al control con `aria-describedby` (ids separados por espacio, en ese orden). Un campo inválido DEBE tener `aria-invalid="true"` y la clase `.is-invalid`; al corregirse se eliminan ambos. El mensaje de error vive en un elemento `.invalid-feedback` con id propio, junto al campo (RNF-029). |
| HTML-14 | Los campos con límite de caracteres (Nombre en Power Campus 40, Descripción corta 250, Meta descripción 155) NO DEBEN usar `maxlength`: el texto no se recorta (RF-022 CA2). El contador `N/límite` es un elemento asociado por `aria-describedby`. |
| HTML-15 | Los valores calculados (Total de horas, edad) DEBEN mostrarse con `<output for="…">` o como texto de solo lectura, nunca como `<input>` editable (RF-021 CA3, RF-003 CA4). |
| HTML-16 | Las tablas de datos DEBEN usar `<table>` con `<caption>` (puede ser `visually-hidden`), `<thead>`, `<tbody>` y `<th scope="col">`; la celda que identifica la fila (código o nombre) PUEDE ser `<th scope="row">`. Prohibido maquetar con tablas o simular tablas con `div`. |
| HTML-17 | Cada fila con detalle DEBE ofrecer un enlace real (`<a href="/pages/course-detail.html?id=…">`) en la celda identificadora. Hacer clicable toda la fila es una mejora opcional que delega en ese enlace. |
| HTML-18 | Las imágenes informativas DEBEN tener `alt` descriptivo (logo: `alt="Universidad CENFOTEC"`); las decorativas `alt=""`. Los iconos SVG decorativos llevan `aria-hidden="true"` y `focusable="false"` (RNF-037). |
| HTML-19 | La navegación activa DEBE marcarse con `aria-current="page"`; el paso activo del stepper con `aria-current="step"`; el último elemento del breadcrumb con `aria-current="page"`. |
| HTML-20 | Solo se usa ARIA cuando no hay elemento nativo. Prohibido `role="button"` sobre `div`, `role` redundante (`<nav role="navigation">`) o `aria-label` que contradiga el texto visible (WCAG 2.5.3). |
| HTML-21 | Los estados del curso DEBEN comunicarse con texto (y opcionalmente icono), nunca solo con color: `<span class="badge …">Borrador</span>`. |
| HTML-22 | Prohibidos los estilos inline (`style="…"`) y los elementos o atributos de presentación obsoletos (`<font>`, `<center>`, `align`, `bgcolor`). Ver [05](05-CSS-AND-BEM.md). Única excepción: las plantillas de correo HTML que genera el servidor (N-03, N-04), por compatibilidad con clientes de correo ([06 §7.1](06-DESIGN-SYSTEM.md#71-inventario-de-componentes-e-implementación)). |
| HTML-23 | Todo texto de interfaz DEBE estar asociado a una clave de traducción según el mecanismo de [20](20-INTERNATIONALIZATION.md). Los ejemplos de este documento muestran el texto en español solo por legibilidad. Los datos ingresados por usuarios no se traducen (RF-044 CA4). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| HTML-24 | Los campos DEBERÍAN usar el `type` y el `inputmode` correctos: `type="email"` (correo), `type="tel" inputmode="numeric"` (celular), `type="text" inputmode="numeric"` (identificación, preserva ceros), `type="number" min max step="1"` (créditos 1–12, horas 0–300), `type="date"` (fecha de nacimiento, e-commerce, rangos de reportes). |
| HTML-25 | `autocomplete` DEBERÍA describir el propósito cuando el dato es del propio usuario (WCAG 1.3.5): inicio de sesión `autocomplete="username"` y `current-password`. En el registro de usuarios, donde el Administrador digita datos de otra persona, se usa `autocomplete="off"` para no rellenar con los datos del Administrador. |
| HTML-26 | No DEBERÍA usarse `type="month"` ni `type="week"` (soporte incompleto en Firefox y Safari de escritorio; RNF-043, RNF-044). El comparativo "mismo mes de dos años" (RF-043 CA2) usa dos `<select>` (mes y año). |
| HTML-27 | Los textos largos (Descripción larga, Competencia, Perfiles, Metadata) DEBERÍAN usar `<textarea rows="4">` o más; los cortos con límite (Nombre en Power Campus) `<input type="text">`. |
| HTML-28 | `accept` en `<input type="file">` DEBERÍA declarar las extensiones y tipos permitidos (`.doc,.docx,.pdf` para adjuntos; `.png,.jpg,.jpeg,.webp` para fotografía; `.csv` para importación). Es solo una ayuda: la validación real ocurre en el servidor ([12](12-SECURITY.md)). |
| HTML-29 | Los diálogos DEBERÍAN usar el componente Modal de Bootstrap con `aria-labelledby` apuntando a su título ([07](07-BOOTSTRAP.md), comportamiento en [14](14-ACCESSIBILITY.md)). |
| HTML-30 | Los ganchos para JavaScript DEBERÍAN ser atributos `data-*` (`data-action="toggle-password"`, `data-field="powerCampusName"`), no clases de estilo ni ids reutilizados para CSS. |
| HTML-31 | El HTML DEBERÍA validarse sin errores con el validador del W3C (Nu Html Checker) antes del PR. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| HTML-32 | PUEDE usarse `<template>` para filas, tarjetas o toasts que JavaScript clona; es preferible a construir HTML como cadena ([12](12-SECURITY.md)). |
| HTML-33 | PUEDE usarse `<details>`/`<summary>` para contenido plegable simple (p. ej. ayuda extendida de un campo). |
| HTML-34 | PUEDE usarse `<dl>` para pares etiqueta–valor en el detalle de curso (C-05, C-06). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos de página | kebab-case en inglés, dentro de `frontend/pages/` (salvo `index.html` = inicio de sesión) | `pages/course-detail.html`, `pages/review-inbox.html` |
| `id` | kebab-case en inglés, únicos por página, derivados del campo del [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) | `power-campus-name`, `power-campus-name-error`, `power-campus-name-counter` |
| `name` de controles | camelCase igual al campo de la API ([10](10-REST-API.md)) | `name="powerCampusName"` |
| Atributos `data-*` | kebab-case | `data-action="suggest-with-gemini"` |
| Sufijos de elementos asociados | `-help`, `-error`, `-counter`, `-legend`, `-title` | `short-description-help` |

## 6. Ejemplos

### 6.1 Esqueleto de página

Correcto:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cursos · Sistema de Gestión de Cursos</title>
    <link rel="stylesheet" href="/css/main.css" />
    <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js" defer></script>
    <script type="module" src="/js/pages/course-list.page.js"></script>
  </head>
  <body>
    <a class="visually-hidden-focusable" href="#main">Saltar al contenido principal</a>
    <header class="app-topbar">…</header>
    <nav class="app-sidebar" aria-label="Principal">
      <ul>
        <li><a href="/pages/courses.html" aria-current="page">Cursos</a></li>
        <li><a href="/pages/reports.html">Reportes</a></li>
      </ul>
    </nav>
    <main id="main" tabindex="-1">
      <h1>Cursos</h1>
      …
    </main>
  </body>
</html>
```

Incorrecto (estado actual de `frontend/index.html`, deuda D2):

```html
<html lang="en">                                   <!-- contenido en español con lang="en" -->
<link rel="stylesheet" href="../css/main.css">     <!-- ruta relativa que sale de frontend/ -->
<div class="container__logo__cenfo"></div>         <!-- logo como div vacío; BEM elemento-de-elemento -->
```

### 6.2 Campo con ayuda, contador y error (RF-022)

Correcto:

```html
<div class="mb-3">
  <label class="form-label" for="power-campus-name">
    Nombre en Power Campus <span aria-hidden="true">*</span>
    <span class="visually-hidden">(obligatorio para enviar)</span>
  </label>
  <input
    class="form-control is-invalid"
    id="power-campus-name"
    name="powerCampusName"
    type="text"
    required
    aria-invalid="true"
    aria-describedby="power-campus-name-help power-campus-name-error power-campus-name-counter"
  />
  <p class="form-text" id="power-campus-name-help">Nombre que Vicerrectoría transcribe a Power Campus.</p>
  <p class="invalid-feedback" id="power-campus-name-error">Máximo 40 caracteres (lleva 45).</p>
  <p class="char-counter char-counter--exceeded" id="power-campus-name-counter">45/40</p>
</div>
```

Incorrecto:

```html
<input placeholder="Nombre en Power Campus" maxlength="40">   <!-- sin label; recorta el texto -->
<span style="color:red">Error</span>                           <!-- inline, no asociado, solo color -->
```

### 6.3 Grupo de opciones

Correcto:

```html
<fieldset>
  <legend>Modalidad <span aria-hidden="true">*</span></legend>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="modality" id="modality-in-person" value="in_person" required />
    <label class="form-check-label" for="modality-in-person">Presencial</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="modality" id="modality-hybrid" value="hybrid" />
    <label class="form-check-label" for="modality-hybrid">Híbrida</label>
  </div>
</fieldset>
```

### 6.4 Botón mostrar/ocultar contraseña

Correcto:

```html
<button type="button" class="btn btn-link" aria-controls="password" aria-pressed="false" data-action="toggle-password">
  <img src="/img/open-eye.svg" alt="" width="20" height="20" />
  <span class="visually-hidden">Mostrar contraseña</span>
</button>
```

Incorrecto (estado actual):

```html
<button type="button" id="btn-toggle">
  <img src="../img/open-eye.svg" id="password-eye" alt="Mostrar/Ocultar contraseña">  <!-- nombre ambiguo, sin estado -->
</button>
```

### 6.5 Valor calculado

```html
<label for="total-hours-output">Total de horas</label>
<output id="total-hours-output" for="class-hours extra-class-hours">45</output>
```

### 6.6 Tabla de listado (C-01)

```html
<table class="table table-hover">
  <caption class="visually-hidden">Cursos visibles para su rol</caption>
  <thead>
    <tr>
      <th scope="col">Código</th>
      <th scope="col">Nombre</th>
      <th scope="col">Escuela</th>
      <th scope="col">Estado</th>
      <th scope="col">Última modificación</th>
      <th scope="col"><span class="visually-hidden">Acciones</span></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><a href="/pages/course-detail.html?id=6745f0c2a1b2c3d4e5f60718">SOFT-101</a></th>
      <td>Fundamentos de programación</td>
      <td>Ingeniería del Software</td>
      <td><span class="badge rounded-pill status-badge status-badge--draft">Borrador</span></td>
      <td><time datetime="2026-11-20T15:04:05.000Z">20 nov 2026</time></td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger" aria-label="Cambiar SOFT-101 a Inactivo">…</button>
      </td>
    </tr>
  </tbody>
</table>
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Comportamiento de validación de formularios

Fuente: handoff 09 "Comportamientos" y RF-019, RF-030. La implementación JavaScript sigue [08](08-JAVASCRIPT.md); las reglas compartidas viven en `shared/` ([03](03-PROJECT-ARCHITECTURE.md)).

| Momento | Qué se valida | Qué muestra |
|---|---|---|
| Al salir del campo (`blur`) la primera vez | Formato y límite del campo | Error junto al campo |
| Mientras escribe, si el campo ya fue tocado | El mismo campo, en tiempo real | Actualiza o retira el error; el contador siempre se actualiza |
| **Guardar borrador** | Solo formatos y límites; NO los obligatorios (RF-019 CA1) | Toast de confirmación (≤ 1 s, RNF-030) o errores de formato |
| **Listo para enviar** | Todos los obligatorios, formatos y límites (RF-030 CA1) | Resumen de errores con enlaces a cada campo, error junto a cada campo y foco en el primer campo inválido (RF-030 CA2) |

Reglas derivadas:

- No se estiliza `:invalid` ni `:user-invalid`: con `novalidate` un campo `required` vacío es válido para un borrador. El estado inválido se expresa solo con `.is-invalid` + `aria-invalid="true"` aplicados por la validación propia.
- El resumen de errores es una lista de enlaces `<a href="#power-campus-name">` dentro de un contenedor con título; los mensajes son específicos ("Máximo 40 caracteres (lleva 45)"), nunca "Campo inválido".
- Al fallar el envío no se borra nada de lo digitado (RF-030 CA2, RNF-023).
- Un curso en `in_development` o posterior se muestra en solo lectura (RF-019 CA4): se renderiza como detalle (`<dl>`) o con controles `readonly`; nunca como formulario editable con el botón oculto.

### 7.2 Pantallas y marcado clave

| Pantalla (ID handoff) | Marcado obligatorio |
|---|---|
| A-01 Inicio de sesión | `<form novalidate>` con `type="email" autocomplete="username"` y `type="password" autocomplete="current-password"`; contenedor del botón de Google (Google Identity Services lo renderiza); mensaje genérico de credenciales en un elemento con `role="alert"` (RNF-011). |
| F-01 a F-08 Formulario de curso | 8 secciones como `<fieldset>`/`<section aria-labelledby>`; stepper como `<nav aria-label="Secciones del curso"><ol>` con `aria-current="step"`; barra fija con "Guardar borrador" y "Listo para enviar". |
| F-09/F-10 Gemini | Botón "Sugerir con Gemini" solo en Metodología, Descripción larga, Descripción corta y Meta descripción; nunca en Competencia (RN-22). La propuesta se muestra en un `<textarea>` editable distinto del campo original; solo reemplaza al pulsar "Usar propuesta" (RF-028 CA1). |
| C-01/C-02 Listados | Formulario de búsqueda con `role="search"` (o `<search>` cuando el soporte lo permita), `<label>` visible o `visually-hidden`; tabla según HTML-16; mensaje sin resultados con botón "Limpiar filtros" (RF-041 CA4). |
| U-03 Registro de usuario | `autocomplete="off"`, fecha de nacimiento `type="date"`, edad como `<output>`, fotografía `type="file" accept=".png,.jpg,.jpeg,.webp"`. |
| K-01 a K-08 Catálogos | Catálogos fijos sin botón Eliminar en el DOM (RF-015 CA4), no solo ocultos con CSS. |
| R-02 a R-09 Revisión | Acciones destructivas o irreversibles con confirmación en modal ([14](14-ACCESSIBILITY.md)). |

### 7.3 Acciones según rol

Las acciones que un rol no puede ejecutar NO se renderizan en el DOM (handoff 09, RF-008 CA3). Ocultarlas no es seguridad: el servidor autoriza cada operación ([13](13-AUTHENTICATION-AUTHORIZATION.md)).

## 8. Errores frecuentes

- Usar `placeholder` como etiqueta o dejar la etiqueta solo como `aria-label` cuando el diseño la muestra visible.
- Poner `maxlength` en campos con contador y esconder así el error que exige RF-022 CA2.
- Estilizar `:invalid` y mostrar en rojo campos vacíos de un borrador recién abierto.
- `div` o `span` con listener de clic en lugar de `button` o `a`.
- Tablas sin `<th scope>` o con encabezados como `<td><b>…</b></td>`.
- Elegir `h3` "porque se ve del tamaño correcto".
- Ocultar acciones no permitidas con `d-none` en vez de no generarlas.
- Iconos sin `aria-hidden` que el lector de pantalla anuncia como "imagen".
- Copiar el texto en español dentro del HTML sin clave de traducción.

## 9. Checklist

- [ ] `doctype`, `lang` correcto, `charset`, `viewport` y `<title>` con el patrón definido.
- [ ] Rutas absolutas desde la raíz; un único `<script type="module">` de página; sin scripts ni estilos inline.
- [ ] Enlace "Saltar al contenido", landmarks (`header`, `nav` con `aria-label`, `main#main`) y un solo `h1`.
- [ ] Encabezados sin saltos de nivel.
- [ ] Todos los botones con `type`; navegación con `<a href>`; acciones con `<button>`.
- [ ] Todos los controles con `<label for>` visible; grupos con `fieldset`/`legend`.
- [ ] Formularios con `novalidate`; obligatorios con `required` + `*` + texto oculto + nota inicial.
- [ ] Ayuda, error y contador enlazados con `aria-describedby`; `aria-invalid` sincronizado con `.is-invalid`.
- [ ] Sin `maxlength` en campos con contador; valores calculados con `<output>`.
- [ ] Tablas con `caption`, `thead`, `th scope`; enlace real al detalle.
- [ ] Imágenes con `alt` adecuado; SVG decorativos con `aria-hidden="true"`.
- [ ] `aria-current` en navegación, breadcrumb y stepper.
- [ ] Acciones no permitidas para el rol ausentes del DOM.
- [ ] HTML validado con Nu Html Checker sin errores.

## 10. Referencias

- HTML Living Standard: https://html.spec.whatwg.org/
- Formularios en HTML (constraint validation): https://html.spec.whatwg.org/multipage/form-control-infrastructure.html
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Nu Html Checker: https://validator.w3.org/nu/
- Bootstrap 5.3 Forms: https://getbootstrap.com/docs/5.3/forms/overview/
- MDN `autocomplete`: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
