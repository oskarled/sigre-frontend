// Servicio de autenticación de SIGRE.
// Con backend (VITE_API_URL) valida las credenciales en POST /api/auth/login del módulo
// sigre-modulo-cursos. Sin backend valida contra los mismos usuarios de demostración que
// crea CargaDatosDemostracion (perfil dev), con su misma contraseña.

import { ApiError, apiFetch, usaBackend } from "./http";
import type { SessionUser, UserRole } from "../lib/roles";

/** Respuesta de POST /api/auth/login (LoginResponse del backend). */
export interface LoginResponse {
  mensaje: string;
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: "ASISTENTE" | "INSTRUCTOR" | "ADMIN";
  idInstructor: number | null;
}

/** Contraseña de los usuarios de demostración (CargaDatosDemostracion.CONTRASENA_DEMO). */
export const CONTRASENA_DEMO = "Sigre2026";

/** Usuarios de demostración: mismos ids, nombres y correos que el backend en perfil dev. */
export const CREDENCIALES_DEMO: ReadonlyArray<LoginResponse> = [
  { mensaje: "", idUsuario: 3, nombre: "Maria Perez", correo: "maria.perez@correo.com", rol: "ASISTENTE", idInstructor: null },
  { mensaje: "", idUsuario: 2, nombre: "Carlos Ortega", correo: "carlos.ortega@ecm.com", rol: "INSTRUCTOR", idInstructor: 1 },
  { mensaje: "", idUsuario: 1, nombre: "Elkin Caicedo", correo: "elkin.caicedo@ecm.com", rol: "ADMIN", idInstructor: null },
];

const ROL_FRONTEND: Record<LoginResponse["rol"], UserRole> = {
  ASISTENTE: "participante",
  INSTRUCTOR: "instructor",
  ADMIN: "administrador",
};

/** Mensaje que se muestra cuando el correo o la contraseña no coinciden. */
export const MENSAJE_CREDENCIALES = "Correo o contraseña incorrectos";

/** Convierte la respuesta del backend en el usuario de sesión que usa la aplicación. */
export function aSesion(datos: LoginResponse): SessionUser {
  return {
    role: ROL_FRONTEND[datos.rol],
    idUsuario: datos.idUsuario,
    idInstructor: datos.idInstructor ?? undefined,
    nombre: datos.nombre,
    email: datos.correo,
  };
}

/** Busca el correo de demostración que corresponde a un rol (para autocompletar el formulario). */
export function correoDemo(rol: UserRole): string {
  const encontrado = CREDENCIALES_DEMO.find((u) => ROL_FRONTEND[u.rol] === rol);
  return encontrado?.correo ?? "";
}

/**
 * Inicia sesión y devuelve el usuario autenticado con el rol que asigna el sistema.
 * Lanza ApiError(401) si las credenciales no son válidas.
 */
export async function iniciarSesion(correo: string, contrasena: string): Promise<SessionUser> {
  const correoNormalizado = correo.trim().toLowerCase();

  if (usaBackend) {
    try {
      const datos = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo: correoNormalizado, contrasena }),
      });
      return aSesion(datos);
    } catch (error) {
      // El backend responde 401 sin detallar cuál dato falló; se muestra un mensaje genérico.
      if (error instanceof ApiError && error.status === 401) {
        throw new ApiError(MENSAJE_CREDENCIALES, 401);
      }
      throw error;
    }
  }

  // Modo demostración: mismas credenciales que el backend en perfil dev.
  const usuario = CREDENCIALES_DEMO.find((u) => u.correo === correoNormalizado);
  if (!usuario || contrasena !== CONTRASENA_DEMO) {
    throw new ApiError(MENSAJE_CREDENCIALES, 401);
  }
  return aSesion(usuario);
}
