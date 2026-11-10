# Equipo 3 · Estado del proyecto al 12 de octubre de 2026

**Sistema de Gestión y Estandarización de Cursos Universitarios** · Proyecto Integrador I · III Cuatrimestre 2026
Equipo: Otoniel González, Sebastián Fernández y Valentina Cristancho · Docente: Álvaro Cordero

Resumen en tres líneas:

1. Corregimos el ERS a la **versión 1.1** siguiendo la rúbrica de la revisión del 5 de octubre: los 100 RF quedaron en **44 historias de usuario** sin sobrefragmentación, con priorización justificada y dependencias completas.
2. En **Jira** (proyecto SGC) cada historia tiene puntos Fibonacci, responsable, fecha límite e iteración. El trabajo está dividido para que **cada integrante haga el registro, la eliminación y la búsqueda de un módulo**.
3. El sprint **Iteración 1** ya está activo (12 oct – 1 nov): avance el 25 oct, exposición el miércoles 28 oct y entrega el 1 nov.

---

## 1. Cómo corregimos el ERS según la rúbrica

| # | Criterio de la rúbrica | Qué estaba mal | Cómo quedó en la v1.1 |
|---|---|---|---|
| 2 | Tabla de contenidos | No había índice formal | Tabla de contenidos automática con números de página |
| 6, 47, 55 | Definiciones y consistencia | "SEFIA", solo 3 estados, "En desarrollo" usado como borrador | **SFIA** (y opcional); **5 estados**: Borrador, En desarrollo, Aprobado, En producción, Inactivo |
| 47, 55 | Terminología | Modalidad "Virtual en vivo" | **4 modalidades**: Presencial, Virtual sincrónica, Virtual asincrónica, Híbrida |
| 9 | Problema y justificación | Sin evidencia del levantamiento | Cuatro problemas citados de los requerimientos del cliente |
| 10, 11 | Objetivos SMART | Sin métrica ni plazo | OBJ-01 a OBJ-06 con indicador de logro y fecha (1 nov o 6 dic) |
| 13, 14 | Supuestos y dependencias | Temas ya aclarados seguían como pendientes; Google y local al mismo nivel | Supuestos actualizados; **Google obligatoria**, correo y contraseña **deseable**; tabla de dependencias |
| 15 | Actores | "Servicios externos" como actor | Sección aparte "Sistemas externos" (no son actores) |
| 18 | Permisos | Faltaba la unicidad de cargos | **Un único** Administrador, Rector y Vicerrector |
| 19 | Cobertura de RF | Faltaban adjuntos, generación del código, roles únicos, SFIA opcional | Agregados: adjuntos Word/PDF, indicador "Solicitar código a Desarrollo Curricular", registro, eliminación y búsqueda por módulo |
| 25 | Calidad de las HU | **Sobrefragmentación** (contador, límite de 40, cálculo de edad, etc. como HU) | **100 RF → 44 HU**; las validaciones son criterios de aceptación de su HU |
| 21, 29 | Evidencia de priorización | Solo P1/P2/P3 sin justificar | Matriz urgente/importante: tabla con el motivo de cada RF (19 P1, 24 P2, 1 P3) |
| 27, 46 | Criterios ambiguos | "estructura vigente", "cuando se valide" | Criterios concretos (ej. columnas del CSV, límites, mensajes) |
| 30, 48 | Dependencias e identificadores | Muchas "Ninguna"; RF-066 → RF-66; "4.12" repetido | Dependencias completas; numeración única de módulos 4.3 a 4.12 |
| 32, 34, 35 | RNF | RNF-015 (fotografía) y RNF-054 (revisión de código) mal clasificados | Se sacaron 6 RNF que eran reglas funcionales o de proceso; quedan 49 RNF |
| 39 | Trazabilidad | Asociaciones mecánicas a OBJ-01/OBJ-02 | Cada requerimiento → su objetivo específico + historia de Jira + iteración |
| 45 | Apéndices | Material complementario mezclado | Apéndices A a G (reglas de negocio, datos del curso, catálogos, flujo y estados, decisiones, correspondencia v1.0 → v1.1, versiones) |
| 54 | Ortografía | "Férnandez" | Fernández |
| 56 | Citas APA 7 | No había | 15 referencias APA 7 citadas en el texto (WCAG, Google, Gemini, MongoDB, OWASP, SFIA…) |

