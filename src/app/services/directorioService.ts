// Servicio del directorio de participantes, instructores y certificados.
// Con backend usa GET /api/usuarios?rol=ASISTENTE, POST /api/auth/registro, GET /api/certificados
// y GET /api/certificados/verificar/{codigo}. Sin backend trabaja con los datos de demostración.

import { ApiError, apiFetch, usaBackend } from "./http";
import { mockParticipants, type Participant } from "../components/ParticipantsTable";
import { mockCertificates, type Certificate } from "../components/CertificateManagementNew";
import { formatDateShort } from "../lib/dates";
import { mockInstructors, type Instructor } from "../components/InstructorsTable";
import type { CursoEvento } from "../models/curso";

/** Respuesta de GET /api/usuarios (UsuarioResponse, sin contraseña). */
export interface UsuarioResponse {
  id: number;
  nombre: string;
  correo: string;
  documento: string | null;
  telefono: string | null;
  rol: string;
  activo: boolean;
  fechaRegistro: string;
}

/** Respuesta de las rutas de certificados (CertificadoResponse). */
export interface CertificadoResponse {
  id: number;
  codigo: string;
  fechaEmision: string;
  idInscripcion: number;
  idUsuario: number;
  nombreParticipante: string;
  documentoParticipante: string | null;
  idCurso: number;
  nombreCurso: string;
  duracionHoras: number;
  nombreInstructor: string;
}

/** Datos mínimos para registrar un participante (RegistroRequest del backend). */
export interface NuevoParticipante {
  nombre: string;
  correo: string;
  documento: string;
  telefono: string;
  empresa?: string;
  cargo?: string;
  curso?: string;
}

/** Convierte un usuario del backend en la fila del directorio. */
export function usuarioAParticipante(u: UsuarioResponse): Participant {
  return {
    id: u.id,
    nombre: u.nombre,
    documento: u.documento ?? "—",
    curso: "—",
    email: u.correo,
    telefono: u.telefono ?? "—",
    empresa: "—",
    cargo: "—",
    fechaRegistro: u.fechaRegistro ? formatDateShort(u.fechaRegistro.slice(0, 10)) : "—",
    estado: u.activo ? "Activo" : "Inactivo",
  };
}

/** Convierte un certificado del backend en la fila del módulo de certificados. */
export function certificadoAFila(c: CertificadoResponse): Certificate {
  return {
    id: c.id,
    participante: c.nombreParticipante,
    curso: c.nombreCurso,
    fechaEmision: formatDateShort(c.fechaEmision.slice(0, 10)),
    estado: "emitido",
    instructor: c.nombreInstructor,
    calificacion: "100",
    codigo: c.codigo,
  };
}

/**
 * Contraseña temporal para un participante registrado por el administrador.
 * Cumple la regla del backend: 8 a 64 caracteres con letras y números.
 */
export function contrasenaTemporal(documento: string): string {
  const digitos = documento.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `Ecm${digitos}${new Date().getFullYear()}`;
}

/** Lista los participantes (usuarios con rol ASISTENTE). */
export async function listarParticipantes(): Promise<Participant[]> {
  if (!usaBackend) return [...mockParticipants];
  const usuarios = await apiFetch<UsuarioResponse[]>("/api/usuarios?rol=ASISTENTE");
  return usuarios.map(usuarioAParticipante);
}

/**
 * Registra un participante. Con backend crea la cuenta en POST /api/auth/registro con una
 * contraseña temporal y devuelve la fila creada junto con esa contraseña.
 */
export async function registrarParticipante(
  datos: NuevoParticipante,
): Promise<{ participante: Participant; contrasena: string }> {
  const contrasena = contrasenaTemporal(datos.documento);
  if (usaBackend) {
    const creado = await apiFetch<UsuarioResponse>("/api/auth/registro", {
      method: "POST",
      body: JSON.stringify({
        nombre: datos.nombre,
        correo: datos.correo.trim().toLowerCase(),
        contrasena,
        documento: datos.documento.replace(/\D/g, ""),
        telefono: datos.telefono.replace(/[^0-9+ ]/g, ""),
      }),
    });
    return {
      participante: { ...usuarioAParticipante(creado), empresa: datos.empresa || "—", cargo: datos.cargo || "—", curso: datos.curso || "—" },
      contrasena,
    };
  }
  return {
    participante: {
      id: Date.now(),
      nombre: datos.nombre,
      documento: datos.documento,
      curso: datos.curso || "—",
      email: datos.correo,
      telefono: datos.telefono,
      empresa: datos.empresa || "—",
      cargo: datos.cargo || "—",
      fechaRegistro: formatDateShort(new Date().toISOString().slice(0, 10)),
      estado: "Activo",
    },
    contrasena,
  };
}

