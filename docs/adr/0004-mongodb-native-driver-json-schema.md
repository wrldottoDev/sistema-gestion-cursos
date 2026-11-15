# ADR-0004 · Driver oficial de MongoDB con validación `$jsonSchema`, sin ODM

- **Estado:** Propuesto (PV-01)
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC; requiere visto bueno del docente
- **Requerimientos relacionados:** RNF-012, RNF-019, RNF-025, RNF-026, RNF-027, RN-03, RN-12, RN-27; Documento de Diseño 2 (esquema de colecciones y CRUD)

## Contexto

La Iteración 2 persiste en MongoDB Atlas. La ERS exige validación en el servidor (RNF-012), unicidad (correo, identificación, código de curso, cargos únicos RN-03), integridad histórica sin borrado físico de cursos (RN-12, RNF-026), atomicidad en la aprobación (RNF-025) y consultas de 5 000 cursos en ≤ 3 s (RNF-019). Las reglas de campo (límites 40/250/155, rangos de horas y créditos, formato de código) deben ser idénticas en navegador y servidor.

## Decisión

1. Usaremos el **driver oficial `mongodb`** para Node.js, encapsulado en repositorios (`*.repository.js`).
2. La validación se aplica en **tres niveles** con una sola definición de reglas de campo:
   - Navegador y servidor comparten `shared/validation/` (mismas funciones y mismos códigos de error).
   - El servicio aplica reglas de negocio (estados, permisos por escuela, referencias existentes).
   - La base de datos aplica `$jsonSchema` (`validationLevel: "strict"`, `validationAction: "error"`) e **índices únicos**, como última defensa ante errores de código o scripts.
3. Los validadores, índices y colecciones se crean con **migraciones idempotentes** versionadas (`backend/src/db/migrations/`), no a mano en Atlas.

Detalle de colecciones, índices, `$jsonSchema` y migraciones en [11 · MongoDB](../standards/11-MONGODB.md).

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| Mongoose (ODM) | Esquemas en código, *middleware*, `populate`, muy usado en cursos | Validación solo en la aplicación (un script con el driver la evita); otra capa de abstracción y semántica propia (casting silencioso, `strict`); dependencia adicional | La base de datos debe proteger su integridad por sí misma; las reglas compartidas viven en `shared/` |
| Sin validación en BD | Menos trabajo inicial | Datos inválidos ante cualquier error de código | Contradice RNF-012 y RNF-026 |

## Consecuencias

- Positivas: integridad garantizada por MongoDB; una sola dependencia de persistencia; consultas explícitas y fáciles de optimizar con `explain()`.
- Negativas: sin `populate` (se hacen consultas explícitas o `$lookup`); el `$jsonSchema` y las reglas de `shared/` deben mantenerse coherentes (prueba de integración que inserte documentos inválidos directamente).
- Si el docente exige Mongoose: se reemplaza solo la capa de repositorios; servicios, controladores y `shared/` no cambian. Se registraría un ADR que reemplaza a este.

## Referencias

- MongoDB Node.js Driver. https://www.mongodb.com/docs/drivers/node/current/
- MongoDB Schema Validation. https://www.mongodb.com/docs/manual/core/schema-validation/
- MongoDB Partial Indexes. https://www.mongodb.com/docs/manual/core/index-partial/
