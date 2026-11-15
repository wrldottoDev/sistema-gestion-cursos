# ADR-0007 · Hash de contraseñas con PBKDF2 de `node:crypto`

- **Estado:** Aceptado
- **Fecha:** 2026-11-14
- **Decisores:** equipo SGC
- **Requerimientos relacionados:** RF-002, RF-003 CA5, RF-005 CA3, RNF-001 a RNF-006, RNF-011

## Contexto

El inicio de sesión local (RF-002) es deseable y requiere guardar contraseñas. RNF-005 prohíbe el texto plano y RNF-006 exige "un algoritmo de hash específico para contraseñas, como PBKDF2 con sal aleatoria, según la guía de OWASP". La guía actual de OWASP (*Password Storage Cheat Sheet*) recomienda, en orden, Argon2id, scrypt, bcrypt y PBKDF2 (este último cuando se requiere FIPS-140), con PBKDF2-HMAC-SHA256 a 600 000 iteraciones como mínimo.

## Decisión

Usaremos **PBKDF2-HMAC-SHA256** de `node:crypto` (biblioteca estándar, sin dependencias nativas):

- Sal aleatoria de 16 bytes por contraseña (`crypto.randomBytes(16)`).
- 600 000 iteraciones; clave derivada de 32 bytes.
- Formato almacenado autodescriptivo: `pbkdf2_sha256$600000$<salBase64>$<hashBase64>`, que permite subir iteraciones o cambiar de algoritmo sin migración masiva (re-hash al siguiente inicio de sesión exitoso).
- Comparación en tiempo constante con `crypto.timingSafeEqual`.
- Versión asíncrona (`crypto.pbkdf2`, promisificada) para no bloquear el *event loop*.
- Si el correo no existe, se calcula igualmente un hash de una contraseña ficticia para que el tiempo de respuesta no revele qué cuentas existen (RNF-011).

La política de contraseña (8–15 caracteres, mayúscula, minúscula y número, RNF-001 a RNF-004) se valida con la misma función en `shared/validation/` en navegador y servidor.

## Alternativas consideradas

| Alternativa | Ventajas | Desventajas | Motivo del descarte |
|---|---|---|---|
| Argon2id (`argon2` en npm) | Primera recomendación de OWASP | Dependencia con binarios nativos; la ERS nombra PBKDF2 | Riesgo de instalación en tres equipos y CI con beneficio marginal para este alcance |
| scrypt (`crypto.scrypt`) | En la biblioteca estándar; recomendado por OWASP | La ERS cita PBKDF2 explícitamente | Se prefiere la alineación literal con RNF-006 |
| bcrypt | Muy difundido | Dependencia nativa; límite de 72 bytes | Igual que Argon2id |

## Consecuencias

- Positivas: cumple el texto de RNF-006 sin dependencias; formato migrable.
- Negativas: cada verificación consume del orden de cientos de milisegundos de CPU (aceptable para un inicio de sesión). RNF-016 mide listado, detalle y guardado, no el inicio de sesión; aun así se mide en el ambiente de pruebas y, si fuera necesario, se ajustan las iteraciones con un ADR nuevo.
- Pruebas obligatorias: límites 7/8/15/16 caracteres, cada regla de composición, formato almacenado sin texto plano, comparación correcta e incorrecta ([16 · Pruebas](../standards/16-TESTING.md)).

## Referencias

- OWASP Password Storage Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Node.js `crypto.pbkdf2`. https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback
