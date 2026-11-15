# ADR-0001 · Registrar las decisiones arquitectónicas con ADR

- **Estado:** Aceptado
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** RNF-045, RNF-048; rúbrica del Documento de Diseño 2 (arquitectura por capas)

## Contexto

La Iteración 2 reconstruye el sistema con servidor, base de datos e integraciones externas en tres semanas y con tres desarrolladores. Las decisiones de la Iteración 1 vivían en conversaciones, en `docs/ESTADO.md` y en el código; varias se perdieron o se contradicen (por ejemplo, la paleta de color y la tipografía del código frente al Design System). Los asistentes de IA que usa el equipo tampoco conocen el porqué de una decisión si no está escrito.

## Decisión

Registraremos cada decisión arquitectónica significativa (afecta a varios módulos, es costosa de revertir o elige entre alternativas razonables) como un ADR en `docs/adr/`, con el formato de Michael Nygard ampliado con "Alternativas consideradas". Los ADR aceptados no se editan: un cambio de decisión se registra en un ADR nuevo que reemplaza al anterior.

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| Solo los documentos de estándares | Un solo lugar | Mezcla reglas con el porqué; se pierde la historia de cambios | Las reglas cambian; el razonamiento debe conservarse |
| Páginas de Confluence o Jira | Integrado con el backlog | Fuera del repositorio; no versionado junto al código | El repositorio en GitHub es obligatorio y es la fuente técnica |

## Consecuencias

- Positivas: decisiones trazables y revisables en PR; insumo directo para el Documento de Diseño 2.
- Negativas: costo de redacción (≈15 min por ADR).
- Acciones: reglas de redacción en [17 · Documentación](../standards/17-DOCUMENTATION.md).

## Referencias

- Nygard, M. (2011). *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- ADR GitHub organization. https://adr.github.io/
