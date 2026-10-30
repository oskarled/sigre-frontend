import { beforeEach, describe, expect, it } from "vitest";
import { crearServicioDemo, type CursosService } from "../services/cursosService";

// El modo demostración debe aplicar las mismas reglas que InscripcionService del backend.
describe("servicio de cursos (modo demostración)", () => {
  let servicio: CursosService;
  beforeEach(() => {
    servicio = crearServicioDemo();
  });

  it("inscribe y descuenta un cupo", async () => {
    const antes = (await servicio.listarCursos()).find((c) => c.id === 2)!;
    const inscripcion = await servicio.inscribir(2, 4);
    expect(inscripcion.estado).toBe("PENDIENTE");
    const despues = (await servicio.listarCursos()).find((c) => c.id === 2)!;
    expect(despues.aforoDisponible).toBe(antes.aforoDisponible - 1);
  });

  it("no permite inscribirse dos veces al mismo curso", async () => {
    await expect(servicio.inscribir(1, 3)).rejects.toThrow(/ya está inscrito/);
  });

  it("no permite inscribirse si no hay cupo", async () => {
    // El curso 6 tiene cupo 2 y ya está lleno en los datos de demostración
    await expect(servicio.inscribir(6, 3)).rejects.toThrow(/cupos/);
  });

  it("no permite inscribirse en un curso que no está programado", async () => {
    await expect(servicio.inscribir(5, 3)).rejects.toMatchObject({ status: 409 });
  });

  it("cancelar libera el cupo", async () => {
    const nueva = await servicio.inscribir(2, 4);
    const lleno = (await servicio.listarCursos()).find((c) => c.id === 2)!;
    await servicio.cancelarInscripcion(nueva.id);
    const libre = (await servicio.listarCursos()).find((c) => c.id === 2)!;
    expect(libre.aforoDisponible).toBe(lleno.aforoDisponible + 1);
  });

  it("rechaza crear un curso con fecha de inicio en el pasado", async () => {
    await expect(
      servicio.crearCurso({
        nombreCurso: "Prueba",
        duracionHoras: 8,
        fechaInicio: "2020-01-01T08:00:00",
        fechaFin: "2020-01-01T17:00:00",
        lugar: "Aula",
        cupoMaximo: 10,
        idInstructor: 1,
      }),
    ).rejects.toThrow(/posterior/);
  });

  it("crea un curso programado con el aforo completo", async () => {
    const curso = await servicio.crearCurso({
      nombreCurso: "Prueba",
      duracionHoras: 8,
      fechaInicio: "2099-01-01T08:00:00",
      fechaFin: "2099-01-01T17:00:00",
      lugar: "Aula",
      cupoMaximo: 10,
      idInstructor: 1,
    });
    expect(curso.estado).toBe("PROGRAMADO");
    expect(curso.aforoDisponible).toBe(10);
    expect(curso.nombreInstructor).toBe("Carlos Ortega");
  });
});
