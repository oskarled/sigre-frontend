// Roles del sistema SIGRE y qué puede hacer cada uno.
// Toda la app consulta este archivo: si cambia una regla, se cambia aquí.

export type UserRole = "participante" | "instructor" | "administrador";

/** Nombre del rol en la tabla rol del backend. */
export const ROL_BACKEND: Record<UserRole, "ASISTENTE" | "INSTRUCTOR" | "ADMIN"> = {
  participante: "ASISTENTE",
  instructor: "INSTRUCTOR",
  administrador: "ADMIN",
};

export interface SessionUser {
  role: UserRole;
  /** id_usuario en el backend */
  idUsuario: number;
  /** id del registro en la tabla instructor (solo para instructores) */
  idInstructor?: number;
  nombre: string;
  email: string;
}

// Usuarios de demostración. Son los mismos que crea CargaDatosDemostracion en el backend
// (perfil dev). Cuando exista el módulo de autenticación (JWT), estos datos vendrán del token.
export const DEMO_USERS: Record<UserRole, Omit<SessionUser, "email">> = {
  participante: { role: "participante", idUsuario: 3, nombre: "Maria Perez" },
  instructor: { role: "instructor", idUsuario: 2, idInstructor: 1, nombre: "Carlos Ortega" },
  administrador: { role: "administrador", idUsuario: 1, nombre: "Laura Mendoza" },
};

export const ROLE_LABEL: Record<UserRole, string> = {
  participante: "Participante",
  instructor: "Instructor",
  administrador: "Administrador",
};

export type NavId =
  | "inicio"
  | "eventos"
  | "participantes"
  | "instructores"
  | "certificados"
  | "reportes";

interface NavItem {
  id: NavId;
  label: string;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  participante: [
    { id: "inicio", label: "INICIO" },
    { id: "eventos", label: "CURSOS" },
    { id: "certificados", label: "MIS CERTIFICADOS" },
  ],
  instructor: [
    { id: "inicio", label: "INICIO" },
    { id: "eventos", label: "MIS CURSOS" },
    { id: "participantes", label: "MIS PARTICIPANTES" },
    { id: "certificados", label: "CERTIFICADOS" },
  ],
  administrador: [
    { id: "inicio", label: "INICIO" },
    { id: "eventos", label: "CURSOS" },
    { id: "participantes", label: "PARTICIPANTES" },
    { id: "instructores", label: "INSTRUCTORES" },
    { id: "certificados", label: "CERTIFICADOS" },
    { id: "reportes", label: "REPORTES" },
  ],
};

export function navItemsFor(role: UserRole): NavItem[] {
  return NAV_BY_ROLE[role];
}

export function canAccess(role: UserRole, id: NavId): boolean {
  return NAV_BY_ROLE[role].some((item) => item.id === id);
}

// Acciones puntuales dentro de los módulos.
export const can = {
  gestionarEventos: (role: UserRole) => role === "administrador",
  verBorradores: (role: UserRole) => role === "administrador",
  inscribirse: (role: UserRole) => role === "participante",
  gestionarParticipantes: (role: UserRole) => role === "administrador",
  emitirCertificados: (role: UserRole) => role !== "participante",
};

// Compara nombres de instructor tolerando apellidos extra
// ("Ing. María González" vs "Ing. María González Pérez").
export function mismoInstructor(a: string, b: string): boolean {
  const x = a.trim().toLowerCase();
  const y = b.trim().toLowerCase();
  return x.startsWith(y) || y.startsWith(x);
}
