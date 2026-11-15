# 11 · MongoDB

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define el modelo de datos de la Iteración 2 sobre MongoDB Atlas: colecciones, forma de los documentos, identificadores, referencias frente a documentos embebidos, índices, validación de esquema, operaciones CRUD con el driver oficial, migraciones, eliminación lógica de cursos, integridad referencial, búsqueda insensible a tildes, archivos con GridFS y datos de prueba.

Estado: **no hay base de datos ni colecciones creadas**; todo lo descrito es **Adoptado** salvo donde se indica **Pendiente de validación**. El uso del driver nativo en lugar de Mongoose es PV-01 ([ADR-0004](../adr/0004-mongodb-native-driver-json-schema.md)).

Los nombres de campos y valores provienen del [Glosario de dominio](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio). La capa que ejecuta estas operaciones (repositorios) está descrita en [09](09-NODEJS-BACKEND.md); la protección de la cadena de conexión y los archivos subidos, en [12](12-SECURITY.md).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Motor | MongoDB Atlas (base separada por ambiente: desarrollo, pruebas, entrega) | Confirmado (ERS §2.6) |
| Acceso | Driver oficial `mongodb` (v6 o superior), un `MongoClient` por proceso | Pendiente de validación (PV-01) |
| Validación | Tres niveles: cliente (experiencia), servicio (reglas de `shared/`), base de datos (`$jsonSchema` estricto + índices únicos) | Adoptado |
| Cambios de esquema | Migraciones numeradas, idempotentes y solo hacia adelante (`npm run db:migrate`) | Adoptado |
| Eliminación de cursos | Solo lógica: cambio a `inactive` (RN-12, RNF-026) | Confirmado (ERS) |
| Eliminación de usuarios y catálogos | Física, con restricciones de uso (RF-006, RF-015, RN-27, RN-29) | Confirmado (ERS) |
| Archivos | GridFS, bucket `files` | Adoptado |
| Búsqueda | Campo normalizado (`searchText`, `nameNormalized`) + expresión regular escapada | Adoptado |

## 3. Justificación

