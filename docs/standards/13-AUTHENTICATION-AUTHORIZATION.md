# 13 · Autenticación y autorización

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo el sistema identifica a las personas usuarias (Google Identity e inicio de sesión local), cómo mantiene la sesión y cómo decide qué puede hacer cada rol sobre cada recurso, incluida la restricción del Director a su escuela. Aplica a los módulos `auth` y `users` del backend, a todos los middlewares de rutas protegidas, a los servicios que filtran por escuela y a `frontend/js/core/session.js`.

Los controles transversales (secretos, CSRF, cabeceras, registro de eventos) están en [12 · Seguridad](12-SECURITY.md). Los códigos de estado y el formato de errores están en [10 · API REST](10-REST-API.md).

## 2. Estándar adoptado

| Referencia | Uso | Estado |
|---|---|---|
| OpenID Connect Core 1.0 y OAuth 2.0 (RFC 6749) | Google Identity Services (GIS) entrega un ID token OIDC firmado que el servidor verifica. | Adoptado; flujo concreto [PV-02](README.md#7-decisiones-pendientes-de-validación) |
| Google Identity Services y guía *Verify the Google ID token* | Botón "Sign in with Google" y verificación con `google-auth-library`. | Adoptado |
| OWASP ASVS 5.0 V6, V7, V8, V10 (L1 + L2 selectos) | Autenticación, sesión, autorización y OIDC. | Adoptado |
| OWASP Session Management y Authorization Cheat Sheets | Atributos de cookie, regeneración, denegación por defecto. | Adoptado |
| RBAC con permisos nombrados + atributo de escuela (ABAC mínimo) | Matriz rol → permisos y filtro por `schoolId`. | Adoptado |
| ERS v1.1: RF-001, RF-002, RF-004, RF-005 CA4, RF-008, RF-009, RN-01 a RN-06, RN-13, RN-29, RNF-007, RNF-008, RNF-011, RNF-014 | Requerimientos de acceso. | Confirmado (ERS) |

Decisión arquitectónica: [ADR-0005 · Sesiones de servidor y Google Identity](../adr/0005-server-sessions-google-identity.md). Hash de contraseñas: [ADR-0007](../adr/0007-password-hashing-pbkdf2.md).

## 3. Justificación

- **Sesión de servidor con cookie HttpOnly** en lugar de JWT en `localStorage`: la cookie no es legible por JavaScript (mitiga robo por XSS), se revoca borrando el documento de sesión y permite que un cambio de rol o una eliminación de usuario tengan efecto inmediato.
- **Verificación del ID token en el servidor**: el navegador no es confiable; solo el servidor puede comprobar firma, audiencia, emisor, expiración y dominio institucional (RF-001 CA3).
- **Permisos nombrados** (`courses:approve`) en lugar de comparar roles en cada ruta: la matriz vive en un solo archivo, se prueba completa y la interfaz puede consultarla sin duplicarla.
- **Filtro de escuela en el servidor** a partir del usuario autenticado: es la única forma de cumplir RNF-008 ("pruebas con dos escuelas confirman que el Director no puede listar, consultar ni modificar cursos ajenos").

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla | Origen |
|---|---|---|
| AUTH-01 | El sistema **DEBE** ofrecer inicio de sesión con Google (obligatorio para la entrega final) y con correo y contraseña (deseable). Ambos mecanismos crean la misma sesión de servidor. | RF-001, RF-002 |
| AUTH-02 | El ID token de Google **DEBE** verificarse en el servidor con `google-auth-library` (`verifyIdToken` con `audience: GOOGLE_CLIENT_ID`) y además exigir `email_verified === true`, `hd === ALLOWED_EMAIL_DOMAIN` y que el correo termine en `@ucenfotec.ac.cr`. | RF-001 CA1, CA3 |
| AUTH-03 | Una cuenta de Google válida que no esté registrada **DEBE** rechazarse con 403 y código `account_not_authorized` ("Su cuenta no está autorizada"). **NO DEBE** crearse ningún usuario automáticamente. | RF-001 CA2, RN-04 |
| AUTH-04 | El servidor **NO DEBE** aceptar identidad declarada por el cliente: ni un correo enviado en el cuerpo ni claims decodificados en el navegador. Solo cuenta el token verificado o la contraseña comprobada. | ASVS V6, V10 |
| AUTH-05 | El inicio de sesión local **DEBE** validar el dominio del correo antes de autenticar (RF-002 CA3), comparar la contraseña según [ADR-0007](../adr/0007-password-hashing-pbkdf2.md) y responder siempre 401 `invalid_credentials` ("Correo o contraseña incorrectos") tanto si el correo no existe como si la contraseña es incorrecta, con un tiempo de respuesta equivalente (se calcula un hash de relleno cuando el usuario no existe). | RF-002 CA2, RNF-011 |
| AUTH-06 | La sesión **DEBE** gestionarse con `express-session` y `connect-mongo` (colección `sessions`) con la cookie `sgc.sid` configurada `HttpOnly`, `Secure` en producción, `SameSite=Lax` y `Path=/`, y con `resave: false`, `saveUninitialized: false`, `rolling: true`. | ASVS V7 |
| AUTH-07 | Al iniciar sesión **DEBE** llamarse `req.session.regenerate()` antes de guardar datos (previene fijación de sesión). La sesión guarda solo `userId`, `authMethod` y `loginAt`. | ASVS V7 |
| AUTH-08 | La sesión **DEBE** expirar por inactividad y por tiempo absoluto. Valores vigentes: 30 minutos de inactividad (`SESSION_MAX_AGE_MS` con `rolling`) y 8 horas absolutas desde `loginAt`. Valores definitivos en [PV-03](README.md#7-decisiones-pendientes-de-validación). La interfaz avisa antes de la expiración por inactividad y permite extender la sesión ([14 · A11Y-14](14-ACCESSIBILITY.md), WCAG 2.2.1). | ASVS V7 |
| AUTH-09 | En cada petición autenticada el middleware `authenticate` **DEBE** cargar el usuario desde la base de datos por `userId` y exponer `req.user = { id, role, schoolId, preferredLanguage }`. Si el usuario ya no existe, destruye la sesión y responde 401. El rol nunca se lee de la cookie ni de la sesión. | RN-01, RF-006 CA1 |
| AUTH-10 | Toda ruta de la API, salvo `POST /api/v1/auth/login`, `POST /api/v1/auth/google` y `GET /api/v1/auth/google/config`, **DEBE** montarse detrás de `authenticate`, y toda ruta de negocio **DEBE** declarar `authorize('<permiso>')`. Lo que no se autoriza explícitamente se deniega. | RNF-007 |
| AUTH-11 | La matriz rol → permisos de [§7.1](#71-matriz-de-permisos) **DEBE** existir en un único archivo, `backend/src/modules/auth/permissions.js`. La interfaz obtiene los permisos del usuario desde `GET /api/v1/auth/me`; no mantiene una copia propia. | RNF-045 |
| AUTH-12 | El alcance por escuela **DEBE** aplicarse en el servicio a partir de `req.user`: para `school_director`, toda consulta, actualización, adjunto, reporte y transición filtra por `schoolId` del usuario; cualquier `schoolId` recibido en query o cuerpo se ignora para ese rol. Al crear un curso, la escuela se asigna desde el perfil del Director. | RF-009, RN-06, RNF-008 |
| AUTH-13 | Un recurso que existe pero está fuera del alcance del usuario **DEBE** responder 404 (no revela su existencia). Un rol sin el permiso requerido **DEBE** responder 403. Sin sesión, 401. | RF-009 CA3, RF-040 CA3 |
| AUTH-14 | El servicio **DEBE** validar el estado del recurso además del permiso: el Director solo edita cursos en `draft`; las transiciones siguen la máquina de estados del [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) y una transición inválida responde 409 `invalid_transition`. | RF-019 CA4, RN-09 a RN-12 |
| AUTH-15 | Solo puede existir un usuario con rol `admin`, uno con `rector` y uno con `vice_rector`. El servicio lo verifica y responde 409 `unique_role_taken`; el índice único parcial de [11](11-MONGODB.md) es la garantía final. El rol `school_director` exige `schoolId`. | RN-03, RF-004 CA2, CA3 |
| AUTH-16 | El Administrador autenticado **NO DEBE** poder eliminarse ni quitarse su propio rol `admin` (deriva de la intención de RF-006 CA3: "para que siempre exista un Administrador"). Un Director con cursos no se elimina (409). | RN-29, RF-006 CA3, CA4 |
| AUTH-17 | Cada uno de los cinco roles **DEBE** tener al menos una prueba negativa automatizada, y cada celda de la matriz de §7.1 una prueba positiva o negativa ([16](16-TESTING.md)). Debe existir una prueba con dos escuelas para RNF-008. | OBJ-03, RNF-007, RNF-008 |
| AUTH-18 | La interfaz **DEBE** ocultar las acciones y opciones de menú no permitidas (RF-005 CA4, RF-008 CA3), pero esa ocultación es solo experiencia de usuario: el servidor decide siempre. | RF-008 |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| AUTH-19 | El inicio con Google **DEBERÍA** usar `nonce`: el servidor lo genera con `crypto.randomUUID()`, lo guarda en la sesión previa al login y lo entrega en `GET /api/v1/auth/google/config`; al verificar se compara con `payload.nonce` y se descarta. |
| AUTH-20 | **DEBERÍA** existir `POST /api/v1/auth/logout` que llame a `req.session.destroy()` y limpie la cookie, aunque la interfaz no muestre el botón mientras [PV-03](README.md#7-decisiones-pendientes-de-validación) siga abierto. |
| AUTH-21 | Los intentos fallidos de inicio de sesión local **DEBERÍAN** limitarse según [SEC-23](12-SECURITY.md#42-recomendadas-debería). |
| AUTH-22 | Los cambios de rol y las eliminaciones de usuarios **DEBERÍAN** invalidar las sesiones abiertas del usuario afectado (borrado en `sessions` por `userId`); con AUTH-09 el efecto ya es inmediato para el rol, esto además fuerza un nuevo inicio de sesión. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| AUTH-23 | Se **PUEDE** pasar `locale` al botón de Google para que coincida con el idioma activo ([20](20-INTERNATIONALIZATION.md)). |
| AUTH-24 | Se **PUEDE** registrar en el usuario la fecha del último inicio de sesión (`lastLoginAt`) si el equipo la necesita; es un dato nuevo y debe documentarse en [12 §7.3](12-SECURITY.md#73-datos-personales-rnf-013-a-rnf-015). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Roles (valor almacenado) | `snake_case`, lista cerrada del [glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio) | `admin`, `curriculum_development`, `school_director`, `rector`, `vice_rector` |
| Permisos | `<recurso>:<acción>` en minúsculas con guiones | `courses:move-to-production` |
| Constantes | `ROLES`, `PERMISSIONS` (`UPPER_SNAKE_CASE`, congeladas) | `ROLES.SCHOOL_DIRECTOR` |
| Middlewares | verbo en camelCase | `authenticate`, `authorize('users:manage')` |
| Cookie de sesión | `sgc.sid` | — |
| Campos de sesión | camelCase | `userId`, `authMethod`, `loginAt`, `googleNonce` |
| Códigos de error de acceso | `snake_case` ([10](10-REST-API.md)) | `unauthenticated`, `forbidden`, `invalid_credentials`, `account_not_authorized`, `invalid_google_token`, `unique_role_taken`, `self_deletion_forbidden`, `director_has_courses` |

## 6. Ejemplos

### 6.1 Verificación del ID token de Google

```js
// backend/src/integrations/google-identity.js
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

const client = new OAuth2Client();

/**
 * Verifica el ID token de Google Identity Services.
 * Devuelve el correo institucional en minúsculas o null si la cuenta no es admisible.
 * Lanza un error si la firma, la audiencia, el emisor o la expiración no son válidos.
 */
export async function verifyGoogleCredential(idToken, expectedNonce) {
  const ticket = await client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const email = String(payload.email ?? '').toLowerCase();
  const domain = env.ALLOWED_EMAIL_DOMAIN; // ucenfotec.ac.cr
  const isAdmissible =
    payload.email_verified === true &&
    payload.hd === domain &&
    email.endsWith(`@${domain}`) &&
    (!expectedNonce || payload.nonce === expectedNonce);
  return isAdmissible ? email : null;
}
```

```js
// backend/src/modules/auth/auth.service.js
import { verifyGoogleCredential } from '../../integrations/google-identity.js';
import { ForbiddenError, UnauthorizedError } from '../../lib/errors.js';
import * as usersService from '../users/users.service.js';

export async function loginWithGoogle(credential, expectedNonce) {
  let email;
  try {
    email = await verifyGoogleCredential(credential, expectedNonce);
  } catch {
    throw new UnauthorizedError('invalid_google_token');
  }
  if (!email) throw new ForbiddenError('account_not_authorized'); // RF-001 CA3
  const user = await usersService.findByEmail(email);
  if (!user) throw new ForbiddenError('account_not_authorized'); // RF-001 CA2: sin auto-registro
  return user;
}
```

```js
// backend/src/modules/auth/auth.controller.js
import { promisify } from 'node:util';
import * as authService from './auth.service.js';
import { homePathFor } from './home-path.js';

async function startSession(req, user, authMethod) {
  await promisify(req.session.regenerate.bind(req.session))(); // AUTH-07
  req.session.userId = user.id;
  req.session.authMethod = authMethod;
  req.session.loginAt = Date.now();
}

export async function loginWithGoogle(req, res) {
  const user = await authService.loginWithGoogle(req.body.credential, req.session.googleNonce);
  await startSession(req, user, 'google');
  res.json({ data: { homePath: homePathFor(user.role) } });
}
```

`homePathFor` aplica RF-002 CA1: el Administrador va a Usuarios y los demás roles a Cursos ("Mis cursos" para el Director). La página "Inicio" por rol es una propuesta pendiente ([PV-15](README.md#7-decisiones-pendientes-de-validación)).

### 6.2 Botón de Google en el frontend

```html
<!-- frontend/index.html (A-01) -->
<script src="https://accounts.google.com/gsi/client" async></script>
<div class="login-form__google" data-google-signin></div>
<script type="module" src="/js/pages/login.page.js"></script>
```

```js
// frontend/js/features/auth/google-sign-in.js
/* global google */
import { apiGet, apiPost } from '../../core/api-client.js';

export async function mountGoogleSignIn(container, { onError }) {
  const { data } = await apiGet('/auth/google/config'); // { clientId, nonce }
  google.accounts.id.initialize({
    client_id: data.clientId,
    nonce: data.nonce,
    callback: async ({ credential }) => {
      try {
        const response = await apiPost('/auth/google', { credential });
        window.location.assign(response.data.homePath);
      } catch (error) {
        onError(error); // A-04 cuenta no autorizada · A-05 cancelado o sin respuesta
      }
    },
  });
  google.accounts.id.renderButton(container, { type: 'standard', theme: 'outline', size: 'large' });
}
```

La página espera a que el script de GIS termine de cargar antes de llamar a `mountGoogleSignIn` (por ejemplo, escuchando el evento `load` de `window`).

Incorrecto: decidir en el navegador.

```js
// INCORRECTO: el navegador decodifica el token y envía el correo; cualquiera puede falsificarlo.
const claims = JSON.parse(atob(credential.split('.')[1]));
await apiPost('/auth/google', { email: claims.email });
```

### 6.3 Configuración de la sesión

```js
// backend/src/app.js (extracto)
import session from 'express-session';
import MongoStore from 'connect-mongo'; // verificar la forma de importación de la versión instalada

if (env.NODE_ENV === 'production') app.set('trust proxy', 1); // TLS terminado en el proxy

app.use(
  session({
    name: 'sgc.sid',
    secret: env.SESSION_SECRET, // ≥ 32 bytes aleatorios
    resave: false,
    saveUninitialized: false,
    rolling: true, // renueva la expiración por inactividad en cada respuesta
    store: MongoStore.create({
      client: mongoClient,
      dbName: env.MONGODB_DB_NAME,
      collectionName: 'sessions',
      ttl: env.SESSION_MAX_AGE_MS / 1000, // segundos
    }),
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: env.SESSION_MAX_AGE_MS, // 30 min (PV-03)
    },
  }),
);
```

### 6.4 Autenticación por petición y expiración absoluta

```js
// backend/src/middlewares/authenticate.js
import { UnauthorizedError } from '../lib/errors.js';
import * as usersService from '../modules/users/users.service.js';

// PV-03: límite absoluto fijo; mover a env.js si se confirma otro valor.
const ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000;

export async function authenticate(req, _res, next) {
  const { userId, loginAt } = req.session ?? {};
  if (!userId || Date.now() - loginAt > ABSOLUTE_SESSION_MS) {
    await destroySession(req);
    throw new UnauthorizedError('unauthenticated');
  }
  const user = await usersService.findSessionUser(userId); // proyección sin datos sensibles
  if (!user) {
    await destroySession(req);
    throw new UnauthorizedError('unauthenticated');
  }
  req.user = user; // { id, role, schoolId, preferredLanguage }
  next();
}

function destroySession(req) {
  return new Promise((resolve) => (req.session ? req.session.destroy(() => resolve()) : resolve()));
}
```

Express 5 envía al `errorHandler` los errores lanzados y las promesas rechazadas por middlewares asíncronos ([09](09-NODEJS-BACKEND.md)).

### 6.5 Matriz de permisos y middleware `authorize`

```js
// backend/src/modules/auth/permissions.js — fuente única (AUTH-11)
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  CURRICULUM_DEVELOPMENT: 'curriculum_development',
  SCHOOL_DIRECTOR: 'school_director',
  RECTOR: 'rector',
  VICE_RECTOR: 'vice_rector',
});

const { ADMIN, CURRICULUM_DEVELOPMENT, SCHOOL_DIRECTOR, RECTOR, VICE_RECTOR } = ROLES;

export const PERMISSIONS = Object.freeze({
  'users:manage': [ADMIN],
  'catalogs:manage': [ADMIN],
  'courses:read': [ADMIN, CURRICULUM_DEVELOPMENT, SCHOOL_DIRECTOR, RECTOR, VICE_RECTOR],
  'courses:create': [SCHOOL_DIRECTOR],
  'courses:update-draft': [SCHOOL_DIRECTOR],
  'courses:submit': [SCHOOL_DIRECTOR],
  'ai:suggest': [SCHOOL_DIRECTOR],
  'courses:review': [CURRICULUM_DEVELOPMENT],
  'courses:approve': [CURRICULUM_DEVELOPMENT],
  'courses:move-to-production': [CURRICULUM_DEVELOPMENT],
  'courses:deactivate': [ADMIN, CURRICULUM_DEVELOPMENT],
  'reports:production:read': [ADMIN, SCHOOL_DIRECTOR, RECTOR, VICE_RECTOR],
  'reports:history:read': [ADMIN, RECTOR, VICE_RECTOR],
});

export function can(role, permission) {
  return PERMISSIONS[permission]?.includes(role) ?? false;
}

export function permissionsFor(role) {
  return Object.keys(PERMISSIONS).filter((permission) => can(role, permission));
}
```

```js
// backend/src/middlewares/authorize.js
import { can } from '../modules/auth/permissions.js';
import { ForbiddenError } from '../lib/errors.js';

export function authorize(permission) {
  return (req, _res, next) => {
    if (!can(req.user.role, permission)) throw new ForbiddenError('forbidden');
    next();
  };
}
```

```js
// backend/src/modules/courses/courses.routes.js
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import * as coursesController from './courses.controller.js';

export const coursesRouter = Router();
coursesRouter.use(authenticate);
coursesRouter.get('/', authorize('courses:read'), coursesController.list);
coursesRouter.post('/', authorize('courses:create'), coursesController.create);
coursesRouter.post('/:id/approve', authorize('courses:approve'), coursesController.approve);
```

### 6.6 Alcance por escuela

```js
// backend/src/modules/courses/courses.service.js
import { ROLES } from '../auth/permissions.js';
import { NotFoundError } from '../../lib/errors.js';

/** Filtro de alcance derivado del usuario autenticado (nunca de la petición). */
function scopeFor(user) {
  return user.role === ROLES.SCHOOL_DIRECTOR ? { schoolId: user.schoolId } : {};
}

export async function getCourse(user, courseId) {
  const course = await coursesRepository.findOne({ id: courseId, ...scopeFor(user) });
  if (!course) throw new NotFoundError('not_found'); // AUTH-13: no revela si existe en otra escuela
  return course;
}

export async function createCourse(user, input) {
  const schoolId = user.schoolId; // RF-009 CA2: se ignora cualquier schoolId del cuerpo
  return coursesRepository.insert({ ...buildDraft(input), schoolId, createdBy: user.id });
}
```

Incorrecto: confiar en el filtro que manda el cliente.

```js
// INCORRECTO: un Director cambia ?schoolId= en la URL y ve otra escuela.
const courses = await coursesRepository.find({ schoolId: req.query.schoolId });
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Matriz de permisos

Fuente: ERS RF-003 a RF-043, RN-04 a RN-06, RN-13, y matriz de pantallas y permisos del handoff (sección 01). "Escuela" significa permitido solo dentro de la escuela del Director.

| Permiso | Administrador | Desarrollo Curricular | Director de Escuela | Rectoría | Vicerrectoría | Referencias |
|---|---|---|---|---|---|---|
| `users:manage` (listar, registrar, editar, eliminar, buscar usuarios) | Sí | — | — | — | — | RF-003 a RF-007, RN-04 |
| `catalogs:manage` (registrar, editar, eliminar, importar CSV) | Sí | — | — | — | — | RF-010 a RF-017, RN-05 |
| `courses:read` (listado, detalle, adjuntos) | Sí (global) | Sí (global) | Escuela | Sí (global, solo lectura) | Sí (global, solo lectura) | RF-039, RF-040, RN-13 |
| `courses:create` | — | — | Escuela | — | — | RF-018, RF-009 CA2 |
| `courses:update-draft` (guardar borrador, adjuntar, quitar adjuntos) | — | — | Escuela, solo `draft` | — | — | RF-019 a RF-027 |
| `courses:submit` | — | — | Escuela, solo `draft` | — | — | RF-030 |
| `ai:suggest` | — | — | Escuela | — | — | RF-028, RF-029 |
| `courses:review` (bandeja, validar, corregir o generar código, flujo SSE) | — | Sí | — | — | — | RF-031, RF-032, RF-037 |
| `courses:approve` | — | Sí (requiere código validado) | — | — | — | RF-033, RN-10 |
| `courses:move-to-production` | — | Sí (solo `approved`) | — | — | — | RF-034, RN-11 |
| `courses:deactivate` | Sí | Sí | — | — | — | RF-035, RN-12 |
| `reports:production:read` | Sí | — | Escuela (filtro fijo) | Sí | Sí | RF-042 CA1, CA3 |
| `reports:history:read` | Sí | — | — | Sí | Sí | RF-043 |

Sin permiso específico, cualquier usuario autenticado puede: leer los catálogos para selectores y filtros (`GET /api/v1/catalogs/...`), consultar `GET /api/v1/auth/me` y cambiar su preferencia de idioma (`PATCH /api/v1/me/preferences`, RF-044).

### 7.2 Semántica de respuestas y comportamiento del frontend

| Situación | Status · código | Frontend (`core/session.js`, `core/api-client.js`) |
|---|---|---|
| Sin sesión o sesión expirada | 401 · `unauthenticated` | Redirige a inicio de sesión (A-01) conservando la ruta solicitada |
| Rol sin permiso para la acción o la vista | 403 · `forbidden` | Muestra acceso denegado (A-06) y redirige a la vista inicial del rol (RF-008 CA4) |
| Recurso de otra escuela o inexistente | 404 · `not_found` | Muestra "no encontrado" sin indicar si existe |
| Cuenta de Google no registrada o de otro dominio | 403 · `account_not_authorized` | A-04 "Su cuenta no está autorizada" |
| Google cancelado o sin respuesta | Sin petición o error de red | A-05, permanece en inicio de sesión (RF-001 CA4) |
| Correo o contraseña incorrectos | 401 · `invalid_credentials` | A-03 con mensaje genérico (RNF-011) |
| Cargo único ocupado | 409 · `unique_role_taken` | Error junto al campo Rol (U-04) |

Cada página llama a `GET /api/v1/auth/me` al cargar; la respuesta incluye `permissions` (de `permissionsFor`) para decidir qué menús y botones mostrar (AUTH-18).

### 7.3 Pruebas negativas mínimas por rol (OBJ-03)

| Rol | Petición | Esperado |
|---|---|---|
| Sin sesión | `GET /api/v1/courses` | 401 |
| Director de Escuela | `GET /api/v1/users` | 403 |
| Director de Escuela (escuela A) | `GET /api/v1/courses/{curso de la escuela B}` | 404 (RNF-008) |
| Director de Escuela | `PATCH /api/v1/courses/{id}` con curso en `in_development` | 409 `invalid_transition` |
| Desarrollo Curricular | `POST /api/v1/catalogs/schools` | 403 |
| Rectoría | `POST /api/v1/courses/{id}/approve` | 403 |
| Vicerrectoría | `POST /api/v1/courses` | 403 |
| Administrador | `POST /api/v1/courses/{id}/approve` | 403 |
| Administrador | `DELETE /api/v1/users/{su propio id}` | 409 `self_deletion_forbidden` |

La matriz completa rol × permiso se automatiza según [16](16-TESTING.md).

## 8. Errores frecuentes

- Guardar `role` o `schoolId` en la sesión y no volver a leerlos: un usuario degradado conserva permisos hasta que expira la sesión.
- Olvidar `authorize` en una ruta nueva porque "la pantalla no la muestra".
- Usar `if (req.user.role === 'admin')` dispersos en controladores en lugar de permisos nombrados.
- Responder 403 a un Director que pide un curso de otra escuela (revela que el curso existe).
- Aceptar `schoolId` del cuerpo al crear un curso de Director.
- Validar solo `hd` o solo el sufijo del correo; se exigen ambos y `email_verified`.
- Crear el usuario si no existe al iniciar con Google ("auto-registro"), prohibido por RF-001 CA2.
- Mensajes distintos para "correo no existe" y "contraseña incorrecta".
- No llamar a `regenerate()` al iniciar sesión.
- Probar solo el camino feliz del Administrador y ninguna denegación.

## 9. Checklist

- [ ] Toda ruta nueva está detrás de `authenticate` y declara `authorize('<permiso>')`, o figura en la lista pública de AUTH-10.
- [ ] El permiso existe en `permissions.js` y la tabla de §7.1 está actualizada.
- [ ] Para `school_director`, el servicio filtra por `req.user.schoolId` e ignora `schoolId` de la petición.
- [ ] Los recursos fuera de alcance responden 404; los permisos faltantes, 403.
- [ ] El servicio valida el estado del curso antes de editar o transicionar.
- [ ] Hay al menos una prueba negativa para cada rol afectado por el cambio.
- [ ] El inicio de sesión regenera la sesión y guarda solo `userId`, `authMethod` y `loginAt`.
- [ ] Los mensajes de autenticación fallida son genéricos.
- [ ] La interfaz oculta las acciones no permitidas usando `permissions` de `/auth/me`.

## 10. Referencias

- Google Identity Services, botón de inicio de sesión: https://developers.google.com/identity/gsi/web
- Verificar el ID token de Google: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- OpenID Connect Core 1.0: https://openid.net/specs/openid-connect-core-1_0.html
- OAuth 2.0 (RFC 6749): https://www.rfc-editor.org/rfc/rfc6749
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Express 5: https://expressjs.com/en/guide/migrating-5.html
- Decisiones: [ADR-0005](../adr/0005-server-sessions-google-identity.md), [ADR-0007](../adr/0007-password-hashing-pbkdf2.md).