Archivo: `~/Desktop/documento ERS.docx` (v1.1) y `~/Desktop/documento ERS v1.1.pdf`. La versión original quedó como `documento ERS v1.0 (original).docx`.

### Los 44 RF por módulo

| Módulo | RF |
|---|---|
| Autenticación | RF-001 Google (obligatorio) · RF-002 correo y contraseña (deseable) |
| Usuarios y autorización | RF-003 registro · RF-004 rol único · RF-005 listado y modificación · RF-006 eliminación · RF-007 búsqueda · RF-008 control de acceso · RF-009 Director solo su escuela |
| Catálogos e importación CSV | RF-010 registro y modificación · RF-011 escuelas y carreras · RF-012 SFIA, temáticas, metodologías, niveles · RF-013 casas y certificaciones · RF-014 estados y moneda · RF-015 eliminación · RF-016 búsqueda · RF-017 carga CSV |
| Cursos | RF-018 creación en Borrador · RF-019 guardado progresivo · RF-020 clasificación · RF-021 carga académica · RF-022 textos con límite · RF-023 competencia y requisitos · RF-024 contenidos y perfiles · RF-025 casa certificadora y programa · RF-026 e-commerce y metadata · RF-027 adjuntos |
| Asistencia IA | RF-028 y RF-029 Gemini |
| Flujo de aprobación | RF-030 envío · RF-031 bandeja · RF-032 código · RF-033 aprobación · RF-034 En producción · RF-035 eliminación lógica (Inactivo) |
| Notificaciones | RF-036 correo · RF-037 escritorio · RF-038 aviso de aprobación |
| Consulta | RF-039 listado · RF-040 detalle · RF-041 búsqueda y filtrado |
| Reportes | RF-042 producción · RF-043 histórico |
| Internacionalización | RF-044 español/inglés |

---

## 2. Qué pusimos en Jira

Tablero: <https://ucenfotec-team-w0qxfajy.atlassian.net/jira/software/projects/SGC/boards/69/backlog>

- **44 historias** (una por RF del ERS v1.1). Los RF viejos que absorbimos quedaron como **subtareas** de su historia, así no se perdió nada.
- **Puntos Fibonacci** (1, 2, 3, 5, 8) en cada historia.
- **Prioridad** igual a la del ERS, con el motivo escrito en cada historia.
- **Dependencias** como vínculos "Blocks" entre historias.
- **Responsable, fecha límite e iteración** en todas las historias y tareas.
- **Sprints** según el calendario de Moodle:

| Sprint | Fechas | Hitos |
|---|---|---|
| Documento de diseño 1 | 28 set – 11 oct | Entregado (3 tareas en Done) |
| **Iteración 1** (activo) | 12 oct – 1 nov | Avance 25 oct · Exposición mié 28 oct · Entrega 1 nov |
| Documento de diseño 2 | 2 – 15 nov | Avance 8 nov · Entrega 15 nov |
| Iteración 2 | 16 nov – 6 dic | Avance 29 nov · Exposición mié 2 dic · Entrega 6 dic |

---

## 3. Cómo nos dividimos el trabajo

Regla: **cada integrante hace el registro, la eliminación y la búsqueda de un módulo**, en LocalStorage (Iteración 1) y luego en Node.js + MongoDB Atlas (Iteración 2).

