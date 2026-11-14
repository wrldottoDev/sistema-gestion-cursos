# ADR-0006 · Identificadores en inglés y glosario de dominio obligatorio

- **Estado:** Aceptado
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** RNF-031 (consistencia), RNF-039 (Unicode), RF-044 (interfaz bilingüe)

## Contexto

La Iteración 1 usó identificadores en español (`validarContrasena`, `--color-primario`, `boton--secundario`) y el código actual mezcla idiomas (`form-field` junto a `boton--secundario`). La interfaz debe ser bilingüe (RF-044), por lo que ningún texto visible puede vivir en identificadores. Los commits se escriben en inglés (Conventional Commits) y los asistentes de IA, la documentación de las herramientas y las librerías usan inglés. Términos del dominio como "Carrera", "En desarrollo" o "Rectoría" admiten traducciones ambiguas que, sin un acuerdo, producirían nombres distintos en cada módulo.

## Decisión

1. **Inglés** para todo identificador: variables, funciones, clases, archivos, carpetas, clases CSS, custom properties, rutas de API, campos JSON, colecciones y campos de MongoDB, claves de i18n, ramas y commits.
2. **Español** para la documentación, los comentarios de código y el JSDoc (equipo hispanohablante, evaluación académica en español).
3. Los textos de interfaz viven en los diccionarios de i18n (`es`, `en`), nunca en el código.
4. Las traducciones de términos del dominio son las del **[glosario de dominio](../standards/03-PROJECT-ARCHITECTURE.md#glosario-de-dominio)** y son obligatorias. Un término nuevo se agrega al glosario en el mismo PR que lo introduce.
5. El código existente con nombres en español se migra cuando se toca (no en un PR masivo), según el registro de deuda de [18 · Calidad](../standards/18-CODE-QUALITY.md#registro-de-deuda-técnica). Excepción: los tokens CSS de la Iteración 1 se reemplazan en un único PR porque son pocos y los usa toda la interfaz ([06 · Design System](../standards/06-DESIGN-SYSTEM.md)).

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| Identificadores en español | Cercanía al dominio y a la ERS | Mezcla inevitable con APIs en inglés; tildes y ñ problemáticas en identificadores; commits en inglés incoherentes | Inconsistencia permanente |
| Mezcla libre | Sin esfuerzo inicial | Es la situación actual y genera nombres duplicados | Origen de la deuda detectada |

## Consecuencias

- Positivas: nombres predecibles para tres personas y para los asistentes de IA; búsqueda en el código fiable.
- Negativas: traducción mental ERS ↔ código (mitigada por el glosario y por citar IDs RF/RN en comentarios y pruebas).
- Acción: renombrar tokens CSS de la Iteración 1 al implementar el Design System ([06](../standards/06-DESIGN-SYSTEM.md)).
