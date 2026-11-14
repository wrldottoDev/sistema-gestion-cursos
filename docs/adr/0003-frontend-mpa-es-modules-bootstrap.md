# ADR-0003 · Frontend multipágina con ES Modules nativos, Bootstrap 5.3 y CSS en cascade layers

- **Estado:** Aceptado
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** restricción del curso (Bootstrap en la Iteración 2), RNF-017, RNF-031, RNF-032, RNF-034, RNF-041 a RNF-044, RNF-049

## Contexto

El curso exige Bootstrap en la Iteración 2 y excluye React, Angular, Vue, Tailwind y TypeScript salvo autorización. El Design System de Figma (sección 04) define tokens propios (color, tipografía Barlow/Figtree, espaciado de 4 px, radios, elevación) y un mapeo a componentes de Bootstrap 5 (handoff 09). La Iteración 1 usó HTML, CSS y JavaScript nativos sin herramientas de build. Las vistas son pantallas independientes por rol (70 desktop, 7 tablet, 9 móvil).

## Decisión

1. **Aplicación multipágina (MPA):** una página HTML por vista en `frontend/`, cada una con un módulo de entrada `<script type="module">`. Sin bundler, transpilador ni framework.
2. **ES Modules nativos** en navegador y servidor, con rutas relativas explícitas y extensión `.js`.
3. **Bootstrap 5.3** compilado, sin modificar su fuente, con su JavaScript bundle (`bootstrap.bundle.min.js`). Se personaliza solo con custom properties (`--bs-*`) — sin Sass.
4. **CSS propio en cascade layers** con el orden `@layer vendor, tokens, base, layout, components, utilities;`. Bootstrap se importa dentro de la capa `vendor`, de modo que los estilos propios lo sobrescriben por capa y no por especificidad. Los componentes propios usan **BEM**.
5. El origen de Bootstrap y de las fuentes (npm local frente a CDN) queda **pendiente de validación** (PV-04); la propuesta es servirlos localmente.

Reglas en [05 · CSS y BEM](../standards/05-CSS-AND-BEM.md), [06 · Design System](../standards/06-DESIGN-SYSTEM.md), [07 · Bootstrap](../standards/07-BOOTSTRAP.md) y [08 · JavaScript](../standards/08-JAVASCRIPT.md).

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| SPA con framework (React/Vue) | Componentes, estado | Excluido por restricción académica | No autorizado |
| Bootstrap personalizado con Sass | Variables en compilación (`$primary`) | Requiere `sass` y un paso de build; dos fuentes de verdad de tokens | Las custom properties de Bootstrap 5.3 cubren la personalización necesaria |
| CSS sin capas, solo orden de carga | Más simple | Para ganar a selectores de Bootstrap de mayor especificidad se termina usando `!important` o selectores largos | Las capas resuelven el conflicto sin subir especificidad |
| Plantillas en servidor (EJS, Handlebars) | HTML con datos desde el servidor | Mezcla presentación con el servidor; otra sintaxis que aprender | La API REST es requisito y el frontend la consume |

## Consecuencias

- Positivas: cero herramientas de build; el código del navegador es el que se escribe; coherente con la Iteración 1; las páginas se prueban abriendo la URL.
- Negativas: sin componentes reutilizables declarativos (se usan funciones de vista y `<template>`); `@import` encadenado agrega una ronda de red (aceptable en este alcance, medir contra RNF-017); cada página declara sus scripts.
- Riesgos: `@layer` requiere navegadores de 2022 en adelante; compatible con las dos últimas versiones exigidas por RNF-041 a RNF-044.

## Referencias

- Bootstrap 5.3, CSS variables. https://getbootstrap.com/docs/5.3/customize/css-variables/
- MDN, `@layer`. https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- MDN, JavaScript modules. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
