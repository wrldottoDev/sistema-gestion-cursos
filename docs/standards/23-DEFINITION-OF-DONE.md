# 23 · Definición de terminado

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define las condiciones verificables que debe cumplir una historia de Jira antes de aprobar su PR y moverla a *Done*, y las condiciones adicionales para cerrar una iteración o hacer una entrega. Aplica a toda historia SGC-n, a todo PR hacia `redesign/iteracion-2` y a todo merge hacia `main`.

Este documento no crea reglas nuevas: reúne en una lista las reglas de los demás estándares y enlaza a la regla dueña de cada ítem.

## 2. Estándar adoptado

| Fuente | Contenido | Estado |
|---|---|---|
| ERS v1.1 §7.3 | "Una historia se considera terminada cuando cumple sus criterios de aceptación, su caso de prueba fue aprobado y el cambio fue revisado por otro integrante e integrado a la rama principal." | Confirmado (ERS) |
| `docs/ESTADO.md` §5 | Misma definición; revisión cruzada rotativa (Otoniel revisa a Sebastián, Sebastián a Valentina, Valentina a Otoniel). | Confirmado (equipo) |
| Scrum Guide (Definition of Done) | Compromiso de calidad compartido del incremento. | Adoptado |
| Estos estándares (01 a 22) | Criterios técnicos verificables de cada ítem. | Adoptado |

Para la Iteración 2, "rama principal" significa la rama de integración `redesign/iteracion-2`; el paso a `main` ocurre al cerrar la iteración ([02](02-BRANCHING-AND-PR.md)).

## 3. Justificación

