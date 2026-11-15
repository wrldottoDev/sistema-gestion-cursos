# Cómo contribuir

Guía rápida para los integrantes del equipo y para asistentes de IA. Las reglas completas y obligatorias están en [`docs/standards/`](docs/standards/README.md); este archivo solo resume el flujo.

## 1. Antes de empezar

1. Lea el [índice de estándares](docs/standards/README.md) y la [definición de terminado](docs/standards/23-DEFINITION-OF-DONE.md).
2. Ubique su historia en Jira (proyecto **SGC**) y su requerimiento en la ERS v1.1 (`docs/documento ERS v1.1.pdf`).
3. Revise la pantalla correspondiente en `wireframes/05-desktop/`, `06-tablet/` y `07-movil/`, y el Design System en `wireframes/04-design-system/`.

## 2. Flujo de trabajo

```bash
git switch redesign/iteracion-2
git pull --ff-only
git switch -c feat/SGC-131-review-inbox      # <tipo>/SGC-<n>-<descripción-en-inglés>

# … cambios pequeños y coherentes …
git add -p
git commit                                   # Conventional Commit en inglés + "Refs: SGC-131"

git fetch origin
git rebase origin/redesign/iteracion-2       # mantener la rama al día (solo ramas propias)
git push -u origin feat/SGC-131-review-inbox
```

Luego abra un Pull Request **hacia `redesign/iteracion-2`** (nunca hacia `main`) y complete la plantilla. Detalle en [01 · Git y commits](docs/standards/01-GIT-AND-COMMITS.md) y [02 · Ramas y PR](docs/standards/02-BRANCHING-AND-PR.md).

## 3. Ejemplo de commit

```text
feat(approval): add review inbox ordered by submission date

List courses in "in_development" status for Curriculum Development,
oldest first, with code or "pending code" marker.

Refs: SGC-131
```

## 4. Revisión

- Revisores (rotación del equipo): Otoniel revisa a Sebastián, Sebastián revisa a Valentina y Valentina revisa a Otoniel.
- Mínimo una aprobación; nadie aprueba su propio PR.
- Merge por **squash** hacia `redesign/iteracion-2`. `main` solo recibe la entrega aprobada de la iteración.

## 5. Herramientas

Configuradas en la raíz: [`.editorconfig`](.editorconfig), [`.prettierrc.json`](.prettierrc.json), [`eslint.config.js`](eslint.config.js). Se activan cuando exista `package.json` con sus dependencias de desarrollo (ver [18 · Calidad de código](docs/standards/18-CODE-QUALITY.md)). Instale las extensiones de EditorConfig, Prettier y ESLint en su editor.

## 6. Reglas que nunca se rompen

- No subir secretos (`.env`, claves de Google, Gemini, MongoDB o SMTP). Si ocurre, avise de inmediato y rote la clave.
- No borrar cursos físicamente: se cambian a `inactive` (RN-12).
- No confiar en la interfaz para la seguridad: todo permiso se valida en el servidor.
- No hacer `push --force` sobre `main`, `redesign/iteracion-2` ni `legacy/iteracion-1`.
- No modificar `legacy/iteracion-1`: conserva la entrega de la Iteración 1.
