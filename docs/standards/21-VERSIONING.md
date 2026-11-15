# 21 · Versionado

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define cómo se numeran las versiones de la aplicación y del contrato de la API, cómo se crean y protegen los tags, cómo se publican los releases en GitHub y cómo se conservan las entregas de cada iteración.

Fuera de alcance: modelo de ramas y merge hacia `main` ([02](02-BRANCHING-AND-PR.md)); formato de commits que alimenta las notas de versión ([01](01-GIT-AND-COMMITS.md)); diseño de la API ([10](10-REST-API.md)); migraciones de base de datos ([11](11-MONGODB.md)).

## 2. Estándar adoptado

| Elemento | Decisión | Estado |
|---|---|---|
| Esquema | [Semantic Versioning 2.0.0](https://semver.org/): `MAJOR.MINOR.PATCH[-prerelease]` | Adoptado |
| Versión de la aplicación | Campo `version` de `package.json` y tag `vX.Y.Z` | Adoptado; `package.json` pendiente de crear |
| Versión de la API | Mayor en la ruta (`/api/v1`) y versión del contrato en `info.version` de `docs/api/openapi.yaml` | Adoptado |
| Tags | Anotados, con prefijo `v`, inmutables | Adoptado |
| Releases | GitHub Releases creados desde el tag, con notas generadas automáticamente | Adoptado |
| Iteración 1 | Tag existente `v1.0-iteracion1` (anotado, sobre `a20730b`) + tag SemVer `v1.0.0` sobre el mismo commit | `v1.0-iteracion1`: Implementado · `v1.0.0`: Pendiente de validación ([PV-18](README.md#7-decisiones-pendientes-de-validación)) |
| Changelog | GitHub Releases; `CHANGELOG.md` opcional | Adoptado |

### 2.1 Mapa de versiones del proyecto

| Versión | Hito | Fecha | Rama donde se crea el tag | Tipo de release |
|---|---|---|---|---|
| `v1.0.0` (y `v1.0-iteracion1`) | Entrega Iteración 1 | Entregada el 1 nov 2026; el equipo etiquetó el commit `a20730b` | `main` / `legacy/iteracion-1` (`a20730b`) | Release |
| `2.0.0-alpha.0` | Desarrollo de la Iteración 2 | desde 16 nov 2026 | — (solo en `package.json`, sin tag) | — |
| `v2.0.0-beta.1` | Avance Iteración 2 | 29 nov 2026 | `redesign/iteracion-2` | Pre-release |
| `v2.0.0-rc.1` (`rc.2`, … si hay correcciones) | Exposición | 2 dic 2026 | `redesign/iteracion-2` | Pre-release |
| `v2.0.0` | Entrega final | 6 dic 2026 | `main` (merge commit desde la integración) | Release |
| `v2.0.1`, `v2.0.2`, … | Correcciones posteriores | según necesidad | `main` (desde `hotfix/*`) | Release |

## 3. Justificación

- **SemVer comunica impacto.** `v1` (HTML, CSS, JS y LocalStorage) y `v2` (Bootstrap, Node.js, MongoDB) son incompatibles: el cambio de MAJOR lo dice sin explicación adicional.
- **Pre-releases para los hitos académicos.** El avance y la exposición son versiones evaluadas que deben poder reproducirse exactamente; un tag `-beta.1` o `-rc.1` lo permite sin presentarlas como entrega final.
- **API versionada aparte.** El contrato `/api/v1` cambia menos que la aplicación; versionarlo por separado evita renombrar rutas en cada release.
- **Tags inmutables.** Si un tag se mueve, la versión evaluada por el docente deja de ser reproducible.
- **Sin herramientas extra.** Las notas generadas de GitHub, alimentadas por títulos de PR en Conventional Commits, cubren el changelog sin instalar `semantic-release` ni similares.
- **Compatibilidad con lo existente.** El tag `v1.0-iteracion1` ya está publicado; borrarlo rompería referencias. Se conserva y se agrega el equivalente SemVer.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| VER-01 | Las versiones de la aplicación DEBEN seguir SemVer 2.0.0 y los tags DEBEN llevar el prefijo `v` (`v2.0.0`, `v2.0.0-rc.1`). |
| VER-02 | Los tags DEBEN ser anotados (`git tag -a`) con un mensaje que identifique el hito y la fecha. |
| VER-03 | Un tag publicado NO DEBE moverse, reemplazarse ni borrarse. Si una versión resulta defectuosa, se publica la siguiente (`-rc.2`, `v2.0.1`). |
| VER-04 | El campo `version` de `package.json` DEBE coincidir con el tag del commit que se etiqueta. Solo se modifica en commits `chore(release): …`. |
| VER-05 | Las pre-releases (`-beta.N`, `-rc.N`) DEBEN etiquetarse en `redesign/iteracion-2` y marcarse como *Pre-release* en GitHub. La versión final de la iteración DEBE etiquetarse en `main`, sobre el merge commit de la entrega ([02](02-BRANCHING-AND-PR.md#64-entrega-de-la-iteración-a-main)). |
| VER-06 | Cada tag DEBE tener su GitHub Release con notas de versión. |
| VER-07 | `legacy/iteracion-1` y los tags `v1.0-iteracion1` y `v1.0.0` NO DEBEN borrarse, moverse ni reescribirse. |
| VER-08 | La API DEBE exponerse bajo `/api/v1`. Después de `v2.0.0`, un cambio incompatible del contrato DEBE publicarse como `/api/v2` conviviendo con `/api/v1`; dentro de `v1` solo se permiten cambios compatibles (endpoints o campos opcionales nuevos). |
| VER-09 | `info.version` de `docs/api/openapi.yaml` DEBE actualizarse cuando cambia el contrato: MINOR por adiciones compatibles, PATCH por correcciones de documentación o de comportamiento sin cambio de forma. |
| VER-10 | Una versión NO DEBE etiquetarse con el pipeline en rojo ([19](19-CI-CD.md)). |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| VER-11 | Antes de `v2.0.0`, el frontend es el único consumidor de la API y se despliega junto con ella; por eso un cambio incompatible de `/api/v1` DEBERÍA hacerse en el mismo PR que adapta el frontend, marcado con `!` ([01](01-GIT-AND-COMMITS.md)), sin crear `/api/v2`. |
| VER-12 | Las notas del release DEBERÍAN incluir, además de las generadas, las migraciones de base de datos incluidas, las variables de entorno nuevas y los pendientes de validación conocidos. |
| VER-13 | Se DEBERÍA proteger los tags `v*` con un *tag ruleset* (§7.2). |
| VER-14 | `redesign/iteracion-2` DEBERÍA conservarse hasta que exista el tag `v2.0.0` y el curso termine; no se borra antes. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| VER-15 | Se PUEDE mantener un `CHANGELOG.md` en formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) si el docente lo solicita; GitHub Releases sigue siendo la fuente principal. |
| VER-16 | Se PUEDE adjuntar al GitHub Release el paquete entregado en Moodle (documentos PDF y ZIP del código) para que la versión evaluada quede junto a su tag. |
| VER-17 | Durante el desarrollo se PUEDE incrementar `2.0.0-alpha.N` en `package.json` sin crear tags. |

## 5. Nomenclatura

| Elemento | Formato | Ejemplo |
|---|---|---|
| Tag de versión | `vMAJOR.MINOR.PATCH` | `v2.0.0` |
| Tag de pre-release | `vMAJOR.MINOR.PATCH-<beta|rc>.N` | `v2.0.0-beta.1`, `v2.0.0-rc.2` |
| Mensaje del tag | `Iteración <n> · <hito> (<fecha>)` | `Iteración 2 · exposición (2 dic 2026)` |
| Título del release | Igual al tag + hito | `v2.0.0-rc.1 · Exposición Iteración 2` |
| Commit de versión | `chore(release): vX.Y.Z[-pre]` | `chore(release): v2.0.0-beta.1` |
| Ruta de la API | `/api/v<MAJOR>` | `/api/v1/courses` |

## 6. Ejemplos

### 6.1 Agregar el tag SemVer de la Iteración 1 (correcto)

```bash
git fetch --tags
git rev-list -n 1 v1.0-iteracion1        # debe mostrar a20730b…
git tag -a v1.0.0 'v1.0-iteracion1^{commit}' -m "Iteración 1 · entrega (mismo commit que v1.0-iteracion1)"
git push origin v1.0.0
```

`^{commit}` hace que `v1.0.0` apunte al commit y no al objeto del tag anterior. Ambos tags conviven.

### 6.2 Pre-release del avance

```bash
# En una rama de release corta, partiendo de la integración con todo lo del hito integrado
git switch redesign/iteracion-2 && git pull --ff-only
git switch -c chore/release-v2.0.0-beta.1
npm version 2.0.0-beta.1 --no-git-tag-version      # actualiza package.json y package-lock.json
git commit -am "chore(release): v2.0.0-beta.1"
gh pr create --base redesign/iteracion-2 --title "chore(release): v2.0.0-beta.1"
# Tras la aprobación y el squash merge, etiquetar el commit resultante:
git switch redesign/iteracion-2 && git pull --ff-only
git tag -a v2.0.0-beta.1 -m "Iteración 2 · avance (29 nov 2026)"
git push origin v2.0.0-beta.1
gh release create v2.0.0-beta.1 --prerelease --generate-notes \
  --title "v2.0.0-beta.1 · Avance Iteración 2"
```

`--no-git-tag-version` evita que npm cree su propio tag: el tag se crea a mano sobre el commit que queda en la integración después del *squash*.

### 6.3 Entrega final

```bash
# 1. Commit de versión en la integración (como en 6.2) con 2.0.0
# 2. PR de entrega redesign/iteracion-2 → main con merge commit (02 §6.4)
git switch main && git pull --ff-only
git tag -a v2.0.0 -m "Iteración 2 · entrega final (6 dic 2026)"
git push origin v2.0.0
gh release create v2.0.0 --generate-notes --title "v2.0.0 · Entrega Iteración 2"
```

### 6.4 Incorrecto

```bash
git tag v2.0                              # sin PATCH, sin anotar (VER-01, VER-02)
git tag -f v2.0.0-rc.1 HEAD               # mueve un tag publicado (VER-03)
git push origin :refs/tags/v1.0-iteracion1  # borra el tag de la Iteración 1 (VER-07)
git tag -a v2.0.0 -m "final"              # sobre la integración en lugar de main (VER-05)
```

```text
iteracion2-final        # no es SemVer
v2.0.0-final            # "final" no es un identificador de pre-release; la final es v2.0.0
```

### 6.5 Cambio compatible e incompatible de la API

| Cambio | Antes de `v2.0.0` | Después de `v2.0.0` |
|---|---|---|
| Nuevo endpoint `GET /api/v1/reports/history` | MINOR de `info.version` | MINOR de `info.version` |
| Nuevo campo opcional en la respuesta de cursos | MINOR | MINOR |
| Renombrar `powerCampusName` en la respuesta | Permitido con `!` y frontend adaptado en el mismo PR (VER-11) | Requiere `/api/v2` (VER-08) |
| Cambiar un 422 por un 409 | Permitido con `!` | Requiere `/api/v2` |

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Conservación de iteraciones

| Iteración | Se conserva en | Estado |
|---|---|---|
| Iteración 1 (LocalStorage) | Rama `legacy/iteracion-1` y tags `v1.0-iteracion1` / `v1.0.0` (`a20730b`) | Rama y tag `v1.0-iteracion1`: Implementado. Bloqueo de rama y tag `v1.0.0`: [PV-18](README.md#7-decisiones-pendientes-de-validación) |
| Iteración 2 (Node.js + MongoDB) | Tags `v2.0.0-beta.1`, `v2.0.0-rc.N`, `v2.0.0` y, tras la entrega, `main` | Adoptado |

Después de la entrega, `main` contiene la Iteración 2. Para consultar o demostrar la Iteración 1 se usa `git switch legacy/iteracion-1` o `git switch --detach v1.0.0`; nunca se restauran archivos antiguos sobre `main`.

### 7.2 Protección de tags en GitHub

**Settings → Rules → Rulesets → New ruleset → New tag ruleset**:

- Nombre: `protect-release-tags`; *Enforcement status: Active*; *Bypass list* vacía salvo el dueño del repositorio (necesita crear los tags).
- *Target tags*: Include by pattern `v*`.
- Reglas: *Restrict updates*, *Restrict deletions*, *Block force pushes*.

Con esta regla, VER-03 y VER-07 pasan de ser un acuerdo a ser una restricción técnica. Su configuración forma parte de [PV-18](README.md#7-decisiones-pendientes-de-validación).

### 7.3 Relación con la base de datos y la configuración

- Las migraciones están numeradas y registradas en la colección `migrations` ([11](11-MONGODB.md)); las notas del release listan las migraciones nuevas (VER-12).
- Una variable de entorno nueva, renombrada o eliminada se menciona en las notas del release y en `.env.example` ([09](09-NODEJS-BACKEND.md)); renombrar o eliminar una variable es un cambio incompatible ([01](01-GIT-AND-COMMITS.md)).

## 8. Errores frecuentes

1. Usar tags ligeros (`git tag v2.0.0`): no guardan autor, fecha ni mensaje del hito.
2. Dejar que `npm version` cree el tag antes del *squash*: el tag queda apuntando a un commit que no existe en la integración.
3. Marcar la exposición como release final y luego necesitar correcciones: para eso existen `-rc.N`.
4. Mover un tag "porque solo faltaba un archivo": la versión evaluada deja de ser reproducible.
5. Confundir la versión de la aplicación (`2.0.0`) con la de la API (`/api/v1`): son independientes.
6. Borrar `legacy/iteracion-1` porque "ya está en el tag": la rama es el acuerdo explícito de conservación.

## 9. Checklist

- [ ] El tag sigue SemVer con prefijo `v` y es anotado con mensaje de hito y fecha.
- [ ] `package.json` tiene la misma versión que el tag, cambiada en un commit `chore(release)`.
- [ ] Las pre-releases se etiquetaron en `redesign/iteracion-2`; la versión final, en `main`.
- [ ] El pipeline estaba en verde en el commit etiquetado.
- [ ] El GitHub Release existe, con notas generadas, migraciones, variables nuevas y pendientes.
- [ ] Ningún tag publicado se movió ni se borró.
- [ ] `legacy/iteracion-1`, `v1.0-iteracion1` y `v1.0.0` siguen intactos.
- [ ] `info.version` de OpenAPI refleja los cambios del contrato.

## 10. Referencias

- Semantic Versioning 2.0.0: <https://semver.org/>
- Git, `git tag`: <https://git-scm.com/docs/git-tag>
- GitHub, About releases: <https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases>
- GitHub, Automatically generated release notes: <https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes>
- GitHub, About rulesets (tag rulesets): <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets>
- npm, `npm version`: <https://docs.npmjs.com/cli/commands/npm-version>
- Keep a Changelog 1.1.0: <https://keepachangelog.com/es-ES/1.1.0/>
- Conventional Commits 1.0.0: <https://www.conventionalcommits.org/en/v1.0.0/>
- Documento relacionado: [01 · Git y commits](01-GIT-AND-COMMITS.md), [02 · Ramas y PR](02-BRANCHING-AND-PR.md), [10 · API REST](10-REST-API.md).
