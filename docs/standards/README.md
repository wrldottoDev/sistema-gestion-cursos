# Estándares de ingeniería · Sistema de Gestión de Cursos CENFOTEC

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Rama de referencia:** `redesign/iteracion-2`
> **Aplica a:** los tres integrantes del equipo y a cualquier asistente de IA que genere o revise código en este repositorio.

## 1. Propósito

Esta carpeta es la **fuente oficial** de las reglas de ingeniería del proyecto para la Iteración 2 (16 nov – 6 dic 2026). Define cómo se escribe, organiza, prueba, revisa, versiona e integra el código, con decisiones explícitas y verificables. Un PR que contradiga estos documentos se corrige o se acompaña de un cambio aprobado al estándar; no se aceptan excepciones silenciosas.

## 2. Jerarquía de fuentes

Cuando dos documentos se contradicen, prevalece el de mayor jerarquía:

1. **ERS v1.1** (`docs/documento ERS v1.1.pdf`, 12 oct 2026): requerimientos, reglas de negocio (RN-01 a RN-29), estados, campos y restricciones del curso.
2. **Wireframes, Design System y handoff** (`wireframes/`, secciones 03–09): comportamiento e interfaz aprobados. El propio handoff declara que ante contradicción prevalece la ERS (tabla X-01 a X-15).
3. **Estos estándares** y los **ADR** (`docs/adr/`).
4. Costumbre o preferencia personal (no es fuente).

Ningún estándar puede contradecir la ERS. Si un estándar parece hacerlo, es un error del estándar: se reporta y se corrige.

## 3. Cómo leer las reglas

| Término | Significado |
|---|---|
| **DEBE / NO DEBE** | Obligatorio. Su incumplimiento bloquea el PR. |
| **DEBERÍA / NO DEBERÍA** | Recomendado. Desviarse requiere justificarlo en el PR. |
| **PUEDE** | Opcional. Queda a criterio del autor. |

Cada decisión se etiqueta con su estado real, para no presentar planes como hechos:

