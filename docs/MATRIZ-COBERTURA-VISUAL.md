# Matriz de cobertura visual · Iteración 2

Estado al 14 de noviembre de 2026, rama `redesign/iteracion-2`. Relaciona cada pantalla de los wireframes con su página HTML del frontend.

Esta matriz cubre **solo la fase visual**: HTML5, CSS y componentes de Bootstrap 5.3. Una pantalla "Implementada" está maquetada y se ve como en el diseño a 1440, 768 y 390 px, pero **no tiene lógica**. Ninguna página valida datos, guarda información, consulta la API, aplica permisos ni llama a Gemini. Las acciones son visuales y los datos, ficticios; cada página lo indica en su pie. La lista de lo pendiente está en la [§6](#6-funcionalidades-pendientes-de-implementación).

Documentos relacionados:
- [Documento de Diseño de la Iteración 2](<Documento Diseno Iteración 2.pdf>), que trae el inventario en el Apéndice B.
- [Estándares](standards/README.md), en particular [04 HTML](standards/04-HTML.md), [05 CSS](standards/05-CSS-AND-BEM.md), [06 Design System](standards/06-DESIGN-SYSTEM.md) y [07 Bootstrap](standards/07-BOOTSTRAP.md).

Estados de implementación:
- **Implementado:** la pantalla tiene todos sus elementos importantes del diseño.
- **Parcial:** falta algo del diseño o depende de otra capa; se indica qué.
- **No aplicable:** no corresponde a una página HTML; se justifica.

## 1. Cómo visualizar el frontend

Las rutas son absolutas desde la raíz web (`/css/main.css`, regla HTML-02), así que la carpeta `frontend/` debe servirse como raíz; abrir los archivos con doble clic no funciona. Sin instalar nada:

```bash
python3 -m http.server 8080 --directory frontend
# Abrir http://localhost:8080/ (inicio de sesión) y http://localhost:8080/pages/courses.html
```

Desde `index.html` y desde cualquier página interna se navega a las demás con los enlaces estáticos del menú. Para ver otro rol se abre la página de inicio de ese rol (`home-admin`, `home-director`, `home-curriculum`, `home-rector` o `home-vice-rector`). No existe redirección por rol.

## 2. Resumen

| Grupo | Pantallas | Implementado | Parcial | No aplicable |
|---|---|---|---|---|
| Escritorio (03 wireframes · 05 alta fidelidad) | 70 | 66 | 3 (N-03, N-04, N-05) | 1 (N-02) |
| Tablet (06) | 7 | 7 | 0 | 0 |
| Móvil (07) | 9 | 9 | 0 | 0 |
| Design System (04) | 15 | 15 (2 con valores aproximados, PV-22) | 0 | 0 |

Son 59 archivos HTML: `index.html`, 57 páginas en `frontend/pages/` y 1 variante en inglés en `frontend/pages/en/`. Los 10 estados de modal de los wireframes (U-06, U-07, K-05, K-07, C-07, F-12, R-05, R-08, R-09 y el panel N-01) viven dentro de su página base y se abren con su botón. Usan el JavaScript de Bootstrap, sin código propio.

## 3. Pantallas de escritorio (70)

| Wireframe | Módulo | Archivo HTML | Estado visual | Responsive | Estado de implementación |
|---|---|---|---|---|---|
| A-01 · Inicio de sesión ([03](../wireframes/03-wireframes/A-autenticacion) · [05](../wireframes/05-desktop/A-autenticacion/a-01-inicio-de-sesion.png)) | Autenticación | [`index.html`](../frontend/index.html) | Normal | Escritorio + TB-01 · MB-01 | Implementado |
| A-02 · Inicio de sesión errores por campo ([03](../wireframes/03-wireframes/A-autenticacion) · [05](../wireframes/05-desktop/A-autenticacion/a-02-inicio-de-sesion-errores-por-campo.png)) | Autenticación | [`login-field-errors.html`](../frontend/pages/login-field-errors.html) | Validación por campo | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| A-03 · Inicio de sesión credenciales incorrectas ([03](../wireframes/03-wireframes/A-autenticacion) · [05](../wireframes/05-desktop/A-autenticacion/a-03-inicio-de-sesion-credenciales-incorrectas.png)) | Autenticación | [`login-invalid-credentials.html`](../frontend/pages/login-invalid-credentials.html) | Error (credenciales) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| A-04 · Google cuenta no autorizada ([03](../wireframes/03-wireframes/A-autenticacion) · [05](../wireframes/05-desktop/A-autenticacion/a-04-google-cuenta-no-autorizada.png)) | Autenticación | [`login-google-unauthorized.html`](../frontend/pages/login-google-unauthorized.html) | Acceso denegado (Google) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| A-05 · Google cancelado o sin respuesta ([03](../wireframes/03-wireframes/A-autenticacion) · [05](../wireframes/05-desktop/A-autenticacion/a-05-google-cancelado-o-sin-respuesta.png)) | Autenticación | [`login-google-cancelled.html`](../frontend/pages/login-google-cancelled.html) | Cargando / error de Google | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| A-06 · Acceso denegado ([03](../wireframes/03-wireframes/A-autenticacion) · [05](../wireframes/05-desktop/A-autenticacion/a-06-acceso-denegado.png)) | Autenticación | [`access-denied.html`](../frontend/pages/access-denied.html) | Acceso denegado | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado (la redirección automática requiere JS) |
| P-01 · Inicio administrador ([03](../wireframes/03-wireframes/P-inicio-por-rol) · [05](../wireframes/05-desktop/P-inicio-por-rol/p-01-inicio-administrador.png)) | Inicio por rol | [`home-admin.html`](../frontend/pages/home-admin.html) | Normal (KPI, gráfico) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| P-02 · Inicio director de escuela ([03](../wireframes/03-wireframes/P-inicio-por-rol) · [05](../wireframes/05-desktop/P-inicio-por-rol/p-02-inicio-director-de-escuela.png)) | Inicio por rol | [`home-director.html`](../frontend/pages/home-director.html) | Normal | Escritorio + TB-02 | Implementado |
| P-03 · Inicio desarrollo curricular ([03](../wireframes/03-wireframes/P-inicio-por-rol) · [05](../wireframes/05-desktop/P-inicio-por-rol/p-03-inicio-desarrollo-curricular.png)) | Inicio por rol | [`home-curriculum.html`](../frontend/pages/home-curriculum.html) | Normal | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| P-04 · Inicio rectoría ejecutivo ([03](../wireframes/03-wireframes/P-inicio-por-rol) · [05](../wireframes/05-desktop/P-inicio-por-rol/p-04-inicio-rectoria-ejecutivo.png)) | Inicio por rol | [`home-rector.html`](../frontend/pages/home-rector.html) | Solo lectura | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| P-05 · Inicio vicerrectoría ([03](../wireframes/03-wireframes/P-inicio-por-rol) · [05](../wireframes/05-desktop/P-inicio-por-rol/p-05-inicio-vicerrectoria.png)) | Inicio por rol | [`home-vice-rector.html`](../frontend/pages/home-vice-rector.html) | Solo lectura | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| U-01 · Usuarios listado ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-01-usuarios-listado.png)) | Usuarios | [`users.html`](../frontend/pages/users.html) | Normal | Escritorio + TB-07 | Implementado |
| U-02 · Usuarios sin resultados ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-02-usuarios-sin-resultados.png)) | Usuarios | [`users-no-results.html`](../frontend/pages/users-no-results.html) | Sin resultados | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| U-03 · Registrar usuario ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-03-registrar-usuario.png)) | Usuarios | [`user-new.html`](../frontend/pages/user-new.html) | Formulario vacío | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado (fotografía con `input type="file"` nativo en lugar del botón del diseño) |
| U-04 · Registrar usuario errores ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-04-registrar-usuario-errores.png)) | Usuarios | [`user-new-errors.html`](../frontend/pages/user-new-errors.html) | Validación + resumen de errores | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| U-05 · Editar usuario ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-05-editar-usuario.png)) | Usuarios | [`user-edit.html`](../frontend/pages/user-edit.html) | Edición | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| U-06 · Eliminar usuario confirmación ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-06-eliminar-usuario-confirmacion.png)) | Usuarios | [`users.html`](../frontend/pages/users.html) (modal #delete-user-modal) | Confirmación destructiva | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| U-07 · Eliminar usuario bloqueado ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-07-eliminar-usuario-bloqueado.png)) | Usuarios | [`users.html`](../frontend/pages/users.html) (modal de eliminación bloqueada) | Bloqueado | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| U-08 · Usuario eliminado confirmación ([03](../wireframes/03-wireframes/U-usuarios) · [05](../wireframes/05-desktop/U-usuarios/u-08-usuario-eliminado-confirmacion.png)) | Usuarios | [`users-deleted.html`](../frontend/pages/users-deleted.html) | Éxito (toast) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-01 · Catálogos indice ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-01-catalogos-indice.png)) | Catálogos | [`catalogs.html`](../frontend/pages/catalogs.html) | Normal | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-02 · Catálogos escuelas ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-02-catalogos-escuelas.png)) | Catálogos | [`catalog-schools.html`](../frontend/pages/catalog-schools.html) | Normal | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-03 · Catálogos carreras filtro por escuela ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-03-catalogos-carreras-filtro-por-escuela.png)) | Catálogos | [`catalog-degree-programs.html`](../frontend/pages/catalog-degree-programs.html) | Filtro activo | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-04 · Catálogos áreas SFIA ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-04-catalogos-areas-sfia.png)) | Catálogos | [`catalog-sfia-areas.html`](../frontend/pages/catalog-sfia-areas.html) | Normal | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-05 · Registrar elemento validación ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-05-registrar-elemento-validacion.png)) | Catálogos | [`catalog-sfia-areas.html`](../frontend/pages/catalog-sfia-areas.html) (modal Registrar) | Validación (modal) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado (el modal abre en su estado de validación de demostración) |
| K-06 · Catálogo fijo niveles de complejidad ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-06-catalogo-fijo-niveles-de-complejidad.png)) | Catálogos | [`catalog-complexity-levels.html`](../frontend/pages/catalog-complexity-levels.html) | Solo lectura (catálogo fijo) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-07 · Eliminar elemento en uso bloqueado ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-07-eliminar-elemento-en-uso-bloqueado.png)) | Catálogos | [`catalog-sfia-areas.html`](../frontend/pages/catalog-sfia-areas.html) (modal de eliminación bloqueada) | Bloqueado (en uso) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| K-08 · Catálogos certificaciones ([03](../wireframes/03-wireframes/K-catalogos) · [05](../wireframes/05-desktop/K-catalogos/k-08-catalogos-certificaciones.png)) | Catálogos | [`catalog-certifications.html`](../frontend/pages/catalog-certifications.html) | Opción protegida | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| M-01 · Importar CSV selección ([03](../wireframes/03-wireframes/M-importacion-csv) · [05](../wireframes/05-desktop/M-importacion-csv/m-01-importar-csv-seleccion.png)) | Importación CSV | [`csv-import.html`](../frontend/pages/csv-import.html) | Selección | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| M-02 · Importar CSV rechazo con errores ([03](../wireframes/03-wireframes/M-importacion-csv) · [05](../wireframes/05-desktop/M-importacion-csv/m-02-importar-csv-rechazo-con-errores.png)) | Importación CSV | [`csv-import-rejected.html`](../frontend/pages/csv-import-rejected.html) | Error (rechazo total) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| M-03 · Importar CSV resultado ([03](../wireframes/03-wireframes/M-importacion-csv) · [05](../wireframes/05-desktop/M-importacion-csv/m-03-importar-csv-resultado.png)) | Importación CSV | [`csv-import-result.html`](../frontend/pages/csv-import-result.html) | Éxito (resultado) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| N-01 · Panel de avisos propuesta UX ([03](../wireframes/03-wireframes/N-avisos-idioma-y-menu) · [05](../wireframes/05-desktop/N-avisos-idioma-y-menu/n-01-panel-de-avisos-propuesta-ux.png)) | Avisos, idioma y menú | offcanvas #notifications-panel (todas las páginas internas) | Normal / vacío (propuesta UX) | Escritorio + MB-08 | Implementado |
| N-02 · Notificación de escritorio ([03](../wireframes/03-wireframes/N-avisos-idioma-y-menu) · [05](../wireframes/05-desktop/N-avisos-idioma-y-menu/n-02-notificacion-de-escritorio.png)) | Avisos, idioma y menú | — | — | — | No aplicable: la notificación de escritorio la dibuja el sistema operativo (Notification API, RF-037); no es HTML de la aplicación. |
| N-03 · Correo a desarrollo curricular curso enviado ([03](../wireframes/03-wireframes/N-avisos-idioma-y-menu) · [05](../wireframes/05-desktop/N-avisos-idioma-y-menu/n-03-correo-a-desarrollo-curricular-curso-enviado.png)) | Avisos, idioma y menú | [`email-course-submitted.html`](../frontend/pages/email-course-submitted.html) | Vista previa | Escritorio; tablet y móvil adaptados (sin diseño propio) | Parcial: vista previa estática; la plantilla real (estilos en línea para clientes de correo) la genera el servidor (RF-036). |
| N-04 · Correo de aprobación vicerrectoría y director ([03](../wireframes/03-wireframes/N-avisos-idioma-y-menu) · [05](../wireframes/05-desktop/N-avisos-idioma-y-menu/n-04-correo-de-aprobacion-vicerrectoria-y-director.png)) | Avisos, idioma y menú | [`email-course-approved.html`](../frontend/pages/email-course-approved.html) | Vista previa | Escritorio; tablet y móvil adaptados (sin diseño propio) | Parcial: vista previa estática; la plantilla real la genera el servidor (RF-038). |
| N-05 · Interfaz en inglés ([03](../wireframes/03-wireframes/N-avisos-idioma-y-menu) · [05](../wireframes/05-desktop/N-avisos-idioma-y-menu/n-05-interfaz-en-ingles.png)) | Avisos, idioma y menú | [`en/my-courses.html`](../frontend/pages/en/my-courses.html) | Interfaz en inglés | Escritorio; tablet y móvil adaptados (sin diseño propio) | Parcial: una vista de muestra en inglés; la traducción de todas las vistas requiere el módulo i18n (RF-044, JS). |
| N-06 · Menú de usuario e idioma ([03](../wireframes/03-wireframes/N-avisos-idioma-y-menu) · [05](../wireframes/05-desktop/N-avisos-idioma-y-menu/n-06-menu-de-usuario-e-idioma.png)) | Avisos, idioma y menú | menú de usuario (todas las páginas internas) | Menú abierto | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| C-01 · Cursos listado global ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-01-cursos-listado-global.png)) | Consulta de cursos | [`courses.html`](../frontend/pages/courses.html) | Normal | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| C-02 · Mis cursos director ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-02-mis-cursos-director.png)) | Consulta de cursos | [`my-courses.html`](../frontend/pages/my-courses.html) | Normal + filtro bloqueado (deshabilitado) | Escritorio + TB-03 · MB-02 | Implementado |
| C-03 · Cursos sin resultados ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-03-cursos-sin-resultados.png)) | Consulta de cursos | [`courses-no-results.html`](../frontend/pages/courses-no-results.html) | Sin resultados | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| C-04 · Cursos carga y error de red ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-04-cursos-carga-y-error-de-red.png)) | Consulta de cursos | [`courses-loading-error.html`](../frontend/pages/courses-loading-error.html) | Cargando (esqueleto) + error de red | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| C-05 · Detalle de curso solo lectura ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-05-detalle-de-curso-solo-lectura.png)) | Consulta de cursos | [`course-detail.html`](../frontend/pages/course-detail.html) | Solo lectura | Escritorio + MB-03 | Implementado (en móvil todas las secciones quedan abiertas) |
| C-06 · Detalle datos para Power Campus ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-06-detalle-datos-para-power-campus.png)) | Consulta de cursos | [`course-detail-power-campus.html`](../frontend/pages/course-detail-power-campus.html) | Solo lectura + copiar (propuesta UX) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| C-07 · Cambiar curso a inactivo confirmación ([03](../wireframes/03-wireframes/C-consulta-de-cursos) · [05](../wireframes/05-desktop/C-consulta-de-cursos/c-07-cambiar-curso-a-inactivo-confirmacion.png)) | Consulta de cursos | [`courses.html`](../frontend/pages/courses.html) (modal #deactivate-course-modal) | Confirmación destructiva | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-01 · Nuevo curso 1 identificación ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-01-nuevo-curso-1-identificacion.png)) | Formulario de curso | [`course-form-identification.html`](../frontend/pages/course-form-identification.html) | Nuevo (sin guardar) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-02 · 2 clasificación académica ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-02-2-clasificacion-academica.png)) | Formulario de curso | [`course-form-classification.html`](../frontend/pages/course-form-classification.html) | Borrador; campo deshabilitado | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-03 · 3 carga académica y modalidad ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-03-3-carga-academica-y-modalidad.png)) | Formulario de curso | [`course-form-workload.html`](../frontend/pages/course-form-workload.html) | Borrador + éxito (toast) | Escritorio + TB-04 | Implementado |
| F-04 · 4 textos y descripciones ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-04-4-textos-y-descripciones.png)) | Formulario de curso | [`course-form-texts.html`](../frontend/pages/course-form-texts.html) | Contadores | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-05 · 5 competencia y perfiles ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-05-5-competencia-y-perfiles.png)) | Formulario de curso | [`course-form-competency.html`](../frontend/pages/course-form-competency.html) | Borrador | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-06 · 6 programa e-commerce y metadata ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-06-6-programa-e-commerce-y-metadata.png)) | Formulario de curso | [`course-form-program.html`](../frontend/pages/course-form-program.html) | Validación de fecha; solo lectura | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-07 · 7 adjuntos ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-07-7-adjuntos.png)) | Formulario de curso | [`course-form-attachments.html`](../frontend/pages/course-form-attachments.html) | Error de archivo | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-08 · 8 revisión y envío ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-08-8-revision-y-envio.png)) | Formulario de curso | [`course-form-review.html`](../frontend/pages/course-form-review.html) | Revisión | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-09 · Gemini propuesta editable ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-09-gemini-propuesta-editable.png)) | Formulario de curso | [`course-form-texts-gemini.html`](../frontend/pages/course-form-texts-gemini.html) | Propuesta de Gemini | Escritorio + MB-04 | Implementado |
| F-10 · Gemini error sin pérdida de datos ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-10-gemini-error-sin-perdida-de-datos.png)) | Formulario de curso | [`course-form-texts-gemini-error.html`](../frontend/pages/course-form-texts-gemini-error.html) | Error sin pérdida de datos | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-11 · Envío bloqueado validación ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-11-envio-bloqueado-validacion.png)) | Formulario de curso | [`course-form-review-blocked.html`](../frontend/pages/course-form-review-blocked.html) | Envío bloqueado (validación) | Escritorio + MB-05 | Implementado |
| F-12 · Confirmar envío a revisión ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-12-confirmar-envio-a-revision.png)) | Formulario de curso | [`course-form-review.html`](../frontend/pages/course-form-review.html) (modal de confirmación) | Confirmación | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| F-13 · Curso enviado en desarrollo solo lectura ([03](../wireframes/03-wireframes/F-formulario-de-curso) · [05](../wireframes/05-desktop/F-formulario-de-curso/f-13-curso-enviado-en-desarrollo-solo-lectura.png)) | Formulario de curso | [`course-submitted.html`](../frontend/pages/course-submitted.html) | Éxito + solo lectura | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-01 · Bandeja de revisión ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-01-bandeja-de-revision.png)) | Revisión y aprobación | [`review-inbox.html`](../frontend/pages/review-inbox.html) | Normal | Escritorio + MB-06 | Implementado |
| R-02 · Revisión validar código ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-02-revision-validar-codigo.png)) | Revisión y aprobación | [`course-review.html`](../frontend/pages/course-review.html) | Botón deshabilitado con motivo | Escritorio + TB-05 | Implementado |
| R-03 · Revisión generar código ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-03-revision-generar-codigo.png)) | Revisión y aprobación | [`course-review-generate-code.html`](../frontend/pages/course-review-generate-code.html) | Generar código | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-04 · Revisión corregir código ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-04-revision-corregir-codigo.png)) | Revisión y aprobación | [`course-review-correct-code.html`](../frontend/pages/course-review-correct-code.html) | Validación (código duplicado) | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-05 · Confirmar aprobación ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-05-confirmar-aprobacion.png)) | Revisión y aprobación | [`course-review.html`](../frontend/pages/course-review.html) (modal Confirmar aprobación) | Confirmación | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-06 · Curso aprobado avisos enviados ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-06-curso-aprobado-avisos-enviados.png)) | Revisión y aprobación | [`course-review-approved.html`](../frontend/pages/course-review-approved.html) | Éxito | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-07 · Error al aprobar estado conservado ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-07-error-al-aprobar-estado-conservado.png)) | Revisión y aprobación | [`course-review-error.html`](../frontend/pages/course-review-error.html) | Error, estado conservado | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-08 · Pasar a en producción confirmación ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-08-pasar-a-en-produccion-confirmacion.png)) | Revisión y aprobación | [`course-review-approved.html`](../frontend/pages/course-review-approved.html) (modal Pasar a En producción) | Confirmación | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| R-09 · Cambiar a inactivo confirmación ([03](../wireframes/03-wireframes/R-revision-y-aprobacion) · [05](../wireframes/05-desktop/R-revision-y-aprobacion/r-09-cambiar-a-inactivo-confirmacion.png)) | Revisión y aprobación | [`course-review-approved.html`](../frontend/pages/course-review-approved.html) (modal Cambiar a Inactivo) | Confirmación destructiva | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| RP-01 · Reporte de producción ([03](../wireframes/03-wireframes/RP-reportes) · [05](../wireframes/05-desktop/RP-reportes/rp-01-reporte-de-produccion.png)) | Reportes | [`report-production.html`](../frontend/pages/report-production.html) | Solo lectura | Escritorio + TB-06 · MB-07 | Implementado |
| RP-02 · Reporte de producción director ([03](../wireframes/03-wireframes/RP-reportes) · [05](../wireframes/05-desktop/RP-reportes/rp-02-reporte-de-produccion-director.png)) | Reportes | [`report-production-director.html`](../frontend/pages/report-production-director.html) | Filtro bloqueado | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| RP-03 · Reporte histórico por período ([03](../wireframes/03-wireframes/RP-reportes) · [05](../wireframes/05-desktop/RP-reportes/rp-03-reporte-historico-por-periodo.png)) | Reportes | [`report-history.html`](../frontend/pages/report-history.html) | Normal | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| RP-04 · Comparativo mismo mes dos años ([03](../wireframes/03-wireframes/RP-reportes) · [05](../wireframes/05-desktop/RP-reportes/rp-04-comparativo-mismo-mes-dos-anos.png)) | Reportes | [`report-comparison.html`](../frontend/pages/report-comparison.html) | Comparativo | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |
| RP-05 · Histórico rango inválido ([03](../wireframes/03-wireframes/RP-reportes) · [05](../wireframes/05-desktop/RP-reportes/rp-05-historico-rango-invalido.png)) | Reportes | [`report-history-invalid-range.html`](../frontend/pages/report-history-invalid-range.html) | Validación de rango | Escritorio; tablet y móvil adaptados (sin diseño propio) | Implementado |

