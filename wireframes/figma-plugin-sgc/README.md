# SGC CENFOTEC · Generador UX/UI (plugin local de Figma)

Construye el proyecto de diseño completo dentro del archivo de Figma
**"SGC CENFOTEC — Sistema de Gestión de Cursos (UX/UI)"**
(https://www.figma.com/design/O47fA9hgACwiOjxStzpLpX), reutilizando el Design System que ya está en ese archivo
(variables, estilos, iconos, logotipo oficial y componentes de la sección 04).

¿Por qué un plugin? El plan Starter + asiento View de Figma limita el servidor MCP a 20 llamadas por mes.
Un plugin de desarrollo usa el mismo Plugin API sin ese límite.

## Requisitos

- Figma **Desktop** (los plugins de desarrollo no se pueden importar desde el navegador). Descarga gratuita: figma.com/downloads
- Permiso de edición sobre el archivo (es tu archivo; está en tu equipo de Figma).

## Uso

1. Abre el archivo de Figma en la app de escritorio.
2. Menú **Plugins → Development → Import plugin from manifest…** y elige `figma-plugin-sgc/manifest.json`.
3. Ejecuta **Plugins → Development → SGC CENFOTEC · Generador UX/UI → Construir todo**.
   - Puede tardar varios minutos (≈ 20 000 capas). Si tu equipo es lento, ejecuta los comandos uno por uno en este orden:
     `03 · Wireframes` → `05 · Alta fidelidad desktop` → `06–07 · Tablet y móvil` → `08 · Conectar prototipo` → `00–02 y 09 · Documentación`.
4. Al terminar, Figma muestra un resumen. Si hubo avisos, aparece el frame **"Reporte del plugin"** a la izquierda de la página 3: copia su texto y compártelo para corregir.

Cada comando es idempotente: borra y regenera solo su sección, sin tocar el Design System.

## Qué genera

| Página de Figma | Sección | Contenido |
|---|---|---|
| 1 · Overview · IA · Flujos | 00, 01, 02 | Portada, objetivos, principios, alcance; sitemap por rol, navegación, matriz de permisos, inventario; 8 flujos |
| 2 · Wireframes · Design System | 03 (+ 04 existente) | 70 wireframes en grises con anotación (rol, objetivo, elementos, acciones, estados, RF) |
| 3 · Hi-Fi · Responsive · Prototipo · Handoff | 05–09 | 70 pantallas desktop, 7 tablet, 9 móvil, conexiones de prototipo + 12 flujos, documentación de handoff |

## Desarrollo

```bash
node build.mjs                 # concatena src/*.js → code.js
node test/mock-run.mjs all     # prueba de humo contra un mock estricto del Plugin API
```

El mock valida nombres de variantes y propiedades de componentes, tokens, estilos y las reglas de
auto-layout que Figma rechaza (FILL/HUG/ABSOLUTE). No reemplaza la revisión visual en Figma.
