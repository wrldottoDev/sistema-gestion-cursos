# 12 · Seguridad

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define los controles de seguridad transversales del sistema: gestión de secretos, validación de entradas, salida segura, cabeceras HTTP, CSRF, CORS, manejo de errores, registro de eventos de seguridad, subida de archivos, dependencias, uso de Gemini y protección de datos personales. Aplica a `frontend/`, `shared/`, `backend/`, scripts de Python y configuración del repositorio.

Quedan fuera y tienen documento propio:

- Identidad, sesiones, roles y permisos: [13 · Autenticación y autorización](13-AUTHENTICATION-AUTHORIZATION.md).
- Formato de errores HTTP y códigos de estado: [10 · API REST](10-REST-API.md).
- Middlewares, `errorHandler`, `config/env.js` y `logger`: [09 · Backend Node.js](09-NODEJS-BACKEND.md).
- Índices, validación `$jsonSchema`, GridFS y eliminación lógica: [11 · MongoDB](11-MONGODB.md).
- Pruebas de seguridad: [16 · Pruebas](16-TESTING.md#7-aplicación-en-el-sistema-cenfotec).

## 2. Estándar adoptado

| Referencia | Uso en el proyecto | Estado |
|---|---|---|
| OWASP ASVS 5.0.0 (mayo 2025) | Nivel objetivo **L1** en todos los capítulos aplicables y controles **L2** selectos en V6 (autenticación), V7 (sesión) y V8 (autorización). Se verifica con la [matriz de §7.1](#71-matriz-de-verificación-owasp-asvs-50). | Adoptado |
| OWASP Top 10 (edición vigente) | Lista de concienciación para revisiones de código. | Adoptado |
| OWASP Cheat Sheet Series | Guía de implementación: Password Storage, Session Management, Authorization, CSRF, Input Validation, Logging, File Upload, Content Security Policy. | Adoptado |
| ERS v1.1 RNF-005 a RNF-015, RNF-023, RNF-024 | Requerimientos de seguridad y privacidad del producto. | Confirmado (ERS) |
| Express security best practices | Configuración del servidor (helmet, `trust proxy`, límites de cuerpo). | Adoptado |

**Ningún documento, presentación ni PR afirmará que el sistema "cumple" OWASP ASVS o la ERS en seguridad sin la evidencia registrada en la matriz de §7.1.** La redacción correcta es "controles implementados y verificados: …".

## 3. Justificación

- La ERS exige autorización y validación en servidor (RNF-007, RNF-012), protección de secretos (RNF-010), hash de contraseñas (RNF-005, RNF-006), mensajes no reveladores (RNF-011), HTTPS (RNF-009) y minimización de datos personales (RNF-013 a RNF-015). Estos controles los hacen verificables.
- ASVS es el único estándar de OWASP pensado para **verificar** una aplicación por niveles; el Top 10 sirve para concienciar, no para auditar.
- El repositorio es **público** (auditoría del 14 nov 2026): cualquier secreto que llegue a un commit queda expuesto de forma permanente, aunque se borre después.
- Se priorizan mecanismos nativos o ya previstos en el stack (`node:crypto`, cookies `SameSite`, `helmet`, `$jsonSchema`) antes que dependencias nuevas.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla | Origen |
|---|---|---|
| SEC-01 | Toda autorización y toda validación de reglas de negocio **DEBE** ejecutarse en el servidor. Ocultar un botón o una ruta en la interfaz no es un control de seguridad. Detalle en [13](13-AUTHENTICATION-AUTHORIZATION.md). | RNF-007, RNF-012 |
| SEC-02 | Los secretos (`MONGODB_URI`, `SESSION_SECRET`, `GEMINI_API_KEY`, `SMTP_PASS` y cualquier credencial) **DEBEN** vivir solo en variables de entorno, leídas únicamente por `backend/src/config/env.js` ([09](09-NODEJS-BACKEND.md)). El archivo `.env` **NO DEBE** versionarse; `.env.example` se versiona con nombres de variables y valores ficticios. | RNF-010, RNF-046 |
| SEC-03 | **NO DEBE** existir ningún secreto en `frontend/`, `shared/`, pruebas, documentación, capturas, Jira, mensajes de commit ni registros. `GOOGLE_CLIENT_ID` es un identificador público y **PUEDE** llegar al navegador; no es un secreto. | RNF-010, RF-028 CA4 |
| SEC-04 | Toda entrada externa (cuerpo, query, parámetros de ruta, cabeceras, archivos, CSV, respuesta de Gemini) **DEBE** validarse en el servidor por lista blanca: tipo, formato, longitud, rango y valores de enumeración. Los objetos que se persisten **DEBEN** construirse campo por campo; **NO DEBE** pasarse `req.body` a MongoDB ni combinarse con `Object.assign` o fusiones profundas. Los campos no permitidos para el rol o el estado se rechazan con 422. | RNF-012 |
| SEC-05 | Los filtros de MongoDB **DEBEN** construirse con valores primitivos ya validados (`String`, `Number`, `ObjectId`). Se rechaza cualquier clave de entrada que empiece con `$` o contenga `.`. **NO DEBEN** usarse `$where`, `$function` ni `$accumulator`. Las expresiones regulares de búsqueda **DEBEN** escapar los metacaracteres ([11](11-MONGODB.md)). | ASVS V1, V2 |
| SEC-06 | El frontend **DEBE** insertar datos con `textContent`, `createElement` y `setAttribute`. Las asignaciones a `innerHTML`/`outerHTML` y las llamadas a `insertAdjacentHTML`/`document.write` están prohibidas por ESLint (`no-restricted-syntax` en `eslint.config.js`). Los enlaces construidos con datos **DEBEN** aceptar solo rutas relativas propias o `https:`. | ASVS V1, V3 |
| SEC-07 | Las plantillas de correo HTML **DEBEN** escapar todo dato de usuario (`&`, `<`, `>`, `"`, `'`) y construir enlaces solo con `APP_BASE_URL`. | RF-036, RF-038 |
| SEC-08 | El servidor **DEBE** enviar las cabeceras de seguridad con `helmet` y la política CSP de [§6.2](#62-cabeceras-http-con-helmet). **NO DEBE** haber scripts inline, atributos `on*=` ni `style=""` en el HTML. | ASVS V3, V13 |
| SEC-09 | Toda petición con método no seguro (`POST`, `PATCH`, `PUT`, `DELETE`) **DEBE** pasar la defensa CSRF: cookie `SameSite=Lax` ([13](13-AUTHENTICATION-AUTHORIZATION.md)), cabecera `Origin` igual a `APP_BASE_URL` y `Content-Type` `application/json` o `multipart/form-data`; en caso contrario, 403 o 415. No se usan tokens CSRF ni el paquete `csurf` (obsoleto). | ASVS V3, V4 |
| SEC-10 | CORS **DEBE** permanecer deshabilitado: el frontend y la API comparten origen ([ADR-0002](../adr/0002-modular-monolith-three-layers.md)). No se instala `cors` ni se emite `Access-Control-Allow-Origin`. | ASVS V3 |
| SEC-11 | Las respuestas de error **NO DEBEN** incluir trazas, mensajes del driver de MongoDB, rutas de archivos, consultas ni versiones. El cliente recibe Problem Details con un `code` estable ([10](10-REST-API.md)); el detalle técnico va solo al registro con el `requestId`. | ASVS V16 |
| SEC-12 | Los eventos de seguridad de [§5](#5-nomenclatura) **DEBEN** registrarse con el `logger` ([09](09-NODEJS-BACKEND.md)). **NO DEBEN** registrarse contraseñas, hashes, tokens, ID tokens de Google, cookies, `SESSION_SECRET`, claves de API, cuerpos completos de peticiones ni datos personales; el usuario se identifica con su `userId`. | ASVS V16 |
| SEC-13 | Cada archivo subido **DEBE** validarse por extensión en lista blanca, `Content-Type`, **firma binaria (magic bytes)** y tamaño máximo antes de almacenarse; se guarda en GridFS con un nombre aleatorio y el nombre original solo como metadato; se descarga con `Content-Disposition: attachment`, previa autorización del curso. Límites: adjuntos `.doc`, `.docx`, `.pdf` ≤ 10 MB (RN-28); fotografía PNG, JPG o WEBP ≤ 500 KB (RF-003 CA3); CSV en UTF-8 (RF-017). | RN-28, RF-027, RF-003 |
| SEC-14 | El servidor **DEBE** limitar el tamaño de toda entrada: `express.json({ limit: '100kb' })`, `limits.fileSize` y `limits.files` en `multer`, `pageSize` ≤ 100 ([10](10-REST-API.md)). | ASVS V4 |
| SEC-15 | En producción, todo el tráfico **DEBE** usar HTTPS con HSTS; HTTP se redirige o se rechaza. Detrás de un proxy TLS se configura `app.set('trust proxy', 1)` para que la cookie `Secure` funcione. El ambiente de producción está pendiente ([PV-19](README.md#7-decisiones-pendientes-de-validación)). | RNF-009 |
| SEC-16 | Las dependencias **DEBEN** instalarse con versión exacta (`npm config set save-exact true` o `--save-exact`), con `package-lock.json` versionado y `npm ci` en CI. Toda dependencia nueva se justifica en el PR (qué resuelve, mantenimiento, alternativas nativas). | ASVS V15 |
| SEC-17 | La clave de Gemini **DEBE** usarse solo en el servidor (`integrations/gemini.js`). El endpoint `/api/v1/ai/suggestions` acepta solo los campos `learningMethodology`, `longDescription`, `shortDescription` y `metaDescription`; `competency` se rechaza (RN-22). La respuesta se trata como texto no confiable: se muestra con `textContent`, no se ejecuta ni se interpreta como HTML y no se recorta en silencio (RF-029 CA2). | RNF-010, RN-22, RN-23 |
| SEC-18 | A Gemini solo se envían el nombre del curso y el texto del campo (RF-028 CA1). **NO DEBEN** enviarse datos personales de usuarios ni identificadores internos. | RNF-013 |
| SEC-19 | Los datos personales de [§7.3](#73-datos-personales-rnf-013-a-rnf-015) **DEBEN** ser visibles solo para el Administrador. Ningún endpoint fuera de `/api/v1/users` devuelve campos personales; `passwordHash` nunca sale de la capa de datos (proyección que lo excluye). | RNF-013, RNF-014 |
| SEC-20 | Las contraseñas locales **DEBEN** almacenarse según [ADR-0007](../adr/0007-password-hashing-pbkdf2.md) (PBKDF2-HMAC-SHA256, sal por usuario, 600 000 iteraciones). | RNF-005, RNF-006 |
| SEC-21 | Ningún artefacto del proyecto **DEBE** afirmar cumplimiento de un estándar de seguridad sin evidencia registrada. | Decisión del equipo |
| SEC-22 | Los procesos externos (Python para CSV) **DEBEN** ejecutarse con `spawn` sin shell (`shell: false`), con argumentos generados por el servidor (nunca el nombre original del archivo) y con `timeout`. | ASVS V1, PV-06 |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| SEC-23 | El inicio de sesión local **DEBERÍA** limitar los intentos fallidos (por ejemplo, 5 por 15 minutos por IP y correo) y responder 429 con un mensaje genérico. `express-rate-limit` con almacén en memoria es suficiente para una sola instancia. |
| SEC-24 | El repositorio **DEBERÍA** activar en GitHub *secret scanning* con *push protection* y *Dependabot alerts* (gratuitos en repositorios públicos). |
| SEC-25 | CI **DEBERÍA** ejecutar `npm audit --omit=dev --audit-level=high` y bloquear el merge ante vulnerabilidades altas o críticas sin mitigación documentada ([19](19-CI-CD.md)). |
| SEC-26 | Los PR que tocan autenticación, autorización, sesiones, subida de archivos o integraciones **DEBERÍAN** recibir revisión de los otros dos integrantes. |
| SEC-27 | El prompt enviado a Gemini **DEBERÍA** separar la instrucción del sistema del texto del usuario (instrucción en `systemInstruction`, texto del usuario delimitado) para reducir la inyección de instrucciones; aun así, la salida se trata como no confiable (SEC-17). |
| SEC-28 | Toda respuesta con datos de usuario autenticado **DEBERÍA** incluir `Cache-Control: no-store`. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| SEC-29 | Si se aprueba cargar Bootstrap o fuentes desde un CDN ([PV-04](README.md#7-decisiones-pendientes-de-validación)), se **PUEDE** hacerlo solo con Subresource Integrity (`integrity` + `crossorigin`) y agregando el dominio exacto a la CSP. |
| SEC-30 | Se **PUEDE** emitir `Permissions-Policy` restrictiva (`camera=(), microphone=(), geolocation=()`). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables de entorno | `UPPER_SNAKE_CASE`, lista cerrada en [09](09-NODEJS-BACKEND.md) | `GEMINI_API_KEY` |
| Eventos de seguridad | `<dominio>.<objeto>.<verbo en pasado>` en minúsculas | `auth.login.failed` |
| Códigos de error | `snake_case` estable, catálogo en [10](10-REST-API.md) | `origin_not_allowed` |
| Middlewares de seguridad | verbo en camelCase | `requireSameOrigin`, `requireJsonBody` |

Eventos de seguridad mínimos (SEC-12):

| Evento | Cuándo | Campos además de `level`, `time`, `requestId`, `ip` |
|---|---|---|
| `auth.login.succeeded` | Inicio de sesión local o con Google | `userId`, `method` (`local` \| `google`) |
| `auth.login.failed` | Credenciales inválidas, cuenta no autorizada, token inválido | `method`, `reason` (`invalid_credentials`, `account_not_authorized`, `invalid_google_token`) |
| `authz.denied` | Respuesta 403 por permiso o 404 por alcance de escuela | `userId`, `permission` o `resource` |
| `security.origin.rejected` | Falla la verificación CSRF | `method`, `path` |
| `users.created`, `users.role.changed`, `users.deleted` | Cambios administrativos sobre usuarios | `userId` (actor), `targetUserId`, `role` |
| `catalogs.item.deleted`, `catalogs.import.completed` | Cambios en catálogos | `userId`, `catalogKey`, `count` |
| `courses.code.changed`, `courses.approved`, `courses.moved_to_production`, `courses.deactivated` | Acciones del flujo de aprobación | `userId`, `courseId` |
| `files.upload.rejected` | Archivo rechazado por tipo, firma o tamaño | `userId`, `reason` |
| `integrations.mail.failed`, `integrations.gemini.failed` | Fallo de un servicio externo | `courseId` si aplica, `reason` |

## 6. Ejemplos

### 6.1 Validación de entrada y consultas a MongoDB

Incorrecto: el cuerpo llega tal cual al repositorio. Con `{"email": {"$ne": null}, "password": "x"}` la consulta devuelve el primer usuario (inyección NoSQL), y con `{"role": "admin"}` un Director podría escalar privilegios (asignación masiva).

```js
// backend/src/modules/users/users.controller.js — INCORRECTO
export async function update(req, res) {
  const user = await usersRepository.findOne({ email: req.body.email });
  await usersRepository.updateOne({ _id: user._id }, { $set: req.body });
  res.json({ data: user });
}
```

Correcto: el servicio valida tipos con las reglas de `shared/` y construye el objeto con los campos permitidos.

```js
// backend/src/modules/users/users.service.js — CORRECTO
const EDITABLE_FIELDS = ['firstName', 'lastName', 'phone', 'personalEmail', 'role', 'schoolId'];

export async function updateUser(actor, userId, input) {
  const forbidden = Object.keys(input).filter((key) => !EDITABLE_FIELDS.includes(key));
  if (forbidden.length > 0) {
    throw new ValidationError(forbidden.map((field) => ({ field, code: 'field_not_allowed' })));
  }
  const changes = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in input) changes[field] = input[field];
  }
  const errors = validateUserChanges(changes); // reglas compartidas de shared/validation
  if (errors.length > 0) throw new ValidationError(errors);
  return usersRepository.update(userId, changes);
}
```

### 6.2 Cabeceras HTTP con helmet

```js
// backend/src/app.js — política CSP del sistema (verificar con la implementación de Google Identity Services)
import helmet from 'helmet';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://accounts.google.com/gsi/client'],
        styleSrc: ["'self'", 'https://accounts.google.com/gsi/style'],
        frameSrc: ['https://accounts.google.com/gsi/'],
        connectSrc: ["'self'", 'https://accounts.google.com/gsi/'],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    // El botón de Google en modo popup necesita conservar la referencia a la ventana emergente.
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);
```

`helmet` también envía `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` y elimina `X-Powered-By`. Los navegadores ignoran HSTS sobre HTTP, por lo que la configuración es la misma en desarrollo.

### 6.3 Defensa CSRF

```js
// backend/src/middlewares/require-same-origin.js
import { ForbiddenError, UnsupportedMediaTypeError } from '../lib/errors.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function requireSameOrigin(allowedOrigin) {
  return (req, _res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();
    if (req.get('Origin') !== allowedOrigin) throw new ForbiddenError('origin_not_allowed');
    const hasBody = req.get('Content-Length') !== '0' && req.get('Content-Type') !== undefined;
    if (hasBody && !req.is(['application/json', 'multipart/form-data'])) {
      throw new UnsupportedMediaTypeError('unsupported_media_type');
    }
    next();
  };
}
```

Los navegadores actuales envían `Origin` en toda petición `POST`, `PATCH`, `PUT` y `DELETE`, incluso del mismo origen, por lo que la comparación estricta no afecta al frontend propio.

### 6.4 Salida segura en el DOM

```js
// INCORRECTO: un nombre de curso "<img src=x onerror=alert(1)>" ejecuta código (bloqueado por ESLint).
row.innerHTML = `<td>${course.code}</td><td>${course.name}</td>`;

// CORRECTO
const codeCell = document.createElement('td');
codeCell.textContent = course.code;
const nameCell = document.createElement('td');
nameCell.textContent = course.name;
row.append(codeCell, nameCell);
```

### 6.5 Validación de firma binaria de archivos

```js
// backend/src/lib/file-signature.js
const SIGNATURES = {
  '.pdf': [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }], // %PDF-
  '.docx': [{ offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }], // contenedor ZIP (OOXML)
  '.doc': [{ offset: 0, bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }], // OLE2
  '.png': [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  '.jpg': [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  '.jpeg': [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  '.webp': [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // WEBP
  ],
};

/** Indica si el contenido del búfer coincide con la firma de la extensión declarada. */
export function hasValidSignature(buffer, extension) {
  const parts = SIGNATURES[extension.toLowerCase()];
  if (!parts) return false;
  return parts.every(({ offset, bytes }) =>
    bytes.every((byte, index) => buffer[offset + index] === byte),
  );
}
```

```js
// backend/src/modules/courses/attachments.routes.js
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // RN-28: 10 MB por archivo
});

router.post('/', authorize('courses:update-draft'), upload.single('file'), attachmentsController.create);
```

El error `LIMIT_FILE_SIZE` de `multer` se traduce a 413 en el `errorHandler` ([09](09-NODEJS-BACKEND.md)). La firma ZIP de `.docx` no prueba por sí sola que sea un documento de Word; la combinación de extensión, `Content-Type`, firma y descarga como adjunto reduce el riesgo a un nivel aceptable para este alcance.

### 6.6 Registro de eventos de seguridad

```js
// CORRECTO
logger.warn('security_event', { event: 'auth.login.failed', method: 'local', reason: 'invalid_credentials', requestId: req.id, ip: req.ip });

// INCORRECTO: expone la contraseña, el correo y el cuerpo completo.
logger.warn(`Login fallido de ${req.body.email} con ${req.body.password}`, req.body);
```

### 6.7 Proceso Python sin shell

```js
// backend/src/integrations/python-csv.js
import { spawn } from 'node:child_process';

const child = spawn(env.PYTHON_BIN, [CSV_SCRIPT_PATH, tempFilePath], { shell: false, timeout: 10_000 });
```

`tempFilePath` lo genera el servidor (directorio temporal y nombre aleatorio); el nombre original del archivo nunca forma parte de los argumentos.

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Matriz de verificación OWASP ASVS 5.0

Estado inicial: **Sin verificar** en todas las filas. Se actualiza en el mismo PR que aporta la evidencia (prueba automatizada, captura o revisión registrada).

| Capítulo ASVS 5.0 | Aplicación en el SGC | Reglas | Evidencia esperada | Estado |
|---|---|---|---|---|
| V1 Encoding and Sanitization | Salida con `textContent`, escape en correos, regex escapadas, `spawn` sin shell | SEC-05, SEC-06, SEC-07, SEC-22 | ESLint sin excepciones; prueba de nombre de curso con `<script>` | Sin verificar |
| V2 Validation and Business Logic | Validación por lista blanca, transiciones de estado, límites RN-17 a RN-19 | SEC-04, [11](11-MONGODB.md) | Pruebas de límites y de campos no permitidos | Sin verificar |
| V3 Web Frontend Security | CSP, cookies, CSRF, sin CORS | SEC-08, SEC-09, SEC-10 | Cabeceras inspeccionadas; prueba de `Origin` ajeno → 403 | Sin verificar |
| V4 API and Web Service | Métodos, `Content-Type`, límites de tamaño | SEC-09, SEC-14, [10](10-REST-API.md) | Pruebas 413 y 415 | Sin verificar |
| V5 File Handling | Lista blanca, firma, tamaño, GridFS, descarga como adjunto | SEC-13 | Pruebas con archivo renombrado y de 10 MB + 1 byte | Sin verificar |
| V6 Authentication | Google ID token, login local, mensajes genéricos, PBKDF2 | SEC-20, SEC-23, [13](13-AUTHENTICATION-AUTHORIZATION.md) | Pruebas RF-001 CA2/CA3, RF-002 CA2, RNF-001 a RNF-006 | Sin verificar |
| V7 Session Management | Cookie HttpOnly/Secure/SameSite, regeneración, expiración | [13](13-AUTHENTICATION-AUTHORIZATION.md) | Prueba de cambio de identificador de sesión al iniciar sesión | Sin verificar |
| V8 Authorization | RBAC por permiso, alcance por escuela | SEC-01, [13](13-AUTHENTICATION-AUTHORIZATION.md) | Matriz de pruebas negativas por rol (OBJ-03) | Sin verificar |
| V9 Self-contained Tokens | Verificación del ID token de Google (firma, `aud`, `iss`, `exp`) | [13](13-AUTHENTICATION-AUTHORIZATION.md) | Prueba con token de otra audiencia | Sin verificar |
| V10 OAuth and OIDC | Uso de Google Identity Services como cliente OIDC | [13](13-AUTHENTICATION-AUTHORIZATION.md), [PV-02](README.md#7-decisiones-pendientes-de-validación) | Revisión técnica registrada | Sin verificar |
| V11 Cryptography | PBKDF2 con `node:crypto`, `timingSafeEqual`, secretos aleatorios | SEC-20 | Revisión de [ADR-0007](../adr/0007-password-hashing-pbkdf2.md) y prueba de formato del hash | Sin verificar |
| V12 Secure Communication | HTTPS, HSTS, TLS de MongoDB Atlas | SEC-15 | URL de producción con HTTPS ([PV-19](README.md#7-decisiones-pendientes-de-validación)) | Sin verificar |
| V13 Configuration | Variables de entorno, `.env` ignorado, cabeceras | SEC-02, SEC-08, SEC-16 | `.gitignore` y revisión del repositorio sin secretos | Sin verificar |
| V14 Data Protection | Datos personales solo para Administrador, `no-store` | SEC-19, SEC-28 | Pruebas por rol sin campos personales (RNF-014) | Sin verificar |
| V15 Secure Coding and Architecture | Capas, dependencias exactas, revisión de dependencias | SEC-16, SEC-25, [03](03-PROJECT-ARCHITECTURE.md) | `package-lock.json`, salida de `npm audit` | Sin verificar |
| V16 Security Logging and Error Handling | Eventos de §5, errores sin detalles internos | SEC-11, SEC-12 | Prueba de error 500 sin traza; revisión de registros | Sin verificar |
| V17 WebRTC | No aplica | — | — | No aplica |

### 7.2 Controles por módulo

| Módulo | Riesgo principal | Control |
|---|---|---|
| Autenticación | Enumeración de cuentas, fuerza bruta, cuentas externas | Mensaje genérico (RNF-011), SEC-23, verificación de `hd` ([13](13-AUTHENTICATION-AUTHORIZATION.md)) |
| Usuarios | Escalada por asignación masiva de `role`, exposición de datos personales | SEC-04, SEC-19, unicidad de cargos ([13](13-AUTHENTICATION-AUTHORIZATION.md)) |
| Catálogos y CSV | Archivo malicioso, carga parcial, inyección de comandos | SEC-13, SEC-22; rechazo total del archivo inválido (RF-017 CA2) |
| Cursos | Acceso a cursos de otra escuela, edición fuera de Borrador | Alcance por escuela en servidor (RNF-008), estado validado en servicio |
| Adjuntos | Archivos ejecutables renombrados, descarga sin permiso | SEC-13; descarga solo si el usuario puede ver el curso |
| Asistencia IA | Fuga de la clave, inyección de instrucciones, HTML en la respuesta | SEC-17, SEC-18, SEC-27 |
| Notificaciones | Correo con HTML inyectado, flujo SSE sin sesión | SEC-07; `/notifications/stream` exige sesión y permiso `courses:review`; la carga útil contiene solo código, nombre e identificador del curso |
| Reportes | Director consultando otras escuelas | Filtro de escuela forzado en servidor (RF-042 CA3) |

### 7.3 Datos personales (RNF-013 a RNF-015)

Inventario y finalidad documentada según ERS §7.2. Cualquier campo personal nuevo requiere actualizar esta tabla en el mismo PR (RNF-013, RNF-015).

| Dato | Campo | Finalidad | Visible para | Conservación |
|---|---|---|---|---|
| Nombre y apellidos | `firstName`, `lastName` | Identificar al usuario | Administrador; el nombre completo del autor de un curso **PUEDE** mostrarse a quien ve el curso | Mientras el usuario exista |
| Identificación | `nationalId` | Identificar de forma única (RF-003 CA2) | Administrador | Mientras el usuario exista |
| Correo institucional | `email` | Autenticar y notificar | Administrador | Mientras el usuario exista |
| Correo personal (opcional) | `personalEmail` | Contacto alternativo | Administrador | Mientras el usuario exista |
| Celular | `phone` | Contacto | Administrador | Mientras el usuario exista |
| Fecha de nacimiento | `birthDate` | Calcular la edad (RF-003 CA4) | Administrador | Mientras el usuario exista |
| Sexo | `sex` | Dato solicitado por el cliente; opciones pendientes ([PV-12](README.md#7-decisiones-pendientes-de-validación)) | Administrador | Mientras el usuario exista |
| Fotografía (opcional) | `photoFileId` | Identificación visual | Administrador | Se elimina de GridFS al eliminar el usuario |
| Rol y escuela | `role`, `schoolId` | Aplicar permisos | Administrador; el propio usuario vía `/auth/me` | Mientras el usuario exista |
| Contraseña | `passwordHash` | Autenticar (RF-002) | Nadie (nunca sale de la capa de datos) | Mientras el usuario exista |

Al eliminar un usuario (RF-006) se eliminan sus datos personales y su fotografía. Los cursos que creó conservan la referencia `createdBy` y la interfaz muestra "Usuario eliminado".

## 8. Errores frecuentes

- Confiar en que un Director "no verá" el botón Aprobar en lugar de verificar el permiso en el servidor.
- Copiar el `.env` en un mensaje de Slack, Jira o en una captura de pantalla para "ayudar" a un compañero.
- Escribir `GEMINI_API_KEY` en un archivo de `frontend/` para probar rápido (RF-028 CA4 lo prohíbe expresamente).
- Pasar `req.body` o `req.query` directamente a `find`, `updateOne` o `$set`.
- Usar `innerHTML` con plantillas de cadena para "pintar más rápido" una tabla.
- Validar solo la extensión del archivo o solo el `Content-Type` que envía el navegador.
- Devolver `error.message` de MongoDB (por ejemplo, `E11000 duplicate key …`) al cliente.
- Registrar `req.body` completo en errores de inicio de sesión.
- Añadir `cors()` "porque falla el fetch", cuando el problema es la ruta o el puerto.
- Desactivar la CSP para que funcione un script inline, en lugar de mover el script a un módulo.
- Instalar una dependencia con `^` y sin revisar su mantenimiento.

## 9. Checklist

- [ ] El cambio no introduce secretos en el código, la documentación ni el historial (`git diff` revisado).
- [ ] Toda entrada nueva se valida en el servidor por lista blanca; los campos no permitidos devuelven 422.
- [ ] Ningún filtro de MongoDB usa objetos provenientes del cliente sin validar.
- [ ] Ningún dato se inserta con `innerHTML` ni equivalentes; ESLint no tiene excepciones nuevas.
- [ ] Las rutas nuevas con métodos no seguros pasan `requireSameOrigin`.
- [ ] Los errores devuelven Problem Details sin detalles internos.
- [ ] Los eventos de seguridad del cambio se registran sin datos sensibles.
- [ ] Los archivos se validan por extensión, tipo, firma y tamaño.
- [ ] Las dependencias nuevas están fijadas con versión exacta y justificadas en el PR.
- [ ] Los campos personales solo aparecen en respuestas para el Administrador.
- [ ] La matriz de §7.1 se actualizó si el cambio aporta evidencia.

## 10. Referencias

- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10: https://owasp.org/Top10/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/ (Password Storage, Session Management, Authorization, Cross-Site Request Forgery Prevention, Input Validation, Logging, File Upload, Content Security Policy)
- Express security best practices: https://expressjs.com/en/advanced/best-practice-security.html
- Google Identity Services (CSP y COOP): https://developers.google.com/identity/gsi/web
- Gemini API: https://ai.google.dev/gemini-api/docs
- MongoDB GridFS: https://www.mongodb.com/docs/manual/core/gridfs/
- RFC 9457 Problem Details: https://www.rfc-editor.org/rfc/rfc9457
- Documentos relacionados: [09](09-NODEJS-BACKEND.md), [10](10-REST-API.md), [11](11-MONGODB.md), [13](13-AUTHENTICATION-AUTHORIZATION.md), [16](16-TESTING.md), [ADR-0007](../adr/0007-password-hashing-pbkdf2.md).
