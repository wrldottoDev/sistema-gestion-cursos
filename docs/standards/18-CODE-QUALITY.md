# 18 · Calidad de código

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define las herramientas y reglas que mantienen el código uniforme y revisable: EditorConfig, Prettier, ESLint, los scripts de npm previstos, los límites de complejidad, el checklist de revisión de código y la gestión de la deuda técnica, incluido el registro de la deuda detectada en la auditoría del 14 nov 2026.

Fuera de alcance: reglas del lenguaje JavaScript ([08](08-JAVASCRIPT.md)); proceso del PR y prefijos de comentarios ([02](02-BRANCHING-AND-PR.md)); ejecución automática en el pipeline ([19](19-CI-CD.md)); pruebas ([16](16-TESTING.md)).

## 2. Estándar adoptado

| Herramienta | Archivo | Responsabilidad | Estado |
|---|---|---|---|
| [EditorConfig](https://editorconfig.org/) | `.editorconfig` | Codificación, fin de línea, indentación en cualquier editor | Implementado (configurado en esta revisión) |
| [Prettier](https://prettier.io/docs/) | `.prettierrc.json`, `.prettierignore` | **Formato** de JS, CSS, HTML, JSON y YAML | Configurado; inactivo hasta instalar dependencias |
| [ESLint](https://eslint.org/docs/latest/use/configure/configuration-files) (flat config, v9+) | `eslint.config.js` | **Calidad y errores probables** en JS; sin reglas de formato | Configurado; inactivo hasta instalar dependencias |
| npm scripts | `package.json` | Punto único para ejecutar lint, formato y pruebas | Pendiente de crear en la tarea de arranque del backend |
| Git | `.gitignore` | Excluir dependencias, artefactos, `.env` y archivos del sistema | Implementado (actualizado en esta revisión) |

División de responsabilidades: **Prettier decide el formato y ESLint no opina sobre él**. Por eso `eslint.config.js` no activa reglas de estilo y no hace falta `eslint-config-prettier` (el conjunto `@eslint/js` *recommended* de ESLint 9 no incluye reglas de formato).

## 3. Justificación

- **Cero discusiones de estilo en la revisión.** Con Prettier, la forma del código no se comenta en los PR; el tiempo del revisor se dedica a la lógica, la seguridad y los criterios de aceptación.
- **Diffs pequeños.** Fin de línea LF y formato determinista evitan PR donde cambia cada línea por un editor distinto (el equipo trabaja con editores y sistemas operativos diferentes).
- **Errores que ESLint detecta antes que el docente.** Comparaciones con `==`, variables sin usar, `var`, sombras de variables y asignaciones a `innerHTML` (riesgo de XSS) se detectan al guardar.
- **Configuración mínima.** Solo se declaran las opciones que difieren de los valores por defecto y las reglas que el equipo necesita; menos configuración significa menos que mantener.
- **Deuda visible.** La auditoría encontró defectos reales en el código existente (§ [Registro de deuda técnica](#registro-de-deuda-técnica)); registrarlos evita que se copien a los módulos nuevos.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| QA-01 | Todo archivo DEBE respetar `.editorconfig`: UTF-8, fin de línea LF, indentación de 2 espacios (4 en Python), salto de línea final y sin espacios finales (salvo Markdown). |
| QA-02 | El código JS, CSS, HTML, JSON y YAML DEBE estar formateado con Prettier usando `.prettierrc.json`; `npm run format:check` DEBE pasar antes del merge. |
| QA-03 | `npm run lint` DEBE terminar sin errores antes del merge. |
| QA-04 | NO DEBE desactivarse una regla de ESLint en línea (`// eslint-disable-next-line`) sin indicar la regla concreta y el motivo en el mismo comentario. Las directivas que no se usan son error (`reportUnusedDisableDirectives`). |
| QA-05 | Las advertencias de complejidad nuevas (QA-12) DEBEN justificarse en el PR o corregirse; el revisor puede bloquear el merge por ellas. |
| QA-06 | NO DEBE dejarse código comentado, `console.log` de depuración ni archivos sin uso. |
| QA-07 | El único formato permitido para marcar deuda en el código es `TODO(SGC-n): descripción`, con una tarjeta de Jira existente. No se usan `FIXME`, `HACK`, `XXX` ni `TODO` sin ID. |
| QA-08 | Las versiones de Prettier y ESLint DEBEN fijarse exactas en `package.json` (`--save-exact`), porque un cambio de versión puede reformatear todo el repositorio. |
| QA-09 | Todo PR DEBE pasar la revisión de código descrita en [Revisión de código](#revisión-de-código) por el revisor asignado ([02](02-BRANCHING-AND-PR.md#71-revisores)). |
| QA-10 | La deuda técnica nueva que se acepte conscientemente DEBE agregarse al [registro](#registro-de-deuda-técnica) en el mismo PR. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| QA-11 | El editor DEBERÍA formatear al guardar con Prettier y mostrar los errores de ESLint en línea (extensiones oficiales de VS Code: *Prettier*, *ESLint*, *EditorConfig*). |
| QA-12 | Las funciones DEBERÍAN respetar los límites de `eslint.config.js`: complejidad ciclomática ≤ 10, anidamiento ≤ 4, ≤ 4 parámetros (si se necesitan más, un objeto de opciones) y ≤ 50 líneas efectivas. Los archivos `*.test.js` están exentos del límite de líneas. |
| QA-13 | Un archivo de código DEBERÍA tener 300 líneas o menos; si crece, probablemente mezcla responsabilidades ([03](03-PROJECT-ARCHITECTURE.md)). |
| QA-14 | La lógica duplicada DEBERÍA extraerse a la tercera repetición (regla de tres), no antes: dos copias parecidas son más baratas que una abstracción equivocada. |
| QA-15 | Antes de `git push` se DEBERÍA ejecutar localmente `npm run lint && npm run format:check && npm test`. |
| QA-16 | Los cambios de formato masivos (por ejemplo, la primera vez que se aplica Prettier al frontend existente) DEBERÍAN ir en un PR `style:` propio, sin cambios funcionales. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| QA-17 | Un integrante PUEDE configurar un hook local `pre-push` sin dependencias (`git config core.hooksPath .githooks` con un script versionado) que ejecute lint y pruebas. No se adopta Husky. |
| QA-18 | Se PUEDE añadir `// @ts-check` al inicio de un archivo para que VS Code verifique los tipos JSDoc ([17](17-DOCUMENTATION.md)). |
| QA-19 | Se PUEDE crear `.npmrc` con `save-exact=true` para que todas las instalaciones fijen versiones exactas. |

## 5. Nomenclatura

Los nombres de archivos, variables, clases CSS y demás identificadores se rigen por el [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) y por [08](08-JAVASCRIPT.md) y [05](05-CSS-AND-BEM.md). Este documento solo fija:

| Elemento | Convención |
|---|---|
| Scripts de npm | `verbo` o `verbo:variante` en minúsculas: `lint`, `format:check`, `test:integration`, `db:migrate` |
| Comentario de deuda | `TODO(SGC-n): …` |
| Identificadores de deuda del registro | `D` + número correlativo (`D11`, `D12`, …), nunca reutilizado |

## 6. Ejemplos

### 6.1 Configuración vigente

**`.editorconfig`** (Implementado)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.py]
indent_size = 4
```

En Markdown no se eliminan los espacios finales porque dos espacios al final de una línea son un salto de línea; Python usa 4 espacios según PEP 8.

**`.prettierrc.json`** (Configurado)

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "printWidth": 100,
  "singleQuote": true
}
```

Solo se declaran las dos opciones que difieren de los valores por defecto de Prettier 3. El resto queda en su valor por defecto: `semi: true`, `tabWidth: 2`, `trailingComma: "all"`, `bracketSpacing: true`, `arrowParens: "always"`, `endOfLine: "lf"`. Comillas simples por continuidad con el código de la Iteración 1; 100 columnas porque 80 parte en exceso las cadenas de rutas y mensajes.

**`.prettierignore`** (Configurado): además de lo listado en `.gitignore` y `node_modules/`, ignora `wireframes/` (herramienta de Figma con código generado, no es parte de la aplicación) y `*.md` (tablas y prosa se mantienen a mano para evitar diffs de alineación).

**`eslint.config.js`** (Configurado). Resumen exacto de lo que contiene:

| Bloque | Contenido |
|---|---|
| `ignores` | `node_modules/`, `coverage/`, `playwright-report/`, `test-results/`, `wireframes/`, `frontend/vendor/` |
| Base | `js.configs.recommended` de `@eslint/js` |
| Todos los `**/*.js` | `ecmaVersion: 'latest'`, `sourceType: 'module'`, `reportUnusedDisableDirectives: 'error'` |
| Errores | `no-var`, `prefer-const`, `eqeqeq` (`always`), `no-console`, `no-eval`, `no-implied-eval`, `no-new-func`, `no-param-reassign`, `no-shadow`, `no-unused-vars` (se permiten argumentos que empiezan con `_`), `no-restricted-syntax` contra asignaciones a `innerHTML`/`outerHTML` y llamadas a `insertAdjacentHTML`/`write`/`writeln` |
| Advertencias | `complexity` 10, `max-depth` 4, `max-params` 4, `max-lines-per-function` 50 (sin contar líneas en blanco ni comentarios) |
| `frontend/**/*.js` | Globales del navegador (`globals.browser`) |
| `backend/**/*.js`, `e2e/**/*.js`, `*.config.js` | Globales de Node.js (`globals.node`) |
| `shared/**` | Sin globales de entorno: usar `window`, `document` o `process` es un error (`no-undef`), lo que garantiza que el código funcione igual en navegador y en servidor |
| `backend/src/lib/logger.js` | Único archivo con `no-console` desactivado |
| `**/*.test.js` | Sin límite de líneas por función |

El archivo usa sintaxis ESM (`import`), por lo que `package.json` DEBE declarar `"type": "module"`.

**`.gitignore`** (Implementado): conserva las entradas previas (`GUIA-VALENTINA.md`, `wireframes/v2/index.html`) y agrega `node_modules/`, `coverage/`, `playwright-report/`, `test-results/`, `__pycache__/`, `*.log`, `.env`, `.env.*` (excepto `.env.example`), `.DS_Store` y `Thumbs.db`.

### 6.2 `package.json` propuesto (Pendiente de crear)

Se crea en la tarea de arranque del backend. Instalación de las herramientas de calidad:

```bash
npm install --save-dev --save-exact eslint @eslint/js globals prettier
```

```json
{
  "name": "sistema-gestion-cursos",
  "version": "2.0.0-alpha.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "start": "node backend/src/server.js",
    "dev": "node --watch --env-file=.env backend/src/server.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "node --test \"backend/test/unit/**/*.test.js\"",
    "test:integration": "node --env-file-if-exists=.env.test --test --test-concurrency=1 \"backend/test/integration/**/*.test.js\"",
    "test:coverage": "node --test --experimental-test-coverage --test-coverage-lines=80 \"backend/test/unit/**/*.test.js\"",
    "test:e2e": "playwright test",
    "db:migrate": "node --env-file=.env backend/src/db/migrate.js",
    "db:seed": "node --env-file=.env backend/src/db/seed.js"
  }
}
```

Notas:

- Los scripts de prueba usan rutas explícitas para que `node --test` no ejecute las pruebas E2E de Playwright ni los archivos auxiliares dentro de carpetas `test/`; el nombre de los archivos E2E lo define [16](16-TESTING.md).
- `--env-file-if-exists` (Node.js ≥ 22.9) evita fallar en CI, donde las variables llegan por el entorno y no por archivo.
- `version` sigue [21](21-VERSIONING.md); `engines` exige la línea LTS activa (≥ 24).
- Los nombres `migrate.js` y `seed.js` dependen de la implementación de [11](11-MONGODB.md); si cambian, se actualiza este bloque.

### 6.3 Desactivar una regla (correcto e incorrecto)

```js
// Correcto: regla concreta y motivo.
// eslint-disable-next-line no-restricted-syntax -- plantilla estática sin datos del usuario (icono SVG del sprite)
iconSlot.innerHTML = STATIC_ICON_SVG;

// Incorrecto: desactiva todo y no explica.
/* eslint-disable */
```

### 6.4 Deuda en el código (correcto e incorrecto)

```js
// Correcto
// TODO(SGC-133): reemplazar PREFIJO-NÚMERO por el algoritmo oficial cuando se confirme (PV-08).
const COURSE_CODE_PATTERN = /^[A-Z]{2,5}-\d{2,4}$/;

// Incorrecto
// FIXME arreglar esto luego
// TODO: validar mejor
```

Comprobación manual mientras no exista una regla automática:

```bash
# Lista marcas de deuda que no siguen TODO(SGC-n): (funciona con el grep de macOS y de Linux)
grep -rnE "FIXME|HACK|XXX|TODO" --include='*.js' frontend backend shared | grep -vE "TODO\(SGC-[0-9]+\):"
```

### 6.5 Complejidad (correcto e incorrecto)

```js
// Incorrecto: cinco parámetros posicionales y anidamiento profundo.
function buildCourseFilter(role, schoolId, status, text, includeInactive) { /* … */ }

// Correcto: objeto de opciones y retornos tempranos.
function buildCourseFilter({ actor, status, text }) {
  const filter = {};
  if (actor.role === 'school_director') filter.schoolId = actor.schoolId; // RF-009: alcance desde la sesión
  if (status) filter.status = status;
  else filter.status = { $ne: 'inactive' }; // RF-035 CA1: inactivos ocultos por defecto
  if (text) filter.searchText = { $regex: escapeRegex(normalizeText(text)) };
  return filter;
}
```

## 7. Aplicación en el sistema CENFOTEC

- Las tres configuraciones existen desde esta revisión, pero **no se ejecutan** hasta crear `package.json` e instalar `eslint`, `@eslint/js`, `globals` y `prettier`. Hasta entonces, QA-02 y QA-03 se verifican en la revisión manual del PR.
- El primer PR que instale las herramientas DEBERÍA aplicar Prettier al frontend existente en un commit `style:` separado (QA-16): `frontend/index.html` y los CSS usan hoy 4 espacios.
- `wireframes/figma-plugin-sgc/` queda fuera de lint y formato: es una herramienta de diseño con su propio estilo y código generado (`code.js`).
- Los límites de complejidad son advertencias y no bloquean el pipeline ([19](19-CI-CD.md)); el revisor decide (QA-05). Si en la práctica se ignoran, se convertirán en errores.

### Revisión de código

Checklist del revisor, complementario a la [Definición de terminado](23-DEFINITION-OF-DONE.md) (que verifica el resultado; este verifica el código):

| Área | Pregunta |
|---|---|
| Requerimiento | ¿El cambio cumple cada criterio de aceptación citado en el PR, y nada fuera de alcance? |
| Arquitectura | ¿Respeta las capas y dependencias de [03](03-PROJECT-ARCHITECTURE.md)? ¿El controlador evita lógica de negocio? |
| Seguridad | ¿La autorización y la validación ocurren en el servidor ([12](12-SECURITY.md), [13](13-AUTHENTICATION-AUTHORIZATION.md))? ¿Hay datos del usuario insertados como HTML? ¿Se registran secretos o datos personales? |
| Datos | ¿Se usan índices y filtros por escuela correctos? ¿Ningún camino elimina físicamente un curso ([11](11-MONGODB.md))? |
| Errores | ¿Se manejan los fallos de red, de Gemini y de correo sin perder datos (RNF-023, RNF-024)? |
| Pruebas | ¿Hay pruebas de las reglas nuevas, incluidas las negativas por rol ([16](16-TESTING.md))? ¿Fallarían si la lógica se rompe? |
| Interfaz | ¿Usa tokens y componentes del Design System, textos i18n y marcado accesible ([06](06-DESIGN-SYSTEM.md), [14](14-ACCESSIBILITY.md), [20](20-INTERNATIONALIZATION.md))? |
| Legibilidad | ¿Los nombres siguen el glosario? ¿Hay funciones que superan los límites de QA-12 sin justificación? |
| Simplicidad | ¿Agrega dependencias, abstracciones o configuración que no se necesitan hoy? |
| Documentación | ¿JSDoc, OpenAPI, ADR y README de integraciones están al día ([17](17-DOCUMENTATION.md))? |

## Registro de deuda técnica

Deuda detectada en la auditoría del 14 nov 2026 sobre `redesign/iteracion-2` (commit `731c863`). Prioridad: **Alta** bloquea historias de la Iteración 2 o introduce defectos visibles; **Media** afecta calidad o consistencia; **Baja** es documental o cosmética.

| ID | Descripción | Archivo | Impacto | Acción propuesta | Prioridad |
|---|---|---|---|---|---|
| D1 | `* { padding: 0; margin: 0; display: block; }` convierte en bloque todos los elementos, incluidos los inline (`span`, `a`, `img`, `input`) y los de `<head>` (`title`, `script`, `style`), que pasan a mostrarse en la página | `frontend/css/base/reset.css` | Defecto visual grave en todas las páginas | Eliminar el archivo; Bootstrap Reboot actúa como reset ([05](05-CSS-AND-BEM.md), [07](07-BOOTSTRAP.md)) | Alta |
| D2 | `lang="en"` con contenido en español; `<link href="../css/main.css">` resuelve fuera de `frontend/` mientras `main.css` usa `@import` absolutos (`/css/…`); logo como `<div class="container__logo__cenfo">` vacío (BEM elemento-de-elemento, sin texto alternativo); clases mezcladas en español e inglés (`boton--secundario`, `form-field`); `title` como única explicación del botón deshabilitado; botón de mostrar contraseña sin `aria-pressed` ni nombre dinámico; textos sin i18n; indentación de 4 espacios | `frontend/index.html` | Accesibilidad, estilos que no cargan, inconsistencia de nombres | Reescribir la pantalla A-01 conforme a [04](04-HTML.md), [05](05-CSS-AND-BEM.md), [14](14-ACCESSIBILITY.md) y [20](20-INTERNATIONALIZATION.md) | Alta |
| D3 | Tokens heredados de la Iteración 1: `spacing.css` contiene tamaños de fuente y ningún espaciado; `typography.css` usa Segoe UI (el Design System usa Barlow y Figtree); `colors.css` usa la paleta anterior (`#b42318`, `#067647`) y nombres en español distintos de los del Design System (`bg/canvas`, `text/primary`…) | `frontend/css/tokens/*.css` | La interfaz no coincide con Figma (RNF-049) | Reemplazar por los tokens de [06](06-DESIGN-SYSTEM.md) | Alta |
| D4 | `.gitignore` no excluía `node_modules/` ni `.env`; `.DS_Store` versionado en dos rutas | `.gitignore`, `.DS_Store`, `wireframes/05-desktop/.DS_Store` | Riesgo de subir secretos y ruido en diffs | **Parcialmente resuelto** en esta revisión (`.gitignore` actualizado). Falta `git rm --cached .DS_Store wireframes/05-desktop/.DS_Store` en un commit `chore(project)` | Media |
| D5 | Historial con mensajes `.` (`a20730b`, `dcdd0e7`) y mensajes en español sin tipo; ramas con nombre de persona (`SGC-222-otoniel-usuarios`) o sin Jira (`fix-director-dos-escuelas`) | Historial de Git | Trazabilidad reducida de la Iteración 1 | No reescribir (GIT-10); aplicar [01](01-GIT-AND-COMMITS.md) y [02](02-BRANCHING-AND-PR.md) desde ahora; borrar ramas remotas ya integradas | Baja |
| D6 | README desactualizado frente a la ERS v1.1: 3 estados (son 5), "SEFIA" (es SFIA), modalidad "Virtual en vivo" (son 4), "Implementación no iniciada", documentos marcados como "Pendiente" | `README.md` | Información contradictoria para el docente y el equipo | Actualizar el README con un PR `docs:` | Media |
| D7 | La estrategia de verificación cita `node tests/validacion.test.js`, ruta de la Iteración 1 | ERS v1.1 §7.3 | Documento académico desalineado con el repositorio | Corregir en el Documento de Diseño 2 o en la siguiente versión de la ERS, con los scripts de §6.2 | Baja |
| D8 | Ancho del riel en tablet: 80 px en Especificaciones (handoff 09) y 72 px en el grid del Design System (04) | `wireframes/09-handoff/02-especificaciones.png`, `wireframes/04-design-system/14-…png` | Ambigüedad al maquetar TB-01 a TB-07 | Resolver [PV-17](README.md#7-decisiones-pendientes-de-validación) | Baja |
| D9 | Dependencia circular: RF-011 CA1 exige director al crear una escuela y RF-004 CA3 exige escuela al crear un director | ERS v1.1 | Bloquea el alta inicial de escuelas y directores | Resolver [PV-07](README.md#7-decisiones-pendientes-de-validación) | Alta |
| D10 | El tag `v1.0-iteracion1` no sigue SemVer | Tags de Git | Inconsistencia con [21](21-VERSIONING.md) | Conservarlo y agregar `v1.0.0` sobre el mismo commit ([PV-18](README.md#7-decisiones-pendientes-de-validación)) | Baja |

Mantenimiento del registro: cada fila se elimina en el PR que la resuelve (el historial de Git conserva la evidencia); la deuda nueva se agrega con el siguiente ID libre (QA-10) y su `TODO(SGC-n)` en el código cuando corresponde.

## 8. Errores frecuentes

1. Discutir formato en la revisión en lugar de ejecutar Prettier.
2. Instalar Prettier con `^` y obtener un reformateo masivo cuando cambia la versión menor.
3. Agregar reglas de estilo a ESLint que chocan con Prettier.
4. Silenciar ESLint con `/* eslint-disable */` al inicio del archivo para "terminar rápido".
5. Mezclar el formateo inicial de archivos existentes con un cambio funcional en el mismo PR.
6. Dejar `TODO` sin tarjeta de Jira: nadie lo retoma.
7. Ignorar las advertencias de complejidad hasta que una función de 150 líneas es imposible de probar.

## 9. Checklist

- [ ] El editor respeta `.editorconfig` (LF, 2 espacios, salto final).
- [ ] `npm run format:check` y `npm run lint` pasan (o, mientras no existan, el revisor verificó formato y errores evidentes).
- [ ] No hay `eslint-disable` sin regla y motivo.
- [ ] No hay código comentado, `console.log` de depuración ni archivos sin uso.
- [ ] Las advertencias de complejidad nuevas están corregidas o justificadas en el PR.
- [ ] La deuda introducida usa `TODO(SGC-n):` y está en el registro.
- [ ] El revisor completó el checklist de [Revisión de código](#revisión-de-código).

## 10. Referencias

- EditorConfig: <https://editorconfig.org/>
- Prettier, opciones: <https://prettier.io/docs/options>
- Prettier, ¿por qué fijar la versión?: <https://prettier.io/docs/install>
- ESLint, configuración (flat config): <https://eslint.org/docs/latest/use/configure/configuration-files>
- ESLint, reglas: <https://eslint.org/docs/latest/rules/>
- Paquete `globals`: <https://github.com/sindresorhus/globals>
- Node.js, `--env-file` y `--env-file-if-exists`: <https://nodejs.org/docs/latest/api/cli.html>
- Google Engineering Practices, revisión de código: <https://google.github.io/eng-practices/review/>
- Documento relacionado: [02 · Ramas y PR](02-BRANCHING-AND-PR.md), [16 · Pruebas](16-TESTING.md), [19 · CI/CD](19-CI-CD.md), [23 · Definición de terminado](23-DEFINITION-OF-DONE.md).
