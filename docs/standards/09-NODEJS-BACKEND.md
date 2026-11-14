# 09 · Backend Node.js

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se construye el servidor de la Iteración 2: arranque, composición de la aplicación Express, orden de middlewares, responsabilidades de rutas, controladores, servicios y repositorios, configuración por entorno, manejo centralizado de errores, registro de eventos e integraciones externas (correo, Gemini, notificaciones de escritorio y Python).

Estado actual: **no iniciado**. `backend/` solo contiene `.gitkeep` y no existe `package.json`. Todo lo descrito aquí es **Adoptado** como forma obligatoria de construirlo, no algo existente.

Fuera de alcance: la estructura de carpetas y las dependencias entre capas ([03](03-PROJECT-ARCHITECTURE.md)), el contrato HTTP ([10](10-REST-API.md)), consultas y esquemas ([11](11-MONGODB.md)), cabeceras, CSRF y archivos ([12](12-SECURITY.md)), sesión y permisos ([13](13-AUTHENTICATION-AUTHORIZATION.md)).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Runtime | Node.js LTS activa (≥ 24), declarada en `engines` de `package.json` | Adoptado (versión exacta al crear `package.json`) |
| Framework HTTP | **Express 5**: las promesas rechazadas en manejadores llegan solas al manejador de errores | Adoptado |
| Arquitectura | *routes → controller → service → repository* por módulo | Adoptado ([ADR-0002](../adr/0002-modular-monolith-three-layers.md)) |
| Base de datos | Driver oficial `mongodb`, un solo `MongoClient` por proceso | Pendiente de validación (PV-01, [ADR-0004](../adr/0004-mongodb-native-driver-json-schema.md)) |
| Configuración | Variables de entorno leídas solo en `config/env.js`; `node --env-file=.env` en desarrollo (sin `dotenv`) | Adoptado (RNF-046) |
| Errores | Clase `AppError` + un único `errorHandler` que responde Problem Details (RFC 9457) | Adoptado |
| Registro | `lib/logger.js`: JSON por línea sobre `console` | Adoptado |
| Correo | `nodemailer` con SMTP configurable; envío después de confirmar el cambio | Adoptado (proveedor: PV-16) |
| Gemini | `@google/genai` desde el servidor, con tiempo límite | Confirmado (ERS RF-028, RNF-010) |
| Notificaciones de escritorio | Server-Sent Events + Notifications API del navegador | Pendiente de validación (PV-05) |
| Python | `child_process.spawn` sin shell, salida JSON | Pendiente de validación (PV-06) |

## 3. Justificación