| Etiqueta | Significado |
|---|---|
| **Implementado** | Existe hoy en el repositorio. |
| **Confirmado (ERS)** | Requerimiento confirmado en la ERS v1.1 o restricción del curso definida por el docente. |
| **Adoptado** | Convención oficial que este estándar adopta; obligatoria desde su publicación. |
| **Pendiente de validación** | Propuesta razonada que requiere confirmación del equipo o del docente (ver [§7](#7-decisiones-pendientes-de-validación)). |

## 4. Índice

| # | Documento | Tema | Lectura |
|---|---|---|---|
| — | [README](README.md) | Índice, jerarquía, decisiones clave y pendientes | Todos |
| 01 | [Git y commits](01-GIT-AND-COMMITS.md) | Conventional Commits, tipos, scopes, cuerpo, breaking changes | Todos |
| 02 | [Ramas y Pull Requests](02-BRANCHING-AND-PR.md) | Modelo de ramas, Jira, PR, revisión, merge, conflictos, protección | Todos |
| 03 | [Arquitectura del proyecto](03-PROJECT-ARCHITECTURE.md) | Tres capas, carpetas, dependencias, glosario de dominio | Todos |
| 04 | [HTML](04-HTML.md) | Semántica, formularios, tablas, navegación, validación | Frontend |
| 05 | [CSS y BEM](05-CSS-AND-BEM.md) | Organización, capas, BEM, especificidad, unidades, media queries | Frontend |
| 06 | [Design System](06-DESIGN-SYSTEM.md) | Tokens, color, tipografía, espaciado, componentes, fidelidad con Figma | Frontend |
| 07 | [Bootstrap](07-BOOTSTRAP.md) | Componentes, grid, personalización, JS bundle, convivencia con CSS propio | Frontend |
| 08 | [JavaScript](08-JAVASCRIPT.md) | Nombres, ES Modules, DOM, eventos, async, errores, organización | Todos |
| 09 | [Backend Node.js](09-NODEJS-BACKEND.md) | Servidor, controladores, servicios, middlewares, configuración | Backend |
| 10 | [API REST](10-REST-API.md) | Rutas, métodos, status codes, JSON, paginación, OpenAPI | Todos |
| 11 | [MongoDB](11-MONGODB.md) | Colecciones, referencias, índices, validación, migraciones, eliminación lógica | Backend |
| 12 | [Seguridad](12-SECURITY.md) | OWASP ASVS, secretos, entradas, cabeceras, errores, registro | Todos |
| 13 | [Autenticación y autorización](13-AUTHENTICATION-AUTHORIZATION.md) | Google Identity, sesiones, RBAC, alcance por escuela | Todos |
| 14 | [Accesibilidad](14-ACCESSIBILITY.md) | WCAG 2.2 AA, teclado, foco, lectores de pantalla, modales | Frontend |
| 15 | [Diseño responsive](15-RESPONSIVE-DESIGN.md) | Mobile-first, breakpoints, layouts, pruebas visuales | Frontend |
| 16 | [Pruebas](16-TESTING.md) | Estrategia, herramientas, cobertura, casos negativos y de seguridad | Todos |
| 17 | [Documentación](17-DOCUMENTATION.md) | Markdown, JSDoc, README, ADR, documentación de API | Todos |
| 18 | [Calidad de código](18-CODE-QUALITY.md) | ESLint, Prettier, EditorConfig, revisión, complejidad, deuda técnica | Todos |
| 19 | [CI/CD](19-CI-CD.md) | GitHub Actions, validaciones automáticas, criterios del pipeline | Todos |
| 20 | [Internacionalización](20-INTERNATIONALIZATION.md) | Diccionarios, claves, BCP 47, `Intl` | Todos |
| 21 | [Versionado](21-VERSIONING.md) | SemVer, tags, releases, conservación de iteraciones | Todos |
| 22 | [Trazabilidad](22-REQUIREMENTS-TRACEABILITY.md) | ERS → Jira → módulo → pantalla → prueba | Todos |
| 23 | [Definición de terminado](23-DEFINITION-OF-DONE.md) | Checklist obligatorio antes de aprobar una funcionalidad | Todos |

Documentos relacionados fuera de esta carpeta: [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`AGENTS.md`](../../AGENTS.md) (instrucciones para asistentes de IA), [ADR](../adr/README.md), [plantilla de PR](../../.github/PULL_REQUEST_TEMPLATE.md).

## 5. Orden de lectura

1. **Antes del primer commit (todos):** este README → [23 Definición de terminado](23-DEFINITION-OF-DONE.md) → [01](01-GIT-AND-COMMITS.md) → [02](02-BRANCHING-AND-PR.md) → [03](03-PROJECT-ARCHITECTURE.md) → [18](18-CODE-QUALITY.md).
2. **Antes de tocar interfaz:** [06](06-DESIGN-SYSTEM.md) → [04](04-HTML.md) → [05](05-CSS-AND-BEM.md) → [07](07-BOOTSTRAP.md) → [14](14-ACCESSIBILITY.md) → [15](15-RESPONSIVE-DESIGN.md) → [20](20-INTERNATIONALIZATION.md) → [08](08-JAVASCRIPT.md).
3. **Antes de tocar servidor o datos:** [08](08-JAVASCRIPT.md) → [09](09-NODEJS-BACKEND.md) → [10](10-REST-API.md) → [11](11-MONGODB.md) → [12](12-SECURITY.md) → [13](13-AUTHENTICATION-AUTHORIZATION.md).
4. **Antes de abrir el PR:** [16](16-TESTING.md) → [22](22-REQUIREMENTS-TRACEABILITY.md) → [23](23-DEFINITION-OF-DONE.md).

## 6. Decisiones clave

| Tema | Decisión | Estado | Detalle |
|---|---|---|---|
| Arquitectura | Monolito modular de tres capas (presentación, servicio, datos); un proceso Express sirve el frontend estático y la API `/api/v1` en el mismo origen | Adoptado | [ADR-0002](../adr/0002-modular-monolith-three-layers.md), [03](03-PROJECT-ARCHITECTURE.md) |
| Frontend | Páginas HTML + ES Modules nativos, sin framework ni bundler; Bootstrap 5.3 sin modificar + CSS propio en cascade layers y BEM | Adoptado | [ADR-0003](../adr/0003-frontend-mpa-es-modules-bootstrap.md), [05](05-CSS-AND-BEM.md), [07](07-BOOTSTRAP.md) |
| Persistencia | Driver oficial `mongodb` + `$jsonSchema` + índices únicos; sin ODM | Pendiente de validación | [ADR-0004](../adr/0004-mongodb-native-driver-json-schema.md), [11](11-MONGODB.md) |
| Sesión y Google | Sesión de servidor (cookie HttpOnly) y verificación del ID token de Google Identity Services en el servidor | Adoptado (flujo de Google: pendiente) | [ADR-0005](../adr/0005-server-sessions-google-identity.md), [13](13-AUTHENTICATION-AUTHORIZATION.md) |
| Idioma del código | Identificadores, commits y ramas en inglés; documentación y comentarios en español; glosario de dominio obligatorio | Adoptado | [ADR-0006](../adr/0006-english-identifiers-domain-glossary.md), [03 §Glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) |
| Contraseñas | PBKDF2-HMAC-SHA256 con `node:crypto`, sal por usuario, 600 000 iteraciones | Adoptado | [ADR-0007](../adr/0007-password-hashing-pbkdf2.md), [12](12-SECURITY.md) |
| Pruebas | `node:test` + `node:assert`; integración con `fetch` nativo; Playwright + axe para E2E y accesibilidad | Adoptado (E2E recomendado) | [ADR-0008](../adr/0008-node-test-runner.md), [16](16-TESTING.md) |
| Git | Conventional Commits en inglés, scopes por módulo, `Refs: SGC-n` en el footer, squash merge hacia `redesign/iteracion-2` | Adoptado | [01](01-GIT-AND-COMMITS.md), [02](02-BRANCHING-AND-PR.md) |
| Versionado | SemVer; Iteración 1 = `v1.0.0`, Iteración 2 = `v2.0.0`; API versionada en la ruta (`/api/v1`) | Adoptado | [21](21-VERSIONING.md) |

## 7. Decisiones pendientes de validación

Lista única. Los demás documentos enlazan aquí en vez de repetirla. Mientras no se resuelva, se aplica la propuesta indicada.

| ID | Tema | Propuesta vigente mientras tanto | Origen | Decide |
|---|---|---|---|---|
| PV-01 | Driver nativo de MongoDB frente a Mongoose | Driver nativo + `$jsonSchema` | [ADR-0004](../adr/0004-mongodb-native-driver-json-schema.md) | Equipo + docente |
| PV-02 | Flujo de Google: ID token de GIS frente a *authorization code* con PKCE | ID token verificado en servidor | [ADR-0005](../adr/0005-server-sessions-google-identity.md) | Equipo |
| PV-03 | Duración de sesión, aviso de expiración y cierre de sesión | 30 min de inactividad, 8 h absolutas; aviso 60 s antes con opción de extender (WCAG 2.2.1); endpoint de logout sin botón en UI | ERS §1.2 y Apéndice E; handoff D-07; [14](14-ACCESSIBILITY.md) | Docente |
| PV-04 | Origen de Bootstrap y fuentes | Paquete npm y fuentes autoalojadas, sin CDN. Mientras no hay backend: Bootstrap 5.3.8 copiado sin modificar en `frontend/vendor/bootstrap/` y Barlow/Figtree (OFL) en `frontend/fonts/` | [07](07-BOOTSTRAP.md), [06](06-DESIGN-SYSTEM.md) | Equipo |
| PV-05 | Notificaciones de escritorio en Iteración 2 (RF-037 CA4) | Server-Sent Events + Notifications API | [09](09-NODEJS-BACKEND.md) | Equipo |
| PV-06 | Uso de Python (RF-017) | Script con módulo `csv` de la biblioteca estándar, invocado con `spawn` y salida JSON | ERS Apéndice E | Docente |
| PV-07 | Dependencia circular escuela ↔ director (RF-011 CA1 frente a RF-004 CA3) | Fuente única `users.schoolId`; crear la escuela primero y asignar director después | [11](11-MONGODB.md) | Docente |
| PV-08 | Algoritmo oficial del código del curso y formato del código de escuela | `PREFIJO-NÚMERO`; el código de la escuela (2–5 mayúsculas, p. ej. `SOFT`) es el prefijo; la propuesta de código empieza en 101 | ERS Apéndice E; [11](11-MONGODB.md) | Cliente |
| PV-09 | Estructura de la metadata | Texto libre | ERS Apéndice E | Cliente |
| PV-10 | Relación curso ↔ carrera (filtro de reportes RF-042) | Campo opcional, filtro marcado como pendiente | ERS Apéndice E | Cliente |
| PV-11 | Metodología: catálogo, texto con Gemini o ambos | Ambos (handoff D-06) | ERS Apéndice E | Cliente |
| PV-12 | Opciones del campo Sexo | Sin definir; no se implementa lista cerrada sin confirmación | Handoff 09 | Cliente |
| PV-13 | Datos del perfil de Google a importar | Ninguno; se usa solo el correo para buscar el usuario | ERS Apéndice E | Cliente |
| PV-14 | Devolución del curso al Director | No existe hasta confirmarse | ERS Apéndice E | Cliente |
| PV-15 | Propuestas UX: Inicio por rol, panel de avisos, "¿Salir sin guardar?", copiar datos para Power Campus | Se diseñan; se implementan solo si se aprueban | Handoff D-02, D-09, D-10 | Docente |
| PV-16 | Proveedor de correo (SMTP) | `nodemailer` con SMTP configurable | ERS §2.6 | Equipo |
| PV-17 | Medidas de layout que difieren entre fuentes: riel en tablet (80 px en especificaciones, 72 px en el grid) y gutter en móvil (12 px en el DS, 16 px con `g-3` de Bootstrap) | Riel 72 px; gutter 16 px | Handoff 09 vs DS 04; [15](15-RESPONSIVE-DESIGN.md) | Diseño |
| PV-18 | Acciones en GitHub: tag `v1.0.0`, protección de ramas, bloqueo de `legacy/iteracion-1`, *secret scanning* con *push protection*, alertas de Dependabot, borrado de ramas remotas ya integradas y, opcionalmente, `redesign/iteracion-2` como rama por defecto durante la iteración | Ejecutar según [02](02-BRANCHING-AND-PR.md), [12](12-SECURITY.md) y [21](21-VERSIONING.md) | Auditoría | Dueño del repo |
| PV-19 | Ambiente de producción con HTTPS (RNF-009) | Sin definir; [19](19-CI-CD.md) cubre solo CI | Auditoría | Equipo |
| PV-20 | Preferencia de idioma | Campo `preferredLanguage` del usuario + `localStorage` antes de iniciar sesión | [20](20-INTERNATIONALIZATION.md) | Equipo |
| PV-21 | Pruebas E2E automatizadas obligatorias o recomendadas, y ubicación de la evidencia de los casos de aceptación | E2E recomendadas; casos manuales con evidencia obligatorios, registrados en un documento de casos de prueba de la Iteración 2 equivalente al de la Iteración 1 | [16](16-TESTING.md) | Equipo |
| PV-22 | Valores de tokens no exportados de Figma: `chart/*`, sombras de elevación y neumorfismo, ancho del halo de foco | Extraer de Figma antes de implementar; halo provisional de 4 px | [06](06-DESIGN-SYSTEM.md) | Diseño |
| PV-23 | Tamaño máximo del archivo CSV de importación | La ERS solo fija el rendimiento con 1 000 filas (RNF-018); se propone 1 MB | [12](12-SECURITY.md) | Cliente |
| PV-24 | Máximo de adjuntos por curso | Sin límite de cantidad; 10 MB por archivo (RN-28) | ESTADO.md, pregunta 4 | Cliente |
| PV-25 | Obligatoriedad de la moneda del curso | Opcional: el Apéndice B de la ERS no la incluye entre los campos para envío | [11](11-MONGODB.md) | Cliente |
| PV-26 | Visibilidad del nombre del autor de un curso para otros roles frente a RNF-014 | Se muestra el nombre completo; ningún otro dato personal | [12](12-SECURITY.md) | Docente |
| PV-27 | Etiquetas en inglés de roles, estados y catálogos fijos | Las de [20](20-INTERNATIONALIZATION.md), a validar contra la pantalla N-05 | [20](20-INTERNATIONALIZATION.md) | Diseño |

## 8. Estado del repositorio al 14 nov 2026

| Ámbito | Estado | Detalle |
|---|---|---|
| Frontend | **Implementado (parcial)** | `frontend/index.html` (inicio de sesión sin JS) y tokens CSS heredados de la Iteración 1. Deuda registrada en [18 §Deuda técnica](18-CODE-QUALITY.md#registro-de-deuda-técnica). |
| Backend | No iniciado | `backend/` solo contiene `.gitkeep`. |
| Dependencias | Ninguna | No existe `package.json` ni lockfile. |
| Herramientas de calidad | **Configuradas en esta revisión** | `.editorconfig`, `.prettierrc.json`, `eslint.config.js`; inactivas hasta instalar dependencias. |
| Pruebas y CI | No iniciado | Plan en [16](16-TESTING.md) y [19](19-CI-CD.md). |
| Protección de ramas | No configurada | `main` sin protección (PV-18). |

## 9. Cómo se cambia un estándar

1. Rama `docs/SGC-<n>-<tema>` (o sin Jira si es mantenimiento: `docs/standards-<tema>`).
2. Commit `docs(standards): <cambio>`; si cambia una decisión arquitectónica, nuevo ADR o ADR que reemplaza a otro (nunca se edita la decisión de un ADR aceptado).
3. PR con aprobación de **los otros dos integrantes** (no solo uno, como en el código).
4. Se actualiza la versión de este README: PATCH por aclaraciones, MINOR por reglas nuevas, MAJOR por reglas que invalidan código existente.

## 10. Uso por asistentes de IA

Los asistentes **DEBEN** leer [`AGENTS.md`](../../AGENTS.md) y los documentos del área que tocan antes de generar código, respetar el [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio), no inventar endpoints, campos ni dependencias fuera de estos documentos y marcar como **Pendiente de validación** cualquier supuesto. El autor humano es responsable del código generado y lo revisa como si fuera propio.
