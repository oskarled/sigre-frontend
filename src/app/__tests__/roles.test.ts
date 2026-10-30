import { describe, expect, it } from "vitest";
import { can, canAccess, navItemsFor } from "../lib/roles";

describe("permisos por rol", () => {
  it("el participante no ve participantes, instructores ni reportes", () => {
    const ids = navItemsFor("participante").map((i) => i.id);
    expect(ids).toEqual(["inicio", "eventos", "certificados"]);
    expect(canAccess("participante", "reportes")).toBe(false);
  });

  it("solo el administrador gestiona cursos y ve reportes", () => {
    expect(can.gestionarEventos("administrador")).toBe(true);
    expect(can.gestionarEventos("instructor")).toBe(false);
    expect(canAccess("administrador", "reportes")).toBe(true);
    expect(canAccess("instructor", "reportes")).toBe(false);
  });

  it("solo el participante se inscribe", () => {
    expect(can.inscribirse("participante")).toBe(true);
    expect(can.inscribirse("administrador")).toBe(false);
  });
});
