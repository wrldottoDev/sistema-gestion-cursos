# ADR-0005 · Sesiones de servidor y verificación del ID token de Google en el servidor

- **Estado:** Aceptado para sesiones; **Propuesto** para el flujo de Google (PV-02) y para los tiempos de expiración (PV-03)
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** RF-001, RF-002, RF-008, RF-009, RNF-007, RNF-008, RNF-009, RNF-010, RNF-011, RNF-012; restricción del curso: "manejo de sesiones" en la Iteración 2

## Contexto

La autenticación con la cuenta institucional de Google es obligatoria (RF-001); correo y contraseña es deseable (RF-002). No hay auto-registro: solo ingresan usuarios creados por el Administrador (RF-001 CA2) con dominio `@ucenfotec.ac.cr` (CA3). La autorización debe ocurrir en el servidor (RNF-007, RNF-012) y depende del rol y de la escuela del usuario, que el Administrador puede cambiar en cualquier momento. Frontend y API comparten origen ([ADR-0002](0002-modular-monolith-three-layers.md)).

## Decisión

1. **Sesión de servidor** con `express-session` y almacén en MongoDB (`connect-mongo`, colección `sessions`). La cookie (`sgc.sid`) es `HttpOnly`, `Secure` en producción, `SameSite=Lax`. La sesión guarda solo el `userId`; rol y escuela se leen del usuario en cada petición, de modo que un cambio de rol o una eliminación tienen efecto inmediato.
2. El identificador de sesión se **regenera** al autenticarse (prevención de fijación de sesión).
3. **Google Identity Services** en el navegador obtiene un **ID token** (OpenID Connect) que se envía a `POST /api/v1/auth/google`. El servidor lo verifica con `google-auth-library` (firma, `aud` = `GOOGLE_CLIENT_ID`, `iss`, `exp`), exige `email_verified`, `hd = ucenfotec.ac.cr` y el sufijo del correo, y busca al usuario por correo. Si no existe, responde 403 con `account_not_authorized` y **no crea usuarios**.
4. No se usan JWT propios ni se guardan tokens en `localStorage` o `sessionStorage`.
5. Expiración propuesta (PV-03): 30 minutos de inactividad (cookie *rolling*) y 8 horas absolutas. El endpoint `POST /api/v1/auth/logout` se implementa como control de seguridad; su botón en la interfaz queda pendiente porque la ERS §1.2 excluye el cierre de sesión y el Apéndice E lo lista como pendiente.

Detalle en [13 · Autenticación y autorización](../standards/13-AUTHENTICATION-AUTHORIZATION.md).

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| JWT propio en `localStorage` | Sin estado en servidor | Expuesto a XSS; revocación difícil; el rol embebido queda obsoleto al cambiarlo | Riesgo innecesario con mismo origen |
| Flujo *authorization code* con PKCE en servidor | Patrón OIDC clásico; no depende del script de Google en la página | Más código (redirecciones, `state`, `nonce`, intercambio de código) | Alternativa válida; se reevalúa en PV-02 si GIS presenta problemas |
| Passport.js | Estrategias listas | Abstracción adicional para un solo proveedor | La verificación del ID token son pocas líneas con la librería oficial |

## Consecuencias

- Positivas: revocación inmediata (borrar la sesión o el usuario); cookies inaccesibles a JavaScript; autorización siempre con datos frescos.
- Negativas: una lectura del usuario por petición (aceptable con índice por `_id`); el almacén de sesiones es otra colección que mantener.
- CSP debe permitir los orígenes de Google Identity Services ([12 · Seguridad](../standards/12-SECURITY.md)).

## Referencias

- Google Identity Services, verificar el ID token. https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- OpenID Connect Core 1.0. https://openid.net/specs/openid-connect-core-1_0.html
- OWASP Session Management Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