| Integrante | Módulo | Registro | Eliminación | Búsqueda | Puntos It1 / It2 |
|---|---|---|---|---|---|
| Otoniel González | Usuarios | RF-003 (SGC-62) | RF-006 (SGC-223) | RF-007 (SGC-224) | 36 / 39 |
| Sebastián Fernández | Cursos | RF-018 (SGC-90) | RF-035 lógica, pasa a Inactivo (SGC-137) | RF-041 (SGC-219) | 39 / 39 |
| Valentina Cristancho | Catálogos | RF-010 (SGC-73) | RF-015 (SGC-225) | RF-016 (SGC-226) | 37 / 37 |

---

## 4. Qué vamos a tener listo en la Iteración 1

Tecnología: HTML semántico, CSS propio responsive, JavaScript nativo, LocalStorage y notificaciones de escritorio.

### Por semana

- **Semana 7 (hasta el 18 oct):** maquetación de todas las vistas y ajuste del prototipo a los requerimientos corregidos (SFIA, modalidades, estados, indicador de código, roles únicos).
- **Semana 8 (avance, 25 oct):** validaciones, LocalStorage y notificaciones de escritorio funcionando; login, usuarios, creación y guardado del curso hasta el envío a revisión.
- **Semana 9:** eliminación y búsqueda de cada módulo y campos restantes (28 oct); casos de prueba ejecutados (lun 26); exposición (mié 28); entrega (1 nov).

### Por persona

**Otoniel (Usuarios)**

| Fecha | Historia |
|---|---|
| 18 oct | SGC-222 Ajustar el prototipo a los requerimientos corregidos · SGC-230 Maquetación de Usuarios |
| 25 oct | SGC-60 Login (RF-002) · SGC-62 Registro de usuarios (RF-003) · SGC-63 Rol único (RF-004) · SGC-217 Listado y modificación (RF-005) · SGC-130 Envío a revisión (RF-030) · SGC-112 Competencia y requisitos (RF-023) · SGC-233 Subir el avance |
| 28 oct | SGC-223 Eliminación de usuarios (RF-006) · SGC-224 Búsqueda de usuarios (RF-007) |

**Sebastián (Cursos)**

| Fecha | Historia |
|---|---|
| 18 oct | SGC-231 Maquetación de Cursos (listado, detalle y formulario) |
| 25 oct | SGC-90 Creación en Borrador (RF-018) · SGC-91 Guardado progresivo (RF-019) · SGC-100 Carga académica y modalidad (RF-021) · SGC-97 Textos con límite (RF-022) · SGC-142 Listado (RF-039) · SGC-69 Director solo su escuela (RF-009) |
| 28 oct | SGC-137 Eliminación lógica (RF-035) · SGC-219 Búsqueda y filtrado (RF-041) · SGC-144 Detalle (RF-040) · SGC-119 Casa certificadora y programa (RF-025) · SGC-121 E-commerce y metadata (RF-026) |
| 1 nov | SGC-235 Entrega en Moodle |

**Valentina (Catálogos)**

| Fecha | Historia |
|---|---|
| 18 oct | SGC-232 Maquetación de Catálogos y página de inicio |
| 25 oct | SGC-73 Registro y modificación de catálogos (RF-010) · SGC-76 Escuelas y carreras (RF-011) · SGC-68 Control de acceso (RF-008) · SGC-139 Notificación de escritorio (RF-037) · SGC-94 Clasificación del curso (RF-020) |
| 28 oct | SGC-225 Eliminación (RF-015) · SGC-226 Búsqueda (RF-016) · SGC-83 Casas y certificaciones (RF-013) · SGC-114 Contenidos y perfiles (RF-024) · SGC-234 Exposición |

### Para la Iteración 2 (16 nov – 6 dic)

Cada uno rehace su módulo con Bootstrap, Node.js y MongoDB Atlas (SGC-220, SGC-228, SGC-221), más:

- **Otoniel:** Google (RF-001), Gemini (RF-028, RF-029), correo a Desarrollo Curricular (RF-036), aprobación (RF-033), paso a En producción (RF-034).
- **Sebastián:** adjuntos (RF-027), bandeja de revisión (RF-031), código del curso (RF-032), reportes (RF-042, RF-043).
- **Valentina:** catálogos de clasificación (RF-012), estados y moneda (RF-014), carga CSV con Python (RF-017, SGC-229), aviso de aprobación (RF-038), español/inglés (RF-044).

