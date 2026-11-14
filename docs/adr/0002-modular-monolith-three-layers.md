# ADR-0002 · Monolito modular de tres capas servido por un único proceso Express

- **Estado:** Aceptado
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** RNF-045 (modularidad en capas de presentación, servicio y datos), RNF-007, RNF-012, RNF-046; restricción del curso: Node.js + MongoDB Atlas en la Iteración 2

## Contexto

La ERS exige separar autenticación, usuarios, catálogos, cursos, reportes e integraciones en capas de presentación, servicio y datos (RNF-045) y validar y autorizar en el servidor (RNF-007, RNF-012). El equipo tiene tres semanas, tres integrantes y cada uno es dueño de un módulo (Usuarios, Cursos, Catálogos). No hay requisitos de escalado independiente: el volumen de prueba es de 5 000 cursos (ERS §2.5).

## Decisión

1. Construiremos **un monolito modular**: un solo proceso Node.js con Express que expone la API REST en `/api/v1` y sirve los archivos estáticos de `frontend/` desde el **mismo origen**.
2. Cada módulo del backend (`auth`, `users`, `catalogs`, `courses`, `notifications`, `reports`) se organiza en **tres capas**: presentación HTTP (`*.routes.js` + `*.controller.js`), servicio (`*.service.js`, reglas de negocio y autorización por alcance) y datos (`*.repository.js`, único punto que usa el driver de MongoDB).
3. Las dependencias fluyen solo hacia abajo (rutas → controlador → servicio → repositorio) y entre módulos solo a través de servicios públicos.
4. Las reglas puras compartidas por navegador y servidor (validaciones de campos, constantes de dominio, normalización de texto) viven en `shared/` como ES Modules sin dependencias de entorno.

Detalle de carpetas, dependencias permitidas y glosario en [03 · Arquitectura](../standards/03-PROJECT-ARCHITECTURE.md).

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| Frontend y API en orígenes distintos (dos servidores) | Despliegue independiente | CORS, cookies `SameSite=None`, más configuración y superficie de ataque | Sin beneficio para el alcance; complica sesiones |
| Microservicios por módulo | Aislamiento | Infraestructura, red y despliegue fuera del alcance de tres semanas | Sobredimensionado |
| Rutas con lógica y consultas directas (sin capas) | Menos archivos | Incumple RNF-045; lógica de negocio no probable de forma aislada | Contradice la ERS |
| Framework de backend opinado (NestJS, Fastify con plugins) | Estructura impuesta | Curva de aprendizaje; NestJS está orientado a TypeScript, excluido por restricción | Express es la opción preferida del curso |

## Consecuencias

- Positivas: sin CORS; cookies de sesión `SameSite=Lax`; cada integrante trabaja en su carpeta de módulo con conflictos mínimos; servicios probables con dobles de repositorio.
- Negativas: un fallo del proceso afecta a toda la aplicación; disciplina manual para no saltarse capas (se revisa en PR).
- Acciones: crear `package.json` en la raíz con `"type": "module"` en la tarea de arranque del backend; reglas en [09 · Backend](../standards/09-NODEJS-BACKEND.md).

## Referencias

- Express 5. https://expressjs.com/
- ERS v1.1, §5 RNF-045 y §7.1.
