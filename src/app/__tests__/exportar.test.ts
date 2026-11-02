import { describe, expect, it } from "vitest";
import { aCSV, leerCSV } from "../lib/exportar";

describe("exportación e importación CSV", () => {
  it("genera CSV con BOM, punto y coma y valores escapados", () => {
    const csv = aCSV(["Curso", "Lugar"], [["Alturas; avanzado", 'Sede "Norte"']]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"Alturas; avanzado";"Sede ""Norte"""');
  });

  it("lee un CSV separado por punto y coma con encabezados con tildes", () => {
    const filas = leerCSV("﻿Nombre;Documento;Teléfono\r\nAna Torres;1047000006;3001234567\r\n");
    expect(filas).toEqual([{ nombre: "Ana Torres", documento: "1047000006", telefono: "3001234567" }]);
  });

  it("lee un CSV separado por comas con comillas", () => {
    const filas = leerCSV('nombre,empresa\n"Gómez, Juan","ECM ""Sede"""');
    expect(filas[0]).toEqual({ nombre: "Gómez, Juan", empresa: 'ECM "Sede"' });
  });

  it("lo que se exporta se puede volver a importar", () => {
    const filas = leerCSV(aCSV(["Nombre", "Correo"], [["Maria Perez", "maria.perez@correo.com"]]));
    expect(filas).toEqual([{ nombre: "Maria Perez", correo: "maria.perez@correo.com" }]);
  });
});
