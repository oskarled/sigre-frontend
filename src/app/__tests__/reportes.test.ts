import { beforeAll, describe, expect, it } from "vitest";
import { filasReporteCursos, ocupacion, resumenCursos } from "../lib/reportes";
import { crearServicioDemo } from "../services/cursosService";
import type { CursoEvento } from "../models/curso";

describe("reporte de ocupación de cursos", () => {
  let cursos: CursoEvento[];
  beforeAll(async () => {
    cursos = await crearServicioDemo().listarCursos();
  });

  it("calcula la ocupación como inscritos sobre cupo", () => {
    expect(ocupacion({ ...cursos[0], cupoMaximo: 20, inscritos: 15 })).toBe(75);
  });

  it("genera una fila por curso ordenada por fecha de inicio", () => {
    const filas = filasReporteCursos(cursos);
    expect(filas).toHaveLength(cursos.length);
    const primero = [...cursos].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))[0];
    expect(filas[0][0]).toBe(primero.nombreCurso);
  });

  it("no cuenta los cursos cancelados en la ocupación promedio", () => {
    const resumen = resumenCursos([
      { ...cursos[0], estado: "PROGRAMADO", cupoMaximo: 10, inscritos: 5 },
      { ...cursos[1], estado: "CANCELADO", cupoMaximo: 10, inscritos: 0 },
    ]);
    expect(resumen).toMatchObject({ totalCursos: 2, programados: 1, inscritos: 5, ocupacionPromedio: 50 });
  });
});
