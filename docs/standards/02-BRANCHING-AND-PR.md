# 02 · Ramas y Pull Requests

> **Estado:** Vigente · **Versión:** 1.0.0 · **Última revisión:** 2026-11-14 · **Responsable:** equipo SGC

## 1. Propósito y alcance

Define el modelo de ramas, el ciclo de trabajo de una historia de Jira desde la rama hasta el merge, las reglas de los Pull Requests (PR), la revisión de código entre integrantes, la resolución de conflictos y la protección de las ramas en GitHub.

Fuera de alcance: formato de los mensajes de commit ([01](01-GIT-AND-COMMITS.md)); qué revisar dentro del código ([18](18-CODE-QUALITY.md#revisión-de-código)); criterios de terminado ([23](23-DEFINITION-OF-DONE.md)); tags y releases ([21](21-VERSIONING.md)).

## 2. Estándar adoptado

[GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) adaptado a iteraciones académicas: en lugar de integrar directamente en `main`, cada iteración tiene una **rama de integración** que recibe las ramas de historia mediante PR y que se entrega a `main` al cierre.

| Rama | Propósito | Recibe cambios por | Estado |
|---|---|---|---|
| `main` | Versión estable entregada. Solo contiene entregas aprobadas. | PR desde `redesign/iteracion-2` al cierre de la iteración (merge commit) o desde `hotfix/*` | Adoptado. Hoy apunta a `a20730b`, igual que `legacy/iteracion-1`. |
| `legacy/iteracion-1` | Conserva la entrega de la Iteración 1 (HTML, CSS, JS y LocalStorage). | Nunca. Rama congelada. | Implementado (existe); bloqueo pendiente (PV-18) |
| `redesign/iteracion-2` | Integración del rediseño de la Iteración 2. | PR desde ramas de historia (*squash merge*) | Implementado (existe); protección pendiente (PV-18) |
| `<type>/SGC-<n>-<desc>` | Una historia o tarea de Jira. Vida corta. | Commits del autor | Adoptado |
| `hotfix/SGC-<n>-<desc>` | Corrección urgente sobre una versión ya entregada en `main`. | Commits del autor | Adoptado |

```text
legacy/iteracion-1   a20730b ───────────────────────────────────────────── (congelada)
main                 a20730b (v1.0-iteracion1) ──────────────────────●── v2.0.0 (merge commit)
                        │                                             │
redesign/iteracion-2    └── 731c863 ──●──────●──────●──── … ──────────┘
                                      ▲      ▲      ▲
                                 squash  squash  squash   (un commit por historia)
feat/SGC-131-review-inbox ────────────┘      │      │
fix/SGC-135-approval-rollback ───────────────┘      │
feat/SGC-48-google-sign-in ─────────────────────────┘
```

## 3. Justificación

- **`main` siempre entregable.** El docente y cualquier revisor externo ven en `main` la última versión aprobada, no trabajo en curso.
- **Conservación de la Iteración 1.** El rediseño eliminó el frontend anterior; `legacy/iteracion-1` y el tag `v1.0-iteracion1` permiten consultar o demostrar la primera entrega sin depender del historial de `main`.
- **Integración frecuente y segura.** Tres personas trabajan en paralelo sobre módulos distintos durante tres semanas; ramas cortas contra una rama de integración común reducen conflictos grandes al final.
- **Historial limpio.** El *squash merge* deja un commit por historia en la rama de integración, con el título del PR en Conventional Commits ([01](01-GIT-AND-COMMITS.md)); el merge commit hacia `main` preserva ese historial y marca la entrega.
- **Revisión obligatoria.** La ERS (§7.3) y `docs/ESTADO.md` ya exigen que otro integrante revise cada historia antes de integrarla.

## 4. Reglas

### 4.1 Obligatorias (DEBE)

| ID | Regla |
|---|---|
| BR-01 | Todo cambio DEBE llegar a `redesign/iteracion-2` y a `main` mediante PR. Nadie hace `push` directo a esas ramas. |
| BR-02 | Las ramas de historia DEBEN crearse desde `redesign/iteracion-2` actualizada y abrir el PR contra `redesign/iteracion-2` (seleccionando la base explícitamente: la rama por defecto del repositorio es `main`). |
| BR-03 | El nombre de rama DEBE seguir `<type>/SGC-<n>-<short-desc-en>` ([§5](#5-nomenclatura)). No se usan nombres de personas. |
| BR-04 | Una rama DEBE corresponder a una sola historia o tarea de Jira. |
| BR-05 | El título del PR DEBE ser un encabezado Conventional Commit válido ([01](01-GIT-AND-COMMITS.md)), sin ID de Jira: será el mensaje del *squash*. |
| BR-06 | El cuerpo del PR DEBE completar la plantilla [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md), incluida la historia de Jira, la trazabilidad (RF/RN, criterios, pantallas, endpoints, pruebas) y la evidencia. |
| BR-07 | Un PR DEBE tener al menos **1 aprobación** de otro integrante antes del merge. Los PR hacia `main` y los que cambian estándares o ADR DEBEN tener la aprobación de **los otros dos** integrantes. |
| BR-08 | Antes del merge DEBEN cumplirse: CI en verde (cuando exista, [19](19-CI-CD.md)), conversaciones resueltas, rama actualizada con la base y checklist de la [Definición de terminado](23-DEFINITION-OF-DONE.md) marcado. |
| BR-09 | Los PR hacia `redesign/iteracion-2` DEBEN integrarse con **Squash and merge**. Los PR de `redesign/iteracion-2` hacia `main` DEBEN integrarse con **Create a merge commit**. |
| BR-10 | Al hacer el *squash*, quien integra DEBE dejar el título del PR como encabezado y conservar en el cuerpo el footer `Closes: SGC-n` o `Refs: SGC-n`, eliminando la lista de commits intermedios si no aporta. |
| BR-11 | NO DEBE hacerse `push --force` ni reescribirse el historial de `main`, `redesign/iteracion-2` ni `legacy/iteracion-1`. |
| BR-12 | `legacy/iteracion-1` NO DEBE recibir commits, borrarse ni moverse. |
| BR-13 | El autor NO DEBE aprobar su propio PR ni hacer merge sin la aprobación requerida, aunque la protección de ramas aún no esté configurada. |
| BR-14 | La rama de historia DEBE borrarse después del merge. |

### 4.2 Recomendadas (DEBERÍA)

| ID | Regla |
|---|---|
| BR-15 | Una rama de historia DEBERÍA vivir 3 días o menos. Si la historia es más grande, se divide en PR incrementales que dejen la aplicación funcionando. |
| BR-16 | Un PR DEBERÍA cambiar 400 líneas o menos de código fuente (sin contar lockfile, imágenes ni datos de prueba). |
| BR-17 | El revisor asignado DEBERÍA responder en menos de 24 horas. Si no responde en ese plazo, el tercer integrante PUEDE revisar en su lugar. En la semana del avance (29 nov) y de la exposición (2 dic) el plazo DEBERÍA ser de 4 horas hábiles. |
| BR-18 | Para actualizar una rama propia con la base se DEBERÍA usar `git rebase origin/redesign/iteracion-2` seguido de `git push --force-with-lease`. Si la rama la comparten dos personas, se usa `git merge` en su lugar. |
| BR-19 | Se DEBERÍA abrir el PR como **Draft** en cuanto exista un primer avance, para recibir comentarios tempranos. |
| BR-20 | Los comentarios de revisión DEBERÍAN usar los prefijos de [§5.3](#53-prefijos-de-comentarios-de-revisión). |
| BR-21 | La tarjeta de Jira DEBERÍA moverse a *In Review* al pedir revisión y a *Done* solo después del merge. |

### 4.3 Opcionales (PUEDE)

| ID | Regla |
|---|---|
| BR-22 | Durante la Iteración 2 el dueño del repositorio PUEDE cambiar la rama por defecto a `redesign/iteracion-2` para que los PR apunten a ella automáticamente; se restaura `main` al entregar. |
| BR-23 | Se PUEDE usar `gh pr create` y `gh pr merge --squash` en lugar de la interfaz web. |
| BR-24 | Se PUEDE crear una rama sin ID de Jira solo para mantenimiento que no corresponde a una historia (`docs/standards-git-conventions`, `chore/cleanup-ds-store`). |

## 5. Nomenclatura

### 5.1 Ramas

Formato: `<type>/SGC-<n>-<short-desc-en>`, todo en minúsculas salvo `SGC`, palabras en inglés separadas por guiones, máximo 50 caracteres. `<type>` usa los tipos de [01 §5.1](01-GIT-AND-COMMITS.md#51-tipos).

| Correcto | Incorrecto | Problema |
|---|---|---|
| `feat/SGC-131-review-inbox` | `SGC-222-otoniel-usuarios` | Nombre de persona y sin tipo |
| `fix/SGC-135-approval-rollback` | `fix-director-dos-escuelas` | Sin Jira, en español |
| `feat/SGC-48-google-sign-in` | `feature/SGC-48` | Tipo no estándar, sin descripción |
| `test/SGC-168-role-negative-tests` | `Test/SGC-168_Pruebas` | Mayúsculas, guion bajo, español |
| `hotfix/SGC-240-session-expiry` | `hotfix` | Sin historia ni descripción |

### 5.2 Pull Requests

- Título: encabezado Conventional Commit (`feat(approval): add review inbox ordered by submission date`).
- Cuerpo: plantilla del repositorio, con `Historia: SGC-131` en la sección Jira.
- PR de entrega a `main`: `chore(release): deliver iteration 2 (v2.0.0)`.

### 5.3 Prefijos de comentarios de revisión

| Prefijo | Significado | ¿Bloquea el merge? |
|---|---|---|
| `bloqueante:` | Viola un estándar, un criterio de aceptación, la seguridad o rompe algo | Sí |
| `pregunta:` | El revisor necesita entender una decisión antes de aprobar | Sí, hasta que se responda |
| `sugerencia:` | Mejora opcional; el autor decide | No |
| `nit:` | Detalle menor (nombre, redacción de comentario) | No |

Cuando un comentario cita una regla, usa su ID (`bloqueante: viola SEC-…`, `nit: GIT-03`).

## 6. Ejemplos

### 6.1 Ciclo completo de una historia (correcto)

```bash
# 1. Partir de la integración actualizada
git switch redesign/iteracion-2
git pull --ff-only

# 2. Crear la rama de la historia SGC-131 (RF-031 Bandeja de revisión)
git switch -c feat/SGC-131-review-inbox

# 3. Trabajar con commits atómicos (ver 01)
git add backend/src/modules/courses frontend/pages
git commit -m "feat(approval): add review inbox endpoint" -m "Refs: SGC-131"

# 4. Actualizar con la base antes de pedir revisión (rama propia)
git fetch origin
git rebase origin/redesign/iteracion-2
npm run lint && npm test          # cuando existan los scripts (18)
git push --force-with-lease -u origin feat/SGC-131-review-inbox

# 5. Abrir el PR contra la integración (nunca contra main)
gh pr create --base redesign/iteracion-2 --draft \
  --title "feat(approval): add review inbox ordered by submission date"

# 6. Tras la aprobación y con CI en verde: squash, conservando el footer
gh pr merge --squash --delete-branch

# 7. Limpiar localmente
git switch redesign/iteracion-2 && git pull --ff-only
git branch -d feat/SGC-131-review-inbox
```

### 6.2 Incorrecto

```bash
git switch main
git commit -am "bandeja lista"
git push origin main                 # push directo a main (BR-01), mensaje inválido (01)

git push --force origin redesign/iteracion-2   # reescribe la integración (BR-11)

gh pr create --title "SGC-131"       # base main por defecto (BR-02), título no es Conventional Commit (BR-05)
```

### 6.3 Resolución de conflictos

```bash
git fetch origin
git rebase origin/redesign/iteracion-2
# Git se detiene en el primer conflicto:
git status                           # ver archivos en conflicto
# Editar cada archivo y resolver entendiendo AMBOS lados; si el código es de otro integrante, consultarle.
git add <archivo>
git rebase --continue

# Conflicto en package-lock.json: resolver package.json a mano y regenerar el lockfile
git checkout origin/redesign/iteracion-2 -- package-lock.json
npm install
git add package.json package-lock.json
git rebase --continue

# Verificar antes de publicar
npm run lint && npm test
git push --force-with-lease          # solo en la rama propia
```

Si el rebase se complica, `git rebase --abort` devuelve la rama a su estado anterior; se puede usar `git merge origin/redesign/iteracion-2` como alternativa.

### 6.4 Entrega de la iteración a `main`

```bash
gh pr create --base main --head redesign/iteracion-2 \
  --title "chore(release): deliver iteration 2 (v2.0.0)"
# Aprobación de los otros dos integrantes; CI en verde.
gh pr merge --merge                  # merge commit, no squash (BR-09)
# El tag v2.0.0 se crea sobre el merge commit según 21-VERSIONING.md
```

### 6.5 Hotfix sobre una versión entregada

```bash
git switch main && git pull --ff-only
git switch -c hotfix/SGC-240-session-expiry
# corrección + prueba
gh pr create --base main --title "fix(auth): expire idle sessions after 30 minutes"
# Tras el merge: tag PATCH (21) y llevar la corrección a la integración si sigue activa
git switch redesign/iteracion-2 && git pull --ff-only
git merge origin/main                # mediante PR si la integración está protegida
```

## 7. Aplicación en el sistema CENFOTEC

### 7.1 Revisores

Rotación acordada en `docs/ESTADO.md` (Adoptado, acuerdo previo del equipo):

| Autor | Revisor asignado |
|---|---|
| Sebastián Fernández | Otoniel González |
| Valentina Cristancho | Sebastián Fernández |
| Otoniel González | Valentina Cristancho |

El revisor asignado se agrega en el campo *Reviewers* del PR. El tercer integrante puede revisar si el asignado no responde (BR-17). Los PR a `main` y los de estándares requieren a los dos.

### 7.2 Estado actual del repositorio (auditoría del 14 nov 2026)

| Aspecto | Estado | Acción |
|---|---|---|
| Protección de `main` | Sin protección (GitHub responde *Branch not protected*) | Configurar según §7.3 (PV-18) |
| Protección de `redesign/iteracion-2` | Sin protección | Configurar según §7.3 (PV-18) |
| `legacy/iteracion-1` | Existe en `a20730b`, sin bloqueo | Bloquear según §7.3 (PV-18) |
| Métodos de merge | Merge commit, squash y rebase habilitados | Deshabilitar *rebase merge* |
| Ramas remotas ya integradas | `SGC-222-otoniel-usuarios`, `SGC-231-maquetacion-cursos`, `SGC-73-catalogos`, `fix-director-dos-escuelas` (PR #1–#4) | Borrarlas tras verificar con `git branch -r --merged origin/main` |
| Visibilidad | Pública | Las reglas de protección están disponibles sin plan de pago |

Las acciones de esta tabla son **Pendiente de validación** ([PV-18](README.md#7-decisiones-pendientes-de-validación)): requieren permisos de administrador del repositorio.

### 7.3 Configuración de GitHub

**Settings → General → Pull Requests**

- [x] Allow merge commits (para `main`).
- [x] Allow squash merging, con *Default commit message: Pull request title and commit details*.
- [ ] Allow rebase merging (deshabilitar).
- [x] Always suggest updating pull request branches.
- [x] Automatically delete head branches.

**Settings → Rules → Rulesets → New ruleset → New branch ruleset** (una regla por fila):

| Ruleset | Target (Include by pattern) | Reglas a activar |
|---|---|---|
| `protect-main` | `main` | Restrict deletions · Block force pushes · Require a pull request before merging (Required approvals: **2**; Dismiss stale pull request approvals when new commits are pushed; Require conversation resolution before merging; Allowed merge methods: Merge) · Require status checks to pass (`lint`, `test` cuando exista CI; Require branches to be up to date) |
| `protect-integration` | `redesign/iteracion-2` | Restrict deletions · Block force pushes · Require a pull request before merging (Required approvals: **1**; Dismiss stale approvals; Require conversation resolution; Allowed merge methods: Squash) · Require status checks to pass (cuando exista CI) |
| `freeze-legacy` | `legacy/iteracion-1` | Restrict updates · Restrict deletions · Block force pushes |

En cada ruleset: *Enforcement status: Active* y lista de *Bypass* vacía (nadie, ni el dueño, se salta las reglas). Si se prefiere la protección clásica (**Settings → Branches → Add branch protection rule**), las opciones equivalentes son *Require a pull request before merging*, *Require status checks*, *Require conversation resolution*, *Do not allow bypassing the above settings* y, para `legacy/iteracion-1`, *Lock branch*. La protección de tags se describe en [21](21-VERSIONING.md).

## 8. Errores frecuentes

1. Abrir el PR contra `main` porque es la rama por defecto: el cambio quedaría fuera de la integración y adelantaría código no entregado a `main`.
2. Usar *Squash and merge* hacia `main`: aplasta todo el historial de la iteración en un solo commit.
3. Hacer `git push --force` (sin `--with-lease`) y sobrescribir commits que un compañero subió a la misma rama.
4. Resolver conflictos aceptando "lo mío" en bloque sin ejecutar pruebas.
5. Aprobar un PR sin ejecutarlo ni revisar la evidencia; la aprobación certifica la [Definición de terminado](23-DEFINITION-OF-DONE.md).
6. Dejar la rama de historia abierta durante una semana: los conflictos crecen con cada merge de los demás.
7. Borrar el footer `Closes: SGC-n` al editar el mensaje del *squash*, lo que rompe la trazabilidad con Jira.
8. Hacer commits en `legacy/iteracion-1` para "arreglar" la entrega anterior.

## 9. Checklist

**Autor, antes de pedir revisión**

- [ ] La rama sigue `<type>/SGC-<n>-<desc>` y parte de `redesign/iteracion-2` actualizada.
- [ ] La base del PR es `redesign/iteracion-2` (o `main` solo para entrega o hotfix).
- [ ] El título es un Conventional Commit válido sin ID de Jira.
- [ ] La plantilla está completa: historia, trazabilidad, cómo probar, evidencia, riesgos.
- [ ] La rama está actualizada con la base y lint/pruebas pasan localmente.
- [ ] El revisor asignado según la rotación está agregado.

**Revisor**

- [ ] Ejecuté o verifiqué la evidencia de los pasos de "Cómo probar".
- [ ] Revisé el código con el checklist de [18](18-CODE-QUALITY.md#revisión-de-código).
- [ ] Mis comentarios usan los prefijos de §5.3.

**Quien integra**

- [ ] Aprobaciones requeridas, conversaciones resueltas y CI en verde.
- [ ] Método correcto: *squash* hacia la integración, *merge commit* hacia `main`.
- [ ] El mensaje final conserva el título y el footer `Closes:`/`Refs: SGC-n`.
- [ ] La rama se borró y la tarjeta de Jira pasó a *Done*.

## 10. Referencias

- GitHub Flow: <https://docs.github.com/en/get-started/using-github/github-flow>
- About protected branches: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches>
- About rulesets: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets>
- About merge methods on GitHub: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github>
- Creating a pull request template: <https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository>
- Git `push --force-with-lease`: <https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt>
- Documento relacionado: [01 · Git y commits](01-GIT-AND-COMMITS.md), [18 · Calidad de código](18-CODE-QUALITY.md), [21 · Versionado](21-VERSIONING.md), [23 · Definición de terminado](23-DEFINITION-OF-DONE.md).
