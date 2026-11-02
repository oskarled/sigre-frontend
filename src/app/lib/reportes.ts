// Cálculos del reporte de cursos a partir de los datos reales del sistema (GET /api/cursos).
// Se separan de la vista para poder probarlos y reutilizarlos en la exportación a PDF y CSV.

import { ESTADO_CURSO_LABEL, type CursoEvento } from "../models/curso";
import { formatDateShort } from "./dates";
import type { Fila } from "./exportar";

export const ENCABEZADOS_REPORTE_CURSOS = [
  "Curso",
  "Instructor",
  "Inicio",
  "Lugar",
  "Estado",
  "Cupo",
  "Inscritos",
  "Disponibles",
  "Ocupación",
];

/** Porcentaje de ocupación de un curso (0 a 100), redondeado. */
export function ocupacion(curso: CursoEvento): number {
  return curso.cupoMaximo > 0 ? Math.round((curso.inscritos / curso.cupoMaximo) * 100) : 0;
}

/** Filas del reporte de ocupación, ordenadas por fecha de inicio. */
export function filasReporteCursos(cursos: CursoEvento[]): Fila[] {
  return [...cursos]
    .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))
    .map((c) => [
      c.nombreCurso,
      c.nombreInstructor,
      formatDateShort(c.fechaInicio),
      c.lugar,
      ESTADO_CURSO_LABEL[c.estado],
      c.cupoMaximo,
      c.inscritos,
      c.aforoDisponible,
      `${ocupacion(c)} %`,
    ]);
}

/** Indicadores generales del reporte. */
export function resumenCursos(cursos: CursoEvento[]) {
  const vigentes = cursos.filter((c) => c.estado !== "CANCELADO");
  const cupo = vigentes.reduce((acc, c) => acc + c.cupoMaximo, 0);
  const inscritos = vigentes.reduce((acc, c) => acc + c.inscritos, 0);
  return {
    totalCursos: cursos.length,
    programados: cursos.filter((c) => c.estado === "PROGRAMADO").length,
    inscritos,
    ocupacionPromedio: cupo > 0 ? Math.round((inscritos / cupo) * 100) : 0,
  };
}
