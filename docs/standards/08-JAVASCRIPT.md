# 08 · JavaScript

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se escribe JavaScript en todo el repositorio: `frontend/js/`, `shared/` y `backend/`. Cubre lenguaje, nombres, módulos, manipulación del DOM, eventos, asincronía, manejo de errores y la organización del código del navegador. Las particularidades del servidor (capas, middlewares, configuración) están en [09 Backend Node.js](09-NODEJS-BACKEND.md); el formato automático en [18 Calidad de código](18-CODE-QUALITY.md).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Lenguaje | ECMAScript moderno (ES2022+) soportado por las dos últimas versiones de Chrome, Edge, Firefox y Safari (RNF-041 a RNF-044) y por Node.js LTS | Adoptado |
| Módulos | **ECMAScript Modules** en navegador (`<script type="module">`) y Node.js (`"type": "module"`) | Adoptado |
| Tipado | JavaScript sin TypeScript; contratos documentados con JSDoc ([17](17-DOCUMENTATION.md)) | Confirmado (restricción del curso) |
| Librerías de frontend | Ninguna salvo el bundle de Bootstrap ([07](07-BOOTSTRAP.md)); sin jQuery ni frameworks | Adoptado |
| Análisis estático | ESLint con `eslint.config.js` del repositorio | Implementado (configuración) / inactivo hasta instalar dependencias |
| Formato | Prettier (`.prettierrc.json`) | Implementado (configuración) |

## 3. Justificación

