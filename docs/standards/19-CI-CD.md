# 19 · CI/CD

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define la integración continua (CI) del repositorio con GitHub Actions: cuándo se ejecuta, qué valida, qué criterios debe cumplir para permitir un merge, cómo se manejan los secretos y qué verificaciones siguen siendo manuales. Incluye los criterios mínimos para un futuro despliegue continuo (CD).

Fuera de alcance: las herramientas que el pipeline ejecuta y su configuración ([18](18-CODE-QUALITY.md)); qué pruebas existen y su cobertura ([16](16-TESTING.md)); las reglas de protección de ramas que exigen el pipeline ([02](02-BRANCHING-AND-PR.md#73-configuración-de-github)); la creación de tags y releases ([21](21-VERSIONING.md)).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Plataforma | GitHub Actions | Adoptado |
| Workflow | Un archivo `.github/workflows/ci.yml` con los jobs `lint`, `test` y `e2e` | Adoptado (diseño); **archivo pendiente de crear** cuando exista `package.json` |
| Runtime | `actions/setup-node@v4` con `node-version: lts/*` y caché de npm | Adoptado |
| Base de datos de pruebas | Contenedor de servicio `mongo:8` en el runner (sin Atlas ni secretos) | Adoptado |
| Instalación | `npm ci` (respeta el lockfile) | Adoptado |
| Despliegue (CD) | Sin ambiente definido | Pendiente de validación ([PV-19](README.md#7-decisiones-pendientes-de-validación)) |

El workflow **no se crea todavía**: sin `package.json` ni lockfile, `npm ci` fallaría en todos los PR y bloquearía el trabajo. Se crea en el mismo PR que agrega `package.json` y los scripts de [18 §6.2](18-CODE-QUALITY.md#62-packagejson-propuesto-pendiente-de-crear).

## 3. Justificación

- **Verificación objetiva antes del merge.** Lint, formato y pruebas se ejecutan igual para los tres integrantes, sin depender de que cada uno recuerde correrlos.
- **Gratis y sin infraestructura.** El repositorio es público: GitHub Actions no tiene costo y la protección de ramas puede exigir sus resultados.
- **Pruebas de integración reales sin secretos.** Un contenedor `mongo:8` efímero permite probar índices, `$jsonSchema` y transiciones atómicas sin exponer la cadena de conexión de Atlas en el pipeline.
- **`lts/*`.** Usa la línea LTS activa de Node.js, coherente con `engines: ">=24"`; no hay que actualizar el workflow en cada versión.
- **Pipeline corto.** Un pipeline que tarda más de 10 minutos se ignora o se esquiva; los jobs se separan para que el error se identifique rápido y corren en paralelo.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| CI-01 | El workflow DEBE ejecutarse en cada `pull_request` y cada `push` hacia `main` y `redesign/iteracion-2`. |
| CI-02 | Los jobs `lint` y `test` DEBEN pasar para integrar un PR; la protección de ramas DEBE exigirlos como *required status checks* una vez creado el workflow ([02](02-BRANCHING-AND-PR.md#73-configuración-de-github)). |
| CI-03 | El job `lint` DEBE ejecutar `npm run lint`, `npm run format:check` y `npm audit --omit=dev --audit-level=high`. |
| CI-04 | El job `test` DEBE ejecutar las pruebas unitarias y de integración contra el servicio `mongo:8`, con una base de datos exclusiva de pruebas. |
| CI-05 | Las dependencias DEBEN instalarse con `npm ci`; nunca con `npm install` en el pipeline. |
| CI-06 | El workflow DEBE declarar `permissions: contents: read` (mínimo privilegio) y `timeout-minutes` en cada job. |
| CI-07 | Los secretos NO DEBEN escribirse en el workflow, en el repositorio ni en los logs. Si un job necesita un secreto, DEBE leerlo de **GitHub Secrets** (`${{ secrets.NOMBRE }}`). |
| CI-08 | Las pruebas de CI NO DEBEN llamar a servicios externos reales (Google, Gemini, SMTP); se usan dobles de prueba ([16](16-TESTING.md)). |
| CI-09 | Un pipeline en rojo en `redesign/iteracion-2` o `main` DEBE corregirse antes de integrar cualquier otro PR (la rama de integración no se deja rota). |
| CI-10 | NO DEBE desactivarse ni saltarse un job para lograr un merge. Si un job es inestable, se corrige o se elimina mediante PR que modifique este documento. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| CI-11 | El pipeline completo (sin E2E) DEBERÍA terminar en menos de 10 minutos. |
| CI-12 | El job `e2e` DEBERÍA ejecutarse en los PR hacia `main` y bajo demanda (`workflow_dispatch`) antes de cada hito (avance 29 nov, exposición 2 dic, entrega 6 dic). |
| CI-13 | Se DEBERÍA activar en GitHub *Secret scanning* y *Push protection* (Settings → Code security), disponibles sin costo en repositorios públicos. |
| CI-14 | Se DEBERÍAN activar las alertas de Dependabot (Settings → Code security → Dependabot alerts). |
| CI-15 | `concurrency` DEBERÍA cancelar ejecuciones anteriores de la misma rama para no gastar minutos en commits ya reemplazados. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| CI-16 | Las acciones PUEDEN fijarse por SHA completo en lugar de etiqueta de versión mayor (`@v4`) para reducir el riesgo de la cadena de suministro. |
| CI-17 | Se PUEDE agregar `.github/dependabot.yml` para PR automáticos de actualización de npm y de GitHub Actions. |
| CI-18 | Cuando exista el script Python de carga CSV ([PV-06](README.md#7-decisiones-pendientes-de-validación)), se PUEDE agregar al job `test` un paso `actions/setup-python` con `python3 -m py_compile` y `python3 -m unittest`. |
| CI-19 | Se PUEDE publicar el reporte de cobertura como artefacto del job (`actions/upload-artifact@v4`). |

## 5. Nomenclatura

| Elemento | Convención |
|---|---|
| Archivo de workflow | `.github/workflows/<nombre-kebab>.yml` (`ci.yml`) |
| `name` del workflow | `CI` |
| ID y `name` de job | Minúsculas de una palabra: `lint`, `test`, `e2e`. El `name` es el que aparece como *status check* en la protección de ramas, por lo que NO DEBE cambiarse sin actualizar la protección. |
| Secretos | `UPPER_SNAKE_CASE`, mismo nombre que la variable de entorno que alimentan (`GEMINI_API_KEY`) |
| Base de datos de pruebas | `sgc_test` (nunca la base de desarrollo ni la de producción) |

## 6. Ejemplos

### 6.1 Workflow propuesto (correcto)

Contenido previsto de `.github/workflows/ci.yml`. **No existe aún** (§2).

```yaml
name: CI

on:
  pull_request:
    branches: [main, redesign/iteracion-2]
  push:
    branches: [main, redesign/iteracion-2]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: lint
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm audit --omit=dev --audit-level=high

  test:
    name: test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    services:
      mongo:
        image: mongo:8
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --quiet --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      NODE_ENV: test
      MONGODB_URI: mongodb://localhost:27017
      MONGODB_DB_NAME: sgc_test
      SESSION_SECRET: ci-only-session-secret-not-used-anywhere-else
      GOOGLE_CLIENT_ID: ci-placeholder.apps.googleusercontent.com
      ALLOWED_EMAIL_DOMAIN: ucenfotec.ac.cr
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:coverage

  e2e:
    name: e2e
    if: github.base_ref == 'main' || github.event_name == 'workflow_dispatch'
    needs: [lint, test]
    runs-on: ubuntu-latest
    timeout-minutes: 30
    services:
      mongo:
        image: mongo:8
        ports:
          - 27017:27017
    env:
      NODE_ENV: test
      MONGODB_URI: mongodb://localhost:27017
      MONGODB_DB_NAME: sgc_e2e
      SESSION_SECRET: ci-only-session-secret-not-used-anywhere-else
      GOOGLE_CLIENT_ID: ci-placeholder.apps.googleusercontent.com
      ALLOWED_EMAIL_DOMAIN: ucenfotec.ac.cr
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium firefox webkit
      - run: npm run test:e2e
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

Notas:

- Las variables de entorno del job son **valores ficticios** que solo satisfacen la validación de configuración al arrancar ([09](09-NODEJS-BACKEND.md)); la lista final debe coincidir con `backend/src/config/env.js` cuando exista. Las integraciones externas se reemplazan por dobles de prueba.
- `test:coverage` vuelve a ejecutar las pruebas para medir cobertura; si el tiempo del job supera CI-11, se elimina el paso `test:unit`/`test:integration` y se deja solo la cobertura.
- El job `e2e` requiere que `playwright.config.js` levante la aplicación con `webServer` ([16](16-TESTING.md)).
- La imagen oficial `mongo:8` incluye `mongosh`, usado por el *health check*.

### 6.2 Incorrecto

```yaml
# Incorrecto: secreto en texto plano, permisos amplios, install en lugar de ci, sin timeout
permissions: write-all
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      MONGODB_URI: mongodb+srv://admin:Password123@cluster0.example.mongodb.net/   # CI-07
      GEMINI_API_KEY: AIza...                                                      # CI-07, CI-08
    steps:
      - uses: actions/checkout@v4
      - run: npm install          # CI-05
      - run: npm test || true     # CI-10: oculta fallos
```

### 6.3 Uso de un secreto (cuando sea imprescindible)

```yaml
    env:
      GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

Se registra en **Settings → Secrets and variables → Actions → New repository secret**. Los PR que vienen de forks no reciben secretos; por eso ningún job obligatorio debe depender de ellos (CI-08).

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Qué se automatiza y qué queda manual

| Verificación | Automatizada | Dónde | Requerimiento |
|---|---|---|---|
| Errores de código y patrones prohibidos (`var`, `==`, `innerHTML`) | Sí | `lint` | RNF-045 |
| Formato | Sí | `lint` | — |
| Vulnerabilidades altas en dependencias de producción | Sí | `lint` (`npm audit`) | RNF-010 |
| Reglas de negocio y validaciones (`shared/`, servicios) | Sí | `test` | RNF-047 |
| Autorización por rol y escuela (pruebas negativas) | Sí | `test` | RNF-007, RNF-008, RNF-012, OBJ-03 |
| Índices, `$jsonSchema`, transiciones atómicas | Sí | `test` (con `mongo:8`) | RNF-025, RNF-026 |
| Flujos principales en Chromium, Firefox y WebKit | Sí (recomendado) | `e2e` | RNF-041 – RNF-044 |
| Reglas automáticas de accesibilidad (axe) | Sí (recomendado) | `e2e` | RNF-034, RNF-035 |
| Secretos en commits | Sí (GitHub) | Secret scanning | RNF-010 |
| Casos de aceptación CP-RF-0xx con evidencia | **Manual** | Cierre de iteración | ERS §7.3 |
| Fidelidad visual con Figma y revisión a 360/768/1440 px | **Manual** | Revisión del PR | RNF-032, RNF-049 |
| Lector de pantalla y recorrido completo por teclado | **Manual** | Revisión del PR | RNF-033, RNF-036 |
| Rendimiento con 5 000 cursos | **Manual** (script de semilla + medición) | Antes de la entrega | RNF-019 |
| Revisión de código | **Manual** | PR | [18](18-CODE-QUALITY.md#revisión-de-código) |
| Tags y releases | **Manual** | Hitos | [21](21-VERSIONING.md) |

### 7.2 Despliegue (CD)

No existe ambiente de producción ni de pruebas desplegado ([PV-19](README.md#7-decisiones-pendientes-de-validación)). Cuando se defina, el despliegue DEBE cumplir:

1. Desplegar solo desde tags de `main` o pre-releases aprobadas de `redesign/iteracion-2` ([21](21-VERSIONING.md)), nunca desde ramas de historia.
2. Servir exclusivamente por HTTPS y redirigir HTTP (RNF-009).
3. Cargar la configuración desde variables de entorno del proveedor, nunca desde archivos versionados (RNF-046).
4. Ejecutar `npm run db:migrate` antes de iniciar la nueva versión.
5. Realizar una prueba de humo: la página de inicio de sesión carga y `GET /api/v1/auth/me` sin sesión responde 401.
6. Conservar la versión anterior para revertir si la prueba de humo falla.

### 7.3 Equivalente local

Antes de `git push`, cada integrante ejecuta lo mismo que el pipeline (cuando existan los scripts):

```bash
npm run lint && npm run format:check && npm test
```

Para las pruebas de integración locales se usa MongoDB en Docker (`docker run --rm -p 27017:27017 mongo:8`) o una base `sgc_test` separada en Atlas ([16](16-TESTING.md)).

## 8. Errores frecuentes

1. Crear el workflow antes de que exista `package.json`: todos los PR quedan en rojo.
2. Apuntar las pruebas de CI a la base de desarrollo de Atlas y borrar datos del equipo.
3. Cambiar el `name` de un job y olvidar actualizar los *required status checks*: GitHub queda esperando un check que nunca llega.
4. Agregar `|| true` o `continue-on-error: true` para "desbloquear" un merge.
5. Imprimir variables de entorno completas (`env` o `printenv`) en un paso de depuración.
6. Hacer depender un job obligatorio de un secreto: los PR desde forks fallan siempre.
7. Instalar los tres navegadores de Playwright en cada PR y duplicar el tiempo del pipeline.

## 9. Checklist

- [ ] El workflow se creó en el mismo PR que `package.json` y el lockfile.
- [ ] Se ejecuta en `pull_request` y `push` hacia `main` y `redesign/iteracion-2`.
- [ ] Usa `npm ci`, `node-version: lts/*`, caché de npm, `permissions: contents: read` y `timeout-minutes`.
- [ ] `lint` ejecuta lint, verificación de formato y `npm audit`.
- [ ] `test` usa el servicio `mongo:8` con la base `sgc_test` y sin servicios externos reales.
- [ ] No hay secretos en el YAML; los necesarios están en GitHub Secrets.
- [ ] Los jobs `lint` y `test` están configurados como *required status checks* en la protección de ramas.
- [ ] Secret scanning, push protection y alertas de Dependabot están activos.
- [ ] El pipeline sin E2E termina en menos de 10 minutos.

## 10. Referencias

- GitHub Actions: <https://docs.github.com/en/actions>
- Sintaxis de workflows: <https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions>
- Contenedores de servicio: <https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/about-service-containers>
- `actions/setup-node`: <https://github.com/actions/setup-node>
- Uso de secretos en GitHub Actions: <https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions>
- Endurecimiento de seguridad de GitHub Actions: <https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions>
- Secret scanning: <https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning>
- Playwright en CI: <https://playwright.dev/docs/ci-intro>
- Imagen oficial de MongoDB: <https://hub.docker.com/_/mongo>
- Documento relacionado: [16 · Pruebas](16-TESTING.md), [18 · Calidad de código](18-CODE-QUALITY.md), [21 · Versionado](21-VERSIONING.md).