- Express 5 elimina los envoltorios `try/catch` o `asyncHandler` en cada ruta: un `throw` dentro de un manejador `async` termina en el `errorHandler`.
- Un único punto de lectura de configuración permite fallar al arrancar si falta un secreto, en vez de fallar en la primera petición de un usuario (RNF-046).
- Un único manejador de errores garantiza que ningún stack trace ni mensaje de MongoDB llegue al cliente y que todos los errores tengan el mismo formato que el frontend sabe traducir ([20](20-INTERNATIONALIZATION.md)).
- Las funciones `create*` que reciben sus dependencias hacen que los servicios se prueben con dobles, sin base de datos ni red ([16](16-TESTING.md)).
- Enviar correos después de confirmar el cambio de estado cumple RF-036 CA2, RF-038 CA3 y RNF-024: un fallo del correo no revierte ni corrompe el curso.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| NODE-01 | `server.js` **DEBE** limitarse a: leer la configuración, conectar a MongoDB, crear la app con `createApp(...)`, escuchar el puerto y cerrar ordenadamente con `SIGINT`/`SIGTERM`. |
| NODE-02 | `app.js` **DEBE** exportar `createApp(deps)` sin efectos secundarios (no conecta ni escucha), para que las pruebas de integración la levanten en un puerto efímero. |
| NODE-03 | Los middlewares **DEBEN** registrarse en el orden de [§7.1](#71-orden-de-middlewares). |
| NODE-04 | Un archivo `*.routes.js` **DEBE** contener solo la asociación ruta → middlewares (`authenticate`, `authorize(permission)`) → función del controlador. Sin lógica, sin consultas y sin funciones anónimas con cuerpo. |
| NODE-05 | Un controlador **DEBE**: leer `req.params`, `req.query` y `req.body`; tomar solo los campos permitidos (lista blanca); convertir identificadores y paginación con `lib/http-input.js`; llamar a un servicio con `req.user` como `actor`; y serializar la respuesta con una función explícita (`toCourseResponse`) que nunca incluya campos internos (`passwordHash`, `searchText`). |
| NODE-06 | Un servicio **DEBE** contener las reglas de negocio: alcance por escuela, estados y transiciones, validaciones con `shared/`, cálculo de campos de sistema (`updatedAt`, `statusHistory`) y orquestación de integraciones. Lanza `AppError`; no conoce HTTP. |
| NODE-07 | Un repositorio **DEBE** encapsular las consultas de su colección y devolver documentos o `null`. No lanza errores de negocio ni decide permisos. |
| NODE-08 | `process.env` **DEBE** leerse solo en `backend/src/config/env.js`, que valida las variables requeridas al importarse y lanza un error si falta alguna (fallo rápido). |
| NODE-09 | Los secretos **NO DEBEN** tener valores por defecto en el código ni registrarse en logs. `.env` está ignorado por Git; `.env.example` se versiona sin valores reales ([12](12-SECURITY.md)). |
| NODE-10 | Todo error esperado **DEBE** lanzarse como `AppError(status, code, { detail, errors })`. Los códigos `code` son los de [10 §Status y códigos de error](10-REST-API.md#44-status-y-códigos-de-error). |
| NODE-11 | **DEBE** existir un único `errorHandler` (cuatro parámetros, registrado al final) que convierta cualquier error en `application/problem+json`. Los errores no previstos responden 500 con `code: "internal_error"` y se registran con `requestId` y stack. |
| NODE-12 | El servidor **DEBE** escribir en consola solo a través de `lib/logger.js` (ESLint `no-console`). Nunca se registran contraseñas, hashes, tokens, ID tokens, cookies, claves de API, cadenas de conexión ni cuerpos completos de peticiones; los datos personales se identifican por `userId`. |
| NODE-13 | Toda llamada a un servicio externo (Gemini, SMTP, Google, Python) **DEBE** tener tiempo límite y su error **DEBE** traducirse a un `AppError` (502/504 para Gemini) sin exponer el mensaje del proveedor. |
| NODE-14 | Los correos y notificaciones **DEBEN** enviarse **después** de confirmar el cambio en la base de datos. Su fallo se registra y **NO DEBE** revertir el cambio ni convertir la respuesta en error (RF-036 CA2, RF-038 CA3, RNF-024). Las plantillas HTML de correo (N-03, N-04) usan estilos inline y tablas de maquetación porque los clientes de correo ignoran hojas externas: es la única excepción a la prohibición de estilos inline de [05](05-CSS-AND-BEM.md); los datos se escapan antes de interpolarse ([12](12-SECURITY.md)). |
| NODE-15 | Los procesos externos (Python) **DEBEN** ejecutarse con `spawn` y argumentos en arreglo, sin `shell: true` ni `exec` con cadenas interpoladas. |
| NODE-16 | El servidor **NO DEBE** usar APIs síncronas de E/S (`readFileSync`, `execSync`) dentro del manejo de peticiones; solo durante el arranque. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| NODE-17 | Cada módulo **DEBERÍA** exponer funciones de creación (`createCoursesRepository(db)`, `createCoursesService(deps)`, `createCoursesController(service)`, `createCoursesRouter(controller, guards)`) que `app.js` compone. |
| NODE-18 | Los servicios **DEBERÍAN** recibir un `clock` inyectable para las fechas de sistema. |
| NODE-19 | Cada respuesta **DEBERÍA** incluir la cabecera `X-Request-Id`, y cada línea de log de esa petición el mismo `requestId`. |
| NODE-20 | En producción detrás de un proxy (PaaS con HTTPS, PV-19) **DEBERÍA** configurarse `app.set('trust proxy', 1)` para que la cookie `Secure` y la IP del cliente funcionen. |
| NODE-21 | Los límites de tamaño **DEBERÍAN** ser explícitos: `express.json({ limit: '100kb' })`; los archivos se limitan en `multer` según [12](12-SECURITY.md). |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| NODE-22 | En desarrollo **PUEDE** usarse `node --watch` en lugar de herramientas como `nodemon`. |
| NODE-23 | Una integración no configurada en desarrollo (sin `GEMINI_API_KEY` o SMTP) **PUEDE** responder `503` con `code: "integration_not_configured"`; en producción esas variables son obligatorias. |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Funciones de creación | `create<Module><Layer>` | `createCoursesService` |
| Métodos de controlador | Verbo de caso de uso | `list`, `getById`, `create`, `updateDraft`, `submit`, `approve` |
| Métodos de servicio | Caso de uso de negocio | `createDraft`, `submit`, `approve`, `moveToProduction`, `deactivate` |
| Métodos de repositorio | Operación de datos | `findById`, `list`, `insert`, `updateDraftFields`, `transition` |
| Middlewares | Sustantivo o verbo corto | `authenticate`, `authorize('courses:approve')`, `requestId`, `verifyOrigin` |
| Eventos de log | `snake_case` en pasado o estado | `server_started`, `course_submitted`, `email_failed` |
| Variables de entorno | `UPPER_SNAKE_CASE` | `MONGODB_URI`, `GEMINI_TIMEOUT_MS` |
| Propiedades de configuración | `camelCase` | `env.mongodbUri`, `env.geminiTimeoutMs` |

## 6. Ejemplos

### 6.1 Configuración con fallo rápido

```js
// backend/src/config/env.js — único lector de process.env (RNF-046)
const REQUIRED = ['APP_BASE_URL', 'MONGODB_URI', 'MONGODB_DB_NAME', 'SESSION_SECRET', 'GOOGLE_CLIENT_ID'];
const REQUIRED_IN_PRODUCTION = ['GEMINI_API_KEY', 'GEMINI_MODEL', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];

const isProduction = process.env.NODE_ENV === 'production';
const missing = [...REQUIRED, ...(isProduction ? REQUIRED_IN_PRODUCTION : [])].filter(
  (name) => !process.env[name],
);
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}
if (process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must have at least 32 characters');
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction,
  port: Number(process.env.PORT ?? 3000),
  appBaseUrl: process.env.APP_BASE_URL,
  mongodbUri: process.env.MONGODB_URI,
  mongodbDbName: process.env.MONGODB_DB_NAME,
  sessionSecret: process.env.SESSION_SECRET,
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS ?? 30 * 60 * 1000), // PV-03
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN ?? 'ucenfotec.ac.cr',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL,
  geminiTimeoutMs: Number(process.env.GEMINI_TIMEOUT_MS ?? 15_000),
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  mailFrom: process.env.MAIL_FROM,
  pythonBin: process.env.PYTHON_BIN ?? 'python3',
});
```

`.env.example` (se crea junto con `package.json`) lista todas las variables anteriores **sin valores reales**. En desarrollo se arranca con `node --watch --env-file=.env backend/src/server.js`.

### 6.2 Arranque

```js
// backend/src/server.js
import { MongoClient } from 'mongodb';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { logger } from './lib/logger.js';

const mongoClient = new MongoClient(env.mongodbUri, { appName: 'sgc-cenfotec' });
await mongoClient.connect();
const db = mongoClient.db(env.mongodbDbName);

const app = createApp({ env, db, mongoClient });
const server = app.listen(env.port, (error) => {
  if (error) throw error;
  logger.info('server_started', { port: env.port });
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.close(async () => {
      await mongoClient.close();
      logger.info('server_stopped', { signal });
    });
    server.closeAllConnections(); // las conexiones SSE nunca quedan inactivas
  });
}
```

### 6.3 Composición y orden de middlewares

```js
// backend/src/app.js
import express from 'express';
import { fileURLToPath } from 'node:url';
import { securityHeaders } from './middlewares/security-headers.js'; // 12-SECURITY
import { requestId } from './middlewares/request-id.js';
import { verifyOrigin } from './middlewares/verify-origin.js'; // 12-SECURITY
import { createSessionMiddleware } from './modules/auth/session.js'; // 13-AUTHENTICATION-AUTHORIZATION
import { createGuards } from './modules/auth/guards.js'; // authenticate + authorize (13)
import { createCoursesRepository } from './modules/courses/courses.repository.js';
import { createCoursesService } from './modules/courses/courses.service.js';
import { createCoursesController } from './modules/courses/courses.controller.js';
import { createCoursesRouter } from './modules/courses/courses.routes.js';
import { createNotificationsService } from './modules/notifications/notifications.service.js';
import { createMailer } from './integrations/mailer.js';
import { apiNotFound, errorHandler } from './middlewares/error-handler.js';
import { logger } from './lib/logger.js';

const dir = (relative) => fileURLToPath(new URL(relative, import.meta.url));

export function createApp({ env, db, mongoClient }) {
  const app = express();
  if (env.isProduction) app.set('trust proxy', 1);

  app.use(securityHeaders(env));
  app.use(requestId);
  app.use(express.static(dir('../../frontend/'), { extensions: ['html'] }));
  app.use('/shared', express.static(dir('../../shared/')));
  app.use('/vendor/bootstrap', express.static(dir('../../node_modules/bootstrap/dist/')));

  const api = express.Router();
  api.use(express.json({ limit: '100kb' }));
  api.use(createSessionMiddleware({ env, mongoClient }));
  api.use(verifyOrigin(env));

  const guards = createGuards({ db });
  const notifications = createNotificationsService({ mailer: createMailer(env), logger /* , usersService */ });
  const coursesService = createCoursesService({
    coursesRepository: createCoursesRepository(db),
    notifications,
  });
  api.use('/courses', createCoursesRouter(createCoursesController(coursesService), guards));
  // … users, catalogs, review-inbox, ai, reports, notifications, auth, me

  api.use(apiNotFound);
  app.use('/api/v1', api);
  app.use(errorHandler);
  return app;
}
```

### 6.4 Ruta, controlador, servicio y repositorio

```js
// backend/src/modules/courses/courses.routes.js
import express from 'express';

export function createCoursesRouter(controller, { authenticate, authorize }) {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', authorize('courses:read'), controller.list);
  router.post('/', authorize('courses:create'), controller.create);
  router.get('/:courseId', authorize('courses:read'), controller.getById);
  router.patch('/:courseId', authorize('courses:update-draft'), controller.updateDraft);
  router.post('/:courseId/submit', authorize('courses:submit'), controller.submit);
  router.post('/:courseId/approve', authorize('courses:approve'), controller.approve);
  router.post('/:courseId/deactivate', authorize('courses:deactivate'), controller.deactivate);
  return router;
}
```

```js
// backend/src/modules/courses/courses.controller.js
import { parseObjectId, parseListQuery, pick } from '../../lib/http-input.js';

const EDITABLE_FIELDS = ['code', 'codeRequested', 'name', 'topicId', 'powerCampusName', 'credits' /* … */];

export function toCourseResponse(course) {
  const { _id, searchText, ...rest } = course; // searchText es interno
  return { id: _id.toString(), ...rest };
}

export function createCoursesController(coursesService) {
  return {
    async list(req, res) {
      const query = parseListQuery(req.query, { sortable: ['code', 'name', 'updatedAt'] });
      const { items, meta } = await coursesService.list(query, req.user);
      res.json({ data: items.map(toCourseResponse), meta });
    },
    async create(req, res) {
      const course = await coursesService.createDraft(pick(req.body, EDITABLE_FIELDS), req.user);
      res.status(201).location(`/api/v1/courses/${course._id}`).json({ data: toCourseResponse(course) });
    },
    async approve(req, res) {
      const course = await coursesService.approve(parseObjectId(req.params.courseId), req.user);
      res.json({ data: toCourseResponse(course) });
    },
    // getById, updateDraft, submit, deactivate…
  };
}
```

```js
// backend/src/modules/courses/courses.service.js (extracto; se divide en course-workflow.service.js según ARC-17)
import { AppError } from '../../lib/errors.js';
import { COURSE_STATUS } from '../../../../shared/domain/constants.js';
import { courseScopeFilter } from '../auth/scope.js'; // alcance por escuela (13)

export function createCoursesService({ coursesRepository, notifications, clock = () => new Date() }) {
  async function findVisible(courseId, actor) {
    const course = await coursesRepository.findOne({ _id: courseId, ...courseScopeFilter(actor) });
    if (!course) throw new AppError(404, 'not_found'); // no revela cursos de otra escuela
    return course;
  }

  return {
    async approve(courseId, actor) {
      const course = await findVisible(courseId, actor);
      if (course.status !== COURSE_STATUS.IN_DEVELOPMENT) throw new AppError(409, 'invalid_transition');
      if (!course.codeValidated) throw new AppError(409, 'code_not_validated'); // RN-10

      const now = clock();
      const approved = await coursesRepository.transition(courseId, {
        from: COURSE_STATUS.IN_DEVELOPMENT,
        to: COURSE_STATUS.APPROVED,
        extraFilter: { codeValidated: true },
        set: { approvedAt: now, approvedBy: actor.id },
        by: actor.id,
        at: now,
      });
      if (!approved) throw new AppError(409, 'invalid_transition'); // otro usuario cambió el estado

      notifications.courseApproved(approved); // después del commit; nunca rechaza (NODE-14)
      return approved;
    },
  };
}
```

```js
// backend/src/modules/courses/courses.repository.js (extracto)
export function createCoursesRepository(db) {
  const courses = db.collection('courses');
  return {
    findOne: (filter) => courses.findOne(filter),
    transition(id, { from, to, by, at, set = {}, extraFilter = {} }) {
      // Atómico: solo actualiza si el estado sigue siendo `from` (RNF-025). Devuelve null si no coincide.
      return courses.findOneAndUpdate(
        { _id: id, status: from, ...extraFilter },
        {
          $set: { status: to, updatedAt: at, ...set },
          $push: { statusHistory: { from, to, by, at } },
        },
        { returnDocument: 'after' },
      );
    },
  };
}
```

### 6.5 Errores centralizados

```js
// backend/src/lib/errors.js
export class AppError extends Error {
  constructor(status, code, { detail, errors, cause } = {}) {
    super(detail ?? code, { cause });
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}
```

```js
// backend/src/middlewares/error-handler.js
import { STATUS_CODES } from 'node:http';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

export function apiNotFound(_req, _res, next) {
  next(new AppError(404, 'not_found'));
}

function toProblem(error) {
  if (error instanceof AppError) {
    return { status: error.status, code: error.code, detail: error.message, errors: error.errors };
  }
  if (error?.type === 'entity.parse.failed') return { status: 400, code: 'malformed_json' };
  if (error?.type === 'entity.too.large') return { status: 413, code: 'payload_too_large' };
  if (error?.code === 11000) {
    const fields = Object.keys(error.keyPattern ?? {});
    return { status: 409, code: 'duplicate_value', errors: fields.map((field) => ({ field, code: 'duplicate_value' })) };
  }
  return { status: 500, code: 'internal_error' };
}

export function errorHandler(error, req, res, _next) {
  const problem = toProblem(error);
  if (problem.status >= 500) logger.error('unhandled_error', { requestId: req.id, error });
  res
    .status(problem.status)
    .type('application/problem+json')
    .json({
      type: 'about:blank',
      title: STATUS_CODES[problem.status],
      instance: req.originalUrl.split('?')[0],
      requestId: req.id,
      ...problem,
      detail: problem.status >= 500 ? undefined : problem.detail, // nunca detalles internos en 5xx
    });
}
```

### 6.6 Logger

```js
// backend/src/lib/logger.js — único archivo con console (eslint.config.js)
function serialize(_key, value) {
  return value instanceof Error
    ? { name: value.name, message: value.message, code: value.code, stack: value.stack }
    : value;
}

function write(level, msg, fields = {}) {
  const line = JSON.stringify({ level, time: new Date().toISOString(), msg, ...fields }, serialize);
  if (level === 'error' || level === 'warn') console.error(line);
  else console.log(line);
}

export const logger = Object.freeze({
  info: (msg, fields) => write('info', msg, fields),
  warn: (msg, fields) => write('warn', msg, fields),
  error: (msg, fields) => write('error', msg, fields),
});
```

### 6.7 Integraciones

```js
// backend/src/integrations/gemini.js
import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

const ai = env.geminiApiKey ? new GoogleGenAI({ apiKey: env.geminiApiKey }) : null;

export async function generateText(prompt) {
  if (!ai) throw new AppError(503, 'integration_not_configured');
  try {
    const response = await ai.models.generateContent({
      model: env.geminiModel,
      contents: prompt,
      config: { abortSignal: AbortSignal.timeout(env.geminiTimeoutMs) },
    });
    return response.text ?? '';
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    throw new AppError(timedOut ? 504 : 502, timedOut ? 'ai_timeout' : 'ai_unavailable', { cause: error });
  }
}
```

Verificar el nombre exacto de la opción de cancelación en la versión instalada del SDK `@google/genai` al implementar.

```js
// backend/src/modules/notifications/notifications.service.js (extracto)
export function createNotificationsService({ mailer, usersService, logger }) {
  return {
    // Nunca rechaza: el curso ya fue aprobado y el error solo se registra (RF-038 CA3, RNF-024).
    courseApproved(course) {
      return sendApprovalEmails(course).catch((error) =>
        logger.error('email_failed', { event: 'course_approved', courseId: course._id.toString(), error }),
      );
    },
  };
  // sendApprovalEmails usa mailer.sendMail con plantillas en el idioma del destinatario (20)
}
```

```js
// backend/src/modules/notifications/notification-stream.js — SSE (PV-05)
// Limitación conocida: registro en memoria; solo funciona con un proceso. Con varias instancias, usar pub/sub.
const clientsByUserId = new Map();

export function openStream(req, res) {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  const userId = req.user.id;
  const clients = clientsByUserId.get(userId) ?? new Set();
  clients.add(res);
  clientsByUserId.set(userId, clients);
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25_000);
  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
}

export function publish(userIds, event, payload) {
  for (const userId of userIds) {
    for (const res of clientsByUserId.get(userId) ?? []) {
      res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
    }
  }
}
```

```js
// backend/src/integrations/python-csv.js (PV-06)
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

const SCRIPT = fileURLToPath(new URL('../../scripts/python/process_csv.py', import.meta.url));

export function processCsv(filePath, catalogKey) {
  return new Promise((resolve, reject) => {
    const child = spawn(env.pythonBin, [SCRIPT, catalogKey, filePath], { timeout: 10_000 });
    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.on('error', (error) => reject(new AppError(500, 'csv_processor_failed', { cause: error })));
    child.on('close', (exitCode) => {
      if (exitCode !== 0) return reject(new AppError(500, 'csv_processor_failed'));
      try {
        resolve(JSON.parse(stdout)); // el servicio vuelve a validar cada fila antes de persistir
      } catch (error) {
        reject(new AppError(500, 'csv_processor_failed', { cause: error }));
      }
    });
  });
}
```

### 6.8 Incorrecto

```js
// ❌ Lectura de entorno dispersa, secreto por defecto, log del cuerpo, error crudo al cliente
const key = process.env.GEMINI_API_KEY || 'AIza-demo';
app.post('/api/v1/users', async (req, res) => {
  console.log('Nuevo usuario', req.body); // incluye contraseña y datos personales
  try {
    await db.collection('users').insertOne(req.body); // asignación masiva: acepta role, passwordHash…
    res.send('ok');
  } catch (error) {
    res.status(500).send(error.message); // expone mensajes internos de MongoDB
  }
});
```

```js
// ❌ El correo bloquea y revierte la aprobación si falla (contradice RF-038 CA3)
await mailer.sendMail(message);
await courses.updateOne({ _id }, { $set: { status: 'approved' } });
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Orden de middlewares

| # | Middleware | Ámbito | Motivo |
|---|---|---|---|
| 1 | `securityHeaders` (helmet + CSP) | Toda la app | Cabeceras también para páginas y estáticos ([12](12-SECURITY.md)) |
| 2 | `requestId` | Toda la app | Correlación de logs; cabecera `X-Request-Id` |
| 3 | `express.static` (`frontend/`, `/shared`, `/vendor/bootstrap`) | Estáticos | Se resuelven antes de la sesión: no consultan el almacén de sesiones por cada CSS o imagen |
| 4 | `express.json({ limit: '100kb' })` | `/api/v1` | Solo la API recibe JSON |
| 5 | Sesión (`express-session` + `connect-mongo`) | `/api/v1` | [13](13-AUTHENTICATION-AUTHORIZATION.md) |
| 6 | `verifyOrigin` | `/api/v1`, métodos no seguros | Defensa CSRF ([12](12-SECURITY.md)) |
| 7 | Routers de módulos con `authenticate` → `authorize(permission)` → controlador | `/api/v1/<recurso>` | [13](13-AUTHENTICATION-AUTHORIZATION.md), [10](10-REST-API.md) |
| 8 | `apiNotFound` | `/api/v1` | 404 en formato Problem Details |
| 9 | `errorHandler` | Toda la app | Último; único lugar que responde errores |

### 7.2 Casos del dominio

| Caso | Aplicación |
|---|---|
| Envío a revisión (RF-030) | Servicio de cursos (`course-workflow.service.js` cuando se divida), método `submit`: valida todos los campos obligatorios con `shared/`; si hay errores lanza `AppError(422, 'validation_failed', { errors })`; transición atómica `draft → in_development` con `submittedAt`; luego `notifications.courseSubmitted(course)` (correo a Desarrollo Curricular, RF-036; evento SSE, RF-037). |
| Aprobación (RF-033) | Ver [§6.4](#64-ruta-controlador-servicio-y-repositorio): 409 si el código no está validado o si el estado cambió; avisos al Director y a Vicerrectoría después del commit (RF-038). |
| Gemini (RF-028, RF-029) | `course-ai.service.js` rechaza `competency` (RN-22) con 422, arma el prompt con nombre del curso y texto actual, llama a `integrations/gemini.js` y devuelve la propuesta sin recortarla (RF-029 CA2). |
| Carga CSV (RF-017) | El controlador recibe el archivo con `multer` ([12](12-SECURITY.md)); el servicio llama a `processCsv`, revalida cada fila, aplica "todo o nada" ante errores y omite duplicados reportándolos (RF-017 CA2-CA3); debe responder en ≤ 10 s para 1 000 filas (RNF-018). |
| Reportes (RF-042, RF-043) | `reports.service.js` construye agregaciones en el repositorio; el alcance del Director se fuerza desde `actor.schoolId` (RF-042 CA3). |

## 8. Errores frecuentes

- Envolver cada ruta en `try/catch` que responde `res.status(500).send(error.message)`: duplica el `errorHandler` y filtra mensajes internos.
- Registrar `express.json()` después de las rutas o antes de los estáticos sin necesidad.
- Crear un `MongoClient` por petición en vez de uno por proceso.
- Leer `process.env.X` en servicios o integraciones; las pruebas no pueden sustituir la configuración.
- Esperar (`await`) el correo antes de responder o dentro de la misma operación que el cambio de estado.
- Usar `exec(\`python3 script.py ${fileName}\`)`: inyección de comandos con nombres de archivo manipulados.
- Responder 200 con `{ error: '...' }` en vez de un status de error.
- Olvidar el cuarto parámetro del `errorHandler`: Express lo trata como middleware normal.

## 9. Checklist

- [ ] `server.js` solo arranca y cierra; `app.js` exporta `createApp` sin efectos secundarios.
- [ ] El orden de middlewares coincide con [§7.1](#71-orden-de-middlewares).
- [ ] Las rutas solo contienen `authenticate`, `authorize(...)` y el método del controlador.
- [ ] Los controladores usan lista blanca de campos y serializadores explícitos.
- [ ] Los servicios no importan `express` ni usan `req`/`res`.
- [ ] `process.env` aparece solo en `config/env.js`, que falla si falta una variable requerida.
- [ ] Todos los errores esperados son `AppError` con un `code` documentado en [10](10-REST-API.md).
- [ ] Ningún log contiene contraseñas, tokens, cookies, cadenas de conexión ni cuerpos completos.
- [ ] Toda integración externa tiene tiempo límite y traduce sus errores.
- [ ] Correos y eventos se envían después del commit y sus fallos no revierten el cambio.
- [ ] Python se invoca con `spawn` y arreglo de argumentos.

## 10. Referencias

- Express 5 — Guía de migración: https://expressjs.com/en/guide/migrating-5.html
- Express — Manejo de errores: https://expressjs.com/en/guide/error-handling.html
- Express — Buenas prácticas de seguridad: https://expressjs.com/en/advanced/best-practice-security.html
- Node.js — `--env-file`, `child_process`, `node:test`: https://nodejs.org/docs/latest/api/
- MongoDB Node.js Driver: https://www.mongodb.com/docs/drivers/node/current/
- RFC 9457 Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457
- Gemini API: https://ai.google.dev/gemini-api/docs
- HTML Living Standard — Server-sent events: https://html.spec.whatwg.org/multipage/server-sent-events.html
- OWASP Logging Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