- Los ES Modules son nativos en ambos entornos: el mismo archivo de `shared/` se importa en el navegador y en Node.js sin transpilar ni empaquetar.
- `const` por defecto y la ausencia de globales reducen errores por reasignación y colisiones entre páginas.
- Separar HTTP, DOM y orquestación permite probar las reglas sin navegador y cambiar la interfaz sin tocar el acceso a datos (RNF-045).
- Manejar explícitamente carga, vacío y error es un requisito de la ERS y del handoff: RNF-020 (indicador si Gemini tarda más de 1 s), RNF-023 (no perder datos ante fallos), C-04 (error de red con reintento sin perder filtros).

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| JS-01 | Las variables **DEBEN** declararse con `const`; `let` solo si se reasignan. `var` está prohibido (ESLint `no-var`, `prefer-const`). |
| JS-02 | Todo archivo **DEBE** ser un ES Module (`import`/`export`). `require`, `module.exports` y scripts clásicos están prohibidos. |
| JS-03 | Las rutas de importación relativas **DEBEN** incluir la extensión `.js` (`'./courses.api.js'`); el navegador no resuelve rutas sin extensión. |
| JS-04 | **DEBEN** usarse exportaciones nombradas. `export default` solo se permite en archivos de configuración cuya herramienta lo exige (`eslint.config.js`, `playwright.config.js`). |
| JS-05 | **NO DEBEN** crearse variables globales (`window.x = …`, asignaciones implícitas). El estado de una página vive en el ámbito de su módulo. |
| JS-06 | Las comparaciones **DEBEN** usar `===` / `!==` (ESLint `eqeqeq`). |
| JS-07 | Cada función **DEBE** tener una responsabilidad nombrable con un verbo. ESLint advierte por encima de 50 líneas, complejidad 10, profundidad 4 o 4 parámetros; superar esos umbrales exige justificar en el PR o dividir. |
| JS-08 | En el frontend, el código **DEBE** separarse en `*.api.js` (solo HTTP mediante `core/api-client.js`), `*.view.js` (solo DOM) y `*.page.js` (orquestación). Las reglas puras van en `shared/` ([03](03-PROJECT-ARCHITECTURE.md)). |
| JS-09 | El texto proveniente de datos **DEBE** insertarse con `textContent`, `setAttribute` o nodos creados con el DOM. `innerHTML`, `outerHTML`, `insertAdjacentHTML` y `document.write` están bloqueados por ESLint ([12](12-SECURITY.md)). |
| JS-10 | Los eventos **DEBEN** registrarse con `addEventListener`. Los atributos `onclick=""` y similares están prohibidos (además, la CSP los bloquea). |
| JS-11 | Las listas con acciones por fila **DEBEN** usar delegación de eventos en el contenedor (`event.target.closest('[data-action]')`), no un listener por fila. |
| JS-12 | Los selectores que usa JavaScript **DEBEN** ser atributos `data-*` (`data-action`, `data-field`, `data-course-filters`), nunca clases de estilo BEM ni de Bootstrap. |
| JS-13 | El código asíncrono **DEBE** usar `async`/`await`. Toda promesa se espera, se retorna o se maneja explícitamente; un `void promise` solo se admite con un `.catch` que registre el error. |
| JS-14 | Toda llamada de red **DEBE** manejar los cuatro estados de la vista: cargando, vacío, error y éxito. Durante la carga el control que la disparó se deshabilita para evitar envíos dobles. |
| JS-15 | Toda llamada de red **DEBE** distinguir: error de red (`NetworkError`), respuesta HTTP no exitosa (`ApiError` con `status` y `code`) y cancelación (`AbortError`). `fetch` solo rechaza por fallo de red; `response.ok` siempre se verifica. |
| JS-16 | Las búsquedas que se disparan al escribir **DEBEN** cancelar la petición anterior con `AbortController` y aplicar *debounce* de 300 ms (handoff 09). |
| JS-17 | Un error de red o de servidor **NO DEBE** borrar lo que el usuario digitó (RNF-023). El formulario conserva sus valores y se ofrece reintentar. |
| JS-18 | Los bloques `catch` **NO DEBEN** estar vacíos ni silenciar errores. Se manejan, se transforman en un error con `cause` o se relanzan. |
| JS-19 | El frontend **NO DEBE** contener credenciales, claves de API, secretos ni tokens: Gemini, correo y MongoDB se usan solo desde el servidor (RNF-010). La sesión viaja en una cookie `HttpOnly` que JavaScript no lee. `localStorage` y `sessionStorage` solo guardan preferencias no sensibles (idioma antes de iniciar sesión, PV-20). |
| JS-20 | Los textos visibles **NO DEBEN** escribirse literalmente en JavaScript; se obtienen con `t(key, params)` ([20](20-INTERNATIONALIZATION.md)). |
| JS-21 | Los módulos de `shared/` **DEBEN** ser deterministas y puros: reciben valores, devuelven valores, no leen el reloj sin recibirlo por parámetro y no acceden a DOM, red ni almacenamiento. |
| JS-22 | Las validaciones de `shared/` **DEBEN** devolver `null` si el valor es válido o un objeto `{ code, params }` con un código estable en `snake_case`, igual al que devuelve la API ([10](10-REST-API.md)); nunca un mensaje en español. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| JS-23 | Los listados **DEBERÍAN** renderizarse clonando un `<template>` y agregando las filas a un `DocumentFragment`, reemplazando el contenido con `replaceChildren`. |
| JS-24 | La visibilidad **DEBERÍA** controlarse con el atributo `hidden` y los estados con atributos ARIA (`aria-busy`, `aria-invalid`, `aria-expanded`) antes que con clases nuevas. |
| JS-25 | Los objetos de configuración y constantes de dominio **DEBERÍAN** congelarse con `Object.freeze`. |
| JS-26 | Las funciones con más de tres parámetros opcionales **DEBERÍAN** recibir un objeto con desestructuración y valores por defecto. |
| JS-27 | **DEBERÍA** preferirse `??` frente a `||` para valores por defecto (`0` y `''` son valores válidos), y `?.` para accesos opcionales. |
| JS-28 | Los números de formularios **DEBERÍAN** convertirse con `Number(value)` y validarse con `Number.isInteger`; nunca con `parseInt` sin base. |
| JS-29 | Las peticiones a servicios lentos (Gemini) **DEBERÍAN** tener un tiempo límite con `AbortSignal.timeout(ms)` y mostrar indicador de progreso si superan 1 s (RNF-020). |
| JS-30 | Las clases de error propias **DEBERÍAN** extender `Error`, definir `name` y aceptar `{ cause }`. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| JS-31 | **PUEDE** usarse `await` de nivel superior en los archivos `*.page.js` y en `backend/src/server.js`. |
| JS-32 | **PUEDE** usarse `structuredClone` para copiar estado antes de modificarlo. |
| JS-33 | **PUEDEN** usarse campos privados de clase (`#field`) cuando una clase lo justifique; la preferencia general es funciones y objetos simples. |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase`, inglés | `courseList`, `loadCourses()` |
| Funciones | Verbo + objeto | `renderCourseRows`, `validatePowerCampusName` |
| Manejadores de eventos | `handle` + evento | `handleSubmit`, `handleRowClick` |
| Booleanos | Prefijo `is`, `has`, `can`, `should` | `isLoading`, `hasCertification`, `canApprove` |
| Clases | `PascalCase` | `ApiError`, `NetworkError` |
| Constantes de módulo inmutables | `UPPER_SNAKE_CASE` | `COURSE_STATUS`, `TEXT_LIMITS`, `SEARCH_DEBOUNCE_MS` |
| Elementos del DOM | Sustantivo del elemento, sin prefijos húngaros | `submitButton`, `filtersForm` (no `$btn`, `elForm`) |
| Atributos de enganche | `data-` en kebab-case | `data-action="deactivate"`, `data-course-id` |
| Archivos | kebab-case con sufijo de rol | `courses.api.js`, `course-list.page.js` |
| Códigos de error | `snake_case` estable | `max_length`, `invalid_transition` |

Los términos de dominio (`course`, `degreeProgram`, `in_development`…) se toman del [Glosario de dominio](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio).

## 6. Ejemplos

### 6.1 Cliente HTTP del frontend

```js
// frontend/js/core/api-client.js
const API_BASE = '/api/v1';

