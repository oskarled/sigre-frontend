# Historial de cambios

## v1.3.0 · Evidencia GA7-220501096-AA4-EV03

- **Comentarios en el código**: cada componente tiene un comentario de documentación (JSDoc) que explica su
  propósito, los datos que recibe y el rol que lo usa; se comentaron los manejadores de `App`, los filtros de
  `EventManagement` y la lógica de inscripción de `EventsTable`.
- **Paginación**: los botones anterior/siguiente mostraban dos flechas; ahora muestran una y tienen
  `aria-label`. La página activa se marca con `aria-current`.
- Versión visible en el login y en Ajustes actualizada a v1.3.
- Capturas de la navegación por rol en `docs/capturas`.

## v1.2.0 · Base oficial conectada al backend

- **Modelo alineado con `sigre-modulo-cursos`**: `CursoEvento`, `Inscripcion`, estados `PROGRAMADO`,
  `EN_CURSO`, `FINALIZADO`, `CANCELADO` e inscripción `PENDIENTE`, `PAGADO`, `APROBADO`, `NO_APROBADO`, `CANCELADO`.
- **Capa de servicios** (`src/app/services`): las pantallas usan `cursosService`, que habla con la API REST
  si existe `VITE_API_URL` o con datos de demostración si no. Los errores del backend (ProblemDetail) se muestran
  como mensajes legibles.
- **Funciones nuevas conectadas a la API**: crear curso (administrador), inscribirse y cancelar inscripción
  (participante), ver inscritos de cada curso y "Mis participantes" (instructor).
- **Formulario "Nuevo curso"** con los mismos campos y validaciones que `CursoEventoRequest`.
- **Error corregido**: los campos `Input` y `Textarea` no reenviaban la referencia (`ref`), así que
  los formularios con react-hook-form no leían lo escrito (venía del código original de Figma Make).
- **Pruebas** con Vitest (21 pruebas) e **integración continua** con GitHub Actions.
- Documentación: README, flujo de ramas (CONTRIBUTING.md), `.env.example` y cambios sugeridos al backend
  (`docs/backend`).
- Usuarios de demostración iguales a los del backend: Maria Perez, Carlos Ortega y Elkin Caicedo.

## v1.1.0 · Revisión del prototipo de Figma Make

- Permisos por rol (participante, instructor, administrador) y menú según el rol.
- Un solo estado y una sola fecha por curso; fechas sin desfase de zona horaria.
- Estadísticas calculadas a partir de los datos.
- Búsqueda y paginación reales; validación en el login y en los formularios.
- Mapa de contacto corregido, contraste de colores, diseño adaptable a móvil.
- Eliminado código sin uso.
