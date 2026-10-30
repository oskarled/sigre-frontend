// Datos de demostración. Se usan cuando no hay backend configurado (VITE_API_URL vacío),
// por ejemplo en la versión publicada en Netlify.
// Los usuarios y el instructor 1 coinciden con CargaDatosDemostracion del backend.

import type { CursoEvento, Inscripcion } from "../models/curso";

type CursoBase = Omit<CursoEvento, "inscritos" | "aforoDisponible">;

export const cursosDemo: CursoBase[] = [
  {
    id: 1,
    nombreCurso: "Trabajos en Alturas Nivel I",
    tipo: "Trabajos en Alturas",
    duracionHoras: 40,
    fechaInicio: "2026-11-09T08:00:00",
    fechaFin: "2026-11-13T17:00:00",
    lugar: "Aula 301 - Sede Principal",
    ciudad: "Cartagena",
    modalidad: "presencial",
    cupoMaximo: 25,
    estado: "PROGRAMADO",
    idInstructor: 1,
    nombreInstructor: "Carlos Ortega",
    descripcion: "Curso completo de trabajos en alturas nivel I, conforme a la Resolución 4272 de 2021.",
    costo: 500000,
  },
  {
    id: 2,
    nombreCurso: "Seguridad Industrial Básica",
    tipo: "Seguridad Industrial",
    duracionHoras: 32,
    fechaInicio: "2026-11-16T18:00:00",
    fechaFin: "2026-11-20T21:00:00",
    lugar: "Aula Virtual",
    ciudad: "Virtual",
    modalidad: "virtual",
    cupoMaximo: 30,
    estado: "PROGRAMADO",
    idInstructor: 2,
    nombreInstructor: "Pedro Martínez",
    descripcion: "Fundamentos de seguridad industrial para empresas de todos los sectores.",
    costo: 350000,
  },
  {
    id: 3,
    nombreCurso: "Primeros Auxilios",
    tipo: "Primeros Auxilios",
    duracionHoras: 24,
    fechaInicio: "2026-09-14T09:00:00",
    fechaFin: "2026-09-16T16:00:00",
    lugar: "Aula 205 - Sede Principal",
    ciudad: "Cartagena",
    modalidad: "presencial",
    cupoMaximo: 20,
    estado: "FINALIZADO",
    idInstructor: 3,
    nombreInstructor: "Jorge Ramírez",
    descripcion: "Curso práctico de primeros auxilios y RCP.",
    costo: 280000,
  },
  {
    id: 4,
    nombreCurso: "Trabajos en Alturas Nivel II",
    tipo: "Trabajos en Alturas",
    duracionHoras: 40,
    fechaInicio: "2026-12-07T08:00:00",
    fechaFin: "2026-12-11T17:00:00",
    lugar: "Aula 301 - Sede Principal",
    ciudad: "Cartagena",
    modalidad: "hibrido",
    cupoMaximo: 20,
    estado: "PROGRAMADO",
    idInstructor: 1,
    nombreInstructor: "Carlos Ortega",
    descripcion: "Curso avanzado de trabajos en alturas nivel II, con prácticas en campo.",
    costo: 650000,
  },
  {
    id: 5,
    nombreCurso: "Riesgo Eléctrico",
    tipo: "Riesgo Eléctrico",
    duracionHoras: 40,
    fechaInicio: "2026-10-13T07:00:00",
    fechaFin: "2026-10-23T12:00:00",
    lugar: "Taller de prácticas",
    ciudad: "Cartagena",
    modalidad: "presencial",
    cupoMaximo: 15,
    estado: "EN_CURSO",
    idInstructor: 4,
    nombreInstructor: "Ana Méndez",
    descripcion: "Prevención de accidentes por riesgo eléctrico (RETIE).",
    costo: 420000,
  },
  {
    id: 6,
    nombreCurso: "Espacios Confinados",
    tipo: "Espacios Confinados",
    duracionHoras: 32,
    fechaInicio: "2026-11-23T08:00:00",
    fechaFin: "2026-11-27T17:00:00",
    lugar: "Zona de prácticas",
    ciudad: "Cartagena",
    modalidad: "presencial",
    cupoMaximo: 2,
    estado: "PROGRAMADO",
    idInstructor: 4,
    nombreInstructor: "Ana Méndez",
    descripcion: "Identificación de riesgos, monitoreo de atmósferas y rescate en espacios confinados.",
    costo: 480000,
  },
  {
    id: 7,
    nombreCurso: "Coordinador de Trabajo en Alturas",
    tipo: "Trabajos en Alturas",
    duracionHoras: 80,
    fechaInicio: "2026-08-03T08:00:00",
    fechaFin: "2026-08-07T17:00:00",
    lugar: "Aula 301 - Sede Principal",
    ciudad: "Cartagena",
    modalidad: "presencial",
    cupoMaximo: 20,
    estado: "FINALIZADO",
    idInstructor: 1,
    nombreInstructor: "Carlos Ortega",
    descripcion: "Formación para coordinadores de trabajo seguro en alturas.",
    costo: 900000,
  },
];

interface UsuarioDemo {
  id: number;
  nombre: string;
  correo: string;
}

// Asistentes de demostración (ids 3 y 4 iguales a los del backend).
export const asistentesDemo: UsuarioDemo[] = [
  { id: 3, nombre: "Maria Perez", correo: "maria.perez@correo.com" },
  { id: 4, nombre: "Juan Gomez", correo: "juan.gomez@correo.com" },
  { id: 5, nombre: "Luis Fernando Torres", correo: "luis.torres@correo.com" },
  { id: 6, nombre: "Diana Patricia Mora", correo: "diana.mora@correo.com" },
];

// [idUsuario, idCurso, estado, fechaInscripcion]
const inscripcionesBase: [number, number, Inscripcion["estado"], string][] = [
  [3, 1, "PAGADO", "2026-10-01T10:15:00"],
  [3, 7, "APROBADO", "2026-07-20T09:00:00"],
  [4, 1, "PENDIENTE", "2026-10-05T14:30:00"],
  [4, 5, "PAGADO", "2026-10-01T08:00:00"],
  [5, 1, "PAGADO", "2026-10-07T11:00:00"],
  [5, 6, "PAGADO", "2026-10-08T11:00:00"],
  [6, 6, "PAGADO", "2026-10-09T16:20:00"],
  [6, 3, "APROBADO", "2026-09-01T10:00:00"],
  [5, 7, "NO_APROBADO", "2026-07-21T10:00:00"],
];

export function inscripcionesDemo(): Inscripcion[] {
  return inscripcionesBase.map(([idUsuario, idCurso, estado, fechaInscripcion], i) => {
    const usuario = asistentesDemo.find((u) => u.id === idUsuario)!;
    const curso = cursosDemo.find((c) => c.id === idCurso)!;
    return {
      id: i + 1,
      idUsuario,
      nombreUsuario: usuario.nombre,
      correoUsuario: usuario.correo,
      idCurso,
      nombreCurso: curso.nombreCurso,
      lugarCurso: curso.lugar,
      fechaInicioCurso: curso.fechaInicio,
      fechaInscripcion,
      estado,
    };
  });
}

// Instructores con id de la tabla instructor del backend (en el backend de demostración solo existe el 1).
export const instructoresDemo = [
  { id: 1, nombre: "Carlos Ortega" },
  { id: 2, nombre: "Pedro Martínez" },
  { id: 3, nombre: "Jorge Ramírez" },
  { id: 4, nombre: "Ana Méndez" },
];
