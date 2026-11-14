# 16 · Pruebas

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define la estrategia de verificación del sistema: tipos de prueba, herramientas, ubicación y nombres de archivos, datos de prueba, cobertura mínima, pruebas negativas, de seguridad, rendimiento, accesibilidad y compatibilidad, y la ejecución de los casos de aceptación CP-RF/CP-RNF de la ERS. Aplica a `shared/`, `backend/`, `frontend/` y `e2e/`.

Estado actual: **no existe ninguna prueba en la rama `redesign/iteracion-2`** (auditoría del 14 nov 2026). La Iteración 1 tenía `tests/validacion.test.js` con `node:assert` en la rama `legacy/iteracion-1`; sus casos de límites son la base de las pruebas unitarias de `shared/`.

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Ejecutor y aserciones | `node:test` + `node:assert/strict` (sin Jest, Mocha ni Chai) | Adoptado ([ADR-0008](../adr/0008-node-test-runner.md)) |
| Pruebas HTTP de integración | `fetch` nativo contra la app escuchando en un puerto efímero (sin `supertest`) | Adoptado |
| Base de datos de prueba | MongoDB dedicada cuyo nombre termina en `_test` (contenedor `mongo:8` en CI; Docker local o base Atlas separada) | Adoptado |
| Cobertura | `node --test --experimental-test-coverage` | Adoptado |
| E2E, compatibilidad y accesibilidad automatizada | Playwright (Chromium, Firefox, WebKit) + `@axe-core/playwright` | Recomendado ([PV-21](README.md#7-decisiones-pendientes-de-validación)) |
| Aceptación | Casos CP-RF-xxx y CP-RNF-xxx de la ERS §6, construidos desde los criterios Dado/Cuando/Entonces y ejecutados con evidencia al cierre de la iteración | Confirmado (ERS §7.3) |
| Pruebas automatizadas mínimas | Autenticación local, autorización por rol y escuela, cálculo de horas y validaciones de límites | Confirmado (ERS RNF-047) |

## 3. Justificación

- `node:test` viene con Node.js: cero dependencias, ES Modules sin configuración, ejecución en paralelo, *mocks* y cobertura incluidos. El equipo ya lo usó en la Iteración 1 con `node:assert`.
- La pirámide de pruebas (muchas unitarias, menos de integración, pocas E2E) da retroalimentación rápida y localiza los fallos: las reglas de negocio se prueban sin red ni base de datos; la integración prueba la composición real (rutas, middlewares, MongoDB); E2E solo los flujos críticos.
- La ERS fija métricas verificables (RNF-016 a RNF-020, RNF-032 a RNF-044) que solo se demuestran con pruebas y evidencia; sin ellas no se puede afirmar su cumplimiento.
- Un fallo de autorización es el defecto más grave posible en este sistema (OBJ-03); por eso las pruebas negativas por rol son obligatorias y no opcionales.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla | Origen |
|---|---|---|
| TEST-01 | Toda regla de `shared/validation` y toda regla de negocio de los servicios **DEBE** tener pruebas unitarias con casos positivos, negativos y **de límite** (valor exacto del límite, uno menos y uno más). | RNF-047 |
| TEST-02 | Como mínimo deben existir pruebas automatizadas de: autenticación local (RNF-001 a RNF-006, RNF-011), autorización por rol y escuela (RNF-007, RNF-008), cálculo del total de horas (RN-16) y límites de texto (RN-17 a RN-19). | RNF-047 |
| TEST-03 | Cada celda de la matriz de permisos de [13 §7.1](13-AUTHENTICATION-AUTHORIZATION.md#71-matriz-de-permisos) **DEBE** tener una prueba positiva o negativa, y cada uno de los cinco roles al menos una prueba negativa. RNF-008 se prueba con dos escuelas. | OBJ-03, RNF-007, RNF-008 |
| TEST-04 | Cada endpoint **DEBE** tener pruebas de integración de: camino feliz, sin sesión (401), sin permiso o fuera de alcance (403/404) y datos inválidos (422 con `errors[].field`). | RNF-012 |
| TEST-05 | Las pruebas **NO DEBEN** llamar a servicios externos reales (Google, Gemini, SMTP). Las integraciones se reemplazan con dobles inyectados en `createApp` ([09](09-NODEJS-BACKEND.md)). | Determinismo |
| TEST-06 | Las pruebas **NO DEBEN** ejecutarse contra una base de datos cuyo nombre no termine en `_test`. El arranque de las pruebas de integración lo verifica y aborta si no se cumple. | Protección de datos |
| TEST-07 | Cada prueba **DEBE** ser independiente del orden: crea sus datos y limpia lo que crea (o usa colecciones vaciadas en `beforeEach`). | Fiabilidad |
| TEST-08 | Toda corrección de defecto **DEBE** incluir una prueba que falle sin la corrección. | Regresión |
| TEST-09 | Las pruebas unitarias y de integración **DEBEN** pasar en CI para poder hacer merge ([19](19-CI-CD.md)). Una prueba no se desactiva (`skip`, `todo`) sin un ticket SGC enlazado en el comentario. | ERS §7.3 |
| TEST-10 | Cada RF que se entrega **DEBE** tener su caso de aceptación CP-RF-xxx ejecutado con evidencia (captura o registro de resultados) al cierre de la iteración. | ERS §6, §7.3 |
| TEST-11 | Las pruebas **DEBEN** usar datos ficticios. **NO DEBEN** contener datos personales reales, contraseñas reales ni secretos. | RNF-013 |
| TEST-12 | Los bloques `describe` **DEBEN** citar el requerimiento (`RF-xxx`, `RNF-xxx` o `RN-xx`) y los `it` el criterio cuando aplique (`CA2 …`) para la trazabilidad de [22](22-REQUIREMENTS-TRACEABILITY.md). | Trazabilidad |
| TEST-13 | Las pruebas de seguridad de [§7.4](#74-pruebas-de-seguridad) **DEBEN** existir para cada endpoint que reciba datos o archivos. | RNF-012, [12](12-SECURITY.md) |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| TEST-14 | Las reglas puras de `shared/` **DEBERÍAN** escribirse con TDD (prueba primero), dado que su comportamiento está especificado con precisión en la ERS. |
| TEST-15 | Los flujos críticos **DEBERÍAN** cubrirse con E2E en Playwright: inicio de sesión, creación y envío de curso, revisión y aprobación, consulta con filtros, cambio de idioma ([PV-21](README.md#7-decisiones-pendientes-de-validación)). |
| TEST-16 | Las vistas principales **DEBERÍAN** pasar `axe` sin violaciones de impacto `serious` o `critical` ([14](14-ACCESSIBILITY.md)). |
| TEST-17 | La cobertura **DEBERÍA** ser ≥ 80 % de líneas en `shared/` y en `backend/src/modules/**/*.service.js`. Es un indicador, no un objetivo en sí: no se escriben pruebas sin aserciones para subirla. |
| TEST-18 | Las métricas de rendimiento de [§7.5](#75-rendimiento) **DEBERÍAN** medirse antes de la exposición del 2 de diciembre y repetirse antes de la entrega. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| TEST-19 | Se **PUEDE** usar `toHaveScreenshot` de Playwright para comparar visualmente pantallas clave a 360, 768 y 1440 px ([15](15-RESPONSIVE-DESIGN.md)). |
| TEST-20 | Se **PUEDE** usar `mock.method` y `mock.timers` de `node:test` para controlar fechas (RNF-027) y tiempos de espera (Gemini). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Prueba unitaria | `backend/test/unit/<módulo>/<archivo>.test.js` | `backend/test/unit/shared/course-rules.test.js` |
| Prueba de integración | `backend/test/integration/<módulo>/<recurso>.test.js` | `backend/test/integration/courses/approve.test.js` |
| Soporte (helpers, dobles, datos) | `backend/test/support/*.js` (no termina en `.test.js`) | `backend/test/support/server.js` |
| E2E (Playwright) | `e2e/<flujo>.spec.js` | `e2e/course-submission.spec.js` |
| `describe` | ID del requerimiento + tema, en inglés | `describe('RF-021 academic load', …)` |
| `it` | comportamiento observable en inglés, en tercera persona | `it('rejects credits above 12', …)` |
| Caso de aceptación | ID de la ERS | `CP-RF-030` |

Las pruebas de `shared/` viven en `backend/test/unit/shared/` porque se ejecutan con Node.js. Los archivos de Playwright usan `.spec.js` para no mezclarse con `node --test`.

Scripts previstos en `package.json` (pendiente de crear, ver [18](18-CODE-QUALITY.md)):

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "node --test \"backend/test/unit/**/*.test.js\"",
    "test:integration": "node --env-file-if-exists=.env.test --test --test-concurrency=1 \"backend/test/integration/**/*.test.js\"",
    "test:coverage": "node --test --experimental-test-coverage --test-coverage-lines=80 \"backend/test/unit/**/*.test.js\"",
    "test:e2e": "playwright test"
  }
}
```

Siempre se pasan rutas con patrón: `node --test` sin argumentos ejecuta también cualquier archivo `.js` dentro de carpetas llamadas `test/`, incluidos los de `support/`. La opción `--test-coverage-lines` requiere Node.js ≥ 22.8.

## 6. Ejemplos

### 6.1 Prueba unitaria de reglas compartidas

```js
// backend/test/unit/shared/course-rules.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateCredits, totalHours, validateMaxLength } from '../../../../shared/validation/course-rules.js';
import { validatePassword } from '../../../../shared/validation/user-rules.js';

// Código y params según el catálogo de 10-REST-API.md: { code: 'password_policy', params: { rule } }.
const ruleOf = (value) => validatePassword(value)?.params.rule;

describe('RNF-001..004 password policy', () => {
  it('rejects 7 and 16 characters', () => {
    assert.equal(ruleOf('Abcdef1'), 'length');
    assert.equal(ruleOf('Abcdefghijklmn12'), 'length');
  });

  it('accepts 8 and 15 characters with upper, lower and digit', () => {
    assert.equal(validatePassword('Abcdefg1'), null);
    assert.equal(validatePassword('Abcdefghijklm12'), null);
  });

  it('rejects a password without uppercase, lowercase or digit', () => {
    assert.equal(ruleOf('abcdefg1'), 'uppercase');
    assert.equal(ruleOf('ABCDEFG1'), 'lowercase');
    assert.equal(ruleOf('Abcdefgh'), 'digit');
  });
});

describe('RF-021 academic load', () => {
  it('accepts credits 1 and 12 and rejects 0 and 13', () => {
    assert.equal(validateCredits(1), null);
    assert.equal(validateCredits(12), null);
    assert.equal(validateCredits(0).code, 'out_of_range');
    assert.equal(validateCredits(13).code, 'out_of_range');
  });

  it('CA3 computes total hours as class hours plus extra class hours', () => {
    assert.equal(totalHours(300, 0), 300);
    assert.equal(totalHours(30, 15), 45);
  });
});

describe('RF-022 limited texts', () => {
  it('CA2 rejects 41 characters for Power Campus name without trimming', () => {
    assert.equal(validateMaxLength('x'.repeat(40), 40), null);
    assert.deepEqual(validateMaxLength('x'.repeat(41), 40), { code: 'max_length', params: { max: 40, actual: 41 } });
  });
});
```

El contrato de los validadores (`null` si es válido, `{ code, params }` si no) lo define [08](08-JAVASCRIPT.md); el ejemplo lo asume.

### 6.2 Servidor de prueba y protección de la base de datos

```js
// backend/test/support/server.js
import { once } from 'node:events';
import { createApp } from '../../src/app.js';
import { env } from '../../src/config/env.js';

if (!env.MONGODB_DB_NAME.endsWith('_test')) {
  throw new Error(`Las pruebas solo pueden usar una base *_test (actual: ${env.MONGODB_DB_NAME})`);
}

export async function startTestServer(overrides = {}) {
  const app = await createApp(overrides); // overrides: dobles de integraciones (Gemini, correo, Google)
  const server = app.listen(0);
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  return { baseUrl, close: () => new Promise((resolve) => server.close(resolve)) };
}

/** Inicia sesión local y devuelve la cabecera Cookie para las siguientes peticiones. */
export async function loginAs(baseUrl, { email, password }) {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: baseUrl },
    body: JSON.stringify({ email, password }),
  });
  return response.headers.getSetCookie().map((cookie) => cookie.split(';')[0]).join('; ');
}
```

### 6.3 Prueba de integración con `fetch`

```js
// backend/test/integration/courses/scope.test.js
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, loginAs } from '../../support/server.js';
import { seedTwoSchools } from '../../support/fixtures.js';

describe('RNF-008 school isolation', () => {
  let server;
  let fixtures;

  before(async () => {
    server = await startTestServer();
    fixtures = await seedTwoSchools(); // dos escuelas, un Director y un curso en cada una
  });

  after(() => server.close());

  it('returns 404 when a director reads a course from another school', async () => {
    const cookie = await loginAs(server.baseUrl, fixtures.directorA.credentials);
    const response = await fetch(`${server.baseUrl}/api/v1/courses/${fixtures.courseB.id}`, {
      headers: { Cookie: cookie },
    });
    assert.equal(response.status, 404);
  });

  it('lists only courses of the director school', async () => {
    const cookie = await loginAs(server.baseUrl, fixtures.directorA.credentials);
    const response = await fetch(`${server.baseUrl}/api/v1/courses?schoolId=${fixtures.schoolB.id}`, {
      headers: { Cookie: cookie },
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.ok(body.data.every((course) => course.schoolId === fixtures.schoolA.id));
  });
});
```

### 6.4 Doble de prueba de una integración

```js
// RNF-023: un fallo de Gemini no borra el texto ya digitado.
const failingGemini = { suggest: async () => { throw new Error('timeout'); } };
const server = await startTestServer({ integrations: { gemini: failingGemini } });
// … la petición a /api/v1/ai/suggestions responde 502 o 504 y el curso conserva su longDescription.
```

### 6.5 Incorrecto

```js
// INCORRECTO: depende del orden, usa la base real, sin aserción útil y sin requerimiento.
it('works', async () => {
  await fetch('https://sgc.ejemplo/api/v1/courses'); // servicio real
  assert.ok(true);
});
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Pirámide y responsabilidades

| Nivel | Qué prueba | Herramienta | Dónde | Cuándo corre |
|---|---|---|---|---|
| Unitaria | `shared/` (validaciones, `normalizeText`, máquina de estados), servicios con repositorios dobles, `permissions.js` | `node:test` | `backend/test/unit/` | Cada push y PR |
| Integración | Rutas + middlewares + servicios + MongoDB real de prueba | `node:test` + `fetch` | `backend/test/integration/` | Cada PR (servicio `mongo:8` en CI) |
| E2E | Flujos de usuario en navegador | Playwright | `e2e/` | Antes de cada release y en PR a `main` |
| Accesibilidad | Reglas automáticas + recorrido manual | `@axe-core/playwright` + checklist de [14](14-ACCESSIBILITY.md) | `e2e/` y evidencia manual | Antes de cada release |
| Aceptación | CP-RF / CP-RNF de la ERS | Manual con evidencia | Documento de casos de prueba de la iteración | Cierre de iteración |

### 7.2 Casos de límite obligatorios

| Regla | Valores a probar | Origen |
|---|---|---|
| Longitud de contraseña | 7 ✗, 8 ✓, 15 ✓, 16 ✗ | RNF-001 |
| Composición de contraseña | sin mayúscula ✗, sin minúscula ✗, sin número ✗ | RNF-002 a RNF-004 |
| Créditos | 0 ✗, 1 ✓, 12 ✓, 13 ✗, 2.5 ✗, `"abc"` ✗ | RF-021 CA1, CA5 |
| Horas clase / extra clase | -1 ✗, 0 ✓, 300 ✓, 301 ✗ | RF-021 CA2 |
| Total de horas | 30 + 15 = 45; no editable | RN-16 |
| Nombre en Power Campus | 40 ✓, 41 ✗ sin recorte | RN-17, RF-022 CA2 |
| Descripción corta | 250 ✓, 251 ✗ | RN-18 |
| Meta descripción | 155 ✓, 156 ✗ | RN-19 |
| Nombre del curso | 2 ✗, 3 ✓ | ERS Apéndice B |
| Código del curso | `SOFT-101` ✓, `SOFT 101` ✗, duplicado ✗ | RF-018 CA3 |
| Identificación | 8 ✗, 9 ✓, 12 ✓, 13 ✗, con guiones ✗ | RF-003 CA1 |
| Celular | 7 ✗, 8 ✓, 9 ✗ | RF-003 CA1 |
| Edad | 17 ✗, 18 ✓, 100 ✓, 101 ✗ | RF-003 CA4 |
| Foto | PNG/JPG/WEBP ≤ 500 KB ✓; 500 KB + 1 byte ✗; GIF ✗ | RF-003 CA3 |
| Adjunto | `.pdf` 10 MB ✓; 10 MB + 1 byte ✗; `.exe` renombrado a `.pdf` ✗ | RN-28 |
| E-commerce | fin = inicio ✓; fin < inicio ✗ | RF-026 CA1 |
| CSV | encabezado incorrecto ✗ total; fila sin obligatorio ✗ total; duplicado omitido y reportado | RF-017 CA2, CA3 |
| Búsqueda | `diseño ágil` encuentra `DISENO AGIL` | RF-007 CA1, RF-041 CA1 |

### 7.3 Autorización

- Matriz completa rol × permiso de [13 §7.1](13-AUTHENTICATION-AUTHORIZATION.md#71-matriz-de-permisos) como prueba parametrizada: para cada permiso y cada rol, se espera 2xx o 403 según la tabla.
- Pruebas negativas mínimas de [13 §7.3](13-AUTHENTICATION-AUTHORIZATION.md#73-pruebas-negativas-mínimas-por-rol-obj-03).
- Dos escuelas con un Director cada una: listar, consultar, modificar, adjuntar, enviar y reportar sobre la escuela ajena → 404 o datos solo propios (RNF-008, RF-042 CA3).
- Unicidad de cargos: segundo `admin`, `rector` o `vice_rector` → 409 (RN-03).
- Estados: editar un curso `in_development` como Director → 409; aprobar sin código validado → 409 (RN-10); aprobar con error simulado de persistencia → el curso conserva `in_development` (RF-033 CA3, RNF-025).

### 7.4 Pruebas de seguridad

| Prueba | Petición | Esperado |
|---|---|---|
| Inyección NoSQL | `POST /auth/login` con `{"email": {"$ne": null}, "password": {"$ne": null}}` | 422, sin sesión |
| Asignación masiva | `PATCH /courses/{id}` como Director con `status`, `schoolId` o `codeValidated` | 422 `field_not_allowed` |
| Escalada de rol | `PATCH /users/{id}` por no Administrador | 403 |
| XSS almacenado | Curso con nombre `<img src=x onerror=alert(1)>` | Se guarda tal cual y se muestra como texto (E2E) |
| CSRF | `POST` sin `Origin` o con `Origin` ajeno | 403 `origin_not_allowed` |
| Tipo de contenido | `POST` JSON con `Content-Type: text/plain` | 415 |
| Fijación de sesión | Cookie antes y después del inicio de sesión | Identificador distinto |
| Mensaje genérico | Correo inexistente vs contraseña incorrecta | Mismo status y cuerpo (RNF-011) |
| Errores internos | Error forzado en un servicio | 500 Problem Details sin traza ni mensaje de MongoDB |
| Datos personales | `GET /courses/{id}` como Rectoría | Sin `email`, `nationalId`, `phone` del autor (RNF-014) |
| Gemini | `POST /ai/suggestions` con `field: "competency"` | 422 (RN-22) |
| Secretos | Búsqueda de `GEMINI_API_KEY` y similares en `frontend/` y en el historial | Sin coincidencias (RNF-010) |

### 7.5 Rendimiento

| RNF | Escenario | Umbral | Método |
|---|---|---|---|
| RNF-016 | Listado, detalle y guardado | p95 ≤ 2 s, sin servicios externos | Script con `fetch` y `performance.now()` sobre 20 repeticiones |
| RNF-017 | Carga de vistas principales | p95 ≤ 3 s hasta contenido utilizable | Playwright o DevTools con red estable |
| RNF-018 | CSV de 1 000 filas | ≤ 10 s | Prueba de integración con archivo generado |
| RNF-019 | Consulta y reporte sobre 5 000 cursos | p95 ≤ 3 s | Semilla `npm run db:seed -- --courses 5000` (pendiente de crear) |
| RNF-020 | Gemini con latencia > 1 s | Indicador de progreso visible | Doble con retardo + E2E |

Las mediciones se registran con fecha, ambiente (local o Atlas, nivel del clúster) y resultado en la evidencia del CP-RNF correspondiente.

### 7.6 Compatibilidad (RNF-041 a RNF-044)

Playwright ejecuta la suite E2E en Chromium, Firefox y WebKit. Como Chromium no es Edge y WebKit no es Safari, la evidencia de RNF-042 y RNF-044 se completa con una ejecución manual de los CP principales en las dos versiones estables más recientes de cada navegador disponibles para el equipo, registrando versión y sistema operativo.

### 7.7 Casos de aceptación

Cada CP-RF-xxx se redacta a partir de los CA de su RF: precondición (Dado), acción (Cuando), resultado esperado (Entonces), datos usados, resultado obtenido, evidencia, fecha y responsable. Se ejecutan al cierre de la iteración y se entregan en el documento de casos de prueba de la iteración, como `docs/Casos de prueba Iteración 1.pdf` en la primera entrega.

## 8. Errores frecuentes

- Ejecutar `node --test` sin patrón y lanzar como prueba un archivo de `support/` que se conecta a la base de datos.
- Usar la base de desarrollo o de producción para las pruebas de integración.
- Probar solo el camino feliz del rol Administrador.
- Llamar a Gemini o al SMTP real desde CI (pruebas lentas, intermitentes y con costo).
- Pruebas que dependen de la hora actual sin controlarla (fechas de modificación, edad).
- Aserciones débiles (`assert.ok(response)`) que pasan aunque el comportamiento sea incorrecto.
- Pruebas que dependen del orden de ejecución o de datos dejados por otra prueba.
- Subir la cobertura con pruebas sin aserciones.
- Marcar un CP como aprobado sin evidencia.

## 9. Checklist

- [ ] Las reglas nuevas tienen pruebas unitarias con valores de límite.
- [ ] Los endpoints nuevos tienen pruebas 2xx, 401, 403/404 y 422.
- [ ] Cada rol afectado tiene al menos una prueba negativa.
- [ ] Las integraciones externas están sustituidas por dobles.
- [ ] La base de datos de prueba termina en `_test`.
- [ ] Los `describe` citan RF/RNF/RN.
- [ ] `npm test` pasa localmente y en CI.
- [ ] Las pruebas de seguridad de §7.4 aplicables al cambio existen.
- [ ] El CP-RF del requerimiento está redactado o actualizado.

## 10. Referencias

- Node.js test runner: https://nodejs.org/api/test.html
- Node.js `assert`: https://nodejs.org/docs/latest/api/assert.html
- Playwright: https://playwright.dev/
- axe-core: https://github.com/dequelabs/axe-core
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Decisión: [ADR-0008](../adr/0008-node-test-runner.md). Relacionados: [12](12-SECURITY.md), [13](13-AUTHENTICATION-AUTHORIZATION.md), [19](19-CI-CD.md), [22](22-REQUIREMENTS-TRACEABILITY.md), [23](23-DEFINITION-OF-DONE.md).
