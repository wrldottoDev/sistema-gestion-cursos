# 22 · Trazabilidad de requerimientos

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se relaciona cada requerimiento de la ERS v1.1 con su objetivo, su historia en Jira, el módulo de código que lo implementa, las pantallas del handoff, los endpoints, las pruebas automatizadas y el caso de prueba de aceptación. Incluye la matriz de los 44 RF y el resumen de los 49 RNF. Aplica a ramas, commits, PR, código, pruebas y documentación.

La ERS §6 es la matriz oficial RF/RNF → objetivo → Jira → caso de prueba. Este documento la **extiende** hacia el código; no la reemplaza ni la contradice.

## 2. Estándar adoptado

Cadena de trazabilidad (Adoptado):

```text
RF/RNF (ERS v1.1) → OBJ-0x → historia SGC-n (Jira) → rama y PR → módulo/carpeta (scope)
      → pantallas (IDs del handoff) → endpoints (/api/v1) → pruebas automatizadas → CP-RF/CP-RNF (evidencia)
```

| Eslabón | Identificador | Fuente | Estado |
|---|---|---|---|
| Requerimiento | `RF-001`…`RF-044`, `RNF-001`…`RNF-049`, `RN-01`…`RN-29` | ERS v1.1 | Confirmado (ERS) |
| Objetivo | `OBJ-01`…`OBJ-06` | ERS §2.3, §2.4 | Confirmado (ERS) |
| Historia | `SGC-n` | Jira, proyecto SGC | Confirmado (ERS §6) |
| Pantalla | `A-01`…`RP-05`, `TB-01`…`TB-07`, `MB-01`…`MB-09` | Handoff 09 (matriz de cobertura) | Implementado (en `wireframes/`) |
| Endpoint | `/api/v1/...` | [10](10-REST-API.md) | Adoptado |
| Prueba automatizada | `describe('RF-xxx …')` | [16](16-TESTING.md) | Adoptado |
| Caso de aceptación | `CP-RF-xxx`, `CP-RNF-xxx` | ERS §6, §7.3 | Confirmado (ERS) |

## 3. Justificación