export class ApiError extends Error {
  constructor(status, problem) {
    super(problem?.detail ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = problem?.code ?? 'unknown_error';
    this.errors = problem?.errors ?? [];
  }
}

export class NetworkError extends Error {
  constructor(options) {
    super('Network request failed', options);
    this.name = 'NetworkError';
  }
}

/**
 * Ejecuta una petición JSON contra la API del mismo origen.
 * @param {string} path Ruta relativa a /api/v1 (por ejemplo, '/courses?page=1').
 * @param {{ method?: string, body?: unknown, signal?: AbortSignal }} [options]
 * @returns {Promise<any>} Cuerpo JSON de la respuesta, o null si es 204.
 */
export async function request(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error; // cancelación intencional: no es un fallo
    throw new NetworkError({ cause: error });
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new ApiError(response.status, problem);
  }
  return response.status === 204 ? null : response.json();
}
```

La cookie de sesión se envía automáticamente porque la API es del mismo origen (`credentials: 'same-origin'` es el valor por defecto de `fetch`).

### 6.2 Página con búsqueda, cancelación y estados

```js
// frontend/js/pages/course-list.page.js — C-01 / C-02
import { listCourses } from '../features/courses/courses.api.js';
import { renderCourseRows, showListState } from '../features/courses/courses.view.js';
import { debounce } from '../core/dom.js';
import { requireSession, handleApiError } from '../core/session.js';

const SEARCH_DEBOUNCE_MS = 300;
const filtersForm = document.querySelector('[data-course-filters]');
let currentRequest;