- Una definición común evita que "terminado" signifique "funciona en mi máquina".
- Concentra en un solo lugar lo que el revisor debe comprobar, sin repetir el detalle de cada estándar.
- Alinea el trabajo diario con lo que el docente evalúa: criterios de aceptación, casos de prueba con evidencia, revisión e integración.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| DOD-01 | Una historia **NO DEBE** moverse a *Done* en Jira si falta cualquier ítem obligatorio del [checklist de historia](#91-checklist-de-historia). |
| DOD-02 | El revisor **DEBE** comprobar el checklist completo antes de aprobar el PR; aprobar un PR con ítems incumplidos equivale a incumplir el estándar. |
| DOD-03 | Un ítem que no aplica **DEBE** marcarse como "No aplica" con una razón breve en el PR; no se borra. |
| DOD-04 | Una iteración o entrega **NO DEBE** cerrarse sin el [checklist de iteración](#92-checklist-de-iteración-y-entrega). |
| DOD-05 | Los ítems marcados **Pendiente de validación** en otros documentos no bloquean una historia si se aplica la propuesta vigente del [README §7](README.md#7-decisiones-pendientes-de-validación) y el PR lo declara. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| DOD-06 | El autor **DEBERÍA** recorrer el checklist antes de pedir revisión, no después de recibir comentarios. |
| DOD-07 | Las historias **DEBERÍAN** ser lo bastante pequeñas para cumplir el DoD en tres días o menos ([02](02-BRANCHING-AND-PR.md)). |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| DOD-08 | El equipo **PUEDE** endurecer el DoD (nunca relajarlo) para una historia concreta, dejándolo escrito en Jira. |

## 5. Nomenclatura

| Término | Significado |
|---|---|
| Historia terminada | Historia SGC-n que cumple el checklist de §9.1 y está integrada en `redesign/iteracion-2`. |
| Incremento | Conjunto de historias terminadas al cierre de un hito (avance, exposición, entrega). |
| Entrega | Merge de `redesign/iteracion-2` a `main` con tag SemVer ([21](21-VERSIONING.md)). |
| Evidencia | Captura o registro de resultados de un CP, fechado y con responsable ([16](16-TESTING.md)). |

## 6. Ejemplos

Correcto (extracto del cuerpo de un PR):

```markdown
## Definición de terminado
- [x] CA1–CA4 de RF-032 cumplidos (pantallas R-02, R-03, R-04)
- [x] Pruebas: backend/test/integration/courses/code.test.js (4 casos, 2 negativos por rol)
- [x] Autorización en servidor: authorize('courses:review'); Director → 403
- [x] Textos en es.json y en.json
- [x] Responsive revisado a 360, 768 y 1440 px (capturas adjuntas)
- [ ] No aplica: sin cambios de base de datos (no hay migración)
- [x] OpenAPI actualizado: PATCH /courses/{id}/code
```

Incorrecto:

```markdown
Listo, probado en mi compu. Falta inglés y las pruebas, las hago en otro PR.
```

## 7. Aplicación en el sistema CENFOTEC

- El checklist de §9.1 se copia en la [plantilla de PR](../../.github/PULL_REQUEST_TEMPLATE.md).
- La revisión sigue la rotación de `docs/ESTADO.md`; los PR de autenticación, autorización y archivos se revisan además por el tercer integrante ([12](12-SECURITY.md)).
- Los hitos de la Iteración 2 son: avance 29 nov 2026, exposición 2 dic 2026 y entrega 6 dic 2026. Cada uno aplica el checklist de §9.2 con su tag ([21](21-VERSIONING.md)).
- Mientras no exista CI ([19](19-CI-CD.md)), el autor ejecuta localmente `npm run lint`, `npm run format:check` y `npm test` y lo declara en el PR; cuando exista, los checks verdes son obligatorios.

## 8. Errores frecuentes

- Considerar terminada una historia sin la versión en inglés de sus textos.
- Dejar las pruebas "para después" en otro PR.
- Mover la tarjeta a *Done* antes del merge o antes de ejecutar el CP.
- Aprobar un PR propio o pedir a alguien fuera de la rotación sin avisar.
- Ocultar la acción en la interfaz y no proteger el endpoint.
- Probar solo en escritorio.
- Olvidar actualizar OpenAPI o la matriz de trazabilidad.

## 9. Checklist

### 9.1 Checklist de historia

**Funcional**

- [ ] Todos los criterios de aceptación (CA) del RF están implementados tal como los define la ERS v1.1 ([22](22-REQUIREMENTS-TRACEABILITY.md)).
- [ ] Las reglas de negocio aplicables (RN-xx) se respetan en el servidor ([09](09-NODEJS-BACKEND.md), [11](11-MONGODB.md)).
- [ ] La interfaz coincide con las pantallas aprobadas del handoff, incluidos los estados vacío, carga, error y sin resultados ([06](06-DESIGN-SYSTEM.md)).

**Código**

- [ ] Respeta la arquitectura de capas y el glosario de dominio ([03](03-PROJECT-ARCHITECTURE.md)).
- [ ] Respeta los estándares de HTML, CSS, Bootstrap y JavaScript del área tocada ([04](04-HTML.md), [05](05-CSS-AND-BEM.md), [07](07-BOOTSTRAP.md), [08](08-JAVASCRIPT.md)).
- [ ] `npm run lint` y `npm run format:check` pasan sin errores ni excepciones nuevas injustificadas ([18](18-CODE-QUALITY.md)).
- [ ] No hay código comentado, `console.log` de depuración ni TODO sin ticket SGC.

**Pruebas**

- [ ] Pruebas unitarias de las reglas nuevas con casos de límite ([16](16-TESTING.md)).
- [ ] Pruebas de integración de cada endpoint nuevo o modificado (2xx, 401, 403/404, 422).
- [ ] `npm test` pasa localmente y en CI.
- [ ] El caso de aceptación CP-RF-xxx está redactado y ejecutado con evidencia ([16 §7.7](16-TESTING.md#77-casos-de-aceptación)).

**Seguridad**

- [ ] Autorización en servidor con `authorize` y alcance por escuela cuando aplique ([13](13-AUTHENTICATION-AUTHORIZATION.md)).
- [ ] Al menos una prueba negativa por cada rol afectado ([13 §7.3](13-AUTHENTICATION-AUTHORIZATION.md#73-pruebas-negativas-mínimas-por-rol-obj-03)).
- [ ] Entradas validadas en servidor; sin `innerHTML`; sin secretos en el código ni en el historial ([12](12-SECURITY.md)).

**Accesibilidad**

- [ ] Operable completamente con teclado y con foco visible ([14](14-ACCESSIBILITY.md)).
- [ ] Controles con etiqueta asociada, errores asociados al campo y contraste AA ([04](04-HTML.md), [14](14-ACCESSIBILITY.md)).

**Responsive**

- [ ] Revisado a 360, 768 y 1440 px sin desplazamiento horizontal innecesario ([15](15-RESPONSIVE-DESIGN.md)).

**Internacionalización**

- [ ] Todos los textos de interfaz y mensajes de validación existen en `es.json` y `en.json`; ningún texto literal en HTML o JS ([20](20-INTERNATIONALIZATION.md)).

**Documentación**

- [ ] OpenAPI actualizado si cambió un endpoint ([10](10-REST-API.md), [17](17-DOCUMENTATION.md)).
- [ ] JSDoc en funciones públicas de servicios y módulos compartidos ([17](17-DOCUMENTATION.md)).
- [ ] Matriz de trazabilidad actualizada ([22](22-REQUIREMENTS-TRACEABILITY.md)).
- [ ] ADR nuevo si se tomó una decisión arquitectónica ([17](17-DOCUMENTATION.md)).

**Integración**

- [ ] Commits con Conventional Commits y footer `Refs:`/`Closes:` ([01](01-GIT-AND-COMMITS.md)).
- [ ] PR revisado y aprobado por otro integrante según la rotación; conversaciones resueltas ([02](02-BRANCHING-AND-PR.md)).
- [ ] Integrado en `redesign/iteracion-2` mediante squash merge ([02](02-BRANCHING-AND-PR.md)).

**Jira**

- [ ] Historia SGC-n enlazada en el PR y movida a *Done* después del merge y del CP.

### 9.2 Checklist de iteración y entrega

- [ ] Todas las historias comprometidas cumplen §9.1 o están documentadas como no entregadas en Jira.
- [ ] Casos de aceptación CP-RF y CP-RNF ejecutados con evidencia en el documento de casos de prueba de la iteración (ERS §7.3).
- [ ] Mediciones de rendimiento RNF-016 a RNF-019 registradas ([16 §7.5](16-TESTING.md#75-rendimiento)).
- [ ] Revisión de accesibilidad (axe + teclado) y de compatibilidad en los navegadores de RNF-041 a RNF-044 ([16 §7.6](16-TESTING.md#76-compatibilidad-rnf-041-a-rnf-044)).
- [ ] Matriz ASVS de [12 §7.1](12-SECURITY.md#71-matriz-de-verificación-owasp-asvs-50) actualizada con la evidencia disponible, sin afirmar cumplimiento no verificado.
- [ ] Matriz de trazabilidad completa ([22](22-REQUIREMENTS-TRACEABILITY.md)).
- [ ] PR de `redesign/iteracion-2` a `main` aprobado, merge commit y tag SemVer creado ([21](21-VERSIONING.md)).
- [ ] Release publicado en GitHub con notas ([21](21-VERSIONING.md)).
- [ ] Decisiones pendientes que se resolvieron, actualizadas en el [README §7](README.md#7-decisiones-pendientes-de-validación).

## 10. Referencias

- ERS v1.1 §7.3 Estrategia de verificación: `docs/documento ERS v1.1.pdf`.
- Estado del proyecto, seguimiento y revisión cruzada: [`docs/ESTADO.md`](../ESTADO.md).
- The Scrum Guide: https://scrumguides.org/scrum-guide.html
- Relacionados: [02](02-BRANCHING-AND-PR.md), [16](16-TESTING.md), [21](21-VERSIONING.md), [22](22-REQUIREMENTS-TRACEABILITY.md).