- El docente evalúa la correspondencia entre ERS, Jira, código y pruebas (criterio 39 de la rúbrica, "Trazabilidad", citado en `docs/ESTADO.md`).
- Con tres desarrolladores y 44 historias en tres semanas, la trazabilidad evita historias olvidadas, código sin requerimiento y requerimientos sin prueba.
- Citar IDs en lugar de describir con palabras permite buscar con `git log --grep` y `grep -r` y responder "¿qué implementa RF-032?" en segundos.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| TRZ-01 | Toda rama de funcionalidad **DEBE** incluir la historia: `<type>/SGC-<n>-<short-desc>` ([02](02-BRANCHING-AND-PR.md)). |
| TRZ-02 | Todo commit que avance una historia **DEBE** llevar el footer `Refs: SGC-<n>` y, el que la completa, `Closes: SGC-<n>` ([01](01-GIT-AND-COMMITS.md)). |
| TRZ-03 | Todo PR **DEBE** declarar en su cuerpo: historia Jira, RF/RNF/RN cubiertos, pantallas del handoff, endpoints tocados y pruebas agregadas (secciones de la [plantilla de PR](../../.github/PULL_REQUEST_TEMPLATE.md)). |
| TRZ-04 | Toda prueba automatizada de una regla de requerimiento **DEBE** citar su ID en el `describe` y el criterio en el `it` cuando aplique ([16](16-TESTING.md)). |
| TRZ-05 | La matriz de [§7.1](#71-matriz-rf--código--pruebas) **DEBE** actualizarse en el mismo PR que cambia el módulo, la pantalla, el endpoint o la prueba de un RF. |
| TRZ-06 | Ningún código de negocio **DEBE** existir sin un RF, RN o RNF que lo justifique. Si se necesita algo fuera de la ERS (por ejemplo, una propuesta UX), se marca como **Pendiente de validación** y se enlaza al [README §7](README.md#7-decisiones-pendientes-de-validación). |
| TRZ-07 | Cada RF entregado **DEBE** tener su CP-RF ejecutado con evidencia antes de cerrar la historia en Jira ([23](23-DEFINITION-OF-DONE.md)). |
| TRZ-08 | Un cambio de requerimiento **DEBE** originarse en la ERS (nueva versión) o en una decisión registrada del docente; nunca solo en el código. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| TRZ-09 | Las reglas de negocio no evidentes en el código **DEBERÍAN** citar su origen en un comentario breve (`// RN-10: no se aprueba sin código validado.`). No se citan IDs en código trivial. |
| TRZ-10 | Las descripciones de historias en Jira **DEBERÍAN** enlazar el PR que las implementa (GitHub muestra el enlace inverso por el ID en el título de la rama). |
| TRZ-11 | Antes de cada hito (avance 29 nov, exposición 2 dic, entrega 6 dic) **DEBERÍA** revisarse la matriz para detectar RF sin prueba o sin CP. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| TRZ-12 | Se **PUEDE** generar un reporte con `grep -rn "RF-0" backend/test` para verificar qué RF tienen pruebas automatizadas. |

## 5. Nomenclatura

| Dónde | Formato | Ejemplo |
|---|---|---|
| Rama | `<type>/SGC-<n>-<short-desc-en>` | `feat/SGC-131-review-inbox` |
| Footer de commit | `Refs: SGC-<n>` / `Closes: SGC-<n>` | `Refs: SGC-133` |
| Cuerpo del PR | `Jira: SGC-<n> · RF: RF-0xx · Pantallas: X-nn` | `Jira: SGC-131 · RF: RF-031 · Pantallas: R-01, MB-06` |
| Comentario de código | `// RN-xx: <regla>` o `// RF-0xx CAn: <regla>` | `// RF-032 CA2: registrar quién y cuándo cambió el código.` |
| Prueba | `describe('RF-0xx <tema en inglés>')`, `it('CAn <comportamiento>')` | `describe('RF-031 review inbox')` |
| Caso de aceptación | `CP-RF-0xx`, `CP-RNF-0xx` | `CP-RF-031` |

## 6. Ejemplos

Correcto:

```text
Rama:   feat/SGC-133-course-code-review
Commit: feat(approval): generate next course code with school prefix

        Desarrollo Curricular puede generar el siguiente código disponible
        cuando el Director marcó "Solicitar código" (RF-032 CA3).

        Refs: SGC-133
PR:     Jira: SGC-133 · RF: RF-032 (CA1–CA4), RN-10 · Pantallas: R-02, R-03, R-04
        Endpoints: PATCH /api/v1/courses/{id}/code, POST /api/v1/courses/{id}/code/generate
        Pruebas: backend/test/integration/courses/code.test.js
```

```js
// backend/test/integration/courses/code.test.js
describe('RF-032 course code review', () => {
  it('CA3 proposes the next available code with the school prefix', async () => { /* … */ });
  it('CA4 rejects approval when the code is not validated', async () => { /* … */ });
});
```

Incorrecto:

```text
Rama:   otoniel-cambios
Commit: arreglos varios
PR:     "Listo, ya funciona la parte de códigos"
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Matriz RF → código → pruebas

Columnas: objetivo, Jira, prioridad e iteración según ERS §6; módulo y scope según [03](03-PROJECT-ARCHITECTURE.md) y [01](01-GIT-AND-COMMITS.md); pantallas según la matriz de cobertura del handoff (sección 09); endpoints según [10](10-REST-API.md) (todos bajo `/api/v1`). La columna "Iteración" es la planificada en la ERS; en la Iteración 2 los RF de la Iteración 1 se **reimplementan** con Bootstrap, Node.js y MongoDB Atlas (tareas SGC-220, SGC-228 y SGC-221, una por módulo, según `docs/ESTADO.md`). Estado de implementación de todas las filas al 14 nov 2026: **no implementado** en `redesign/iteracion-2`.

| RF | Historia | OBJ | Jira | Prio. | Iter. | Módulo · scope | Pantallas | Endpoint principal | CP |
|---|---|---|---|---|---|---|---|---|---|
| RF-001 | Inicio de sesión con Google | OBJ-03 | SGC-48 | P2 | 2 | auth · `auth` | A-01, A-04, A-05 | `POST /auth/google` | CP-RF-001 |
| RF-002 | Inicio con correo y contraseña | OBJ-03 | SGC-60 | P3 | 1 | auth · `auth` | A-01, A-02, A-03 | `POST /auth/login` | CP-RF-002 |
| RF-003 | Registro de usuarios | OBJ-03 | SGC-62 | P1 | 1 | users · `users` | U-03, U-04 | `POST /users` | CP-RF-003 |
| RF-004 | Rol único y unicidad de cargos | OBJ-03 | SGC-63 | P1 | 1 | users · `users` | U-03, U-04 | `POST /users`, `PATCH /users/{id}` | CP-RF-004 |
| RF-005 | Listado y modificación de usuarios | OBJ-03 | SGC-217 | P1 | 1 | users · `users` | U-01, U-05, TB-07 | `GET /users`, `PATCH /users/{id}` | CP-RF-005 |
| RF-006 | Eliminación de usuarios | OBJ-03 | SGC-223 | P2 | 1 | users · `users` | U-06, U-07, U-08 | `DELETE /users/{id}` | CP-RF-006 |
| RF-007 | Búsqueda de usuarios | OBJ-03 | SGC-224 | P2 | 1 | users · `users` | U-01, U-02 | `GET /users?q=&role=` | CP-RF-007 |
| RF-008 | Control de acceso por rol | OBJ-03 | SGC-68 | P1 | 1 | auth · `auth` | Menús por rol, A-06, C-05 | Todas (`authorize`) | CP-RF-008 |
| RF-009 | Director limitado a su escuela | OBJ-03 | SGC-69 | P1 | 1 | auth + courses · `auth` | C-02, F-01, RP-02, A-06 | `GET /courses` (alcance) | CP-RF-009 |
| RF-010 | Administración de catálogos | OBJ-02 | SGC-73 | P1 | 1 | catalogs · `catalogs` | K-01, K-04, K-05 | `GET/POST/PATCH /catalogs/{catalogKey}` | CP-RF-010 |
| RF-011 | Escuelas y carreras | OBJ-02 | SGC-76 | P1 | 1 | catalogs · `catalogs` | K-02, K-03 | `/catalogs/schools`, `/catalogs/degree-programs` | CP-RF-011 |
| RF-012 | Catálogos de clasificación | OBJ-02 | SGC-79 | P2 | 2 | catalogs · `catalogs` | K-04, K-06 | `/catalogs/sfia-areas`, `/catalogs/topics`, `/catalogs/learning-methodologies`, `GET /catalogs/complexity-levels` | CP-RF-012 |
| RF-013 | Casas certificadoras y certificaciones | OBJ-02 | SGC-83 | P2 | 1 | catalogs · `catalogs` | K-08 | `/catalogs/certifying-bodies`, `/catalogs/certifications` | CP-RF-013 |
| RF-014 | Estados de curso y moneda | OBJ-02 | SGC-78 | P2 | 2 | catalogs · `catalogs` | K-06 | `GET /catalogs/course-statuses`, `GET /catalogs/currencies` | CP-RF-014 |
| RF-015 | Eliminación de elementos de catálogo | OBJ-02 | SGC-225 | P2 | 1 | catalogs · `catalogs` | K-06, K-07, K-08 | `DELETE /catalogs/{catalogKey}/{id}` | CP-RF-015 |
| RF-016 | Búsqueda en catálogos | OBJ-02 | SGC-226 | P2 | 1 | catalogs · `catalogs` | K-03, K-04 | `GET /catalogs/{catalogKey}?q=&schoolId=` | CP-RF-016 |
| RF-017 | Carga masiva CSV | OBJ-02 | SGC-86 (Python: SGC-229) | P2 | 2 | catalogs · `csv-import` | M-01, M-02, M-03 | `POST /catalogs/{catalogKey}/imports` | CP-RF-017 |
| RF-018 | Creación de curso en Borrador | OBJ-01 | SGC-90 | P1 | 1 | courses · `courses` | F-01 | `POST /courses` | CP-RF-018 |
| RF-019 | Guardado progresivo del borrador | OBJ-01 | SGC-91 | P1 | 1 | courses · `courses` | F-03, P-02, F-13 | `PATCH /courses/{id}` | CP-RF-019 |
| RF-020 | Clasificación académica | OBJ-02 | SGC-94 | P1 | 1 | courses · `courses` | F-02, F-11 | `PATCH /courses/{id}` | CP-RF-020 |
| RF-021 | Carga académica y modalidad | OBJ-02 | SGC-100 | P1 | 1 | courses · `courses` | F-03, TB-04 | `PATCH /courses/{id}` | CP-RF-021 |
| RF-022 | Textos con límite | OBJ-02 | SGC-97 | P1 | 1 | courses · `courses` | F-04, MB-04 | `PATCH /courses/{id}` | CP-RF-022 |
| RF-023 | Competencia, requisitos y palabras clave | OBJ-01 | SGC-112 | P1 | 1 | courses · `courses` | F-05 | `PATCH /courses/{id}` | CP-RF-023 |
| RF-024 | Contenidos y perfiles | OBJ-01 | SGC-114 | P1 | 1 | courses · `courses` | F-04, F-05 | `PATCH /courses/{id}` | CP-RF-024 |
| RF-025 | Casa certificadora y programa | OBJ-01 | SGC-119 | P2 | 1 | courses · `courses` | F-02, F-06, F-11 | `PATCH /courses/{id}` | CP-RF-025 |
| RF-026 | E-commerce y metadata | OBJ-01 | SGC-121 | P2 | 1 | courses · `courses` | F-06 | `PATCH /courses/{id}` | CP-RF-026 |
| RF-027 | Adjuntos Word y PDF | OBJ-04 | SGC-218 | P2 | 2 | courses · `courses` | F-07, R-02 | `POST/GET/DELETE /courses/{id}/attachments` | CP-RF-027 |
| RF-028 | Gemini: Metodología y Descripción larga | OBJ-06 | SGC-123 | P2 | 2 | courses · `ai` | F-04, F-10 | `POST /ai/suggestions` | CP-RF-028 |
| RF-029 | Gemini: Descripción corta y Meta descripción | OBJ-06 | SGC-125 | P2 | 2 | courses · `ai` | F-09, MB-04 | `POST /ai/suggestions` | CP-RF-029 |
| RF-030 | Envío a revisión | OBJ-04 | SGC-130 | P1 | 1 | courses · `approval` | F-08, F-11, F-12, F-13, MB-05 | `POST /courses/{id}/submit` | CP-RF-030 |
| RF-031 | Bandeja de revisión | OBJ-04 | SGC-131 | P1 | 2 | courses · `approval` | R-01, MB-06 | `GET /review-inbox` | CP-RF-031 |
| RF-032 | Validar, corregir o generar código | OBJ-04 | SGC-133 | P1 | 2 | courses · `approval` | R-02, R-03, R-04 | `PATCH /courses/{id}/code`, `POST /courses/{id}/code/generate` | CP-RF-032 |
| RF-033 | Aprobación del curso | OBJ-04 | SGC-135 | P1 | 2 | courses · `approval` | R-05, R-06, R-07 | `POST /courses/{id}/approve` | CP-RF-033 |
| RF-034 | Paso a En producción | OBJ-04 | SGC-227 | P2 | 2 | courses · `approval` | R-06, R-08 | `POST /courses/{id}/move-to-production` | CP-RF-034 |
| RF-035 | Eliminación lógica (Inactivo) | OBJ-05 | SGC-137 | P2 | 1 | courses · `courses` | C-07, R-09 | `POST /courses/{id}/deactivate` | CP-RF-035 |
| RF-036 | Correo a Desarrollo Curricular | OBJ-04 | SGC-138 | P2 | 2 | notifications · `notifications` | N-03 | Efecto de `POST /courses/{id}/submit` | CP-RF-036 |
| RF-037 | Notificación de escritorio | OBJ-04 | SGC-139 | P2 | 1 | notifications · `notifications` | N-02 | `GET /notifications/stream` (SSE, [PV-05](README.md#7-decisiones-pendientes-de-validación)) | CP-RF-037 |
| RF-038 | Aviso de aprobación | OBJ-04 | SGC-140 | P2 | 2 | notifications · `notifications` | N-04, R-06, P-05 | Efecto de `POST /courses/{id}/approve` | CP-RF-038 |
| RF-039 | Listado de cursos según rol | OBJ-01 | SGC-142 | P1 | 1 | courses · `courses` | C-01, C-02, C-03, MB-02 | `GET /courses` | CP-RF-039 |
| RF-040 | Detalle de curso | OBJ-05 | SGC-144 | P2 | 1 | courses · `courses` | C-05, C-06, MB-03 | `GET /courses/{id}` | CP-RF-040 |
| RF-041 | Búsqueda y filtrado de cursos | OBJ-05 | SGC-219 | P2 | 1 | courses · `courses` | C-01, C-02, C-03 | `GET /courses?q=&schoolId=&status=` | CP-RF-041 |
| RF-042 | Reporte de producción | OBJ-05 | SGC-145 | P2 | 2 | reports · `reports` | RP-01, RP-02, TB-06, MB-07 | `GET /reports/production` | CP-RF-042 |
| RF-043 | Reporte histórico y comparativo | OBJ-05 | SGC-146 | P2 | 2 | reports · `reports` | RP-03, RP-04, RP-05 | `GET /reports/history` | CP-RF-043 |
| RF-044 | Interfaz bilingüe | OBJ-06 | SGC-150 | P2 | 2 | i18n · `i18n` | N-05, N-06, selector de idioma | `PATCH /me/preferences` | CP-RF-044 |

RF con pendientes del cliente que afectan la implementación: RF-020 y RF-028 (metodología, [PV-11](README.md#7-decisiones-pendientes-de-validación)), RF-042 (relación curso–carrera, [PV-10](README.md#7-decisiones-pendientes-de-validación)), RF-011 (escuela ↔ director, [PV-07](README.md#7-decisiones-pendientes-de-validación)), RF-017 (Python, [PV-06](README.md#7-decisiones-pendientes-de-validación)), RF-032 (algoritmo del código, [PV-08](README.md#7-decisiones-pendientes-de-validación)).

### 7.2 Resumen de RNF

Los IDs de Jira y CP de cada RNF están en la ERS §6 (CP-RNF-xxx con el mismo número). Todos son transversales.

| Categoría | RNF | Jira | Dónde se implementa | Cómo se verifica |
|---|---|---|---|---|
| Seguridad | RNF-001 a RNF-012 | SGC-162 a SGC-173 | `shared/validation`, `auth`, middlewares; [12](12-SECURITY.md), [13](13-AUTHENTICATION-AUTHORIZATION.md) | Pruebas unitarias de contraseña, negativas por rol y escuela, de seguridad ([16 §7.4](16-TESTING.md#74-pruebas-de-seguridad)); revisión de secretos |
| Privacidad | RNF-013 a RNF-015 | SGC-174, SGC-175, SGC-177 | Proyecciones por rol en `users` y `courses`; inventario en [12 §7.3](12-SECURITY.md#73-datos-personales-rnf-013-a-rnf-015) | Pruebas por rol sin campos personales; revisión del modelo |
| Rendimiento | RNF-016 a RNF-020 | SGC-178 a SGC-182 | Índices ([11](11-MONGODB.md)), paginación ([10](10-REST-API.md)), indicador de progreso | Mediciones de [16 §7.5](16-TESTING.md#75-rendimiento) con 5 000 cursos |
| Disponibilidad | RNF-021 | SGC-183 | Ambiente de producción ([PV-19](README.md#7-decisiones-pendientes-de-validación)) | Monitoreo del hosting (sin definir) |
| Confiabilidad | RNF-022 a RNF-024 | SGC-184 a SGC-186 | Guardado en servidor, manejo de errores de Gemini y correo | Pruebas de integración con dobles que fallan |
| Integridad | RNF-025 a RNF-027 | SGC-187 a SGC-189 | Transiciones atómicas, sin borrado físico, `updatedAt` ([11](11-MONGODB.md)) | Pruebas de integración de transiciones y fechas |
| Usabilidad | RNF-028 a RNF-032 | SGC-191 a SGC-194, SGC-197 | Design System, formularios, responsive ([04](04-HTML.md), [06](06-DESIGN-SYSTEM.md), [15](15-RESPONSIVE-DESIGN.md)) | Revisión heurística, E2E, capturas a 360/768/1440 |
| Accesibilidad | RNF-033 a RNF-037 | SGC-198 a SGC-202 | [14](14-ACCESSIBILITY.md) | axe + recorrido por teclado + revisión de contraste |
| Internacionalización | RNF-038 a RNF-040 | SGC-204 a SGC-206 | Diccionarios `es`/`en` ([20](20-INTERNATIONALIZATION.md)) | Revisión de vistas en inglés; prueba de tildes y ñ |
| Compatibilidad | RNF-041 a RNF-044 | SGC-207 a SGC-210 | HTML, CSS y JS estándar sin transpilar | Playwright + ejecución manual ([16 §7.6](16-TESTING.md#76-compatibilidad-rnf-041-a-rnf-044)) |
| Mantenibilidad | RNF-045 a RNF-048 | SGC-211 a SGC-214 | Capas y módulos ([03](03-PROJECT-ARCHITECTURE.md)), `config/env.js`, pruebas, documentación de integraciones | Revisión técnica, `npm test`, documentación en [09](09-NODEJS-BACKEND.md) |
| Identidad visual | RNF-049 | SGC-216 | Tokens del Design System ([06](06-DESIGN-SYSTEM.md)) | Revisión visual contra Figma |

### 7.3 Mantenimiento de la matriz

1. El autor del PR actualiza la fila del RF (pantallas, endpoint, pruebas) en el mismo PR.
2. El revisor verifica que el RF citado en el PR coincide con la historia Jira y con los CA implementados.
3. Al cerrar la historia, el CP-RF se ejecuta y su evidencia se adjunta al documento de casos de prueba de la iteración.
4. Si la ERS cambia de versión, se revisa la matriz completa en un PR `docs(standards): update traceability to ERS vX.Y`.

## 8. Errores frecuentes

- Ramas o PR sin ID de Jira, o con el ID de otra historia.
- Citar el RF de la ERS v1.0 (por ejemplo, el antiguo RF-040 "contador") en lugar del de la v1.1 (Apéndice F de la ERS).
- Implementar propuestas UX del handoff (Inicio por rol, panel de avisos) como si fueran requerimientos confirmados.
- Pruebas sin ID de requerimiento, imposibles de relacionar con un CP.
- Actualizar el código y olvidar la fila de la matriz.
- Cerrar la historia en Jira antes de ejecutar el CP con evidencia.

## 9. Checklist

- [ ] La rama y el PR citan la historia SGC-n correcta.
- [ ] Los commits llevan `Refs:` o `Closes:` con la historia.
- [ ] El PR lista RF/RNF/RN, pantallas, endpoints y pruebas.
- [ ] Las pruebas citan el RF en `describe`.
- [ ] La fila de §7.1 está actualizada.
- [ ] El CP-RF tiene evidencia antes de cerrar la historia.
- [ ] No se implementó nada fuera de la ERS sin marcarlo como pendiente de validación.

## 10. Referencias

- ERS v1.1, §6 Matriz de trazabilidad y Apéndice F: `docs/documento ERS v1.1.pdf`.
- Estado del proyecto y asignación por módulo: [`docs/ESTADO.md`](../ESTADO.md).
- Matriz de cobertura requerimiento → pantallas: `wireframes/09-handoff/08-matriz-de-cobertura-requerimiento-pantallas.png`.
- Conventional Commits (footers): https://www.conventionalcommits.org/en/v1.0.0/
- Relacionados: [01](01-GIT-AND-COMMITS.md), [02](02-BRANCHING-AND-PR.md), [16](16-TESTING.md), [23](23-DEFINITION-OF-DONE.md).