async function loadCourses() {
  currentRequest?.abort();
  currentRequest = new AbortController();
  showListState('loading');
  try {
    const filters = Object.fromEntries(new FormData(filtersForm));
    const { data, meta } = await listCourses(filters, { signal: currentRequest.signal });
    if (data.length === 0) {
      showListState('empty');
      return;
    }
    renderCourseRows(data, meta);
    showListState('ready');
  } catch (error) {
    if (error.name === 'AbortError') return; // la reemplazó una búsqueda más reciente
    showListState('error'); // los filtros del formulario se conservan (C-04)
    handleApiError(error);
  }
}

filtersForm.addEventListener('input', debounce(loadCourses, SEARCH_DEBOUNCE_MS));
filtersForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loadCourses();
});

await requireSession();
await loadCourses();
```

### 6.3 Vista con plantilla y delegación

```js
// frontend/js/features/courses/courses.view.js
import { t } from '../../core/i18n.js';

const tableBody = document.querySelector('[data-course-rows]');
const rowTemplate = document.querySelector('template[data-template="course-row"]');

export function renderCourseRows(courses) {
  const fragment = document.createDocumentFragment();
  for (const course of courses) {
    const row = rowTemplate.content.cloneNode(true);
    row.querySelector('[data-field="code"]').textContent = course.code ?? t('courses.list.codePending');
    row.querySelector('[data-field="name"]').textContent = course.name;
    row.querySelector('[data-action="open"]').dataset.courseId = course.id;
    fragment.append(row);
  }
  tableBody.replaceChildren(fragment);
}

export function onRowAction(handler) {
  tableBody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (button) handler(button.dataset.action, button.dataset.courseId);
  });
}
```

### 6.4 Regla compartida

```js
// shared/validation/rules.js — se usa en navegador y servidor
export function maxLength(value, max) {
  const actual = Array.from(value ?? '').length; // cuenta caracteres Unicode, no unidades UTF-16
  return actual > max ? { code: 'max_length', params: { max, actual } } : null;
}

export function integerInRange(value, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number)) return { code: 'not_integer', params: {} };
  return number < min || number > max ? { code: 'out_of_range', params: { min, max } } : null;
}
```

```js
// shared/domain/constants.js
export const COURSE_STATUS = Object.freeze({
  DRAFT: 'draft',
  IN_DEVELOPMENT: 'in_development',
  APPROVED: 'approved',
  IN_PRODUCTION: 'in_production',
  INACTIVE: 'inactive',
});

export const TEXT_LIMITS = Object.freeze({
  powerCampusName: 40, // RN-17
  shortDescription: 250, // RN-18
  metaDescription: 155, // RN-19
});
```

### 6.5 Incorrecto

```js
// ❌ Global, var, HTML con datos del usuario, fetch dentro de la vista, sin manejo de errores
var cursos = [];
window.cursos = cursos;

