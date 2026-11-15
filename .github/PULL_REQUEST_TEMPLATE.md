<!--
Título del PR = Conventional Commit en inglés, sin ID de Jira (será el mensaje del squash):
  feat(approval): add review inbox ordered by submission date
Reglas: docs/standards/01-GIT-AND-COMMITS.md y docs/standards/02-BRANCHING-AND-PR.md
-->

## Resumen

<!-- Qué cambia y por qué, en 2–5 líneas. -->

## Jira

- Historia: SGC-
- Rama: `feat/SGC-…`

## Tipo de cambio

- [ ] `feat` funcionalidad
- [ ] `fix` corrección
- [ ] `refactor` / `perf` sin cambio funcional
- [ ] `test` / `docs` / `build` / `ci` / `chore`
- [ ] **Breaking change** (describir impacto y migración)

## Trazabilidad

| Requerimiento (RF/RNF/RN) | Criterios cubiertos (CA) | Pantallas (handoff) | Endpoints | Pruebas |
|---|---|---|---|---|
| RF-0xx | CA1, CA2 | X-00 | `METHOD /api/v1/...` | `backend/test/...` |

## Cómo probar

1. <!-- Pasos reproducibles: rol con el que se ingresa, datos, URL. -->
2.
3.

## Evidencia

<!-- Capturas a 360 / 768 / 1440 px si hay interfaz; salida de pruebas; resultado del caso CP-RF-0xx. -->

## Checklist (Definición de terminado)

Lista completa: docs/standards/23-DEFINITION-OF-DONE.md

- [ ] Cumple todos los criterios de aceptación de la historia en la ERS v1.1.
- [ ] `npm run lint`, `npm run format:check` y `npm test` pasan (cuando existan los scripts).
- [ ] Autorización validada en el servidor, con al menos una prueba negativa por rol afectado.
- [ ] Validación de entradas en el servidor; sin secretos ni credenciales en el código.
- [ ] Textos de interfaz en `es` y `en` (sin literales en HTML/JS).
- [ ] Accesible con teclado, foco visible, etiquetas asociadas, contraste AA.
- [ ] Responsive verificado a 360, 768 y 1440 px.
- [ ] OpenAPI, glosario y matriz de trazabilidad actualizados si aplica.
- [ ] Commits con Conventional Commits y `Refs: SGC-…`.

## Riesgos y notas para el revisor

<!-- Decisiones tomadas, deuda introducida (TODO(SGC-n)), pendientes de validación (PV-xx), zonas a revisar con cuidado. -->
