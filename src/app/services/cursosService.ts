// Servicio de cursos e inscripciones.
//
// Las pantallas solo conocen la interfaz CursosService. Hay dos implementaciones:
//  - httpCursosService: consume la API de sigre-modulo-cursos (Spring Boot + MySQL).
//  - crearServicioDemo(): guarda los datos en memoria y aplica las mismas reglas del backend.
// Se usa la primera si existe VITE_API_URL; si no, la segunda.

import { apiFetch, ApiError, usaBackend } from "./http";
import { inscripcionActiva, type CursoEvento, type CursoEventoRequest, type Inscripcion } from "../models/curso";
import { asistentesDemo, cursosDemo, inscripcionesDemo, instructoresDemo } from "../mocks/cursos";

export interface InstructorOpcion {
  id: number;
  nombre: string;
}

export interface CursosService {
  listarCursos(): Promise<CursoEvento[]>;
  crearCurso(datos: CursoEventoRequest): Promise<CursoEvento>;
  inscribir(idCurso: number, idUsuario: number): Promise<Inscripcion>;
  cancelarInscripcion(idInscripcion: number): Promise<Inscripcion>;
  inscripcionesDeUsuario(idUsuario: number): Promise<Inscripcion[]>;
  inscripcionesDeCurso(idCurso: number): Promise<Inscripcion[]>;
  listarInstructores(): Promise<InstructorOpcion[]>;
}

// ---------------------------------------------------------------- API real

export const httpCursosService: CursosService = {
  listarCursos: () => apiFetch<CursoEvento[]>("/api/cursos"),

  crearCurso: (datos) => apiFetch<CursoEvento>("/api/cursos", { method: "POST", body: JSON.stringify(datos) }),

  inscribir: (idCurso, idUsuario) =>
    apiFetch<Inscripcion>(`/api/cursos/${idCurso}/inscripciones`, {
      method: "POST",
      body: JSON.stringify({ idUsuario }),
    }),

  cancelarInscripcion: (idInscripcion) =>
    apiFetch<Inscripcion>(`/api/inscripciones/${idInscripcion}/cancelar`, { method: "PATCH" }),

  inscripcionesDeUsuario: (idUsuario) => apiFetch<Inscripcion[]>(`/api/usuarios/${idUsuario}/inscripciones`),

  inscripcionesDeCurso: (idCurso) => apiFetch<Inscripcion[]>(`/api/cursos/${idCurso}/inscripciones`),

  // El backend todavía no expone GET /api/instructores. Mientras tanto se usan los
  // instructores que ya tienen cursos y, si no hay ninguno, el instructor de demostración (id 1).
  listarInstructores: async () => {
    const cursos = await apiFetch<CursoEvento[]>("/api/cursos");
    const mapa = new Map<number, string>();
    cursos.forEach((c) => mapa.set(c.idInstructor, c.nombreInstructor));
    if (mapa.size === 0) mapa.set(1, "Carlos Ortega");
    return [...mapa].map(([id, nombre]) => ({ id, nombre }));
  },
};

// ---------------------------------------------------------- Modo demostración

export function crearServicioDemo(): CursosService {
  let cursos = cursosDemo.map((c) => ({ ...c }));
  let inscripciones = inscripcionesDemo();
  let siguienteCurso = Math.max(...cursos.map((c) => c.id)) + 1;
  let siguienteInscripcion = inscripciones.length + 1;

  const ocupados = (idCurso: number) =>
    inscripciones.filter((i) => i.idCurso === idCurso && inscripcionActiva(i)).length;

  const conAforo = (c: (typeof cursos)[number]): CursoEvento => {
    const inscritos = ocupados(c.id);
    return { ...c, inscritos, aforoDisponible: Math.max(0, c.cupoMaximo - inscritos) };
  };

  // Copias para que la interfaz no modifique el "servidor" por accidente.
  const copia = <T,>(v: T): T => structuredClone(v);

  return {
    async listarCursos() {
      return cursos.map(conAforo);
    },

    async crearCurso(datos) {
      if (new Date(datos.fechaInicio) <= new Date()) {
        throw new ApiError("La fecha de inicio debe ser posterior a la fecha actual", 400);
      }
      if (datos.fechaFin <= datos.fechaInicio) {
        throw new ApiError("La fecha de fin debe ser posterior a la fecha de inicio", 400);
      }
      const instructor = instructoresDemo.find((i) => i.id === datos.idInstructor);
      if (!instructor) throw new ApiError("No existe el instructor indicado", 404);
      const nuevo = {
        ...datos,
        id: siguienteCurso++,
        estado: "PROGRAMADO" as const,
        nombreInstructor: instructor.nombre,
      };
      cursos = [...cursos, nuevo];
      return conAforo(nuevo);
    },

    async inscribir(idCurso, idUsuario) {
      const curso = cursos.find((c) => c.id === idCurso);
      if (!curso) throw new ApiError("No existe el curso indicado", 404);
      if (curso.estado !== "PROGRAMADO" || new Date(curso.fechaInicio) <= new Date()) {
        throw new ApiError("El curso no admite inscripciones: no está programado o ya inició", 409);
      }
      if (inscripciones.some((i) => i.idCurso === idCurso && i.idUsuario === idUsuario && inscripcionActiva(i))) {
        throw new ApiError("El participante ya está inscrito en este curso", 409);
      }
      if (ocupados(idCurso) >= curso.cupoMaximo) {
        throw new ApiError("El curso no tiene cupos disponibles", 409);
      }
      const usuario = asistentesDemo.find((u) => u.id === idUsuario) ?? {
        id: idUsuario,
        nombre: `Usuario ${idUsuario}`,
        correo: "",
      };
      const nueva: Inscripcion = {
        id: siguienteInscripcion++,
        idUsuario,
        nombreUsuario: usuario.nombre,
        correoUsuario: usuario.correo,
        idCurso,
        nombreCurso: curso.nombreCurso,
        lugarCurso: curso.lugar,
        fechaInicioCurso: curso.fechaInicio,
        fechaInscripcion: new Date().toISOString().slice(0, 19),
        estado: "PENDIENTE",
      };
      inscripciones = [...inscripciones, nueva];
      return copia(nueva);
    },

    async cancelarInscripcion(idInscripcion) {
      const actual = inscripciones.find((i) => i.id === idInscripcion);
      if (!actual) throw new ApiError("No existe la inscripción indicada", 404);
      if (actual.estado === "CANCELADO") throw new ApiError("La inscripción ya está cancelada", 409);
      const horasParaIniciar = (new Date(actual.fechaInicioCurso).getTime() - Date.now()) / 3_600_000;
      if (horasParaIniciar < 24) {
        throw new ApiError("No se puede cancelar a menos de 24 horas del inicio del curso", 409);
      }
      const cancelada = { ...actual, estado: "CANCELADO" as const };
      inscripciones = inscripciones.map((i) => (i.id === idInscripcion ? cancelada : i));
      return copia(cancelada);
    },

    async inscripcionesDeUsuario(idUsuario) {
      return copia(inscripciones.filter((i) => i.idUsuario === idUsuario));
    },

    async inscripcionesDeCurso(idCurso) {
      return copia(inscripciones.filter((i) => i.idCurso === idCurso));
    },

    async listarInstructores() {
      return copia(instructoresDemo);
    },
  };
}

export const cursosService: CursosService = usaBackend ? httpCursosService : crearServicioDemo();
