# Architecture Decision Records (ADR)

Registro de decisiones arquitectónicas del Sistema de Gestión de Cursos CENFOTEC. Proceso y reglas de redacción en [17 · Documentación](../standards/17-DOCUMENTATION.md).

## Índice

| ADR | Título | Estado | Fecha |
|---|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Registrar las decisiones arquitectónicas con ADR | Aceptado | 2026-11-14 |
| [0002](0002-modular-monolith-three-layers.md) | Monolito modular de tres capas servido por un único proceso Express | Aceptado | 2026-11-14 |
| [0003](0003-frontend-mpa-es-modules-bootstrap.md) | Frontend multipágina con ES Modules nativos, Bootstrap 5.3 y CSS en cascade layers | Aceptado | 2026-11-14 |
| [0004](0004-mongodb-native-driver-json-schema.md) | Driver oficial de MongoDB con validación `$jsonSchema`, sin ODM | Propuesto | 2026-11-14 |
| [0005](0005-server-sessions-google-identity.md) | Sesiones de servidor y verificación del ID token de Google en el servidor | Aceptado (flujo de Google: Propuesto) | 2026-11-14 |
| [0006](0006-english-identifiers-domain-glossary.md) | Identificadores en inglés y glosario de dominio obligatorio | Aceptado | 2026-11-14 |
| [0007](0007-password-hashing-pbkdf2.md) | Hash de contraseñas con PBKDF2 de `node:crypto` | Aceptado | 2026-11-14 |
| [0008](0008-node-test-runner.md) | Pruebas con el test runner nativo de Node.js | Aceptado | 2026-11-14 |

## Estados

- **Propuesto:** redactado, pendiente de validación (ver [decisiones pendientes](../standards/README.md#7-decisiones-pendientes-de-validación)).
- **Aceptado:** vigente.
- **Reemplazado por ADR-NNNN:** se conserva como historia; no se edita su decisión.
- **Rechazado:** se conserva para no repetir la discusión.

## Plantilla

Copiar en `NNNN-titulo-en-kebab-case-ingles.md` (número siguiente, cuatro dígitos):

```markdown
# ADR-NNNN · Título en español

- **Estado:** Propuesto | Aceptado | Reemplazado por ADR-NNNN | Rechazado
- **Fecha:** AAAA-MM-DD
- **Decisores:** nombres o "equipo SGC"
- **Requerimientos relacionados:** RF-xxx, RNF-xxx, RN-xx

## Contexto
Problema, fuerzas y restricciones (ERS, curso, plazos, equipo).

## Decisión
Lo que se decide, en voz activa ("Usaremos…").

## Alternativas consideradas
| Alternativa | Ventajas | Desventajas | Motivo del descarte |

## Consecuencias
Positivas, negativas y acciones derivadas (qué documentos o código cambian).

## Referencias
```
