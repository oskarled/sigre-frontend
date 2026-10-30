import { describe, expect, it } from "vitest";
import { admiteInscripcion, horario, type CursoEvento } from "../models/curso";

const base: CursoEvento = {
  id: 1,
  nombreCurso: "Alturas",
  duracionHoras: 40,
  fechaInicio: "2099-01-10T08:00:00",
  fechaFin: "2099-01-14T17:00:00",
  lugar: "Aula 1",
  cupoMaximo: 10,
  inscritos: 3,
  aforoDisponible: 7,
  estado: "PROGRAMADO",
  idInstructor: 1,
  nombreInstructor: "Carlos Ortega",
};

describe("regla de inscripción", () => {
  it("admite cursos programados, futuros y con cupo", () => {
    expect(admiteInscripcion(base)).toBe(true);
  });
  it("rechaza cursos sin cupo", () => {
    expect(admiteInscripcion({ ...base, aforoDisponible: 0 })).toBe(false);
  });
  it("rechaza cursos que no están programados", () => {
    expect(admiteInscripcion({ ...base, estado: "EN_CURSO" })).toBe(false);
    expect(admiteInscripcion({ ...base, estado: "CANCELADO" })).toBe(false);
  });
  it("rechaza cursos que ya iniciaron", () => {
    expect(admiteInscripcion({ ...base, fechaInicio: "2020-01-01T08:00:00" })).toBe(false);
  });
  it("calcula el horario a partir de las fechas", () => {
    expect(horario(base)).toBe("08:00 - 17:00");
  });
});