- **`$jsonSchema` en la base** convierte las reglas estructurales (tipos, enumerados, límites RN-17 a RN-19) en una garantía que ningún script ni error de código puede saltarse; el servicio sigue validando para dar mensajes por campo.
- **Índices únicos** son la única forma confiable de impedir duplicados con usuarios concurrentes (correo, identificación, código de curso, cargos únicos RN-03); una verificación previa en código no basta.
- **Referencias por `ObjectId` a catálogos** cumplen RF-010 CA3: al renombrar un elemento, los cursos muestran el valor actualizado sin reescribirlos.
- **Historial embebido** (`statusHistory`, `codeHistory`) se lee siempre junto con el curso, está acotado a pocas entradas y documenta quién y cuándo (RF-032 CA2, RF-033 CA1).
- **Transiciones con filtro de estado** hacen atómica la aprobación sin transacciones multi-documento (RNF-025): MongoDB garantiza atomicidad por documento.
- **Normalizar en escritura** permite búsquedas sin mayúsculas ni tildes (RF-007, RF-016, RF-041) que una *collation* no resuelve para coincidencias parciales con `$regex`.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| DB-01 | El acceso a MongoDB **DEBE** hacerse solo desde repositorios (`*.repository.js`), migraciones y scripts de `backend/src/db/`. |
| DB-02 | **DEBE** existir un único `MongoClient` por proceso, creado en `server.js` y compartido; nunca se conecta por petición. |
| DB-03 | Toda colección de negocio **DEBE** tener un validador `$jsonSchema` con `validationLevel: 'strict'` y `validationAction: 'error'`, creado por migración. |
| DB-04 | Las restricciones de unicidad **DEBEN** implementarse con índices únicos (ver [§7.3](#73-índices)); la verificación previa en el servicio solo mejora el mensaje. El error `11000` se traduce a 409 `duplicate_value` ([09](09-NODEJS-BACKEND.md)). |
| DB-05 | **NO DEBE** ejecutarse `deleteOne`, `deleteMany`, `findOneAndDelete`, `replaceOne` ni `drop` sobre `courses`, ni en código ni en scripts. Desactivar un curso es un `updateOne` a `inactive` con `deactivatedAt`, `deactivatedBy` y entrada en `statusHistory` (RF-035, RN-12, RNF-026). |
| DB-06 | Las transiciones de estado **DEBEN** ser atómicas: un `updateOne`/`findOneAndUpdate` cuyo filtro incluye el estado esperado; si `matchedCount === 0` (o el resultado es `null`) se responde 409 (RNF-025). |
| DB-07 | Toda escritura **DEBE** fijar `updatedAt` desde el servicio (RNF-027); `metadataUpdatedAt` solo cambia si cambió `metadata` (RF-026 CA2); `createdAt` y `createdBy` solo en la inserción. |
| DB-08 | Las fechas **DEBEN** guardarse como BSON `Date` en UTC, nunca como cadenas. |
| DB-09 | Los identificadores de la API **DEBEN** validarse con `/^[0-9a-f]{24}$/i` antes de `new ObjectId(id)`; uno mal formado responde 404. `ObjectId.isValid` no basta porque acepta cualquier cadena de 12 caracteres. |
| DB-10 | Los filtros **DEBEN** construirse campo por campo con valores primitivos ya validados. Nunca se pasa `req.query`, `req.body` ni un objeto del cliente directamente como filtro, proyección, orden o actualización (inyección de operadores `$`). |
| DB-11 | Las referencias entre colecciones **DEBEN** guardarse como `ObjectId` en campos `<entidad>Id`. Antes de escribir, el servicio verifica que el elemento referenciado exista (`invalid_reference`). |
| DB-12 | Un elemento de catálogo **NO DEBE** eliminarse si algún curso (de cualquier estado, incluido `inactive`) o usuario lo referencia; se responde 409 `catalog_item_in_use` con la cantidad (RF-015 CA2, RN-27). |
| DB-13 | Un usuario **NO DEBE** eliminarse si es el Administrador autenticado o un Director con cursos (RF-006 CA3-CA4, RN-29). Al eliminarlo se borran también su foto en GridFS y sus sesiones (ERS §7.2). |
| DB-14 | Los textos buscables **DEBEN** guardar su versión normalizada (`searchText` en cursos y usuarios; `nameNormalized` en catálogos) calculada con `normalizeText` de `shared/`, y las búsquedas **DEBEN** escapar los metacaracteres de expresión regular del término. |
| DB-15 | Los cambios de esquema e índices **DEBEN** hacerse con una migración nueva; una migración aplicada nunca se edita. |
| DB-16 | Los datos de semilla masiva (5 000 cursos, RNF-019) **NO DEBEN** ejecutarse contra la base de entrega; el script se niega si `NODE_ENV === 'production'`. |
| DB-17 | Los listados **DEBEN** paginarse en la base (`skip`/`limit` + `countDocuments`) y proyectar solo los campos que la vista usa. |
| DB-18 | Los nombres de catálogos **NO DEBEN** copiarse dentro del curso; se guardan referencias para que los cambios se reflejen (RF-010 CA3). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| DB-19 | El usuario de base de datos de la aplicación **DEBERÍA** tener un rol personalizado de Atlas con `find`, `insert` y `update` sobre `courses`, **sin** `remove`, y sin permisos de `collMod`/`createIndex`; las migraciones usan otro usuario. Así la regla DB-05 también la impone la base. |
| DB-20 | Cada consulta nueva de listado o reporte **DEBERÍA** revisarse con `explain('executionStats')` sobre los 5 000 cursos de prueba; un `COLLSCAN` en una consulta frecuente requiere índice. |
| DB-21 | Las operaciones que deben ser consistentes entre **varios** documentos **DEBERÍAN** usar una transacción (`client.withSession` + `session.withTransaction`); las de un solo documento no la necesitan. |
| DB-22 | Los listados de cursos **DEBERÍAN** devolver identificadores de catálogos y que el frontend resuelva sus nombres con los catálogos que ya carga para filtros y formularios; los reportes resuelven nombres en el servidor con `$lookup`. |
| DB-23 | Los correos se **DEBERÍAN** guardar en minúsculas y las cadenas con `trim()` aplicado, antes de calcular campos normalizados. |
| DB-24 | Las referencias a usuarios eliminados (`approvedBy`, `codeHistory[].by`) **DEBERÍAN** mostrarse como "Usuario eliminado"; no se reescriben. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| DB-25 | **PUEDE** usarse *collation* `{ locale: 'es', strength: 1 }` para ordenar nombres sin distinguir tildes ni mayúsculas. |
| DB-26 | **PUEDE** usarse `findOneAndUpdate` con `returnDocument: 'after'` en lugar de `updateOne` cuando el servicio necesita el documento actualizado (por ejemplo, para notificar). |

## 5. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Colección | `camelCase`, plural, inglés | `courses`, `degreePrograms`, `certifyingBodies` |
| Campo | `camelCase` | `powerCampusName`, `metadataUpdatedAt` |
| Referencia | `<entidad>Id` (`ObjectId`) | `schoolId`, `topicId`, `approvedBy` (usuario) |
| Fechas de evento | `<evento>At` | `submittedAt`, `approvedAt`, `deactivatedAt` |
| Autor de evento | `<evento>By` | `approvedBy`, `deactivatedBy`, `createdBy` |
| Booleanos | Afirmación | `codeRequested`, `codeValidated`, `belongsToProgram`, `ecommerce.isOpen` |
| Índice | `<propósito>` en `snake_case`; prefijo `uniq_` si es único | `uniq_course_code`, `review_inbox` |
| Migración | `NNNN-<descripcion>.js` | `0001-create-collections.js` |
| Bucket GridFS | `files` | colecciones `files.files`, `files.chunks` |

## 6. Ejemplos

### 6.1 Documento de curso

```js
// Notación de mongosh
const course = {
  _id: ObjectId('6740f1c2a9e3b54d2c1f0a11'),
  schoolId: ObjectId('6740f0aaa9e3b54d2c1f09f0'),
  code: 'SOFT-101',
  codeRequested: false,
  codeValidated: false,
  name: 'Programación web',
  status: 'in_development',
  sfiaAreaId: null,
  topicId: ObjectId('6740f0aaa9e3b54d2c1f0a01'),
  learningMethodologyId: ObjectId('6740f0aaa9e3b54d2c1f0a02'),
  complexityLevel: 'intermediate',
  certificationId: ObjectId('6740f0aaa9e3b54d2c1f0a03'), // elemento de sistema "No tiene"
  certifyingBodyId: null,
  powerCampusName: 'PROGRAMACION WEB',
  credits: 4,
  classHours: 48,
  extraClassHours: 96, // totalHours (144) se calcula, no se guarda (RN-16)
  modality: 'hybrid',
  currency: 'CRC',
  requiredPrerequisites: 'Fundamentos de programación',
  desiredPrerequisites: 'HTML y CSS básicos',
  belongsToProgram: false,
  programName: null,
  shortDescription: '…',
  metaDescription: '…',
  longDescription: '…',
  competency: '…',
  specificCapabilities: '…',
  entryProfile: '…',
  exitProfile: '…',
  keywords: ['html', 'css', 'javascript'],
  ecommerce: { isOpen: true, startDate: ISODate('2027-01-10T06:00:00Z'), endDate: ISODate('2027-02-10T06:00:00Z') },
  metadata: '…',
  metadataUpdatedAt: ISODate('2026-11-18T16:00:00Z'),
  attachments: [
    {
      fileId: ObjectId('6740f3d1a9e3b54d2c1f0b20'),
      fileName: 'programa-del-curso.pdf',
      contentType: 'application/pdf',
      size: 482133,
      uploadedAt: ISODate('2026-11-18T16:05:00Z'),
      uploadedBy: ObjectId('6740efc9a9e3b54d2c1f09aa'),
    },
  ],
  statusHistory: [
    { from: null, to: 'draft', by: ObjectId('6740efc9a9e3b54d2c1f09aa'), at: ISODate('2026-11-17T14:00:00Z') },
    { from: 'draft', to: 'in_development', by: ObjectId('6740efc9a9e3b54d2c1f09aa'), at: ISODate('2026-11-19T15:30:00Z') },
  ],
  codeHistory: [],
  searchText: 'soft-101 programacion web',
  createdBy: ObjectId('6740efc9a9e3b54d2c1f09aa'),
  createdAt: ISODate('2026-11-17T14:00:00Z'),
  updatedAt: ISODate('2026-11-19T15:30:00Z'),
  submittedAt: ISODate('2026-11-19T15:30:00Z'),
  approvedAt: null, approvedBy: null, productionAt: null, deactivatedAt: null, deactivatedBy: null,
};
```

En la API este documento se expone con `id` en vez de `_id`, sin `searchText` y con `totalHours` calculado ([10](10-REST-API.md)).

### 6.2 Validador `$jsonSchema` de `courses`

```js
// backend/src/modules/courses/courses.schema.js
const STATUSES = ['draft', 'in_development', 'approved', 'in_production', 'inactive'];
const nullableId = { bsonType: ['objectId', 'null'] };
const nullableText = { bsonType: ['string', 'null'] };
const nullableDate = { bsonType: ['date', 'null'] };
const nullableInt = (minimum, maximum) => ({ bsonType: ['int', 'null'], minimum, maximum });

export const coursesValidator = {
  $jsonSchema: {
    bsonType: 'object',
    additionalProperties: false,
    required: [
      '_id', 'schoolId', 'name', 'status', 'codeRequested', 'codeValidated', 'keywords',
      'attachments', 'statusHistory', 'codeHistory', 'searchText', 'createdBy', 'createdAt', 'updatedAt',
    ],
    // RN-07: código obligatorio salvo que se solicite a Desarrollo Curricular
    anyOf: [{ required: ['code'] }, { properties: { codeRequested: { enum: [true] } } }],
    properties: {
      _id: { bsonType: 'objectId' },
      schoolId: { bsonType: 'objectId' },
      code: { bsonType: 'string', pattern: '^[A-Z]{2,5}-[0-9]{2,4}$' }, // PV-08
      codeRequested: { bsonType: 'bool' },
      codeValidated: { bsonType: 'bool' },
      name: { bsonType: 'string', minLength: 3, maxLength: 150 },
      status: { enum: STATUSES },
      sfiaAreaId: nullableId,
      topicId: nullableId,
      learningMethodologyId: nullableId,
      certificationId: nullableId,
      certifyingBodyId: nullableId,
      complexityLevel: { enum: ['basic', 'intermediate', 'advanced', 'certification', 'variable', null] },
      modality: { enum: ['in_person', 'online_synchronous', 'online_asynchronous', 'hybrid', null] },
      currency: { enum: ['CRC', 'USD', null] },
      powerCampusName: { bsonType: ['string', 'null'], maxLength: 40 }, // RN-17
      shortDescription: { bsonType: ['string', 'null'], maxLength: 250 }, // RN-18
      metaDescription: { bsonType: ['string', 'null'], maxLength: 155 }, // RN-19
      credits: nullableInt(1, 12),
      classHours: nullableInt(0, 300),
      extraClassHours: nullableInt(0, 300),
      requiredPrerequisites: nullableText,
      desiredPrerequisites: nullableText,
      belongsToProgram: { bsonType: ['bool', 'null'] },
      programName: nullableText,
      longDescription: nullableText,
      competency: nullableText,
      specificCapabilities: nullableText,
      entryProfile: nullableText,
      exitProfile: nullableText,
      metadata: nullableText,
      metadataUpdatedAt: nullableDate,
      keywords: { bsonType: 'array', uniqueItems: true, items: { bsonType: 'string', minLength: 1 } },
      ecommerce: {
        bsonType: ['object', 'null'],
        additionalProperties: false,
        required: ['isOpen'],
        properties: { isOpen: { bsonType: 'bool' }, startDate: nullableDate, endDate: nullableDate },
      },
      attachments: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          additionalProperties: false,
          required: ['fileId', 'fileName', 'contentType', 'size', 'uploadedAt', 'uploadedBy'],
          properties: {
            fileId: { bsonType: 'objectId' },
            fileName: { bsonType: 'string', minLength: 1, maxLength: 255 },
            contentType: {
              enum: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ],
            },
            size: { bsonType: ['int', 'long'], minimum: 1, maximum: 10485760 }, // RN-28: 10 MB
            uploadedAt: { bsonType: 'date' },
            uploadedBy: { bsonType: 'objectId' },
          },
        },
      },
      statusHistory: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['from', 'to', 'by', 'at'],
          properties: {
            from: { enum: [...STATUSES, null] },
            to: { enum: STATUSES },
            by: { bsonType: 'objectId' },
            at: { bsonType: 'date' },
          },
        },
      },
      codeHistory: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['from', 'to', 'by', 'at'],
          properties: { from: nullableText, to: { bsonType: 'string' }, by: { bsonType: 'objectId' }, at: { bsonType: 'date' } },
        },
      },
      searchText: { bsonType: 'string' },
      createdBy: { bsonType: 'objectId' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
      submittedAt: nullableDate,
      approvedAt: nullableDate,
      approvedBy: nullableId,
      productionAt: nullableDate,
      deactivatedAt: nullableDate,
      deactivatedBy: nullableId,
    },
  },
};
```

El validador comprueba estructura y límites, **no** la obligatoriedad para el envío: un borrador puede tener casi todo vacío (RF-019 CA1). La completitud para "Listo para enviar" la valida el servicio con `shared/` (RF-030). El driver serializa los enteros de JavaScript dentro del rango de 32 bits como `int`, por eso `credits` y las horas usan `bsonType: 'int'`.

### 6.3 Migración idempotente y su ejecutor

```js
// backend/src/db/migrations/0001-create-collections.js
import { coursesValidator } from '../../modules/courses/courses.schema.js';
import { usersValidator } from '../../modules/users/users.schema.js';

async function ensureCollection(db, name, validator) {
  const options = { validator, validationLevel: 'strict', validationAction: 'error' };
  const exists = await db.listCollections({ name }, { nameOnly: true }).hasNext();
  if (exists) await db.command({ collMod: name, ...options });
  else await db.createCollection(name, options);
}

export async function up(db) {
  await ensureCollection(db, 'users', usersValidator);
  await ensureCollection(db, 'courses', coursesValidator);
  // … catálogos

  const users = db.collection('users');
  await users.createIndex({ email: 1 }, { name: 'uniq_email', unique: true });
  await users.createIndex({ nationalId: 1 }, { name: 'uniq_national_id', unique: true });
  await users.createIndex(
    { role: 1 },
    {
      name: 'uniq_institutional_role', // RN-03
      unique: true,
      partialFilterExpression: { role: { $in: ['admin', 'rector', 'vice_rector'] } },
    },
  );
  await users.createIndex(
    { schoolId: 1 },
    {
      name: 'uniq_school_director', // un Director por escuela y una escuela por Director
      unique: true,
      partialFilterExpression: { role: 'school_director', schoolId: { $exists: true } },
    },
  );

  const courses = db.collection('courses');
  await courses.createIndex(
    { code: 1 },
    { name: 'uniq_course_code', unique: true, partialFilterExpression: { code: { $type: 'string' } } },
  );
  await courses.createIndex({ schoolId: 1, status: 1, updatedAt: -1 }, { name: 'school_status_updated' });
  await courses.createIndex({ status: 1, submittedAt: 1 }, { name: 'review_inbox' });
}
```

```js
// backend/src/db/migrate.js — npm run db:migrate
import { readdir } from 'node:fs/promises';
import { MongoClient } from 'mongodb';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

const MIGRATIONS_DIR = new URL('./migrations/', import.meta.url);
const client = new MongoClient(env.mongodbUri, { appName: 'sgc-migrations' });
await client.connect();
try {
  const db = client.db(env.mongodbDbName);
  const applied = new Set(await db.collection('migrations').distinct('_id'));
  const files = (await readdir(MIGRATIONS_DIR)).filter((name) => /^\d{4}-.+\.js$/.test(name)).sort();
  for (const file of files) {
    const id = file.replace(/\.js$/, '');
    if (applied.has(id)) continue;
    const { up } = await import(new URL(file, MIGRATIONS_DIR).href);
    await up(db);
    await db.collection('migrations').insertOne({ _id: id, appliedAt: new Date() });
    logger.info('migration_applied', { id });
  }
} finally {
  await client.close();
}
```

`createIndex` es idempotente si la especificación es idéntica; cambiar opciones de un índice existente con el mismo nombre falla, por eso un cambio de índice es una migración nueva que primero hace `dropIndex`.

### 6.4 Lectura paginada con búsqueda normalizada

```js
// shared/text/normalize-text.js
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // "Programación" → "programacion"; "ñ" → "n"
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

```js
// backend/src/modules/courses/courses.repository.js (extracto)
import { normalizeText, escapeRegex } from '../../../../shared/text/normalize-text.js';

const LIST_PROJECTION = { code: 1, name: 1, schoolId: 1, status: 1, updatedAt: 1 };

export function buildCourseFilter({ q, schoolId, status }) {
  const filter = {};
  if (schoolId) filter.schoolId = schoolId; // ObjectId ya validado; para Director lo fija el servicio
  filter.status = status ?? { $ne: 'inactive' }; // inactivos ocultos por defecto (RF-035 CA1)
  const term = normalizeText(q);
  if (term) filter.searchText = { $regex: escapeRegex(term) };
  return filter;
}

export async function listCourses(courses, { filter, sort, page, pageSize }) {
  const [items, total] = await Promise.all([
    courses.find(filter, { projection: LIST_PROJECTION }).sort(sort).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    courses.countDocuments(filter),
  ]);
  return { items, total };
}
```

### 6.5 Escrituras

```js
// Crear borrador (RF-018): el servicio ya validó formatos y fijó schoolId desde el perfil del Director
const now = clock();
const { insertedId } = await courses.insertOne({
  schoolId: actor.schoolId,
  // Sin código: el campo se omite (no null). El driver serializa undefined como null por defecto.
  ...(input.codeRequested ? {} : { code: input.code }),
  codeRequested: Boolean(input.codeRequested),
  codeValidated: false,
  name: input.name.trim(),
  status: 'draft',
  keywords: [],
  attachments: [],
  statusHistory: [{ from: null, to: 'draft', by: actor.id, at: now }],
  codeHistory: [],
  searchText: normalizeText(`${input.code ?? ''} ${input.name}`),
  createdBy: actor.id,
  createdAt: now,
  updatedAt: now,
});
```

```js
// Guardar borrador (RF-019): solo si sigue en draft y es de la escuela del Director
const result = await courses.updateOne(
  { _id: courseId, status: 'draft', schoolId: actor.schoolId },
  {
    $set: {
      ...changes, // lista blanca ya validada
      searchText,
      updatedAt: now,
      ...(metadataChanged && { metadataUpdatedAt: now }), // RF-026 CA2
    },
  },
);
if (result.matchedCount === 0) throw new AppError(409, 'course_not_editable');
```

```js
// Aprobar (RF-033, RNF-025): atómico; no hay estado intermedio "aprobado a medias"
const result = await courses.updateOne(
  { _id: courseId, status: 'in_development', codeValidated: true },
  {
    $set: { status: 'approved', approvedAt: now, approvedBy: actor.id, updatedAt: now },
    $push: { statusHistory: { from: 'in_development', to: 'approved', by: actor.id, at: now } },
  },
);
if (result.matchedCount === 0) throw new AppError(409, 'invalid_transition');
```

```js
// Desactivar (RF-035): eliminación lógica con concurrencia optimista sobre el estado leído
const { status: previous } = course; // leído y autorizado antes por el servicio
const result = await courses.updateOne(
  { _id: course._id, status: previous },
  {
    $set: { status: 'inactive', deactivatedAt: now, deactivatedBy: actor.id, updatedAt: now },
    $push: { statusHistory: { from: previous, to: 'inactive', by: actor.id, at: now } },
  },
);
if (result.matchedCount === 0) throw new AppError(409, 'invalid_transition');
```

### 6.6 Integridad referencial al eliminar un catálogo

```js
// backend/src/modules/catalogs/catalogs.service.js (extracto)
async function deleteItem(catalogKey, itemId) {
  const { referenceField } = CATALOG_DEFINITIONS[catalogKey]; // p. ej. 'topicId'
  // Cuenta cursos de cualquier estado: los inactivos conservan su clasificación histórica.
  const inUse = await countCoursesUsing(referenceField, itemId);
  if (inUse > 0) {
    throw new AppError(409, 'catalog_item_in_use', {
      errors: [{ field: referenceField, code: 'catalog_item_in_use', params: { count: inUse } }],
    });
  }
  // Limitación aceptada: carrera entre el conteo y el borrado; tolerable con un único Administrador (RN-03).
  await catalogsRepository.deleteById(catalogKey, itemId);
}
```

### 6.7 Código autonumérico y código de curso propuesto

```js
// Áreas SFIA y Temáticas: código autonumérico (RF-012 CA1)
async function nextSequence(db, name) {
  const counter = await db
    .collection('counters')
    .findOneAndUpdate({ _id: name }, { $inc: { value: 1 } }, { upsert: true, returnDocument: 'after' });
  return String(counter.value);
}
```

```js
// Propuesta de código (RF-032 CA3): siguiente número libre con el prefijo de la escuela (PV-08)
const [last] = await courses
  .aggregate([
    { $match: { code: { $regex: `^${escapeRegex(school.code)}-[0-9]+$` } } },
    { $project: { number: { $toInt: { $arrayElemAt: [{ $split: ['$code', '-'] }, 1] } } } },
    { $sort: { number: -1 } },
    { $limit: 1 },
  ])
  .toArray();
const proposal = `${school.code}-${(last?.number ?? 100) + 1}`; // se confirma con PATCH /code; el índice único resuelve carreras
```

### 6.8 Archivos con GridFS

```js
// backend/src/modules/courses/course-attachments.repository.js (extracto)
import { GridFSBucket } from 'mongodb';
import { once } from 'node:events';
import { pipeline } from 'node:stream/promises';

export function createFilesStore(db) {
  const bucket = new GridFSBucket(db, { bucketName: 'files' });
  return {
    async save({ buffer, fileName, contentType, ownerId }) {
      const upload = bucket.openUploadStream(fileName, { metadata: { contentType, ownerId } });
      upload.end(buffer); // tipo y tamaño ya validados por firma de archivo (12-SECURITY)
      await once(upload, 'finish');
      return upload.id;
    },
    stream: (fileId, destination) => pipeline(bucket.openDownloadStream(fileId), destination),
    remove: (fileId) => bucket.delete(fileId),
  };
}
```

### 6.9 Reporte de producción (RF-042)

```js
// backend/src/modules/reports/reports.repository.js (extracto)
export function productionBySchoolAndStatus(courses, scopeFilter) {
  return courses
    .aggregate([
      { $match: scopeFilter }, // {} global; { schoolId } para el Director (RF-042 CA3)
      { $group: { _id: { schoolId: '$schoolId', status: '$status' }, count: { $sum: 1 } } },
      { $lookup: { from: 'schools', localField: '_id.schoolId', foreignField: '_id', as: 'school' } },
      { $project: { _id: 0, schoolId: '$_id.schoolId', status: '$_id.status', count: 1, schoolName: { $first: '$school.name' } } },
    ])
    .toArray();
}
```

Los rangos de RF-043 se interpretan en la zona horaria de Costa Rica: `from = new Date(\`${fromDate}T00:00:00-06:00\`)` y el fin es exclusivo al día siguiente; para comparar meses se usa `$dateToParts` con `timezone: 'America/Costa_Rica'`.

### 6.10 Incorrecto

```js
// ❌ Filtro con el objeto del cliente: ?status[$ne]=x o un body con operadores
await courses.find(req.query).toArray();

// ❌ Eliminación física de un curso (RN-12)
await courses.deleteOne({ _id: courseId });

// ❌ Transición no atómica: otro usuario puede cambiar el estado entre la lectura y la escritura
const course = await courses.findOne({ _id: courseId });
if (course.status === 'in_development') {
  await courses.updateOne({ _id: courseId }, { $set: { status: 'approved' } }); // sin historial ni updatedAt
}

// ❌ Regex con el término sin escapar: "c++" o "(" rompen la consulta o permiten ReDoS
await courses.find({ name: { $regex: q, $options: 'i' } }).toArray();

// ❌ Copiar el nombre del catálogo en el curso: al renombrar la temática el curso queda desactualizado
await courses.updateOne({ _id }, { $set: { topicName: topic.name } });
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Colecciones

| Colección | Contenido | Eliminación | Notas |
|---|---|---|---|
| `users` | Usuarios y su rol ([glosario](03-PROJECT-ARCHITECTURE.md#glosario-de-dominio)) | Física con restricciones (DB-13) | `email` en minúsculas; `passwordHash` nunca se proyecta en listados |
| `schools` | `code` (prefijo de 2 a 5 letras mayúsculas, p. ej. `SOFT`), `name`, `nameNormalized` | Física si no hay cursos, usuarios ni carreras que la usen | El Director se obtiene de `users.schoolId` (PV-07) |
| `degreePrograms` | `code`, `name`, `nameNormalized`, `schoolId` | Física si no está en uso | Relación con cursos pendiente (PV-10) |
| `sfiaAreas`, `topics` | `code` autonumérico, `name`, `nameNormalized`, `description` opcional | Física si no está en uso | Carga CSV (RF-017) |
| `learningMethodologies` | `code`, `name`, `nameNormalized`, `description` obligatoria | Física si no está en uso | PV-11 |
| `certifyingBodies` | `code`, `name`, `nameNormalized` | Física si no está en uso | Carga CSV (RF-017) |
| `certifications` | `name`, `nameNormalized`, `description` opcional, `systemKey` | Física si no está en uso; el elemento `systemKey: 'none'` ("No tiene") nunca | RF-013 CA3, RN-25 |
| `courses` | Cursos con historial embebido | **Nunca física** (DB-05) | Ver [§6.1](#61-documento-de-curso) |
| `counters` | Secuencias `{ _id, value }` | — | Códigos autonuméricos |
| `migrations` | `{ _id, appliedAt }` | — | Registro de migraciones |
| `sessions` | Sesiones de `connect-mongo` | Expiración automática (TTL) | [13](13-AUTHENTICATION-AUTHORIZATION.md) |
| `files.files`, `files.chunks` | Bucket GridFS `files`: adjuntos y fotos | Al eliminar el adjunto de un borrador (RF-027 CA4) o el usuario | [12](12-SECURITY.md) |

Los catálogos fijos (estados, niveles, modalidades, monedas) no son colecciones: viven en `shared/domain/constants.js` y se validan con `enum` (RF-014 CA2, RN-27).

### 7.2 Embebido frente a referencia

| Dato | Decisión | Motivo |
|---|---|---|
| `statusHistory`, `codeHistory` | Embebido | Acotado, siempre se lee con el curso, auditoría (RF-032 CA2) |
| Metadatos de adjuntos | Embebido; contenido en GridFS | Se listan con el curso (RF-027 CA1); el binario no infla el documento |
| `keywords`, `ecommerce` | Embebido | Pertenecen solo al curso |
| Escuela, carrera, catálogos | Referencia `ObjectId` | Compartidos y editables (RF-010 CA3) |
| Usuarios (`createdBy`, `approvedBy`) | Referencia `ObjectId` | Auditoría; el usuario puede eliminarse (DB-24) |

### 7.3 Índices

| Colección | Índice | Opciones | Requerimiento |
|---|---|---|---|
| `users` | `{ email: 1 }` | único | RF-003 CA2 |
| `users` | `{ nationalId: 1 }` | único | RF-003 CA2 |
| `users` | `{ role: 1 }` | único, parcial `role ∈ {admin, rector, vice_rector}` | RN-03, RF-004 CA2 |
| `users` | `{ schoolId: 1 }` | único, parcial `role: 'school_director'` y `schoolId` existe | RF-011, PV-07 |
| `courses` | `{ code: 1 }` | único, parcial `code` de tipo string | RF-018 CA3, RF-032 CA2 |
| `courses` | `{ schoolId: 1, status: 1, updatedAt: -1 }` | — | RF-039, RF-041, RNF-019 |
| `courses` | `{ status: 1, submittedAt: 1 }` | — | RF-031 CA1 |
| `courses` | `{ createdAt: 1 }`, `{ approvedAt: 1 }`, `{ deactivatedAt: 1 }` | crear si `explain` lo justifica (DB-20) | RF-043 |
| catálogos | `{ nameNormalized: 1 }` | único | RF-010 CA4 |
| catálogos con código | `{ code: 1 }` | único | RF-011 CA1, RF-013 CA1 |
| `degreePrograms` | `{ schoolId: 1 }` | — | RF-016 CA2 |

El índice parcial con `$in` requiere que la versión del clúster admita `$in` dentro de `partialFilterExpression`. **Verificar en la documentación de índices parciales de esa versión y en el clúster de Atlas al crear la migración**; si no se admite, se agrega el campo booleano `holdsUniqueRole: true` solo en esos tres roles y el filtro parcial pasa a `{ holdsUniqueRole: true }`.

### 7.4 Datos de prueba de rendimiento

`npm run db:seed -- --courses 5000` (pendiente de crear) inserta escuelas, catálogos y 5 000 cursos distribuidos en todos los estados y escuelas con `insertMany` en lotes de 1 000, para verificar RNF-019 (≤ 3 s) y RF-042 CA4. Solo contra la base de desarrollo o pruebas (DB-16).

## 8. Errores frecuentes

- Confiar en `ObjectId.isValid`: acepta cadenas de 12 caracteres cualquiera (`'abcdefghijkl'`).
- Crear índices desde el arranque del servidor en vez de una migración.
- Olvidar que los cursos inactivos también referencian catálogos y permitir borrar una temática "sin uso" que sí aparece en el histórico.
- Usar `$regex` con `$options: 'i'` creyendo que ignora tildes: no lo hace.
- Guardar fechas como `'2026-11-20'` (cadena): rompe rangos, orden y `$dateToParts`.
- Guardar `totalHours` o la edad del usuario: se desactualizan; se calculan.
- Aplicar el filtro de escuela del Director en el frontend o aceptarlo del cliente.
- Actualizar el estado sin `$push` en `statusHistory` ni `updatedAt`.

## 9. Checklist

- [ ] La colección nueva tiene validador `$jsonSchema` estricto creado por migración.
- [ ] Las unicidades del ERS tienen índice único.
- [ ] Ningún código ni script borra o reemplaza documentos de `courses`.
- [ ] Las transiciones filtran por el estado esperado y verifican `matchedCount`.
- [ ] `updatedAt`, `statusHistory` y los campos `<evento>At`/`<evento>By` se fijan en el servicio.
- [ ] Los filtros se construyen con primitivos validados; los términos de búsqueda se normalizan y escapan.
- [ ] Los identificadores se validan con la expresión de 24 hexadecimales.
- [ ] La eliminación de catálogos y usuarios verifica uso y responde 409 con conteo.
- [ ] Los listados paginan y proyectan en la base.
- [ ] Las consultas nuevas se revisaron con `explain` sobre 5 000 cursos.
- [ ] La migración es idempotente (se puede ejecutar dos veces sin error).

## 10. Referencias

- MongoDB — Schema Validation: https://www.mongodb.com/docs/manual/core/schema-validation/
- MongoDB — Indexes: https://www.mongodb.com/docs/manual/indexes/
- MongoDB — Partial Indexes: https://www.mongodb.com/docs/manual/core/index-partial/
- MongoDB — GridFS: https://www.mongodb.com/docs/manual/core/gridfs/
- MongoDB — Node.js Driver: https://www.mongodb.com/docs/drivers/node/current/
- MongoDB — Transactions: https://www.mongodb.com/docs/manual/core/transactions/
- MongoDB Atlas — Custom database roles: https://www.mongodb.com/docs/atlas/security-add-mongodb-roles/
- OWASP — Injection Prevention (NoSQL): https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- [ADR-0004 Driver nativo y `$jsonSchema`](../adr/0004-mongodb-native-driver-json-schema.md)