## 4. Tablet (7) y móvil (9)

| Wireframe | Módulo | Archivo HTML | Estado visual | Responsive | Estado de implementación |
|---|---|---|---|---|---|
| TB-01 · Inicio de sesión tablet ([PNG](../wireframes/06-tablet/tb-01-inicio-de-sesion-tablet.png)) | Autenticación | [`index.html`](../frontend/index.html) | Adaptación de A-01 | 768 px (riel 80 px) | Implementado |
| TB-02 · Inicio director tablet ([PNG](../wireframes/06-tablet/tb-02-inicio-director-tablet.png)) | Inicio por rol | [`home-director.html`](../frontend/pages/home-director.html) | Adaptación de P-02 | 768 px (riel 80 px) | Implementado |
| TB-03 · Mis cursos tablet ([PNG](../wireframes/06-tablet/tb-03-mis-cursos-tablet.png)) | Consulta de cursos | [`my-courses.html`](../frontend/pages/my-courses.html) | Adaptación de C-02 | 768 px (riel 80 px) | Implementado |
| TB-04 · Formulario 3 carga académica tablet ([PNG](../wireframes/06-tablet/tb-04-formulario-3-carga-academica-tablet.png)) | Formulario de curso | [`course-form-workload.html`](../frontend/pages/course-form-workload.html) | Adaptación de F-03 | 768 px (riel 80 px) | Implementado |
| TB-05 · Revisión de curso tablet ([PNG](../wireframes/06-tablet/tb-05-revision-de-curso-tablet.png)) | Revisión y aprobación | [`course-review.html`](../frontend/pages/course-review.html) | Adaptación de R-02 | 768 px (riel 80 px) | Implementado |
| TB-06 · Reporte de producción tablet ([PNG](../wireframes/06-tablet/tb-06-reporte-de-produccion-tablet.png)) | Reportes | [`report-production.html`](../frontend/pages/report-production.html) | Adaptación de RP-01 | 768 px (riel 80 px) | Implementado |
| TB-07 · Usuarios tablet ([PNG](../wireframes/06-tablet/tb-07-usuarios-tablet.png)) | Usuarios | [`users.html`](../frontend/pages/users.html) | Adaptación de U-01 | 768 px (riel 80 px) | Implementado |
| MB-01 · Inicio de sesión móvil ([PNG](../wireframes/07-movil/mb-01-inicio-de-sesion-movil.png)) | Autenticación | [`index.html`](../frontend/index.html) | Adaptación de A-01 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-02 · Mis cursos móvil ([PNG](../wireframes/07-movil/mb-02-mis-cursos-movil.png)) | Consulta de cursos | [`my-courses.html`](../frontend/pages/my-courses.html) | Adaptación de C-02 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-03 · Detalle de curso móvil ([PNG](../wireframes/07-movil/mb-03-detalle-de-curso-movil.png)) | Consulta de cursos | [`course-detail.html`](../frontend/pages/course-detail.html) | Adaptación de C-05 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-04 · Formulario textos con Gemini móvil ([PNG](../wireframes/07-movil/mb-04-formulario-textos-con-gemini-movil.png)) | Formulario de curso | [`course-form-texts-gemini.html`](../frontend/pages/course-form-texts-gemini.html) | Adaptación de F-09 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-05 · Envío bloqueado móvil ([PNG](../wireframes/07-movil/mb-05-envio-bloqueado-movil.png)) | Formulario de curso | [`course-form-review-blocked.html`](../frontend/pages/course-form-review-blocked.html) | Adaptación de F-11 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-06 · Bandeja de revisión móvil ([PNG](../wireframes/07-movil/mb-06-bandeja-de-revision-movil.png)) | Revisión y aprobación | [`review-inbox.html`](../frontend/pages/review-inbox.html) | Adaptación de R-01 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-07 · Reporte de producción móvil ([PNG](../wireframes/07-movil/mb-07-reporte-de-produccion-movil.png)) | Reportes | [`report-production.html`](../frontend/pages/report-production.html) | Adaptación de RP-01 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-08 · Avisos móvil ([PNG](../wireframes/07-movil/mb-08-avisos-movil.png)) | Avisos, idioma y menú | [`notifications.html`](../frontend/pages/notifications.html) | Adaptación de N-01 | 390 px (verificado también a 360 y 320 px) | Implementado |
| MB-09 · Menú lateral móvil ([PNG](../wireframes/07-movil/mb-09-menu-lateral-movil.png)) | Navegación | offcanvas #app-sidebar | Adaptación de — | 390 px (verificado también a 360 y 320 px) | Implementado (todas las páginas internas) |

