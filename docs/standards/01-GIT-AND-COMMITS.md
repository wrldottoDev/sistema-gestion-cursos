# 01 · Git y commits

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define el formato obligatorio de los mensajes de commit y la forma de agrupar los cambios en commits. Aplica a todo commit que llegue a `redesign/iteracion-2`, a `main` y a cualquier rama del repositorio, incluidos los generados por asistentes de IA y los mensajes de *squash merge* de los Pull Requests.

Fuera de alcance: nombres de ramas, Pull Requests, estrategia de merge y protección de ramas ([02](02-BRANCHING-AND-PR.md)); tags y releases ([21](21-VERSIONING.md)).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Formato | [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) | Adoptado |
| Idioma | Inglés, modo imperativo | Adoptado |
| Tipos | `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert` | Adoptado |
| Scopes | Lista cerrada alineada con los módulos de la ERS ([§5.2](#52-scopes-lista-cerrada)) | Adoptado |
| Jira | Footer `Refs: SGC-n` o `Closes: SGC-n`; nunca en el asunto | Adoptado |
| Validación automática | `commitlint` | Opcional, no instalado |

Estructura del mensaje:

```text
<type>(<scope>): <subject>

<body: qué cambia y por qué, líneas de máximo 72 caracteres>

<footer(s): Refs: SGC-n · Closes: SGC-n · BREAKING CHANGE: ... · Co-authored-by: ...>
```

## 3. Justificación

- **Historial legible y filtrable.** El tipo y el scope permiten responder "qué cambió en `approval` desde el avance" con `git log --grep`, sin abrir cada commit.
- **Notas de versión.** Los títulos de PR en Conventional Commits generan notas de release comprensibles ([21](21-VERSIONING.md)).
- **SemVer derivable.** `feat` implica MINOR, `fix` implica PATCH y `!`/`BREAKING CHANGE` implica MAJOR, lo que hace explícito el impacto de cada cambio.
- **Trazabilidad con Jira sin ruido.** El ID en el footer conserva el asunto corto y permite que la integración GitHub–Jira (si está configurada) enlace el commit con la historia ([22](22-REQUIREMENTS-TRACEABILITY.md)).
- **Inglés.** Coincide con los identificadores del código ([ADR-0006](../adr/0006-english-identifiers-domain-glossary.md)) y con el vocabulario de las herramientas (`feat`, `fix`). El historial previo en español y sin tipo ([§8](#8-errores-frecuentes)) demostró que sin un formato común los mensajes pierden valor.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| GIT-01 | El encabezado DEBE tener la forma `<type>(<scope>): <subject>` o `<type>: <subject>` cuando el cambio es transversal, con un tipo de la lista de §2. |
| GIT-02 | El encabezado completo DEBE tener 72 caracteres o menos. |
| GIT-03 | El asunto DEBE estar en inglés, en modo imperativo (`add`, `fix`, `remove`), empezar en minúscula y no terminar en punto. |
| GIT-04 | El scope, cuando se use, DEBE pertenecer a la lista cerrada de [§5.2](#52-scopes-lista-cerrada). Un scope nuevo requiere actualizar este documento en el mismo PR. |
| GIT-05 | El ID de Jira NO DEBE ir en el asunto. Cuando el commit corresponde a una historia, DEBE incluir el footer `Refs: SGC-n` (avance parcial) o `Closes: SGC-n` (completa la historia). |
| GIT-06 | Un cambio incompatible DEBE marcarse con `!` después del tipo/scope **y** con el footer `BREAKING CHANGE: <descripción y migración>`. En este proyecto es incompatible: cambiar el contrato de `/api/v1`, cambiar el esquema de una colección de forma que requiera migración o renombrar/eliminar una variable de entorno. |
| GIT-07 | Cada commit DEBE ser atómico: un único cambio lógico, que compile y no rompa pruebas existentes. Las pruebas del cambio van en el mismo commit que el código. |
| GIT-08 | Los cambios de solo formato (Prettier) DEBEN ir en un commit `style:` separado, sin cambios de comportamiento. |
| GIT-09 | NO DEBE haber mensajes vacíos o sin significado (`.`, `wip`, `update`, `changes`, `fix stuff`). |
| GIT-10 | NO DEBE reescribirse el historial de `main`, `redesign/iteracion-2` ni `legacy/iteracion-1` para corregir mensajes antiguos. Los mensajes heredados se conservan como están. |
| GIT-11 | Un commit NO DEBE contener secretos, archivos `.env`, `node_modules/` ni artefactos generados ([12](12-SECURITY.md), `.gitignore`). Si ocurre, se rota el secreto: borrar el commit no basta. |
| GIT-12 | La reversión de un commit DEBE usar el tipo `revert:` con el encabezado del commit revertido y el footer `Refs: <hash>`. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| GIT-13 | El cuerpo DEBERÍA explicar **qué** cambia y **por qué** (regla de negocio, RF/RN, defecto observado), no **cómo**: el cómo está en el diff. |
| GIT-14 | El cuerpo DEBERÍA citar el requerimiento o regla afectada (`RF-033 CA3`, `RN-12`, `RNF-024`). |
| GIT-15 | Los commits intermedios de una rama de historia DEBERÍAN seguir este formato aunque el PR se integre con *squash*: facilitan la revisión commit a commit. |
| GIT-16 | El asunto DEBERÍA describir el efecto observable (`reject courses without validated code`) y no la tarea (`work on approval`). |
| GIT-17 | Un commit DEBERÍA cambiar menos de ~200 líneas de código fuente (sin contar lockfile, imágenes ni migraciones de datos). Si es más grande, probablemente agrupa varios cambios lógicos. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| GIT-18 | El equipo PUEDE instalar `@commitlint/cli` con `@commitlint/config-conventional` y un hook `commit-msg` local ([§6.5](#65-validación-automática-opcional)). No está instalado ni es requisito. |
| GIT-19 | Se PUEDE añadir `Co-authored-by: Nombre <correo>` cuando dos integrantes programan en pareja. El trabajo generado con un asistente de IA no cambia la autoría: el integrante que hace el commit es responsable del contenido. |
| GIT-20 | Se PUEDE usar `git commit --fixup <hash>` en la rama propia y `git rebase -i --autosquash` antes de pedir revisión. |

## 5. Nomenclatura

### 5.1 Tipos

| Tipo | Uso | Impacto SemVer |
|---|---|---|
| `feat` | Funcionalidad nueva visible para un rol o para un consumidor de la API | MINOR |
| `fix` | Corrección de un defecto | PATCH |
| `docs` | Solo documentación (Markdown, JSDoc, OpenAPI sin cambio de comportamiento) | — |
| `style` | Formato sin cambio de lógica (Prettier, espacios, orden de imports) | — |
| `refactor` | Cambio interno sin modificar comportamiento ni contrato | — |
| `perf` | Mejora de rendimiento sin cambio funcional (p. ej., índice para RNF-019) | PATCH |
| `test` | Agrega o corrige pruebas sin tocar código de producción | — |
| `build` | Dependencias, `package.json`, scripts de npm | — |
| `ci` | Workflows de GitHub Actions | — |
| `chore` | Mantenimiento que no encaja en lo anterior (estructura del repositorio, versión de release) | — |
| `revert` | Reversión de un commit previo | Depende del commit revertido |

`!` o `BREAKING CHANGE:` convierten cualquier tipo en MAJOR (ver [21](21-VERSIONING.md) para cómo se aplica antes y después de `v2.0.0`).

### 5.2 Scopes (lista cerrada)

| Scope | Corresponde a | Requerimientos |
|---|---|---|
| `auth` | Inicio de sesión, sesión, permisos (`modules/auth`, `features/auth`, `index.html`) | RF-001, RF-002, RF-008, RF-009 |
| `users` | Usuarios (`modules/users`, `features/users`) | RF-003 – RF-007 |
| `catalogs` | Catálogos maestros y fijos (`modules/catalogs`) | RF-010 – RF-016 |
| `csv-import` | Carga CSV de catálogos e integración Python | RF-017 |
| `courses` | Registro, borrador, adjuntos, consulta y búsqueda de cursos | RF-018 – RF-027, RF-039 – RF-041 |
| `ai` | Asistencia de redacción con Gemini | RF-028, RF-029 |
| `approval` | Envío, bandeja de revisión, código, aprobación, En producción, Inactivo | RF-030 – RF-035 |
| `notifications` | Correo, Server-Sent Events, notificaciones de escritorio | RF-036 – RF-038 |
| `reports` | Reportes de producción e histórico | RF-042, RF-043 |
| `i18n` | Diccionarios `es`/`en`, preferencia de idioma | RF-044, RNF-038 – RNF-040 |
| `ui` | Design System, tokens, layout y componentes compartidos (`frontend/css`, `frontend/js/core`) | RNF-028 – RNF-037, RNF-049 |
| `api` | Infraestructura transversal de la API (router base, Problem Details, OpenAPI) | — |
| `db` | Conexión, migraciones, índices, semillas (`backend/src/db`) | RNF-019, RNF-025 – RNF-027 |
| `security` | Cabeceras, CSP, controles transversales de seguridad | RNF-005 – RNF-014 |
| `config` | Configuración del entorno (`backend/src/config`) y archivos de herramientas | RNF-046 |
| `deps` | Alta, baja o actualización de dependencias (normalmente con `build`) | — |
| `ci` | Workflows (normalmente se usa el tipo `ci` sin scope) | — |
| `docs` | Documentación general del proyecto (`README.md`, `docs/`) | — |
| `standards` | Estándares de ingeniería y ADR (`docs/standards`, `docs/adr`) | — |
| `release` | Preparación de versiones (`chore(release): …`) | — |
| `project` | Estructura del repositorio, `.gitignore`, archivos de la raíz | — |

Regla de desempate: si un cambio toca dos módulos, se usa el scope del módulo cuyo comportamiento cambia y se menciona el otro en el cuerpo; si toca tres o más de forma equivalente, se omite el scope o se divide el commit.

### 5.3 Footers reconocidos

| Footer | Uso |
|---|---|
| `Refs: SGC-131` | El commit avanza la historia sin completarla. Varias historias: `Refs: SGC-131, SGC-133`. |
| `Closes: SGC-131` | El commit completa la historia (normalmente solo en el *squash* del PR). |
| `BREAKING CHANGE: <texto>` | Describe la incompatibilidad y la migración. |
| `Refs: <hash>` | En `revert:`, referencia al commit revertido. |
| `Co-authored-by: Nombre <correo>` | Coautoría (GIT-19). |

## 6. Ejemplos

### 6.1 Correcto

```text
feat(approval): add review inbox ordered by submission date

List courses in in_development status from every school, oldest
first, with code (or "pending code"), name, school and submission
date. Other roles receive 403.

Refs: SGC-131
```

```text
fix(approval): keep previous status when approval write fails

The update now filters by the expected previous status and
codeValidated: true, so a failed or concurrent write can no longer
leave a course half approved (RF-033 CA3, RNF-025).

Closes: SGC-135
```

```text
feat(auth): reject Google accounts outside the institutional domain

Refs: SGC-48
```

```text
feat(catalogs): block deletion of catalog items that are in use

Return 409 catalog_item_in_use with the number of courses or users
that reference the item (RF-015 CA2, RN-27).

Refs: SGC-225
```

```text
test(users): add negative authorization tests for every role

Refs: SGC-168
```

```text
build(deps): add express 5 and the official mongodb driver
```

```text
docs(standards): add git and commit conventions
```

```text
chore(project): restructure frontend and backend
```

El último corresponde al commit real `731c863`, el primero del historial que ya sigue el estándar.

### 6.2 Cambio incompatible

```text
feat(api)!: return problem details for validation errors

Validation errors now use application/problem+json with an errors
array of { field, code, params } instead of a plain message string.
The frontend api-client is updated in this same commit.

BREAKING CHANGE: clients must read errors[].code instead of message
and translate it with the i18n dictionaries.
Refs: SGC-130
```

### 6.3 Reversión

```text
revert: feat(reports): add history comparison by month

The comparison query exceeds 3 s with 5 000 courses (RNF-019).
It will return once the compound index is in place.

Refs: 4f2a9c1
```

`git revert <hash>` genera `Revert "…"`; se edita el mensaje antes de confirmar para adaptarlo a este formato.

### 6.4 Incorrecto (tomado del historial real)

| Mensaje | Commit | Problema | Corrección |
|---|---|---|---|
| `.` | `a20730b`, `dcdd0e7` | Sin tipo ni significado (GIT-09) | `chore(project): …` describiendo el cambio real |
| `update names` | `110a690` | Sin tipo; no dice qué nombres ni por qué | `refactor(catalogs): rename school fields to match ERS v1.1` |
| `Impedir que un director dirija dos escuelas (RF-011)` | `36487c2` | En español, sin tipo, RF en el asunto | `fix(catalogs): prevent a director from leading two schools` + cuerpo con RF-011 + `Refs: SGC-76` |
| `SGC-94 SGC-114 Clasificación desde catálogos y contenidos y perfiles` | `eaf638b` | ID en el asunto, español, dos historias en un commit | Dos commits: `feat(courses): classify courses using catalog values` (`Refs: SGC-94`) y `feat(courses): add content and profile fields` (`Refs: SGC-114`) |

Otros contraejemplos frecuentes:

```text
Feat(Courses): Added review inbox.     # tipo y scope en mayúscula, pasado, punto final
feat(cursos): agregar bandeja          # scope fuera de la lista, español
fix: bug                               # no describe el efecto
feat(approval): add review inbox, code validation, approval and emails   # varios cambios lógicos
```

### 6.5 Validación automática (opcional)

No hay `commitlint` instalado. Si el equipo decide adoptarlo (GIT-18), la configuración mínima coherente con este documento es:

```js
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [
      2,
      'always',
      [
        'auth', 'users', 'catalogs', 'csv-import', 'courses', 'ai', 'approval',
        'notifications', 'reports', 'i18n', 'ui', 'api', 'db', 'security',
        'config', 'deps', 'ci', 'docs', 'standards', 'release', 'project',
      ],
    ],
  },
};
```

Mientras no exista, la validación ocurre en la revisión del PR: el revisor DEBE comprobar el título del PR, que se convierte en el mensaje del *squash* ([02](02-BRANCHING-AND-PR.md)).

## 7. Aplicación en el sistema CENFOTEC

- **Ramas de historia.** Los commits intermedios siguen este formato (GIT-15); el mensaje que queda en `redesign/iteracion-2` es el título del PR más el footer `Closes: SGC-n` o `Refs: SGC-n` que el integrante que hace el merge conserva al editar el *squash* ([02](02-BRANCHING-AND-PR.md)).
- **Reparto por integrante.** Cada integrante trabaja sobre su módulo (Usuarios, Cursos, Catálogos según `docs/ESTADO.md`), por lo que el scope coincide casi siempre con su área: `users`, `courses` y `catalogs` respectivamente, más los scopes de sus historias de Iteración 2 (`auth`, `ai`, `approval`, `reports`, `csv-import`, `notifications`, `i18n`).
- **Requerimientos en el cuerpo.** El cuerpo cita RF/RN/RNF y criterios de aceptación (`RF-030 CA2`), lo que permite reconstruir la trazabilidad sin abrir Jira.
- **Historial heredado.** Los commits de la Iteración 1 en español se conservan sin reescritura (GIT-10); la regla aplica desde el 14 nov 2026.
- **Cambios de estándares.** Se registran como `docs(standards): …` (ver [README §9](README.md#9-cómo-se-cambia-un-estándar)).

## 8. Errores frecuentes

1. Escribir el ID de Jira en el asunto (`SGC-131 add inbox`): ocupa espacio del límite de 72 caracteres y duplica la información del footer.
2. Usar el pasado (`added`, `fixed`) en lugar del imperativo.
3. Mezclar formato y lógica en el mismo commit, lo que vuelve ilegible el diff para el revisor.
4. Usar `fix` para funcionalidad nueva o `feat` para un refactor: altera la versión que se infiere del historial.
5. Inventar scopes (`cursos`, `frontend`, `backend`, `misc`).
6. Olvidar el `!` en un cambio del contrato de la API que obliga a cambiar el frontend.
7. Hacer `git commit -am "wip"` y abrir el PR sin limpiar: en ramas propias se corrige con `--fixup` y `--autosquash` antes de pedir revisión.
8. Confirmar un `.env` y luego borrarlo en otro commit: el secreto sigue en el historial y debe rotarse ([12](12-SECURITY.md)).

## 9. Checklist

- [ ] El encabezado sigue `<type>(<scope>): <subject>` con tipo y scope de las listas de §5.
- [ ] El encabezado tiene 72 caracteres o menos, en inglés, imperativo, minúscula inicial y sin punto final.
- [ ] El ID de Jira está en el footer (`Refs:` o `Closes:`), no en el asunto.
- [ ] El cuerpo explica qué y por qué, y cita RF/RN/RNF cuando aplica.
- [ ] El commit contiene un único cambio lógico con sus pruebas.
- [ ] Los cambios de formato están en un commit `style:` aparte.
- [ ] Los cambios incompatibles tienen `!` y `BREAKING CHANGE:`.
- [ ] No hay secretos, `.env`, `node_modules/` ni artefactos generados.
- [ ] El título del PR (mensaje del *squash*) cumple todo lo anterior.

## 10. Referencias

- Conventional Commits 1.0.0: <https://www.conventionalcommits.org/en/v1.0.0/>
- Semantic Versioning 2.0.0: <https://semver.org/>
- Git trailers (`git interpret-trailers`): <https://git-scm.com/docs/git-interpret-trailers>
- commitlint: <https://commitlint.js.org/>
- Documento relacionado: [02 · Ramas y Pull Requests](02-BRANCHING-AND-PR.md), [21 · Versionado](21-VERSIONING.md), [22 · Trazabilidad](22-REQUIREMENTS-TRACEABILITY.md).