/** Lista los certificados emitidos. */
export async function listarCertificados(): Promise<Certificate[]> {
  if (!usaBackend) return [...mockCertificates];
  const certificados = await apiFetch<CertificadoResponse[]>("/api/certificados");
  return certificados.map(certificadoAFila);
}

/**
 * Verifica la autenticidad de un certificado por su código (por ejemplo ECM-2026-4F7A9C2B).
 * Lanza ApiError(404) si el código no existe.
 */
export async function verificarCertificado(codigo: string): Promise<Certificate> {
  const limpio = codigo.trim().toUpperCase();
  if (!limpio) throw new ApiError("Escriba el código del certificado", 400);
  if (usaBackend) {
    const c = await apiFetch<CertificadoResponse>(`/api/certificados/verificar/${encodeURIComponent(limpio)}`);
    return certificadoAFila(c);
  }
  const encontrado = mockCertificates.find((c) => c.codigo === limpio && c.estado === "emitido");
  if (!encontrado) throw new ApiError(`No existe un certificado emitido con el código ${limpio}`, 404);
  return encontrado;
}

// ------------------------------------------------------------------ Instructores

/** Respuesta de GET /api/instructores (InstructorResponse). */
export interface InstructorResponse {
  id: number;
  idUsuario: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  especialidad: string;
  licenciaSst: string | null;
}

/** Convierte un instructor del backend en la fila del directorio; cuenta sus cursos activos. */
export function instructorAFila(i: InstructorResponse, cursos: CursoEvento[] = []): Instructor {
  return {
    id: i.id,
    nombre: i.nombre,
    documento: "—",
    especialidad: i.especialidad,
    titulo: i.licenciaSst ? `Licencia SST ${i.licenciaSst}` : "—",
    email: i.correo,
    telefono: i.telefono ?? "—",
    aniosExperiencia: "—",
    certificaciones: i.licenciaSst ? 1 : 0,
    cursosActivos: cursos.filter((c) => c.idInstructor === i.id && (c.estado === "PROGRAMADO" || c.estado === "EN_CURSO")).length,
    estado: "Activo",
    fechaRegistro: "—",
  };
}

/** Lista los instructores (GET /api/instructores) o los de demostración. */
export async function listarInstructoresDirectorio(cursos: CursoEvento[] = []): Promise<Instructor[]> {
  if (!usaBackend) return [...mockInstructors];
  const lista = await apiFetch<InstructorResponse[]>("/api/instructores");
  return lista.map((i) => instructorAFila(i, cursos));
}

/**
 * Registra un instructor. Con backend usa POST /api/instructores, que crea también su usuario con
 * rol INSTRUCTOR; se envía una contraseña temporal que se muestra al administrador.
 */
export async function registrarInstructor(datos: Instructor): Promise<{ instructor: Instructor; contrasena: string }> {
  const contrasena = contrasenaTemporal(datos.documento || datos.telefono || "0000");
  if (!usaBackend) return { instructor: datos, contrasena };
  const creado = await apiFetch<InstructorResponse>("/api/instructores", {
    method: "POST",
    body: JSON.stringify({
      nombre: datos.nombre,
      correo: datos.email.trim().toLowerCase(),
      contrasena,
      telefono: datos.telefono.replace(/[^0-9+ ]/g, ""),
      especialidad: datos.especialidad,
      licenciaSst: datos.titulo?.slice(0, 40) || null,
    }),
  });
  return { instructor: { ...instructorAFila(creado), documento: datos.documento, aniosExperiencia: datos.aniosExperiencia }, contrasena };
}