function pintar() {
  fetch('/api/v1/courses').then((r) => r.json()).then((json) => {
    document.getElementById('tabla').innerHTML = json.data
      .map((c) => `<tr onclick="abrir('${c.id}')"><td>${c.name}</td></tr>`)
      .join('');
  });
}
```

Problemas: JS-01, JS-05, JS-08, JS-09 (XSS si `name` contiene HTML), JS-10, JS-13, JS-14 y JS-15 (no verifica `response.ok` ni maneja red caída).

```js
// ❌ Secreto en el navegador (RNF-010)
const GEMINI_API_KEY = 'AIza…';
```

```js
// ❌ catch que silencia y pierde lo digitado
try {
  await saveDraft(form);
} catch {
  form.reset();
}
```

## 7. Aplicación en el sistema CENFOTEC

| Caso | Aplicación |
|---|---|
| Formulario de curso (F-01 a F-13) | `course-form.page.js` mantiene el estado de validación como lista de `{ field, code, params }`; al cambiar de idioma se vuelven a traducir sin perder valores (RF-044 CA2). Guardar borrador valida formatos y límites con `shared/`; "Listo para enviar" valida todo y mueve el foco al primer error (RF-030 CA2). |
| Contadores de caracteres (RF-022) | Usan `maxLength` de `shared/` y `Array.from(value).length`; no se usa el atributo `maxlength` porque la ERS exige mostrar el exceso sin recortar (RF-022 CA2). |
| Total de horas (RN-16) | Función pura `calculateTotalHours(classHours, extraClassHours)` en `shared/`; la vista la muestra en un campo de solo lectura. |
| Gemini (RF-028, RF-029) | `course-ai.view.js` muestra el indicador si la respuesta tarda más de 1 s, usa `AbortSignal.timeout` y, ante error, conserva el texto original (RNF-023). La propuesta se inserta con `textContent`/`value`, nunca como HTML. |
| Búsqueda (RF-007, RF-016, RF-041) | `debounce` de 300 ms + `AbortController`; la normalización sin tildes y sin mayúsculas la hace el servidor ([11](11-MONGODB.md)). |
| Sesión y permisos | `core/session.js` consulta `GET /api/v1/auth/me` al cargar cada página: sin sesión redirige al inicio de sesión; con 403 redirige a acceso denegado (A-06). Ocultar acciones según el rol es solo experiencia de usuario ([13](13-AUTHENTICATION-AUTHORIZATION.md)). |
| Errores de la API | `handleApiError` traduce `error.code` con i18n; los errores de campo (`error.errors`) se muestran junto a cada campo (RNF-029). |
| Iteración 1 | El código heredado (`legacy/iteracion-1:js/validacion.js`) devuelve mensajes en español y usa CommonJS en pruebas; se reutiliza su lógica, no su forma (JS-02, JS-22). |

## 8. Errores frecuentes

- Olvidar la extensión `.js` en un import relativo: funciona en algunas herramientas pero falla en el navegador.
- Tratar `fetch` como si rechazara en 404 o 500; solo rechaza por fallo de red.
- Mostrar un error genérico cuando la petición fue cancelada por una búsqueda más reciente (`AbortError`).
- Reconstruir todo el formulario al cambiar de idioma y perder lo digitado.
- Seleccionar elementos por clases de Bootstrap (`.btn-primary`) que cambian por diseño.
- Usar `||` para valores numéricos opcionales y convertir un `0` válido (horas extra clase) en el valor por defecto.
- Guardar el rol del usuario en `localStorage` y usarlo para decidir qué puede hacer.
- Duplicar en la página una validación que ya existe en `shared/`.

## 9. Checklist

- [ ] No hay `var`, `require`, `module.exports` ni globales nuevas.
- [ ] Todos los imports relativos terminan en `.js` y usan exportaciones nombradas.
- [ ] Ninguna vista llama a `fetch`; ningún `*.api.js` toca el DOM.
- [ ] No hay `innerHTML`, `insertAdjacentHTML` ni manejadores en atributos HTML.
- [ ] Cada llamada de red muestra carga, vacío, error y éxito, y deshabilita el disparador mientras carga.
- [ ] Se verifica `response.ok` (vía `api-client.js`) y se distingue red, HTTP y cancelación.
- [ ] Las búsquedas usan *debounce* de 300 ms y cancelan la petición anterior.
- [ ] Un error no borra datos digitados.
- [ ] No hay secretos ni tokens en el código del navegador.
- [ ] Los textos visibles salen de `t()`.
- [ ] Las reglas nuevas de validación viven en `shared/` y devuelven `{ code, params }`.
- [ ] `npm run lint` no reporta errores.

## 10. Referencias

- ECMAScript Language Specification: https://tc39.es/ecma262/
- MDN — JavaScript modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- MDN — Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN — AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- MDN — `<template>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
- HTML Living Standard — Event handlers y DOM: https://html.spec.whatwg.org/
- ESLint — Configuration files: https://eslint.org/docs/latest/use/configure/configuration-files
- OWASP — DOM based XSS Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
