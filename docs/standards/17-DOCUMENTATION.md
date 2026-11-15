# 17 · Documentación

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se escribe y dónde vive la documentación técnica del proyecto: archivos Markdown, comentarios y JSDoc en el código, README de módulos, Architecture Decision Records (ADR), la especificación OpenAPI y la documentación de integraciones y datos personales que exige la ERS (RNF-015, RNF-048).

Fuera de alcance: el **diseño** de la API (rutas, status codes, formato de errores) está en [10](10-REST-API.md); el formato de los comentarios de deuda técnica (`TODO(SGC-n):`) en [18](18-CODE-QUALITY.md); la matriz de trazabilidad en [22](22-REQUIREMENTS-TRACEABILITY.md). Los entregables académicos (ERS, Documento de Diseño, casos de prueba en PDF/DOCX) siguen la plantilla del curso y no se rigen por este documento.

## 2. Estándar adoptado

| Elemento | Estándar | Estado |
|---|---|---|
| Documentos del repositorio | Markdown con GitHub Flavored Markdown (GFM) | Adoptado |
| Diagramas | Mermaid embebido en Markdown (GitHub lo renderiza) | Adoptado |
| Documentación de código | Comentarios y [JSDoc](https://jsdoc.app/) en español | Adoptado |
| Decisiones de arquitectura | ADR en formato de Michael Nygard, en `docs/adr/` | Adoptado (índice y ADR-0001 a ADR-0008 en [`docs/adr/`](../adr/README.md)) |
| Contrato de la API | [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) en `docs/api/openapi.yaml` | Adoptado; archivo pendiente de crear con el primer endpoint |
| Integraciones (RNF-048) | `backend/src/integrations/README.md` | Adoptado; pendiente de crear con la primera integración |
| Datos personales (RNF-015) | `backend/src/modules/users/README.md` | Adoptado; pendiente de crear con el módulo de usuarios |

## 3. Justificación

- **Markdown junto al código.** Se versiona, se revisa en el mismo PR que el cambio y se lee directamente en GitHub. Un documento que vive fuera del repositorio se desactualiza sin que nadie lo note.
- **Mermaid en lugar de imágenes.** Los diagramas en texto se pueden comparar en un diff; una imagen exportada no.
- **JSDoc sin TypeScript.** El stack excluye TypeScript ([ADR-0003](../adr/0003-frontend-mpa-es-modules-bootstrap.md)); JSDoc da a VS Code autocompletado y verificación de tipos opcional (`// @ts-check`) sin dependencias ni compilación.
- **ADR.** Las decisiones (por qué driver nativo y no Mongoose, por qué PBKDF2) se pierden si solo quedan en conversaciones. Un ADR breve conserva el contexto para el docente, para el equipo dentro de tres semanas y para los asistentes de IA.
- **OpenAPI como contrato.** Frontend y backend se desarrollan en paralelo por integrantes distintos; un contrato escrito evita suposiciones sobre nombres de campos y errores.
- **Exigencias de la ERS.** RNF-048 pide documentar configuración y manejo de errores de Google Identity, Gemini, MongoDB Atlas, correo, notificaciones de escritorio y Python; RNF-015 pide identificar la finalidad de cada dato personal.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| DOC-01 | La documentación técnica DEBE redactarse en español técnico; identificadores, comandos, código y nombres de herramientas se mantienen en inglés ([ADR-0006](../adr/0006-english-identifiers-domain-glossary.md)). |
| DOC-02 | Cada archivo Markdown DEBE tener un único `#` (H1) y no saltar niveles de encabezado (de `##` no se pasa a `####`). |
| DOC-03 | Los enlaces entre documentos del repositorio DEBEN ser relativos (`../adr/0004-mongodb-native-driver-json-schema.md`), nunca URLs absolutas de GitHub a la misma rama. |
| DOC-04 | Los bloques de código DEBEN declarar su lenguaje (`js`, `bash`, `json`, `yaml`, `html`, `css`, `text`). |
| DOC-05 | Toda función, clase o constante exportada desde `shared/`, desde `backend/src/modules/*/*.service.js` y desde `frontend/js/core/` DEBE tener JSDoc con descripción, `@param`, `@returns` y `@throws` cuando lanza errores de dominio. |
| DOC-06 | Los comentarios DEBEN explicar el **por qué** (regla de negocio, restricción, decisión) y citar el requerimiento cuando aplica (`// RN-12: …`). No describen lo que el código ya dice. |
| DOC-07 | Una decisión que elige, reemplaza o elimina una dependencia, cambia la arquitectura en capas, el modelo de datos con migración o un mecanismo de seguridad DEBE registrarse en un ADR. Resolver un pendiente PV-xx con una decisión arquitectónica también requiere ADR. |
| DOC-08 | Un ADR aceptado NO DEBE editarse en su contexto ni en su decisión; si la decisión cambia, se crea un ADR nuevo que lo reemplaza y solo se actualiza el campo Estado del anterior. |
| DOC-09 | Todo cambio en un endpoint (ruta, parámetro, campo, status code, error) DEBE actualizar `docs/api/openapi.yaml` en el mismo PR ([10](10-REST-API.md)). |
| DOC-10 | Cada integración externa DEBE documentar en `backend/src/integrations/README.md` su propósito, variables de entorno, comportamiento ante fallos y cómo probarla localmente (RNF-048). |
| DOC-11 | Agregar, eliminar o cambiar el uso de un dato personal DEBE actualizar la tabla de finalidad de `backend/src/modules/users/README.md` en el mismo PR (RNF-013, RNF-015). |
| DOC-12 | Los documentos NO DEBEN contener secretos, tokens, URIs de conexión reales ni datos personales reales; los ejemplos usan valores ficticios (`ana.perez@ucenfotec.ac.cr`, `mongodb+srv://<user>:<password>@<cluster>/`). |
| DOC-13 | Los documentos NO DEBEN describir como existente algo que no está implementado; se usan las etiquetas de estado del [README](README.md#3-cómo-leer-las-reglas). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| DOC-14 | Los diagramas DEBERÍAN escribirse en Mermaid; las imágenes se reservan para capturas de pantalla y se guardan en `docs/img/` con texto alternativo. |
| DOC-15 | El encabezado de cada módulo de página del frontend DEBERÍA indicar la pantalla del handoff y los requerimientos que implementa: `// Pantalla C-01 · Listado de cursos (RF-039, RF-041)`. |
| DOC-16 | Los tipos de dominio DEBERÍAN declararse una sola vez con `@typedef` (en el `*.schema.js` del módulo o en el módulo de `shared/` que define la entidad) e importarse con `import('./ruta.js').Tipo`. |
| DOC-17 | Las tablas DEBERÍAN usarse para comparaciones y matrices; las listas, para pasos y reglas sueltas. |
| DOC-18 | Un párrafo DEBERÍA tener cinco líneas o menos; si crece, conviene dividirlo o convertirlo en lista. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| DOC-19 | Un archivo JS PUEDE empezar con `// @ts-check` para que VS Code verifique los tipos JSDoc sin instalar TypeScript. |
| DOC-20 | Se PUEDE validar `docs/api/openapi.yaml` con `npx @redocly/cli lint docs/api/openapi.yaml` (no instalado). |
| DOC-21 | Se PUEDE incluir un ejemplo `@example` en funciones de `shared/` cuyo comportamiento no es obvio (normalización de texto, cálculo de edad). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Documentos convencionales de la raíz | MAYÚSCULAS | `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CHANGELOG.md` |
| Estándares | `NN-TOPIC-NAME.md` | `17-DOCUMENTATION.md` |
| ADR | `NNNN-kebab-case-title.md`, número de 4 dígitos, nunca reutilizado | `0004-mongodb-native-driver-json-schema.md` |
| Otros documentos | kebab-case en inglés | `docs/api/openapi.yaml`, `docs/img/review-inbox-1440.png` |
| README de módulo | `README.md` dentro de la carpeta | `backend/src/integrations/README.md` |
| `operationId` de OpenAPI | camelCase, verbo + recurso | `listCourses`, `approveCourse`, `listReviewInbox` |
| Tags de OpenAPI | Nombre del módulo en inglés | `auth`, `users`, `catalogs`, `courses`, `approval`, `ai`, `notifications`, `reports` |

Los entregables académicos existentes con espacios y tildes (`docs/documento ERS v1.1.pdf`, `docs/Casos de prueba Iteración 1.pdf`) se conservan con su nombre para no romper referencias externas; los archivos nuevos siguen la tabla.

## 6. Ejemplos

### 6.1 JSDoc de un servicio (correcto)

```js
/** @typedef {import('./courses.schema.js').Course} Course */

/**
 * Aprueba un curso en revisión y registra quién lo aprobó.
 * La transición es atómica: solo se aplica si el curso sigue en `in_development`
 * con el código validado (RF-033, RN-10, RNF-025). Los avisos por correo se envían
 * después y su fallo no revierte la aprobación (RF-038 CA3).
 *
 * @param {string} courseId - Identificador del curso (ObjectId en hexadecimal).
 * @param {{ id: string, role: string }} actor - Usuario autenticado que aprueba.
 * @returns {Promise<Course>} Curso con estado `approved`.
 * @throws {NotFoundError} Si el curso no existe.
 * @throws {ConflictError} Si el curso no está en revisión o su código no está validado.
 */
export async function approveCourse(courseId, actor) {
  // …
}
```

### 6.2 JSDoc de `shared/` con ejemplo

```js
/**
 * Normaliza un texto para búsquedas insensibles a mayúsculas y tildes
 * (RF-007 CA1, RF-016 CA1, RF-041 CA1).
 *
 * @param {string} text - Texto original.
 * @returns {string} Texto en minúsculas, sin diacríticos y con espacios colapsados.
 * @example
 * normalizeText('  Diseño ÁGIL ') // → 'diseno agil'
 */
export function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
```

### 6.3 Comentarios: correcto e incorrecto

```js
// Correcto: explica una regla que el código no puede expresar por sí solo.
// RN-12: los cursos nunca se eliminan físicamente; "Eliminar" en la interfaz los pasa a Inactivo.
await coursesRepository.updateStatus(courseId, 'inactive', actor);

// Incorrecto: repite el código y no aporta contexto.
// actualiza el estado a inactive
await coursesRepository.updateStatus(courseId, 'inactive', actor);
```

```js
// Incorrecto: código comentado "por si acaso". Se elimina; Git conserva el historial.
// const total = Number(classHours) + Number(extraHours) + 1;
```

### 6.4 ADR (plantilla)

```markdown
# ADR-0009: Título en forma de decisión

- **Estado:** Propuesto | Aceptado | Rechazado | Reemplazado por [ADR-00NN](00NN-...md)
- **Fecha:** 2026-11-20
- **Decisores:** Otoniel González, Sebastián Fernández, Valentina Cristancho
- **Relacionado:** PV-05, RF-037

## Contexto
Problema, restricciones (ERS, curso, plazo) y fuerzas en tensión.

## Decisión
Lo que se decide, en presente: "Usamos Server-Sent Events para…".

## Alternativas consideradas
- Web Push: …, descartada porque …

## Consecuencias
Positivas, negativas y lo que queda pendiente.
```

### 6.5 OpenAPI: estilo de una operación

```yaml
paths:
  /courses/{courseId}/approve:
    post:
      tags: [approval]
      operationId: approveCourse
      summary: Aprobar un curso en revisión
      description: |
        Cambia el curso de `in_development` a `approved` si su código está validado.
        Genera los avisos al Director y a Vicerrectoría; un fallo de correo no revierte la aprobación.
      x-requirements: [RF-033, RF-038, RN-10, RNF-025]
      security:
        - sessionCookie: []
      parameters:
        - $ref: '#/components/parameters/CourseId'
      responses:
        '200':
          description: Curso aprobado.
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/Course'
        '401':
          $ref: '#/components/responses/Unauthenticated'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          description: El curso no está en revisión o su código no está validado.
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'
              example:
                title: Transición de estado no permitida
                status: 409
                code: invalid_transition
components:
  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: sgc.sid
```

Reglas de estilo de `openapi.yaml`:

- `openapi: 3.1.0`; `servers: [{ url: /api/v1 }]`; `info.version` es la versión del contrato ([21](21-VERSIONING.md)).
- `summary` corto en español; `description` con la regla de negocio; extensión `x-requirements` con los RF/RN/RNF que implementa la operación (alimenta [22](22-REQUIREMENTS-TRACEABILITY.md)).
- Esquemas reutilizables en `components/schemas` (`Course`, `User`, `CatalogItem`, `ProblemDetails`, `PageMeta`); respuestas de error comunes en `components/responses`; nunca se repite un esquema en línea.
- Cada cuerpo de solicitud y cada respuesta de error tienen un `example` con datos ficticios.
- Nombres de campos idénticos a los del [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio).

### 6.6 Documentación de integraciones (RNF-048)

Estructura mínima de `backend/src/integrations/README.md`:

| Integración | Variables de entorno | Comportamiento ante fallo | Prueba local |
|---|---|---|---|
| Google Identity | `GOOGLE_CLIENT_ID`, `ALLOWED_EMAIL_DOMAIN` | Token inválido, cuenta no registrada u otro dominio: acceso denegado sin crear usuario (RF-001 CA2, CA3); cancelación o sin respuesta: mensaje y permanece en A-01 (CA4) | Cliente OAuth de desarrollo con `http://localhost:<PORT>` como origen autorizado |
| Gemini API | `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_TIMEOUT_MS` | Error o tiempo agotado: 502/504, el texto del usuario se conserva (RNF-023) | Clave de desarrollo; doble de prueba en tests ([16](16-TESTING.md)) |
| MongoDB Atlas | `MONGODB_URI`, `MONGODB_DB_NAME` | Sin conexión al arrancar: el proceso termina con error claro (configuración validada al inicio, [09](09-NODEJS-BACKEND.md)) | Cluster o base `sgc_test` separada, o MongoDB local |
| Correo | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Fallo registrado, el estado del curso no se revierte (RF-036 CA2, RF-038 CA3, RNF-024) | Servidor SMTP de pruebas del proveedor elegido (PV-16) |
| Notificaciones de escritorio | — | Permiso denegado o navegador sin soporte: no se muestra, el curso igual aparece en la bandeja (RF-037 CA2); reconexión automática del `EventSource` | Dos navegadores con sesiones de Director y de Desarrollo Curricular (PV-05) |
| Python (CSV) | `PYTHON_BIN` | Error o archivo inválido: se rechaza la carga completa indicando fila y error (RF-017 CA2) | `python3` local con archivos CSV de ejemplo (PV-06) |

### 6.7 Finalidad de datos personales (RNF-015)

`backend/src/modules/users/README.md` DEBE reproducir y mantener la tabla de la ERS §7.2: categoría (nombre, apellidos, identificación, correo institucional, correo personal, celular, fecha de nacimiento, sexo, fotografía, rol, contraseña protegida con hash), finalidad (identificar, autenticar, contactar, aplicar permisos), quién la consulta (solo el Administrador), conservación (mientras el usuario exista; se elimina con RF-006).

## 7. Aplicación en el sistema CENFOTEC

| Documento | Ubicación | Responsable de mantenerlo | Estado |
|---|---|---|---|
| Estándares | `docs/standards/` | Todo el equipo (cambios con 2 aprobaciones) | Implementado (esta revisión) |
| ADR | `docs/adr/` | Quien propone la decisión | Implementado (ADR-0001 a ADR-0008) |
| Contrato de la API | `docs/api/openapi.yaml` | Autor de cada endpoint | Pendiente de crear |
| Integraciones | `backend/src/integrations/README.md` | Autor de cada integración (Otoniel: Google, Gemini, correo; Valentina: Python, aviso de aprobación) | Pendiente de crear |
| Datos personales | `backend/src/modules/users/README.md` | Responsable del módulo Usuarios | Pendiente de crear |
| Guía de contribución | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Todo el equipo | Implementado (esta revisión) |
| Instrucciones para IA | [`AGENTS.md`](../../AGENTS.md) | Todo el equipo | Implementado (esta revisión) |
| README del proyecto | `README.md` | Todo el equipo | Implementado, **desactualizado** respecto de la ERS v1.1 (deuda D6 en [18](18-CODE-QUALITY.md#registro-de-deuda-técnica)) |

## 8. Errores frecuentes

1. Escribir JSDoc que repite el nombre de la función (`@returns el curso`) sin explicar reglas, errores ni efectos secundarios.
2. Actualizar el endpoint y olvidar el `openapi.yaml`: el otro integrante programa contra un contrato falso.
3. Editar un ADR aceptado para "corregir" la decisión en lugar de crear uno que lo reemplace.
4. Copiar en un estándar la misma regla que ya existe en otro documento: con el tiempo las dos copias divergen; se enlaza.
5. Pegar capturas de código en lugar de bloques de código.
6. Usar URIs reales de Atlas o correos reales de personas en ejemplos.
7. Documentar como "implementado" un comportamiento que solo está diseñado en Figma.

## 9. Checklist

- [ ] Los documentos nuevos o modificados tienen un H1, niveles consecutivos y enlaces relativos que funcionan.
- [ ] Las funciones exportadas de `shared/`, servicios y `frontend/js/core/` tienen JSDoc completo.
- [ ] Los comentarios explican el porqué y citan RF/RN cuando aplica; no hay código comentado.
- [ ] Si el PR cambia un endpoint, `docs/api/openapi.yaml` está actualizado con ejemplos y `x-requirements`.
- [ ] Si el PR toma una decisión arquitectónica o resuelve un PV, existe el ADR correspondiente.
- [ ] Si el PR toca una integración, su sección en `backend/src/integrations/README.md` está al día.
- [ ] Si el PR toca datos personales, la tabla de finalidad está al día.
- [ ] No hay secretos ni datos personales reales en la documentación.

## 10. Referencias

- GitHub Flavored Markdown: <https://github.github.com/gfm/>
- Mermaid en GitHub: <https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams>
- JSDoc: <https://jsdoc.app/>
- JSDoc en VS Code (`@ts-check`): <https://code.visualstudio.com/docs/languages/javascript#_type-checking>
- Architecture Decision Records: <https://adr.github.io/>
- Michael Nygard, *Documenting Architecture Decisions*: <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- OpenAPI Specification 3.1.0: <https://spec.openapis.org/oas/v3.1.0>
- RFC 9457 Problem Details for HTTP APIs: <https://www.rfc-editor.org/rfc/rfc9457>
- Documento relacionado: [10 · API REST](10-REST-API.md), [18 · Calidad de código](18-CODE-QUALITY.md), [22 · Trazabilidad](22-REQUIREMENTS-TRACEABILITY.md).
