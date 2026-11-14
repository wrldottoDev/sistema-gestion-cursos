# ADR-0008 · Pruebas con el test runner nativo de Node.js

- **Estado:** Aceptado (E2E automatizado: Propuesto, PV-21)
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** RNF-047 (pruebas automatizadas críticas), OBJ-03 (prueba negativa por rol), RNF-034/035 (auditoría de accesibilidad), RNF-041 a RNF-044 (compatibilidad); ERS §7.3

## Contexto

La Iteración 1 probó las validaciones con `node:assert` ejecutado a mano (`node tests/validacion.test.js`). En la Iteración 2 se necesitan pruebas unitarias (reglas compartidas, servicios, permisos), de integración (API con MongoDB) y de aceptación en navegadores. Node.js trae un test runner estable (`node:test`) con *mocks*, *watch* y cobertura experimental, sin dependencias.

## Decisión

1. **Unitarias e integración:** `node:test` + `node:assert/strict`, ejecutadas con `node --test`.
2. **Integración HTTP:** la app Express se levanta en un puerto efímero (`app.listen(0)`) y se consulta con `fetch` nativo; base de datos de prueba aislada (contenedor `mongo:8` en CI; Docker local o base `sgc_test` separada en Atlas).
3. **Cobertura:** `node --test --experimental-test-coverage`.
4. **E2E y accesibilidad (recomendado, PV-21):** Playwright (Chromium, Firefox y WebKit) con `@axe-core/playwright`. Mientras no se adopte, los casos CP-RF-0xx se ejecutan manualmente con evidencia, como exige la ERS §7.3.

Estrategia completa en [16 · Pruebas](../standards/16-TESTING.md).

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| Jest | Popular, *snapshot*, *mocks* automáticos | Soporte ESM experimental; dependencia pesada | ES Modules nativos son la base del proyecto |
| Mocha + Chai + Sinon | Maduro | Tres dependencias para lo que trae Node | Innecesario |
| Supertest | API cómoda para HTTP | Dependencia para algo que `fetch` nativo resuelve | Innecesario |
| Cypress | E2E popular | Sin WebKit/Safari, requerido por RNF-044 | Playwright cubre los cuatro navegadores |

## Consecuencias

- Positivas: cero dependencias para unitarias e integración; mismo lenguaje de aserciones que la Iteración 1.
- Negativas: la cobertura de `node:test` sigue marcada como experimental; menos ecosistema de *matchers*.