Las pantallas sin diseño propio de tablet o móvil se adaptan con el mismo sistema. Entre 768 y 1199 px aparecen el riel y las columnas secundarias ocultas. Por debajo de 768 px aparecen la barra superior azul, la barra inferior y tarjetas donde el diseño móvil las define. Si el diseño no las define, la tabla se desplaza dentro de su contenedor. La regla RNF-032 se verificó a 360 px y el criterio WCAG 1.4.10 a 320 px, sin desplazamiento horizontal de la página.

## 5. Design System (04) y documentación

| Wireframe | Módulo | Archivo HTML | Estado visual | Responsive | Estado de implementación |
|---|---|---|---|---|---|
| DS-01 · Marca y logotipo ([PNG](../wireframes/04-design-system/01-ds-marca-y-logotipo.png)) | Design System | `frontend/img/logo-horizontal-blanco.svg (vector del Libro de Marca), img/logo-horizontal-color.png` | Componentes y variantes | Todos los anchos | Implementado |
| DS-02 · Iconografia ([PNG](../wireframes/04-design-system/02-ds-iconografia.png)) | Design System | `frontend/img/icons.svg (sprite Lucide)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-03 · Acciones ([PNG](../wireframes/04-design-system/03-ds-acciones.png)) | Design System | `frontend/css/components/bootstrap-components.css (.btn-*)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-04 · Badges etiquetas y avatares ([PNG](../wireframes/04-design-system/04-ds-badges-etiquetas-y-avatares.png)) | Design System | `frontend/css/components/status-badge.css, app-header.css (.lang-switch), feedback.css (.char-counter)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-05 · Formularios campos ([PNG](../wireframes/04-design-system/05-ds-formularios-campos.png)) | Design System | `frontend/css/components/bootstrap-components.css (formularios), form-field.css` | Componentes y variantes | Todos los anchos | Implementado |
| DS-06 · Formularios controles ([PNG](../wireframes/04-design-system/06-ds-formularios-controles.png)) | Design System | `frontend/css/components/bootstrap-components.css (.form-check), csv-import.css (.choice-card)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-07 · Navegacion ([PNG](../wireframes/04-design-system/07-ds-navegacion.png)) | Design System | `frontend/css/layout/app-shell.css, components/app-header.css, stepper.css, bootstrap-components.css (.breadcrumb, .nav-tabs)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-08 · Tablas y acciones de formulario ([PNG](../wireframes/04-design-system/08-ds-tablas-y-acciones-de-formulario.png)) | Design System | `frontend/css/components/data-table.css, form-action-bar.css` | Componentes y variantes | Todos los anchos | Implementado |
| DS-09 · Feedback ([PNG](../wireframes/04-design-system/09-ds-feedback.png)) | Design System | `frontend/css/components/bootstrap-components.css (.alert, .toast, .modal), feedback.css (.empty-state, esqueleto)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-10 · Visualizacion ia avisos y móvil ([PNG](../wireframes/04-design-system/10-ds-visualizacion-ia-avisos-y-movil.png)) | Design System | `frontend/css/components/dashboard.css, ai-suggestion.css, app-header.css (avisos), layout/app-shell.css (móvil)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-11 · Fundamentos color ([PNG](../wireframes/04-design-system/11-ds-fundamentos-color.png)) | Design System | `frontend/css/tokens/primitives.css, tokens/semantic.css` | Componentes y variantes | Todos los anchos | Implementado (series de gráficos y sombras aproximadas: PV-22) |
| DS-12 · Accesibilidad contraste verificado wcag 2 2 aa ([PNG](../wireframes/04-design-system/12-ds-accesibilidad-contraste-verificado-wcag-2-2-aa.png)) | Design System | `frontend/css/tokens/semantic.css (combinaciones verificadas con axe)` | Componentes y variantes | Todos los anchos | Implementado |
| DS-13 · Fundamentos tipografia ([PNG](../wireframes/04-design-system/13-ds-fundamentos-tipografia.png)) | Design System | `frontend/css/tokens/typography.css, base/fonts.css` | Componentes y variantes | Todos los anchos | Implementado |
| DS-14 · Fundamentos espaciado radios elevacion y grid ([PNG](../wireframes/04-design-system/14-ds-fundamentos-espaciado-radios-elevacion-y-grid.png)) | Design System | `frontend/css/tokens/spacing.css, tokens/elevation.css, layout/app-shell.css` | Componentes y variantes | Todos los anchos | Implementado (series de gráficos y sombras aproximadas: PV-22) |
| DS-15 · Filtros de tabla ([PNG](../wireframes/04-design-system/15-ds-filtros-de-tabla.png)) | Design System | `frontend/css/components/data-table.css (.filter-select)` | Componentes y variantes | Todos los anchos | Implementado |
| 00 · Overview, 01 · Arquitectura de información, 02 · Flujos de usuario, 08 · Prototipo ([carpeta](../wireframes)) | Documentación UX | — | — | — | No aplicable: son láminas de documentación. Su contenido se refleja en la navegación por rol, los enlaces entre páginas y el Documento de Diseño. |
| 09 · Handoff (10 láminas) ([carpeta](../wireframes/09-handoff)) | Especificación | — | — | — | No aplicable como pantalla. Sus especificaciones se aplican en [06](standards/06-DESIGN-SYSTEM.md) y [07](standards/07-BOOTSTRAP.md) y en los tokens; las decisiones D-01 a D-13, en las páginas. |

### 5.1 Estados visuales transversales

| Estado | Dónde se representa |
|---|---|
| Vacío | Panel de avisos sin avisos (`home-rector.html` y Rectoría en general) |
| Cargando | `courses-loading-error.html` (esqueleto con `aria-busy`), `login-google-cancelled.html` (botón de Google en carga) |
| Error | `courses-loading-error.html` (red), `course-review-error.html`, `course-form-texts-gemini-error.html`, `login-invalid-credentials.html`, `csv-import-rejected.html` |
| Éxito | `users-deleted.html` (toast), `course-form-workload.html` (toast), `course-review-approved.html`, `course-submitted.html`, `csv-import-result.html` |
| Acceso denegado | `access-denied.html`, `login-google-unauthorized.html` |
| Confirmación | Modales C-07 (`courses.html`), U-06 (`users.html`), F-12 (`course-form-review.html`), R-05 (`course-review.html`), R-08 y R-09 (`course-review-approved.html`) |
| Validación visual | `login-field-errors.html`, `user-new-errors.html`, `course-form-review-blocked.html`, modal K-05 (`catalog-sfia-areas.html`), `course-review-correct-code.html`, `report-history-invalid-range.html`, `course-form-program.html` |
| Sin resultados | `courses-no-results.html`, `users-no-results.html` |
| Solo lectura | `course-detail.html`, `course-submitted.html`, `home-rector.html`, `report-production.html`, `catalog-complexity-levels.html` |
| Deshabilitado | `course-review.html` ("Aprobar curso" con motivo), `my-courses.html` y `report-production-director.html` (escuela bloqueada), `course-form-identification.html` (escuela fija), `course-form-classification.html` |

### 5.2 Reutilización y duplicación temporal

Los componentes se implementan una sola vez (DS-10) en `frontend/css/components/` y se reutilizan en todas las páginas. Sin JavaScript no hay forma de incluir HTML compartido, así que la estructura común se **duplica de forma temporal** en cada archivo: barra lateral, riel, barras superior e inferior, menú de usuario y panel de avisos. Al integrar JavaScript, el plan es generarla desde un módulo `js/core/layout.js` con `<template>`, o desde el servidor, a partir de la sesión y los permisos (`GET /api/v1/auth/me`). Así se elimina la copia por página.

## 6. Funcionalidades pendientes de implementación

Nada de esto existe todavía. Cada página trae, en un comentario, el punto de integración previsto (`/js/pages/<página>.page.js`) y ganchos `data-action`, `data-form` y `data-field`.

- **Comunes:**
  - sesión real y redirección por rol (RF-002, RF-008, RF-009);
  - generación del menú según permisos;
  - selector de idioma ES/EN con traducción de todas las vistas y preferencia persistida (RF-044);
  - contador y panel de avisos con datos reales;
  - cierre automático de toasts a los 6 s;
  - aviso "¿Salir sin guardar?" (propuesta UX).
- **Autenticación:**
  - Google Identity (RF-001) e inicio con correo y contraseña (RF-002);
  - mostrar u ocultar la contraseña;
  - validación y mensajes;
  - redirección desde A-06.
- **Usuarios:**
  - búsqueda con debounce, filtros, orden y paginación (RF-007);
  - registro y edición con validación RF-003 y RF-004, cálculo de la edad, escuela según el rol y subida de la fotografía;
  - eliminación con sus reglas de bloqueo (RF-006).
- **Catálogos y CSV:**
  - registro, edición, eliminación y búsqueda (RF-010 a RF-016);
  - comprobar si un elemento está en uso;
  - modales de registro de escuelas, carreras y certificaciones;
  - importación CSV con validación todo o nada y duplicados omitidos (RF-017, Python pendiente de validar).
- **Cursos:**
  - búsqueda y filtros (RF-041), paginación y reintento;
  - detalle con datos reales;
  - descarga de adjuntos;
  - copiar los datos para Power Campus (propuesta UX);
  - cambio a Inactivo (RF-035).
- **Formulario de curso:**
  - guardar borrador (formatos y límites) y Listo para enviar (validación completa, resumen y foco al primer error);
  - contadores en tiempo real y total de horas;
  - reglas RN-25 y de fechas;
  - palabras clave;
  - adjuntos con validación de tipo y tamaño en el servidor;
  - sugerencias de Gemini con espera, aceptación, descarte y errores (RF-028, RF-029);
  - envío a revisión con correo y notificación de escritorio (RF-030, RF-036, RF-037).
- **Revisión y aprobación:**
  - validar, corregir o generar el código (RF-032);
  - aprobar con avisos (RF-033, RF-038);
  - pasar a En producción (RF-034) e Inactivo;
  - reintento ante errores.
- **Reportes:**
  - consulta con filtros;
  - validación del rango de fechas;
  - comparativo y gráficos generados desde la API (RF-042, RF-043).

## 7. Desviaciones documentadas respecto del diseño

| Pantalla | Diseño | Implementación | Motivo |
|---|---|---|---|
| Rectoría (P-04, RP-01, C-05) | Campana con 3 avisos | Campana sin contador | La ERS no asigna avisos a Rectoría |
| RP-02 | Pestaña "Histórico y comparativo" | Oculta para el Director | RF-043 no lo incluye; no se muestran acciones no permitidas |
| F-11 | Solo "Ir al primer error" | Resumen con enlaces a cada campo | RF-030 CA2 y el handoff piden resumen con enlaces |
| Formularios | Sin nota de obligatorios | "Los campos marcados con * son obligatorios…" | HTML-12 / RF-018 CA4 |
| Campos de texto | Unos 14–15 px | 16 px | Evita el zoom automático de iOS al enfocar |
| U-03 a U-05 | Botón "Subir fotografía" | `input type="file"` nativo | Accesible y funcional sin JS |
| Menú de catálogos (K-02…K-08) | 10 catálogos | Los que no tienen página propia enlazan a `catalogs.html` | Solo hay diseño de 6 catálogos |
| Filtros con valor visible | Ancho ajustado al valor | Ajustado en Chrome (`field-sizing`); en otros navegadores, el ancho de la opción más larga | Sin JS |
| Tablet | Título de la vista en la barra superior | Ruta de navegación en la barra superior y título en el contenido | Una sola estructura de barra para tablet y escritorio |
| Móvil | Título solo en la barra azul | `h1` visualmente oculto y título visible en la barra | Un único `h1` por página (HTML-06) |

## 8. Verificaciones

Ejecutadas el 14 de noviembre de 2026 sobre `frontend/` servido localmente:

| Verificación | Herramienta | Resultado |
|---|---|---|
| HTML válido | html-validate 9.7.1 (`html-validate:recommended` + reglas de landmarks, botones e inline) | 0 errores en 59 archivos |
| Recursos y consola | Chromium sin interfaz (Playwright) a 360, 768 y 1440 px | 0 errores de consola, 0 respuestas 4xx/5xx, 0 enlaces internos rotos, 0 iconos inexistentes |
| Desplazamiento horizontal | Playwright a 320, 360, 640, 768 y 1440 px | 0 px de desborde en las 59 páginas |
| Accesibilidad automática | axe-core 4.14.0, reglas WCAG 2.0/2.1/2.2 A y AA, a 360 y 1440 px | 0 violaciones en 59 páginas, después de corregir el nombre accesible del menú de usuario, el contraste de la zona de carga, los objetivos táctiles del resumen de errores y las regiones desplazables |
| Jerarquía de encabezados | Script Playwright | 1 `h1` por página y sin saltos de nivel en 59 páginas |
| Objetivos táctiles a 390 px | Script Playwright | Botones ≥ 44 px y botones de icono ≥ 40 px. Los filtros miden 44 px en total (control de 42 px dentro de su borde) |
| Teclado | Playwright | Primer Tab en "Saltar al contenido principal"; modal C-07 y menú lateral se cierran con Esc; el foco vuelve al botón del modal y no pasa al contenido de la página mientras el modal está abierto |
| Patrones prohibidos | grep | 0 `style=`, 0 `on*=`, 0 `maxlength` en campos con contador, 0 `fetch`/`localStorage`, 0 `!important` en el CSS propio; único `<script>` activo: el bundle de Bootstrap |
| Formato | Prettier 3.10.1 con `.prettierrc.json` | Todos los HTML y CSS de `frontend/` conformes |
| Fidelidad visual | Capturas a 1440, 768 y 390 px comparadas con los PNG de 05, 06 y 07 | Revisadas pantalla por pantalla; desviaciones en la §7 |

**Pendiente de ejecutar:**
- Nu Html Checker y validador de CSS del W3C.
- Prueba con lector de pantalla (NVDA o VoiceOver).
- Recorrido completo con teclado de cada página.
- Zoom real al 200 %.
- Contraste de bordes y componentes no textuales (WCAG 1.4.11).
- Prueba en Safari y Firefox reales (RNF-043, RNF-044).

Un resultado automático sin violaciones **no demuestra cumplimiento de WCAG 2.2 AA**. Solo indica que no se detectaron fallos automatizables.
