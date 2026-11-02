import { describe, expect, it } from "vitest";
import { certificadoAFila, contrasenaTemporal, listarParticipantes, usuarioAParticipante, verificarCertificado } from "../services/directorioService";

describe("directorio de participantes y certificados", () => {
  it("convierte un usuario del backend en una fila del directorio", () => {
    const fila = usuarioAParticipante({ id: 5, nombre: "Juan Gomez", correo: "juan.gomez@correo.com", documento: "1047000005", telefono: null, rol: "ASISTENTE", activo: true, fechaRegistro: "2026-10-31T10:00:00" });
    expect(fila).toMatchObject({ id: 5, nombre: "Juan Gomez", documento: "1047000005", telefono: "—", estado: "Activo" });
  });

  it("genera una contraseña temporal que cumple la regla del backend", () => {
    expect(contrasenaTemporal("1.045.234.890")).toMatch(/^(?=.*[A-Za-z])(?=.*\d).{8,64}$/);
  });

  it("en modo demostración lista los participantes de ejemplo", async () => {
    expect((await listarParticipantes()).length).toBeGreaterThan(0);
  });

  it("verifica un certificado emitido por su código", async () => {
    const c = await verificarCertificado(" ecm-2026-demo0001 ");
    expect(c.participante).toBe("Maria Perez");
  });

  it("rechaza un código inexistente o de un certificado anulado", async () => {
    await expect(verificarCertificado("ECM-2026-NOEXISTE")).rejects.toMatchObject({ status: 404 });
    await expect(verificarCertificado("ECM-2026-DEMO0005")).rejects.toMatchObject({ status: 404 });
  });

  it("convierte un certificado del backend en la fila del módulo", () => {
    const fila = certificadoAFila({ id: 1, codigo: "ECM-2026-DEMO0001", fechaEmision: "2026-08-07T09:00:00", idInscripcion: 1, idUsuario: 3, nombreParticipante: "Maria Perez", documentoParticipante: "1047000003", idCurso: 4, nombreCurso: "Coordinador de Trabajo en Alturas", duracionHoras: 80, nombreInstructor: "Carlos Ortega" });
    expect(fila).toMatchObject({ codigo: "ECM-2026-DEMO0001", estado: "emitido", participante: "Maria Perez" });
  });
});

describe("directorio de instructores", () => {
  it("cuenta solo los cursos programados o en curso del instructor", async () => {
    const { instructorAFila } = await import("../services/directorioService");
    const { crearServicioDemo } = await import("../services/cursosService");
    const cursos = await crearServicioDemo().listarCursos();
    const esperado = cursos.filter((c) => c.idInstructor === 1 && (c.estado === "PROGRAMADO" || c.estado === "EN_CURSO")).length;
    const fila = instructorAFila({ id: 1, idUsuario: 2, nombre: "Carlos Ortega", correo: "carlos.ortega@ecm.com", telefono: null, especialidad: "Trabajo en alturas", licenciaSst: "SST-2019-0451" }, cursos);
    expect(fila).toMatchObject({ nombre: "Carlos Ortega", certificaciones: 1, cursosActivos: esperado, titulo: "Licencia SST SST-2019-0451" });
  });
});
