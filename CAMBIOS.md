# Historial de cambios

## v1.4.0 · Correcciones de la evidencia GA7-220501096-AA4-EV03

- **Inicio de sesión real**: nuevo `authService` que valida en `POST /api/auth/login` (modo conectado) o contra
  los usuarios de demostración con su contraseña (modo demostración). Antes cualquier correo y contraseña
  entraban. El rol lo asigna el sistema y los errores se muestran en el formulario.
- **Directorio de participantes conectado**: lista `GET /api/usuarios?rol=ASISTENTE` y registra con
  `POST /api/auth/registro` (contraseña temporal). La importación ahora lee de verdad el archivo CSV,
  valida cada fila e informa las rechazadas; la plantilla se descarga.
- **Directorio de instructores conectado**: `GET` y `POST /api/instructores`; "Nuevo curso" usa la lista real.
- **Certificados**: listado desde `GET /api/certificados`, verificación por código
  (`/api/certificados/verificar/{codigo}`) y exportación del listado a CSV.
- **Reportes**: reporte de ocupación con los cursos del sistema y exportación real a PDF (jsPDF) y Excel (CSV).
- **Calidad**: TypeScript en modo `strict` sin errores, 42 pruebas unitarias (antes 21).

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
