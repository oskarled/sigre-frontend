# Cambios sugeridos para `sigre-modulo-cursos`

## 1. CORS (necesario para conectar el frontend)

1. Copia `CorsConfig.java` en `src/main/java/com/ecm/sigre/config/`.
2. Agrega al final de `src/main/resources/application.properties`:

```properties
# Origenes permitidos para el frontend (separados por comas)
sigre.cors.origenes=${SIGRE_CORS_ORIGENES:http://localhost:5173,http://localhost:4173}
```

3. Haz commit en una rama `feature/cors-frontend` y fusiónala a `develop` con un pull request.

Sin esto el navegador bloquea las peticiones del frontend (error de CORS en la consola).

## 2. Endpoints que el frontend necesita a continuación

| Prioridad | Endpoint | Para qué |
|-----------|----------|----------|
| Alta | `POST /api/auth/login` (JWT) | Iniciar sesión de verdad; el rol y el id del usuario saldrían del token |
| Alta | `GET /api/instructores` | Lista del selector "Instructor a cargo" al crear un curso |
| Media | `GET/POST /api/usuarios` | Directorio de participantes del administrador |
| Media | `GET /api/certificados` y `GET /api/usuarios/{id}/certificados` | Módulo de certificados |
| Baja | Campos `tipo`, `modalidad`, `costo`, `descripcion` en `CursoEvento` | Hoy solo existen en el modo demostración del frontend |
