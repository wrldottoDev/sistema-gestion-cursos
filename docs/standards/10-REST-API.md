# 10 · API REST

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define el contrato HTTP entre el frontend y el servidor: forma de las rutas, métodos, códigos de estado, formato JSON de éxito y error, paginación, filtros, orden, acciones de cambio de estado, versionado y el documento OpenAPI que lo formaliza. Incluye el catálogo de endpoints previstos con el permiso que exige cada uno.

Estado: la API **no existe todavía**; este documento es el contrato **Adoptado** al que debe ajustarse la implementación. Cómo se implementan rutas y controladores está en [09](09-NODEJS-BACKEND.md); qué significa cada permiso, en [13](13-AUTHENTICATION-AUTHORIZATION.md); cómo se redacta la documentación, en [17](17-DOCUMENTATION.md).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Estilo | REST orientado a recursos sobre HTTP (RFC 9110), JSON en UTF-8 | Adoptado |
| Base | `/api/v1`, mismo origen que el frontend | Adoptado ([03](03-PROJECT-ARCHITECTURE.md)) |
| Errores | Problem Details (RFC 9457), `application/problem+json`, con extensiones `code`, `errors` y `requestId` | Adoptado |
| Contrato | OpenAPI 3.1 en `docs/api/openapi.yaml`, escrito a mano y actualizado en el mismo PR que cambia un endpoint | Adoptado |
| Autenticación | Cookie de sesión `sgc.sid` ([13](13-AUTHENTICATION-AUTHORIZATION.md)) | Adoptado |
| Versionado | En la ruta (`/v1`); independiente de la versión de la aplicación ([21](21-VERSIONING.md)) | Adoptado |

## 3. Justificación

