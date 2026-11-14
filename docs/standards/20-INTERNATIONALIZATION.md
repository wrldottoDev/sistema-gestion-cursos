# 20 · Internacionalización

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo la interfaz se ofrece en español e inglés (RF-044) y cómo se formatean fechas, números y plurales según el idioma activo. Cubre diccionarios, claves, atributos `data-i18n`, la función `t()`, persistencia de la preferencia, mensajes de error de la API, correos, notificaciones de escritorio y la prueba automática de traducciones.

Estado: **no implementado**. `frontend/index.html` tiene `lang="en"` con contenido en español y textos fijos en el HTML (deuda D2). Todo lo descrito aquí es **Adoptado**, salvo la persistencia de la preferencia (PV-20).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Idiomas | Español (`es`, predeterminado) e inglés (`en`) | Confirmado (ERS RF-044, RNF-038) |
| Etiquetas de idioma | BCP 47: `es` y `en` para diccionarios y atributo `lang`; `es-CR` y `en-US` para `Intl` | Adoptado |
| Diccionarios | JSON plano por idioma en `frontend/i18n/es.json` y `frontend/i18n/en.json` | Adoptado |
| API de traducción | `t(key, params)` y `tPlural(key, count, params)` en `frontend/js/core/i18n.js`, sin librerías | Adoptado |
| Formato | `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.PluralRules`, `Intl.Collator`; zona horaria `America/Costa_Rica` | Adoptado |
| Errores de la API | El servidor envía códigos estables; el frontend los traduce | Adoptado ([10](10-REST-API.md)) |
| Preferencia | `localStorage` antes de iniciar sesión; `users.preferredLanguage` después | Pendiente de validación (PV-20) |

## 3. Justificación