---

## 5. Seguimiento

- **Puntos de control con demo de 15 minutos:**
  - Mié 14 oct: cambios compartidos integrados.
  - Dom 18 oct: vistas maquetadas.
  - Vie 23 oct: todo integrado.
  - Lun 26 oct: casos de prueba ejecutados.
  - Mar 27 oct: ensayo de la exposición.
- **Jira:** cada uno mueve sus tarjetas de To Do a In Progress y luego a Done.
- **Git:**
  - Una rama por historia (`SGC-223-eliminar-usuario`).
  - Pull request revisado por otro integrante: Otoniel revisa a Sebastián, Sebastián a Valentina y Valentina a Otoniel.
- **Una historia está terminada cuando:** cumple sus criterios de aceptación, su caso de prueba pasó, otro integrante la revisó y está en `main`.

---

## 6. Preguntas para el profe

**Sobre propuestas que hicimos en el ERS (Apéndice E), para confirmar:**

1. **Código del curso:** ¿hay un algoritmo oficial? Mientras tanto usamos `PREFIJO-NÚMERO` con el prefijo de la escuela (ej. `SOFT-101`), y Desarrollo Curricular puede generarlo si el Director marca "Solicitar código".
2. **Python:** ¿para qué espera que lo usemos en la Iteración 2? Propusimos usarlo para validar y procesar la carga CSV de catálogos.
3. **CSV:** ¿le parecen bien las columnas `nombre,descripcion` (Áreas SFIA y Temáticas) y `codigo,nombre` (Casas certificadoras), y rechazar todo el archivo si una fila es inválida?
4. **Adjuntos:** ¿Word y PDF de hasta 10 MB por archivo está bien? ¿Hay un máximo de adjuntos por curso?
5. **Metadata:** ¿qué estructura tiene? Por ahora la tratamos como texto.
6. **Metodología de aprendizaje:** ¿es solo un catálogo, un texto que Gemini ayuda a redactar, o las dos cosas?
7. **Reportes por carrera:** ¿el curso pertenece a una carrera? En el levantamiento el curso solo tiene escuela.
8. **En producción:** ¿quién pasa un curso de Aprobado a En producción? Pusimos que Desarrollo Curricular, cuando el curso empieza a ofertarse.
9. **Eliminación:** ¿le sirve que la eliminación de cursos sea lógica (pasa a Inactivo) y que la de usuarios y catálogos sea física con restricciones (no se borra un catálogo en uso ni un Director con cursos)?

**Sobre temas que quedaron abiertos:**

10. ¿Existe la devolución del curso al Director para corrección (rechazo), con su propio estado y aviso?
11. ¿Necesitamos recuperación de contraseña o cierre de sesión?
12. Notificaciones de escritorio en la Iteración 1: con LocalStorage solo funcionan en el mismo navegador. ¿Es suficiente para el avance del 25 de octubre?

**Sobre la entrega:**

13. La rúbrica de la Iteración 1 en Moodle todavía aparece como "Recurso pendiente de actualizar". ¿Cuándo la publica?
14. La tarea "Entrega: Iteración 1" se abre el 2 de noviembre a las 18:00, pero el calendario dice que la entrega es en la semana 9. ¿Cuál es la fecha y hora límite?
15. ¿Quiere que volvamos a entregar el ERS v1.1 corregido o solo lo usamos como base?

---

## Enlaces

- Jira: <https://ucenfotec-team-w0qxfajy.atlassian.net/jira/software/projects/SGC/boards/69/backlog>
- Repositorio: <https://github.com/wrldottoDev/sistema-gestion-cursos>
- Plan de la Iteración 1 (página compartible): <https://claude.ai/code/artifact/bda33f1a-99dd-4d15-a63c-e33b1ee0049f>
- ERS v1.1: `~/Desktop/documento ERS.docx`
