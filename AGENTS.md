# Instrucciones para asistentes de IA

Este repositorio es el **Sistema de Gestión y Estandarización de Cursos** de la Universidad CENFOTEC (Proyecto Integrador I, Iteración 2). Estas instrucciones aplican a cualquier asistente que lea, genere o revise código aquí.

## Fuentes de verdad (en orden)

1. ERS v1.1: `docs/documento ERS v1.1.pdf`.
2. Wireframes, Design System y handoff: `wireframes/` (03–09).
3. Estándares: `docs/standards/` (empiece por `docs/standards/README.md`) y decisiones en `docs/adr/`.

## Reglas obligatorias

- Trabaje en ramas `<type>/SGC-<n>-<desc>` creadas desde `redesign/iteracion-2`. No haga commits en `main` ni en `legacy/iteracion-1`. No haga commit ni push sin que la persona lo pida.
- Commits en inglés con Conventional Commits y scopes de la lista cerrada (`docs/standards/01-GIT-AND-COMMITS.md`).
- Identificadores en inglés según el glosario de dominio (`docs/standards/03-PROJECT-ARCHITECTURE.md#glosario-de-dominio`); documentación y comentarios en español; textos de interfaz solo en los diccionarios de i18n.
- Stack permitido: HTML semántico, CSS con custom properties y BEM, Bootstrap 5.3, JavaScript con ES Modules, Node.js + Express, MongoDB con el driver oficial. Prohibido sin autorización: React, Angular, Vue, Tailwind, TypeScript, jQuery, Sass, ODM y nuevas dependencias no documentadas en los estándares.
- Respete las tres capas (rutas/controladores → servicios → repositorios) y la autorización en el servidor por rol y por escuela.
- Nunca: borrar cursos físicamente, exponer claves en el frontend, usar `innerHTML` con datos, confiar en permisos ocultos de la interfaz, registrar contraseñas o tokens.
- No invente endpoints, campos, estados ni reglas: si algo no está en la ERS o en los estándares, márquelo como **Pendiente de validación** y pregunte.
- Antes de dar por terminado un cambio, recorra `docs/standards/23-DEFINITION-OF-DONE.md`.