- La ERS exige interfaz completa en ambos idiomas (OBJ-06, RNF-038), cambio sin perder lo digitado (RF-044 CA2), preferencia recordada (CA3), datos de usuario sin traducir (CA4), mensajes de validación en el idioma activo (RNF-040) y soporte Unicode (RNF-039).
- Dos idiomas y un diccionario plano no justifican una librería: `Intl` es nativo en todos los navegadores objetivo y en Node.js.
- Que el servidor devuelva códigos y no textos mantiene una sola fuente de traducciones (el frontend) y permite volver a traducir un error ya mostrado al cambiar de idioma.
- Claves planas con puntos se buscan con `grep` exacto y se comparan fácilmente entre idiomas en una prueba.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| I18N-01 | Todo texto visible de la interfaz (etiquetas, botones, menús, títulos, mensajes, `placeholder`, `aria-label`, `alt`, `title`, `<title>` del documento) **DEBE** salir de los diccionarios. No hay textos literales en JavaScript. |
| I18N-02 | `es.json` y `en.json` **DEBEN** tener exactamente las mismas claves, ninguna vacía y los mismos marcadores `{param}` por clave. Lo verifica la prueba de [§6.6](#66-prueba-de-traducciones). |
| I18N-03 | `es.json` es la fuente de verdad. Un texto en español escrito en el HTML es solo el contenido inicial y se reemplaza al cargar. |
| I18N-04 | Sin preferencia guardada, la interfaz **DEBE** mostrarse en español (RF-044 CA1), aunque el navegador esté en inglés. |
| I18N-05 | Cambiar de idioma **NO DEBE** recargar la página ni perder datos digitados (RF-044 CA2): solo se vuelven a aplicar las traducciones y se re-renderizan los mensajes dinámicos desde su estado (códigos de error, datos en memoria). |
| I18N-06 | Al cambiar de idioma **DEBE** actualizarse `<html lang>` (`es` o `en`) para lectores de pantalla y separación silábica (WCAG 3.1.1). |
| I18N-07 | Los datos ingresados por usuarios (nombres y descripciones de cursos, elementos de catálogos administrables) **NO DEBEN** traducirse (RF-044 CA4). Los valores de dominio fijos (estados, roles, modalidades, niveles, monedas, "No tiene") **SÍ** se traducen por su valor almacenado. |
| I18N-08 | Los errores de la API **DEBEN** mostrarse traduciendo `code` y `errors[].code` con sus `params`; nunca se muestra `detail` del servidor. |
| I18N-09 | Las oraciones **NO DEBEN** armarse concatenando fragmentos traducidos; se usa una sola clave con marcadores (`{count}`, `{max}`). |
| I18N-10 | Los textos que dependen de una cantidad **DEBEN** usar `tPlural` con `Intl.PluralRules`. |
| I18N-11 | Fechas y números visibles **DEBEN** formatearse con `Intl` y el locale activo (`es-CR` o `en-US`); las fechas con la zona `America/Costa_Rica`. Nunca se arma una fecha concatenando día, mes y año. |
| I18N-12 | Todo el sistema **DEBE** usar UTF-8: `<meta charset="utf-8">`, JSON, base de datos, correos y CSV (RNF-039, RF-017 CA1). |
| I18N-13 | Los correos **DEBEN** generarse en el idioma preferido del destinatario (`preferredLanguage`, por defecto `es`), con plantillas por idioma en `backend/src/modules/notifications/` y valores interpolados escapados para HTML ([12](12-SECURITY.md)). |
| I18N-14 | Toda clave nueva **DEBE** agregarse en ambos idiomas en el mismo PR que la usa. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| I18N-15 | Los diseños **DEBERÍAN** tolerar textos 30 % más largos (el español suele ser más largo que el inglés): sin anchos fijos en botones ni truncamiento de etiquetas. Se revisan ambos idiomas a 360 px ([15](15-RESPONSIVE-DESIGN.md)). |
| I18N-16 | El selector de idioma **DEBERÍA** mostrar cada idioma en su propio idioma ("Español", "English") con su atributo `lang` (WCAG 3.1.2). |
| I18N-17 | Las mayúsculas decorativas (Label/Overline del Design System) **DEBERÍAN** aplicarse con CSS `text-transform`, no escribiendo el texto en mayúsculas en el diccionario. |
| I18N-18 | Los ordenamientos hechos en el navegador **DEBERÍAN** usar `Intl.Collator(locale, { sensitivity: 'base' })`; la búsqueda sin tildes la resuelve el servidor ([11](11-MONGODB.md)). |
| I18N-19 | Las sugerencias de Gemini **DEBERÍAN** pedirse en el idioma de los datos del curso (español por defecto), no en el idioma de la interfaz, porque son datos de usuario (RF-044 CA4). |
| I18N-20 | El procesamiento de CSV **DEBERÍA** aceptar UTF-8 con o sin BOM (Excel lo agrega). |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| I18N-21 | En desarrollo, una clave inexistente **PUEDE** mostrarse como la propia clave para detectarla visualmente; la prueba de [§6.6](#66-prueba-de-traducciones) evita que llegue a la entrega. |
| I18N-22 | **PUEDE** precargarse el diccionario del idioma activo con `<link rel="preload" as="fetch" crossorigin>` si la carga inicial lo requiere (RNF-017). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clave | `<module>.<view-o-componente>.<elemento>[.<estado>]`, segmentos en `camelCase` | `courses.form.powerCampusName.label` |
| Textos compartidos | Prefijo `common.` | `common.actions.save`, `common.states.loading` |
| Valores de dominio | `domain.<enumerado>.<valor almacenado>` (el último segmento es el valor tal cual) | `domain.courseStatus.in_development`, `domain.role.school_director` |
| Errores de campo | `errors.field.<code>` | `errors.field.max_length` |
| Errores de la API | `errors.api.<code>` | `errors.api.catalog_item_in_use` |
| Plurales | `<clave>.one`, `<clave>.other` (y `.many` si se necesita) | `courses.list.count.one` |
| Marcadores | `{camelCase}` | `"Máximo {max} caracteres (lleva {actual})"` |
| Atributos HTML | `data-i18n` (texto), `data-i18n-placeholder`, `data-i18n-aria-label`, `data-i18n-alt`, `data-i18n-title` | `<button data-i18n="common.actions.save">` |
| Clave de `localStorage` | `sgc.language` | — |

## 6. Ejemplos

### 6.1 Diccionarios

`frontend/i18n/es.json` (extracto; claves ordenadas alfabéticamente):

```json
{
  "common.actions.save": "Guardar",
  "common.states.loading": "Cargando…",
  "courses.form.powerCampusName.label": "Nombre en Power Campus",
  "courses.form.saveDraft": "Guardar borrador",
  "courses.form.submit": "Listo para enviar",
  "courses.list.codePending": "Código pendiente",
  "courses.list.count.one": "{count} curso",
  "courses.list.count.other": "{count} cursos",
  "courses.list.empty": "No hay cursos que coincidan",
  "domain.courseStatus.draft": "Borrador",
  "domain.courseStatus.in_development": "En desarrollo",
  "errors.api.account_not_authorized": "Su cuenta no está autorizada",
  "errors.api.invalid_credentials": "Correo o contraseña incorrectos",
  "errors.field.max_length": "Máximo {max} caracteres (lleva {actual})",
  "errors.field.required": "Este campo es obligatorio"
}
```

`frontend/i18n/en.json` (mismas claves):

```json
{
  "common.actions.save": "Save",
  "common.states.loading": "Loading…",
  "courses.form.powerCampusName.label": "Power Campus name",
  "courses.form.saveDraft": "Save draft",
  "courses.form.submit": "Ready to submit",
  "courses.list.codePending": "Code pending",
  "courses.list.count.one": "{count} course",
  "courses.list.count.other": "{count} courses",
  "courses.list.empty": "No courses match",
  "domain.courseStatus.draft": "Draft",
  "domain.courseStatus.in_development": "In development",
  "errors.api.account_not_authorized": "Your account is not authorized",
  "errors.api.invalid_credentials": "Incorrect email or password",
  "errors.field.max_length": "Maximum {max} characters ({actual} entered)",
  "errors.field.required": "This field is required"
}
```

Los mensajes de RF-001 CA2, RF-002 CA2 y RF-022 CA2 se copian literalmente de la ERS en `es.json`.

### 6.2 Módulo de traducción

```js
// frontend/js/core/i18n.js
const SUPPORTED_LANGUAGES = ['es', 'en'];
const DEFAULT_LANGUAGE = 'es'; // RF-044 CA1
const LOCALES = Object.freeze({ es: 'es-CR', en: 'en-US' });
const TIME_ZONE = 'America/Costa_Rica';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'aria-label', 'alt', 'title'];

let language = DEFAULT_LANGUAGE;
let dictionary = {};

export function getLanguage() {
  return language;
}

export async function setLanguage(requested) {
  const next = SUPPORTED_LANGUAGES.includes(requested) ? requested : DEFAULT_LANGUAGE;
  const response = await fetch(`/i18n/${next}.json`);
  if (!response.ok) throw new Error(`Dictionary not available: ${next}`);
  dictionary = await response.json();
  language = next;
  document.documentElement.lang = next;
  applyTranslations(document);
}

export function t(key, params = {}) {
  const template = dictionary[key] ?? key; // I18N-21
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

export function tPlural(key, count, params = {}) {
  const category = new Intl.PluralRules(LOCALES[language]).select(count);
  const pluralKey = `${key}.${category}` in dictionary ? `${key}.${category}` : `${key}.other`;
  return t(pluralKey, { ...params, count: formatNumber(count) });
}

export function applyTranslations(root) {
  for (const element of root.querySelectorAll('[data-i18n]')) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const attribute of TRANSLATABLE_ATTRIBUTES) {
    for (const element of root.querySelectorAll(`[data-i18n-${attribute}]`)) {
      element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    }
  }
}

export function formatDateTime(value, options = { dateStyle: 'medium', timeStyle: 'short' }) {
  return new Intl.DateTimeFormat(LOCALES[language], { ...options, timeZone: TIME_ZONE }).format(new Date(value));
}

export function formatNumber(value) {
  return new Intl.NumberFormat(LOCALES[language]).format(value);
}
```

`Intl.PluralRules` puede devolver `many` para el español en algunos números grandes según CLDR; si la clave `.many` no existe se usa `.other`.

### 6.3 HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title data-i18n="courses.list.pageTitle">Cursos · SGC CENFOTEC</title>
  </head>
  <body>
    <label for="course-search" data-i18n="courses.filters.search.label">Buscar curso</label>
    <input id="course-search" name="q" type="search" data-i18n-placeholder="courses.filters.search.placeholder" />
    <button type="button" data-action="close" data-i18n-aria-label="common.actions.close">×</button>

    <label for="language" data-i18n="common.language.label">Idioma</label>
    <select id="language" data-language-switch>
      <option value="es" lang="es">Español</option>
      <option value="en" lang="en">English</option>
    </select>
  </body>
</html>
```

### 6.4 Errores traducidos sin perder lo digitado

```js
// El estado de validación guarda códigos, no textos: se puede volver a traducir al cambiar de idioma.
let fieldErrors = []; // [{ field: 'powerCampusName', code: 'max_length', params: { max: 40, actual: 47 } }]

function renderFieldErrors() {
  for (const { field, code, params } of fieldErrors) {
    document.querySelector(`[data-error-for="${field}"]`).textContent = t(`errors.field.${code}`, params);
  }
}

document.querySelector('[data-language-switch]').addEventListener('change', async (event) => {
  await setLanguage(event.target.value); // no toca los valores de los campos
  renderFieldErrors();
  await savePreferredLanguage(event.target.value); // PV-20: localStorage o PATCH /api/v1/me/preferences
});
```

### 6.5 Valores de dominio en ambos idiomas

| Valor almacenado | Español (`es.json`) | Inglés (`en.json`) |
|---|---|---|
| `domain.courseStatus.draft` | Borrador | Draft |
| `domain.courseStatus.in_development` | En desarrollo | In development |
| `domain.courseStatus.approved` | Aprobado | Approved |
| `domain.courseStatus.in_production` | En producción | In production |
| `domain.courseStatus.inactive` | Inactivo | Inactive |
| `domain.role.admin` | Administrador | Administrator |
| `domain.role.curriculum_development` | Desarrollo Curricular | Curriculum Development |
| `domain.role.school_director` | Director de Escuela | School Director |
| `domain.role.rector` | Rectoría | Rector's Office |
| `domain.role.vice_rector` | Vicerrectoría | Vice-Rector's Office |
| `domain.modality.in_person` | Presencial | In person |
| `domain.modality.online_synchronous` | Virtual sincrónica | Online (synchronous) |
| `domain.modality.online_asynchronous` | Virtual asincrónica | Online (asynchronous) |
| `domain.modality.hybrid` | Híbrida | Hybrid |
| `domain.complexityLevel.basic` … `variable` | Básico, Intermedio, Avanzado, Certificación, Nivel variable | Basic, Intermediate, Advanced, Certification, Variable level |
| `domain.currency.CRC` / `USD` | Colones / Dólares | Costa Rican colones / US dollars |
| `domain.certification.none` | No tiene | None |

Las traducciones al inglés de esta tabla son **Adoptadas** por el equipo; cualquier cambio se coordina con la pantalla N-05 (interfaz en inglés) del handoff.

### 6.6 Prueba de traducciones

```js
// backend/test/unit/i18n-dictionaries.test.js — se ejecuta con npm test (16-TESTING)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = async (language) =>
  JSON.parse(await readFile(new URL(`../../../frontend/i18n/${language}.json`, import.meta.url), 'utf8'));
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map(([, name]) => name).sort();

test('es y en tienen las mismas claves, sin valores vacíos y con los mismos marcadores', async () => {
  const [es, en] = await Promise.all([load('es'), load('en')]);
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  for (const [key, text] of Object.entries(es)) {
    assert.ok(text.trim() && en[key].trim(), `Traducción vacía: ${key}`);
    assert.deepEqual(placeholders(en[key]), placeholders(text), `Marcadores distintos: ${key}`);
  }
});
```

Una segunda prueba recomendada recorre `frontend/` con `readdir(dir, { recursive: true })`, extrae las claves de `data-i18n*="…"` y de llamadas `t('…')` con literal, y verifica que existan en `es.json`.

### 6.7 Incorrecto

```js
// ❌ Texto literal, concatenación y fecha armada a mano
button.textContent = 'Guardar';
message.textContent = 'Se encontraron ' + total + ' cursos';
dateCell.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

// ❌ Traducir datos del usuario o mostrar el texto del servidor
nameCell.textContent = t(course.name);
errorBox.textContent = problem.detail;

// ❌ Cambiar idioma recargando la página: se pierde lo digitado (RF-044 CA2)
location.reload();
```

## 7. Aplicación en el sistema CENFOTEC

| Caso | Aplicación |
|---|---|
| Inicio de sesión (A-01 a A-05) | La página carga el idioma de `localStorage` (`sgc.language`) o español; corrige `lang="en"` actual. |
| Después de iniciar sesión | `GET /api/v1/auth/me` devuelve `preferredLanguage`; si difiere del activo, se aplica (PV-20). El selector del menú de usuario (N-06) llama a `PATCH /api/v1/me/preferences`. |
| Formulario de curso (F-01 a F-13) | Etiquetas, ayudas, contadores ("N/40") y mensajes salen de `t()`; al cambiar de idioma se conservan valores y errores (RF-044 CA2). |
| Listados y tablas | Estados con `domain.courseStatus.*` (texto + icono, nunca solo color); fechas con `formatDateTime`; totales con `tPlural`. |
| Reportes (RF-042, RF-043) | Números con `formatNumber`; nombres de meses con `Intl.DateTimeFormat(locale, { month: 'long' })`. |
| Correos (RF-036, RF-038) | Plantillas `course-submitted` y `course-approved` en `es` y `en`, según el destinatario; asuntos formales e identidad institucional (N-03, N-04). |
| Notificación de escritorio (RF-037) | El servidor envía `{ courseId, code, name }`; el navegador arma el texto con `t()` en el idioma activo. |
| Catálogos | Nombres de escuelas, temáticas, etc. se muestran como fueron registrados; solo los catálogos fijos se traducen. |

## 8. Errores frecuentes

- Olvidar `aria-label`, `alt` o `placeholder`: la interfaz "parece" traducida pero el lector de pantalla sigue en el otro idioma.
- Guardar en el estado el mensaje traducido en vez del código, y que al cambiar de idioma los errores queden en el idioma anterior.
- Agregar una clave solo en `es.json`.
- Usar `toLocaleDateString()` sin locale ni zona horaria: depende de la configuración del equipo del usuario.
- Mostrar la etiqueta "Virtual en vivo" u otros valores de la ERS v1.0 (contradicción X-03 del handoff).
- Traducir con `Accept-Language` del navegador e ignorar RF-044 CA1 (español por defecto).

## 9. Checklist

- [ ] No hay textos visibles literales en JavaScript; el HTML usa `data-i18n*` en todo texto, incluido `<title>`.
- [ ] Las claves nuevas existen en `es.json` y `en.json` con los mismos marcadores.
- [ ] `npm test` pasa la prueba de diccionarios.
- [ ] Cambiar de idioma actualiza `<html lang>`, no recarga y conserva lo digitado y los errores.
- [ ] Los valores de dominio se traducen por su valor almacenado; los datos de usuario no.
- [ ] Fechas, números y plurales usan `Intl` con `es-CR`/`en-US` y `America/Costa_Rica`.
- [ ] Los errores de la API se muestran desde `code`, nunca desde `detail`.
- [ ] La vista se revisó en ambos idiomas a 360, 768 y 1440 px.

## 10. Referencias

- BCP 47 — Tags for Identifying Languages: https://www.rfc-editor.org/info/bcp47
- MDN — `Intl`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- MDN — `Intl.PluralRules`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
- Unicode CLDR — Plural rules: https://cldr.unicode.org/index/cldr-spec/plural-rules
- WCAG 2.2 — 3.1.1 Language of Page y 3.1.2 Language of Parts: https://www.w3.org/TR/WCAG22/
- HTML Living Standard — atributo `lang`: https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes
- W3C Internationalization — Language tags in HTML: https://www.w3.org/International/articles/language-tags/
