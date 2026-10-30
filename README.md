# SIGRE · Frontend (ECM Training Center)

Interfaz web del **Sistema de Registro para Eventos (SIGRE)** de ECM Training Center.
Proyecto formativo SENA · Tecnología en Análisis y Desarrollo de Software · ficha 3134533.

| Capa | Tecnología | Repositorio |
|------|------------|-------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS 4 | este repositorio (`sigre-frontend`) |
| Backend | Spring Boot 3.2 + Java 17 + MySQL 8 | [`sigre-modulo-cursos`](https://github.com/oskarled/sigre-modulo-cursos) |

## Capturas

La carpeta [`docs/capturas`](docs/capturas) tiene la navegación completa de los tres roles
(participante, instructor y administrador) en modo demostración.

## Requisitos

- Node.js 20 o superior (recomendado 22 LTS)
- Para el modo conectado: el backend `sigre-modulo-cursos` corriendo en `http://localhost:8080`

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

### Modo demostración o conectado

La app elige la fuente de datos con la variable `VITE_API_URL`:

| `VITE_API_URL` | Modo | Para qué sirve |
|----------------|------|----------------|
| vacía (por defecto) | **Demostración**: datos en memoria con las mismas reglas del backend | Publicar en Netlify, mostrar sin servidor |
| `http://localhost:8080` | **Conectado**: consume la API REST de Spring Boot | Desarrollo e integración |

Para el modo conectado:

```bash
cp .env.example .env.local     # deja VITE_API_URL=http://localhost:8080
npm run dev
```

y en el backend (perfil `dev`, base de datos H2 con usuarios de demostración):

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

> El backend necesita la configuración de CORS incluida en `docs/backend/` para aceptar peticiones del frontend.

### Usuarios para entrar

Todavía no hay módulo de autenticación: se elige el rol en la pantalla de inicio y se escribe cualquier correo
y contraseña. Los usuarios son los mismos que crea `CargaDatosDemostracion` en el backend:

| Rol en pantalla | Rol en backend | Usuario | id_usuario | id_instructor |
|-----------------|----------------|---------|-----------:|--------------:|
| Participante | ASISTENTE | Maria Perez | 3 | — |
| Instructor | INSTRUCTOR | Carlos Ortega | 2 | 1 |
| Administrador | ADMIN | Laura Mendoza | 1 | — |

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run typecheck` | Revisión de tipos (TypeScript) |
| `npm run build` | Compilación para producción en `dist/` |
| `npm run preview` | Sirve la compilación localmente |

## Arquitectura

```
src/app/
  App.tsx                    Sesión, navegación y estado compartido (cursos e inscripciones)
  models/curso.ts            Tipos y reglas del dominio (iguales a los DTO del backend)
  services/http.ts           Cliente HTTP: URL base, JSON y errores ProblemDetail
  services/cursosService.ts  Contrato CursosService con dos implementaciones (API real y demostración)
  mocks/cursos.ts            Datos del modo demostración
  lib/roles.ts               Roles, menú por rol y permisos
  lib/dates.ts               Fechas sin desfase de zona horaria
  components/                Pantallas y diálogos
  components/ui/             Componentes base (shadcn/ui + Radix)
  __tests__/                 Pruebas unitarias
```

Las pantallas nunca llaman a `fetch` directamente: usan `cursosService`. Así se cambia de datos de prueba
a la API real sin tocar la interfaz.

### Endpoints que consume

| Método | Ruta | Pantalla |
|--------|------|----------|
| GET | `/api/cursos` | Inicio, Cursos |
| POST | `/api/cursos` | Nuevo curso (administrador) |
| POST | `/api/cursos/{id}/inscripciones` | Inscribirme (participante) |
| GET | `/api/cursos/{id}/inscripciones` | Detalle del curso y Mis participantes (instructor) |
| GET | `/api/usuarios/{id}/inscripciones` | Mis inscripciones (participante) |
| PATCH | `/api/inscripciones/{id}/cancelar` | Cancelar inscripción (participante) |

### Qué está conectado y qué sigue siendo de ejemplo

| Módulo | Estado |
|--------|--------|
| Cursos e inscripciones | Conectado a la API |
| Mis participantes (instructor) | Conectado (inscritos de sus cursos) |
| Inicio de sesión | Simulado: falta el módulo de autenticación (JWT) |
| Directorio de participantes e instructores | Datos de ejemplo: falta módulo de usuarios |
| Certificados y reportes | Datos de ejemplo: faltan endpoints |

## Flujo de trabajo con Git

Ver [CONTRIBUTING.md](CONTRIBUTING.md): ramas `main` / `develop` / `feature/*`, mensajes de commit y
revisión con GitHub Actions.

## Publicación

- **Netlify o Vercel** (modo demostración): conecta el repositorio; comando `npm run build`, carpeta `dist`.
- Para publicar el modo conectado, define `VITE_API_URL` con la URL pública del backend en la configuración
  del sitio y agrega ese dominio a `SIGRE_CORS_ORIGENES` en el backend.