- Un formato único de error con `code` estable permite que el frontend traduzca cualquier error al idioma activo (RNF-040) y que las pruebas comparen códigos en vez de textos.
- Los status HTTP correctos hacen que las pruebas negativas por rol (OBJ-03, RNF-007, RNF-008) sean verificables de forma automática: 403 por rol, 404 por alcance de escuela.
- Las transiciones de estado como sub-recursos de acción (`/approve`, `/deactivate`) permiten un permiso por transición y hacen imposible "eliminar" un curso por accidente: no existe `DELETE /courses/{id}` (RN-12).
- OpenAPI 3.1 es el estándar de facto para describir APIs HTTP y es compatible con JSON Schema 2020-12; un contrato escrito antes del código evita que frontend y backend inventen formatos distintos en paralelo.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| API-01 | Toda ruta **DEBE** empezar con `/api/v1/` y usar sustantivos en plural y kebab-case (`/degree-programs`, `/review-inbox`). Los identificadores de recurso van en la ruta (`/courses/{courseId}`). |
| API-02 | Los verbos en la ruta **SOLO** se permiten como sub-recurso de acción para transiciones o comandos que no son CRUD (`POST /courses/{courseId}/approve`, `POST /courses/{courseId}/code/generate`). |
| API-03 | Los métodos **DEBEN** usarse según su semántica: `GET` lee (seguro, sin efectos), `POST` crea o ejecuta una acción, `PATCH` modifica parcialmente, `DELETE` elimina. `PUT` solo para reemplazar un sub-recurso completo (foto de usuario). |
| API-04 | **NO DEBE** existir `DELETE` sobre cursos. "Eliminar" un curso es `POST /courses/{courseId}/deactivate` (RF-035, RN-12). |
| API-05 | Los cuerpos de petición y respuesta **DEBEN** ser JSON en `camelCase`, codificado en UTF-8. Las peticiones con cuerpo JSON **DEBEN** enviar `Content-Type: application/json`; si no, el servidor responde 415. |
| API-06 | Una respuesta exitosa **DEBE** envolver los datos en `data`: recurso `{ "data": { … } }`; colección `{ "data": [ … ], "meta": { "page", "pageSize", "total", "totalPages" } }`. |
| API-07 | Los identificadores **DEBEN** exponerse como `id` (cadena hexadecimal de 24 caracteres), nunca `_id`. Las referencias se nombran `<entidad>Id` (`schoolId`). |
| API-08 | Las fechas **DEBEN** viajar en ISO 8601 UTC con milisegundos (`2026-11-20T15:04:05.000Z`). Las fechas sin hora (rango de reportes, e-commerce) se envían como `YYYY-MM-DD`. |
| API-09 | Los valores enumerados **DEBEN** ser los del [Glosario de dominio](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) (`in_development`, `school_director`), nunca etiquetas traducidas. |
| API-10 | Todo error **DEBE** responder con el status correcto y un cuerpo Problem Details ([§6.3](#63-error-problem-details)) con `code` de la [tabla de códigos](#44-status-y-códigos-de-error). Nunca se responde 200 con un error dentro. |
| API-11 | Los errores de validación **DEBEN** responder 422 con `errors: [{ field, code, params }]`, un elemento por campo inválido, usando los mismos códigos que `shared/` ([08](08-JAVASCRIPT.md)). |
| API-12 | Un recurso fuera del alcance del usuario (curso de otra escuela para un Director) **DEBE** responder 404, igual que uno inexistente (RF-009 CA3, RF-040 CA3). Una acción que el rol nunca puede ejecutar responde 403. |
| API-13 | Las peticiones de escritura **DEBEN** aceptar solo los campos de la lista blanca del endpoint. Un campo desconocido produce 422 `unknown_field`; un campo de sistema (`status`, `codeValidated`, `updatedAt`, `schoolId` del Director) produce 422 `read_only_field`. |
| API-14 | Las colecciones **DEBEN** paginarse con `page` (desde 1) y `pageSize` (por defecto 10, máximo 100). Una página posterior a la última devuelve `data: []` con su `meta`, no 404. |
| API-15 | El orden **DEBE** expresarse con `sort` (lista separada por comas; prefijo `-` para descendente) y solo admite campos de la lista blanca del recurso; otro campo produce 400 `invalid_parameter`. |
| API-16 | El servidor **DEBE** calcular el alcance a partir del usuario autenticado. Para un Director, el filtro `schoolId` se fuerza a su escuela aunque la petición envíe otro (RF-041 CA3, RF-042 CA3). |
| API-17 | `POST` que crea un recurso **DEBE** responder 201 con cabecera `Location` y el recurso creado. `DELETE` exitoso responde 204 sin cuerpo. Una acción de transición responde 200 con el recurso actualizado. |
| API-18 | Todo endpoint nuevo o modificado **DEBE** actualizarse en `docs/api/openapi.yaml` en el mismo PR, con `operationId`, permiso (`x-permission`) y requerimientos (`x-requirements`). |
| API-19 | Las respuestas de la API **DEBEN** enviar `Cache-Control: no-store`: contienen datos personales y de estado que no deben quedar en cachés ([12](12-SECURITY.md)). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| API-20 | En `PATCH`, la ausencia de un campo **DEBERÍA** significar "sin cambios" y `null` "vaciar" (solo campos opcionales). Las respuestas incluyen todos los campos conocidos, con `null` si no tienen valor; los arreglos vacíos son `[]`, nunca `null`. |
| API-21 | Los parámetros de consulta desconocidos **DEBERÍAN** ignorarse; los conocidos con valor inválido responden 400 `invalid_parameter`. |
| API-22 | Repetir una acción ya aplicada (aprobar un curso aprobado) **DEBERÍA** responder 409 `invalid_transition`, lo que hace seguros los reintentos desde la interfaz. |
| API-23 | La búsqueda textual **DEBERÍA** usar el parámetro `q` y ser insensible a mayúsculas y tildes ([11](11-MONGODB.md)). |
| API-24 | Los cursos `inactive` **DEBERÍAN** excluirse de `GET /courses` salvo que se filtre explícitamente `status=inactive` (RF-035 CA1, CA3). |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| API-25 | El contrato **PUEDE** validarse con `npx @redocly/cli lint docs/api/openapi.yaml` antes del PR (sin agregarlo como dependencia). |
| API-26 | Un endpoint **PUEDE** devolver campos derivados de solo lectura (`totalHours`, `age`) calculados al responder; nunca se aceptan en la entrada. |

### 4.4 Status y códigos de error

| Status | Cuándo | `code` |
|---|---|---|
| 200 OK | Lectura, actualización o acción exitosa | — |
| 201 Created | Recurso creado (con `Location`) | — |
| 204 No Content | Eliminación exitosa; logout | — |
| 400 Bad Request | JSON mal formado; parámetro de consulta inválido | `malformed_json`, `invalid_parameter` |
| 401 Unauthorized | Sin sesión o sesión vencida; credenciales inválidas; token de Google inválido | `unauthenticated`, `invalid_credentials`, `invalid_google_token` |
| 403 Forbidden | Rol sin el permiso; cuenta de Google válida pero no registrada (RF-001 CA2); origen no permitido | `forbidden`, `account_not_authorized`, `origin_not_allowed` |
| 404 Not Found | No existe, está fuera del alcance o el identificador está mal formado; importación no soportada para ese catálogo | `not_found`, `import_not_supported` |
| 405 Method Not Allowed | Escritura sobre un catálogo fijo (estados, niveles, modalidades, monedas) | `method_not_allowed` |
| 409 Conflict | Valor único repetido; cargo institucional ocupado (RN-03); transición inválida; código no validado (RN-10); curso no editable; elemento de catálogo en uso; Director con cursos; autoeliminación del Administrador | `duplicate_value`, `unique_role_taken`, `invalid_transition`, `code_not_validated`, `course_not_editable`, `catalog_item_in_use`, `director_has_courses`, `self_deletion_forbidden` |
| 413 Content Too Large | Cuerpo JSON o archivo por encima del límite | `payload_too_large`, `file_too_large` |
| 415 Unsupported Media Type | `Content-Type` incorrecto o tipo de archivo no permitido | `unsupported_media_type`, `file_type_not_allowed` |
| 422 Unprocessable Content | Campos inválidos; CSV inválido (todo o nada, RF-017 CA2) | `validation_failed`, `csv_invalid` |
| 429 Too Many Requests | Límite de intentos de inicio de sesión ([13](13-AUTHENTICATION-AUTHORIZATION.md)) | `too_many_requests` |
| 500 Internal Server Error | Error no previsto; fallo del procesador CSV | `internal_error`, `csv_processor_failed` |
| 502 Bad Gateway | Gemini respondió con error | `ai_unavailable` |
| 503 Service Unavailable | Integración sin configurar (solo desarrollo, NODE-23) | `integration_not_configured` |
| 504 Gateway Timeout | Gemini superó el tiempo límite | `ai_timeout` |

Códigos de campo (`errors[].code`), compartidos con `shared/`:

| `code` | `params` | Uso |
|---|---|---|
| `required` | — | Campo obligatorio vacío (para borrador o para envío) |
| `min_length` / `max_length` | `{ min }` / `{ max, actual }` | Nombre ≥ 3; límites RN-17 a RN-19 |
| `invalid_format` | `{ format }` | Código `PREFIJO-NÚMERO`, identificación, celular |
| `not_integer` / `out_of_range` | `{ min, max }` | Créditos 1–12, horas 0–300 |
| `invalid_email_domain` | `{ domain }` | Correo que no es `@ucenfotec.ac.cr` |
| `password_policy` | `{ rule }` | RNF-001 a RNF-004 (`length`, `uppercase`, `lowercase`, `digit`) |
| `age_out_of_range` | `{ min: 18, max: 100 }` | RF-003 CA4 |
| `invalid_option` | `{ allowed }` | Valor fuera de un enumerado |
| `invalid_reference` | — | Referencia a un elemento de catálogo inexistente |
| `date_range_invalid` | — | Fin anterior al inicio (RF-026 CA1, RF-043 CA3) |
| `duplicate_value` | — | Valor único repetido |
| `unknown_field` / `read_only_field` | — | API-13 |
| `field_not_allowed` | — | Asistencia de Gemini sobre `competency` (RN-22) |
| `file_type_not_allowed` / `file_too_large` | `{ allowed }` / `{ maxBytes }` | Adjuntos y foto |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Recurso | Plural, kebab-case | `/courses`, `/degree-programs` |
| Parámetro de ruta | `camelCase` + `Id` | `{courseId}`, `{attachmentId}` |
| Acción | Verbo kebab-case como último segmento | `/submit`, `/move-to-production` |
| Parámetro de consulta | `camelCase` | `pageSize`, `schoolId`, `q`, `sort` |
| Campo JSON | `camelCase` | `powerCampusName`, `submittedAt` |
| `operationId` | Verbo + sustantivo en `camelCase` | `listCourses`, `approveCourse` |
| Tag OpenAPI | Nombre del módulo | `courses`, `catalogs`, `users` |
| Código de error | `snake_case` | `catalog_item_in_use` |

## 6. Ejemplos

### 6.1 Colección paginada

```http
GET /api/v1/courses?q=programacion&status=draft&page=1&pageSize=10&sort=-updatedAt
Accept: application/json
```

```json
{
  "data": [
    {
      "id": "6740f1c2a9e3b54d2c1f0a11",
      "code": "SOFT-101",
      "name": "Programación web",
      "schoolId": "6740f0aaa9e3b54d2c1f09f0",
      "status": "draft",
      "updatedAt": "2026-11-20T15:04:05.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 10, "total": 1, "totalPages": 1 }
}
```

### 6.2 Creación

```http
POST /api/v1/courses
Content-Type: application/json

{ "codeRequested": true, "name": "Introducción a la ciberseguridad" }
```

```http
HTTP/1.1 201 Created
Location: /api/v1/courses/6740f1c2a9e3b54d2c1f0a12
Content-Type: application/json; charset=utf-8

{ "data": { "id": "6740f1c2a9e3b54d2c1f0a12", "code": null, "codeRequested": true, "status": "draft", "…": "…" } }
```

La escuela no se envía: el servidor la toma del perfil del Director (RF-009 CA2).

### 6.3 Error (Problem Details)

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Unprocessable Entity",
  "status": 422,
  "code": "validation_failed",
  "detail": "One or more fields are invalid.",
  "instance": "/api/v1/courses/6740f1c2a9e3b54d2c1f0a11/submit",
  "requestId": "0f6b8a8e-3c1d-4c7e-9a43-2f1d5b7c9e10",
  "errors": [
    { "field": "powerCampusName", "code": "max_length", "params": { "max": 40, "actual": 47 } },
    { "field": "topicId", "code": "required" }
  ]
}
```

`type: "about:blank"` indica que la semántica es la del status HTTP; `title` es la frase de Node.js para ese status (`http.STATUS_CODES`). El frontend nunca muestra `detail`: traduce `code` y `errors[].code` ([20](20-INTERNATIONALIZATION.md)).

### 6.4 Acción de transición

```http
POST /api/v1/courses/6740f1c2a9e3b54d2c1f0a11/approve
```

- 200 con el curso en `approved` si estaba `in_development` y con código validado.
- 409 `code_not_validated` si falta validar el código (RF-032 CA4).
- 409 `invalid_transition` si el estado ya no era `in_development`.
- 403 `forbidden` si el usuario no es Desarrollo Curricular.

### 6.5 Contrato OpenAPI 3.1 (fragmento)

```yaml
openapi: 3.1.0
info:
  title: SGC CENFOTEC API
  version: 1.0.0
servers:
  - url: /api/v1
security:
  - sessionCookie: []
tags:
  - name: courses
    description: Cursos y flujo de aprobación
paths:
  /courses/{courseId}/approve:
    post:
      tags: [courses]
      operationId: approveCourse
      summary: Aprueba un curso en revisión
      description: Requiere estado in_development y código validado (RF-033, RN-10).
      x-permission: courses:approve
      x-requirements: [RF-033, RNF-025]
      parameters:
        - $ref: '#/components/parameters/CourseId'
      responses:
        '200':
          description: Curso aprobado.
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    $ref: '#/components/schemas/Course'
        '401':
          $ref: '#/components/responses/Problem'
        '403':
          $ref: '#/components/responses/Problem'
        '404':
          $ref: '#/components/responses/Problem'
        '409':
          $ref: '#/components/responses/Problem'
components:
  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: sgc.sid
  parameters:
    CourseId:
      name: courseId
      in: path
      required: true
      schema:
        type: string
        pattern: '^[0-9a-f]{24}$'
  responses:
    Problem:
      description: Error en formato Problem Details (RFC 9457).
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
  schemas:
    Problem:
      type: object
      required: [type, title, status, code]
      properties:
        type: { type: string }
        title: { type: string }
        status: { type: integer }
        code: { type: string }
        detail: { type: string }
        instance: { type: string }
        requestId: { type: string }
        errors:
          type: array
          items:
            type: object
            required: [code]
            properties:
              field: { type: string }
              row: { type: integer }
              code: { type: string }
              params: { type: object }
    CourseStatus:
      type: string
      enum: [draft, in_development, approved, in_production, inactive]
    Course:
      type: object
      required: [id, schoolId, name, status, codeRequested, codeValidated, updatedAt]
      properties:
        id: { type: string, pattern: '^[0-9a-f]{24}$' }
        schoolId: { type: string, pattern: '^[0-9a-f]{24}$' }
        code:
          type: [string, 'null']
          pattern: '^[A-Z]{2,5}-\d{2,4}$'
        codeRequested: { type: boolean }
        codeValidated: { type: boolean }
        name: { type: string, minLength: 3 }
        status:
          $ref: '#/components/schemas/CourseStatus'
        powerCampusName:
          type: [string, 'null']
          maxLength: 40
        updatedAt: { type: string, format: date-time }
```

### 6.6 Incorrecto

```http
❌ GET  /api/v1/getCourses              (verbo en la ruta, sin recurso)
❌ POST /api/v1/courses/delete/42       (verbo y eliminación física)
❌ DELETE /api/v1/courses/42            (prohibido por RN-12)
❌ PATCH /api/v1/courses/42  { "status": "approved" }   (salta el flujo y los permisos de aprobación)
❌ GET  /api/v1/Cursos?Escuela=SOFT     (español, mayúsculas, filtro por nombre traducido)
```

❌ 200 con error dentro, mensaje en español fijo y `_id` expuesto:

```json
{ "ok": false, "mensaje": "Falta la temática", "_id": "6740f1c2a9e3b54d2c1f0a11" }
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Catálogo de endpoints

"Autenticado" = cualquier usuario con sesión. Los permisos están definidos en [13](13-AUTHENTICATION-AUTHORIZATION.md).

| Método | Ruta | Permiso | Requerimientos | Éxito |
|---|---|---|---|---|
| POST | `/auth/login` | Público | RF-002, RNF-011 | 200 |
| POST | `/auth/google` | Público | RF-001 | 200 |
| GET | `/auth/google/config` | Público | RF-001 (`clientId` y `nonce`, [13](13-AUTHENTICATION-AUTHORIZATION.md)) | 200 |
| GET | `/auth/me` | Autenticado | RF-008 | 200 |
| POST | `/auth/logout` | Autenticado | PV-03 | 204 |
| PATCH | `/me/preferences` | Autenticado | RF-044 CA3 (PV-20) | 200 |
| GET | `/users` | `users:manage` | RF-005, RF-007 | 200 |
| POST | `/users` | `users:manage` | RF-003, RF-004 | 201 |
| GET | `/users/{userId}` | `users:manage` | RF-005 | 200 |
| PATCH | `/users/{userId}` | `users:manage` | RF-005 | 200 |
| DELETE | `/users/{userId}` | `users:manage` | RF-006, RN-29 | 204 |
| PUT / GET / DELETE | `/users/{userId}/photo` | `users:manage` | RF-003 CA3, RN-20 | 204 / 200 / 204 |
| GET | `/catalogs/{catalogKey}` | Autenticado | RF-010, RF-016 | 200 |
| GET | `/catalogs/{catalogKey}/{itemId}` | Autenticado | RF-010 | 200 |
| POST | `/catalogs/{catalogKey}` | `catalogs:manage` | RF-010 a RF-013 | 201 |
| PATCH | `/catalogs/{catalogKey}/{itemId}` | `catalogs:manage` | RF-010 CA3 | 200 |
| DELETE | `/catalogs/{catalogKey}/{itemId}` | `catalogs:manage` | RF-015, RN-27 | 204 |
| POST | `/catalogs/{catalogKey}/imports` | `catalogs:manage` | RF-017 | 200 |
| GET | `/courses` | `courses:read` | RF-039, RF-041 | 200 |
| POST | `/courses` | `courses:create` | RF-018 | 201 |
| GET | `/courses/{courseId}` | `courses:read` | RF-040 | 200 |
| PATCH | `/courses/{courseId}` | `courses:update-draft` | RF-019 a RF-026 | 200 |
| POST | `/courses/{courseId}/submit` | `courses:submit` | RF-030 | 200 |
| PATCH | `/courses/{courseId}/code` | `courses:review` | RF-032 CA1, CA2 | 200 |
| POST | `/courses/{courseId}/code/generate` | `courses:review` | RF-032 CA3 | 200 (propuesta, no persiste) |
| POST | `/courses/{courseId}/approve` | `courses:approve` | RF-033 | 200 |
| POST | `/courses/{courseId}/move-to-production` | `courses:move-to-production` | RF-034 | 200 |
| POST | `/courses/{courseId}/deactivate` | `courses:deactivate` | RF-035 | 200 |
| GET | `/courses/{courseId}/attachments` | `courses:read` | RF-027 | 200 |
| POST | `/courses/{courseId}/attachments` | `courses:update-draft` | RF-027 CA1, CA2 | 201 |
| GET | `/courses/{courseId}/attachments/{attachmentId}` | `courses:read` | RF-027 CA3 | 200 (binario) |
| DELETE | `/courses/{courseId}/attachments/{attachmentId}` | `courses:update-draft` | RF-027 CA4 | 204 |
| GET | `/review-inbox` | `courses:review` | RF-031 | 200 |
| POST | `/ai/suggestions` | `ai:suggest` | RF-028, RF-029 | 200 |
| GET | `/reports/production` | `reports:production:read` | RF-042 | 200 |
| GET | `/reports/history` | `reports:history:read` | RF-043 CA1, CA4 | 200 |
| GET | `/reports/history/comparison` | `reports:history:read` | RF-043 CA2 | 200 |
| GET | `/notifications/stream` | Autenticado | RF-037 CA4 (PV-05) | 200 `text/event-stream` |

`catalogKey` admite `schools`, `degree-programs`, `sfia-areas`, `topics`, `learning-methodologies`, `certifying-bodies` y `certifications`; los catálogos fijos `course-statuses`, `complexity-levels`, `modalities` y `currencies` solo admiten `GET` (otros métodos: 405). Las importaciones solo existen para `sfia-areas`, `topics` y `certifying-bodies` (RF-017).

### 7.2 Parámetros por recurso

| Recurso | Filtros | `sort` permitido | Orden por defecto |
|---|---|---|---|
| `GET /courses` | `q` (código o nombre), `schoolId`, `status` | `code`, `name`, `updatedAt`, `createdAt` | `-updatedAt` |
| `GET /review-inbox` | `q`, `schoolId` | — | `submittedAt` ascendente, fijo (RF-031 CA1) |
| `GET /users` | `q` (nombre, apellidos, identificación, correo), `role` | `lastName`, `firstName`, `createdAt` | `lastName` |
| `GET /catalogs/{catalogKey}` | `q` (código o nombre), `schoolId` (solo `degree-programs`) | `code`, `name` | `name` |
| `GET /reports/production` | `schoolId`, `degreeProgramId` (PV-10) | — | — |
| `GET /reports/history` | `from`, `to` (`YYYY-MM-DD`, `from ≤ to`) | — | — |
| `GET /reports/history/comparison` | `month` (1–12), `years` (dos años, p. ej. `2025,2026`) | — | — |

### 7.3 Cuerpos de acciones

| Endpoint | Cuerpo | Respuesta |
|---|---|---|
| `PATCH /courses/{courseId}/code` | `{ "code": "SOFT-102" }` (igual al actual = validar; distinto = corregir) | Curso con `codeValidated: true` y entrada en `codeHistory` si cambió |
| `POST /courses/{courseId}/code/generate` | — | `{ "data": { "code": "SOFT-102" } }` sin persistir; se confirma con `PATCH …/code` |
| `POST /ai/suggestions` | `{ "field": "shortDescription", "courseId": "…" }` | `{ "data": { "field": "shortDescription", "suggestion": "…", "length": 238, "limit": 250 } }` |
| `POST /catalogs/{catalogKey}/imports` | `multipart/form-data`, campo `file` (.csv UTF-8) | `{ "data": { "imported": 120, "duplicates": [{ "row": 7, "value": "Bases de datos" }] } }` o 422 `csv_invalid` con `errors[].row` |

## 8. Errores frecuentes

- Devolver 403 cuando un Director pide un curso de otra escuela: revela que el curso existe; debe ser 404.
- Devolver 400 para errores de validación de campos: 400 es para peticiones mal formadas; los campos inválidos son 422 con `errors`.
- Aceptar `status` o `schoolId` en `PATCH /courses/{courseId}` y permitir que el cliente salte el flujo.
- Paginar en el frontend descargando todos los cursos (5 000 registros, RNF-019).
- Cambiar el nombre o la forma de un campo sin actualizar OpenAPI ni avisar al otro lado del contrato.
- Traducir mensajes en el servidor y que el frontend dependa de su texto.
- Responder 500 cuando falla Gemini: es 502 o 504, y el texto del usuario se conserva (RNF-023).

## 9. Checklist

- [ ] La ruta es `/api/v1/<recurso-plural-kebab>` y solo usa verbos en sub-recursos de acción.
- [ ] El método y el status de éxito siguen API-03 y API-17.
- [ ] La respuesta usa `data`/`meta`, `id` en vez de `_id`, `camelCase` y fechas ISO UTC.
- [ ] Los errores usan Problem Details con `code` de la tabla; la validación responde 422 con `errors`.
- [ ] Los recursos fuera del alcance de escuela responden 404.
- [ ] La entrada se limita a una lista blanca; los campos de sistema se rechazan.
- [ ] Paginación, `sort` y filtros respetan las listas blancas de [§7.2](#72-parámetros-por-recurso).
- [ ] No existe `DELETE` para cursos.
- [ ] `docs/api/openapi.yaml` refleja el cambio con `operationId`, `x-permission` y `x-requirements`.
- [ ] Hay pruebas de integración para el caso feliz, 401, 403, 404 por alcance y 422 ([16](16-TESTING.md)).

## 10. Referencias

- RFC 9110 HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110
- RFC 9457 Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457
- OpenAPI Specification 3.1: https://spec.openapis.org/oas/v3.1.0
- JSON Schema 2020-12 (usado por OpenAPI 3.1): https://json-schema.org/specification
- ISO 8601 en JavaScript (`Date.prototype.toISOString`): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
- OWASP REST Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- Express 5: https://expressjs.com/en/guide/migrating-5.html
