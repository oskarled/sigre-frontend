// Utilidades de fecha.
//
// Las fechas se guardan como texto ISO "AAAA-MM-DD". `new Date("2026-06-15")`
// las interpreta en UTC y en Colombia (UTC-5) se muestran un día antes.
// Por eso se crean siempre con año, mes y día locales.

export function parseISODate(value: string): Date | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/** 15 de junio de 2026 */
export function formatDateLong(value: string): string {
  const d = parseISODate(value);
  if (!d) return "---";
  return d.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

/** 15/06/2026 */
export function formatDateShort(value: string): string {
  const d = parseISODate(value);
  if (!d) return "---";
  return d.toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
}

/** Fecha de hoy en formato ISO local (AAAA-MM-DD). */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function isSameMonth(value: string, ref: Date = new Date()): boolean {
  const d = parseISODate(value);
  return !!d && d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}
