# Flujo de trabajo y control de versiones

## Versionamiento local y remoto

| | Local (Git) | Remoto (GitHub) |
|---|---|---|
| Dónde vive | Carpeta `.git` en el equipo del desarrollador | Repositorio en github.com |
| Para qué | Registrar cambios con `git commit`, crear ramas, volver a versiones anteriores sin internet | Respaldo, trabajo en equipo, revisión con *pull requests* e integración continua |
| Comandos típicos | `git add`, `git commit`, `git switch -c`, `git log` | `git push`, `git pull`, *pull request*, *merge* |

## Ramas

```
main        Versión estable y entregable. Solo recibe fusiones desde develop.
develop     Integración de lo terminado en el sprint.
feature/*   Una rama por historia de usuario o tarea. Ej: feature/hu-09-inscripciones
fix/*       Corrección de errores. Ej: fix/fechas-zona-horaria
```

Ciclo de una tarea:

```bash
git switch develop
git pull
git switch -c feature/hu-10-cancelar-inscripcion
# ...cambios...
npm test && npm run build
git add .
git commit -m "feat: permite cancelar una inscripción"
git push -u origin feature/hu-10-cancelar-inscripcion
# En GitHub: pull request hacia develop → revisión → merge
# Al cerrar el sprint: pull request de develop hacia main
```

## Mensajes de commit

Formato `tipo: descripción en presente`:

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `test` | Pruebas |
| `docs` | Documentación |
| `refactor` | Cambio interno sin alterar el comportamiento |
| `style` | Formato o estilos visuales |
| `chore` | Configuración, dependencias |

## Herramientas por etapa

| Etapa | Herramienta | Uso en el proyecto |
|-------|-------------|--------------------|
| Codificación | VS Code, TypeScript, React, Vite | Desarrollo del frontend |
| Pruebas | Vitest (`npm test`) | Reglas de inscripción, roles, fechas, cliente HTTP |
| Versionamiento | Git + GitHub | Ramas y pull requests |
| Integración continua | GitHub Actions (`.github/workflows/ci.yml`) | En cada push o pull request: tipos, pruebas y compilación |
| Despliegue | Netlify o Vercel | Publicación del frontend desde `main` |
