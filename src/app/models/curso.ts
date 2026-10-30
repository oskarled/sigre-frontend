// Modelo de cursos e inscripciones.
// Los nombres y estados coinciden con la API de sigre-modulo-cursos (Spring Boot):
// CursoEventoResponse, CursoEventoRequest, InscripcionResponse, EstadoCurso y EstadoInscripcion.

export type EstadoCurso = "PROGRAMADO" | "EN_CURSO" | "FINALIZADO" | "CANCELADO";

export type EstadoInscripcion = "PENDIENTE" | "PAGADO" | "APROBADO" | "NO_APROBADO" | "CANCELADO";

export type Modalidad = "presencial" | "virtual" | "hibrido";

/** Respuesta de GET /api/cursos (CursoEventoResponse). */
export interface CursoEvento {
  id: number;
  nombreCurso: string;
  duracionHoras: number;
  fechaInicio: string; // ISO local: AAAA-MM-DDTHH:mm:ss
  fechaFin: string;
  lugar: string;
  cupoMaximo: number;
  inscritos: number;
  aforoDisponible: number;
  estado: EstadoCurso;
  idInstructor: number;
  nombreInstructor: string;

  // Datos que el backend todavía no maneja. Solo existen en el modo demostración;
  // las pantallas los muestran únicamente si vienen.
  tipo?: string;
  modalidad?: Modalidad;
  ciudad?: string;
  descripcion?: string;
  costo?: number;
}

/** Cuerpo de POST/PUT /api/cursos (CursoEventoRequest). */
export interface CursoEventoRequest {
  nombreCurso: string;
  duracionHoras: number;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  cupoMaximo: number;
  idInstructor: number;
}

/** Respuesta de las rutas de inscripciones (InscripcionResponse). */
export interface Inscripcion {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  correoUsuario: string;
  idCurso: number;
  nombreCurso: string;
  lugarCurso: string;
  fechaInicioCurso: string;
  fechaInscripcion: string;
  estado: EstadoInscripcion;
}

export const ESTADO_CURSO_LABEL: Record<EstadoCurso, string> = {
  PROGRAMADO: "Programado",
  EN_CURSO: "En curso",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export const ESTADO_CURSO_COLOR: Record<EstadoCurso, string> = {
  PROGRAMADO: "bg-green-100 text-green-800",
  EN_CURSO: "bg-blue-100 text-blue-800",
  FINALIZADO: "bg-gray-100 text-gray-800",
  CANCELADO: "bg-red-100 text-red-800",
};

export const ESTADO_INSCRIPCION_LABEL: Record<EstadoInscripcion, string> = {
  PENDIENTE: "Pendiente de pago",
  PAGADO: "Pagado",
  APROBADO: "Aprobado",
  NO_APROBADO: "No aprobado",
  CANCELADO: "Cancelada",
};

export const MODALIDAD_COLOR: Record<Modalidad, string> = {
  presencial: "bg-blue-100 text-blue-800",
  virtual: "bg-green-100 text-green-800",
  hibrido: "bg-purple-100 text-purple-800",
};

export const MODALIDAD_LABEL: Record<Modalidad, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrido: "Híbrido",
};

/** Misma regla que el backend: solo se inscribe en cursos programados con cupo. */
export function admiteInscripcion(curso: CursoEvento, ahora: Date = new Date()): boolean {
  return curso.estado === "PROGRAMADO" && curso.aforoDisponible > 0 && new Date(curso.fechaInicio) > ahora;
}

/** Una inscripción cancelada libera el cupo y no cuenta como activa. */
export function inscripcionActiva(i: Inscripcion): boolean {
  return i.estado !== "CANCELADO";
}

/** "08:00 - 17:00" a partir de las fechas con hora. */
export function horario(curso: CursoEvento): string {
  const hora = (v: string) => v.slice(11, 16);
  const ini = hora(curso.fechaInicio);
  const fin = hora(curso.fechaFin);
  return ini && fin ? `${ini} - ${fin}` : "---";
}
