import { describe, expect, it } from "vitest";
import { formatDateLong, formatDateShort, parseISODate } from "../lib/dates";

describe("fechas", () => {
  it("no corre un día la fecha por la zona horaria (UTC-5)", () => {
    const d = parseISODate("2026-11-09")!;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(10);
    expect(d.getDate()).toBe(9);
  });

  it("acepta fechas con hora como las del backend (LocalDateTime)", () => {
    expect(formatDateShort("2026-11-09T08:00:00")).toBe("09/11/2026");
    expect(formatDateLong("2026-11-09T08:00:00")).toBe("9 de noviembre de 2026");
  });

  it("muestra --- cuando no hay fecha", () => {
    expect(formatDateShort("")).toBe("---");
  });
});
