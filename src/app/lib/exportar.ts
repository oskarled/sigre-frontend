// Utilidades para exportar e importar listados en CSV y generar reportes en PDF.
// El CSV usa punto y coma y BOM UTF-8 para que Excel en español lo abra con tildes y columnas correctas.

import { jsPDF } from "jspdf";

export type Fila = Array<string | number>;

/** Escapa un valor para CSV: comillas dobles si contiene separador, comillas o saltos de línea. */
function celdaCSV(valor: string | number): string {
  const texto = String(valor ?? "");
  return /[;"\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

/** Construye el contenido CSV (con BOM) a partir de los encabezados y las filas. */
export function aCSV(encabezados: string[], filas: Fila[]): string {
  const lineas = [encabezados, ...filas].map((fila) => fila.map(celdaCSV).join(";"));
  return "﻿" + lineas.join("\r\n");
}

/** Lee un CSV separado por ";" o "," (detecta el separador en la primera línea). */
export function leerCSV(contenido: string): Record<string, string>[] {
  const texto = contenido.replace(/^﻿/, "").trim();
  if (!texto) return [];
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim() !== "");
  const separador = (lineas[0].match(/;/g)?.length ?? 0) >= (lineas[0].match(/,/g)?.length ?? 0) ? ";" : ",";

  const partir = (linea: string): string[] => {
    const celdas: string[] = [];
    let actual = "";
    let entreComillas = false;
    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (c === '"') {
        if (entreComillas && linea[i + 1] === '"') {
          actual += '"';
          i++;
        } else {
          entreComillas = !entreComillas;
        }
      } else if (c === separador && !entreComillas) {
        celdas.push(actual.trim());
        actual = "";
      } else {
        actual += c;
      }
    }
    celdas.push(actual.trim());
    return celdas;
  };

  const encabezados = partir(lineas[0]).map((h) =>
    h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(),
  );
  return lineas.slice(1).map((linea) => {
    const celdas = partir(linea);
    return Object.fromEntries(encabezados.map((h, i) => [h, celdas[i] ?? ""]));
  });
}

/** Descarga un archivo de texto en el navegador. */
export function descargarArchivo(nombre: string, contenido: string, tipo = "text/csv;charset=utf-8"): void {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

/** Exporta un listado a CSV y lo descarga. */
export function exportarCSV(nombre: string, encabezados: string[], filas: Fila[]): void {
  descargarArchivo(nombre, aCSV(encabezados, filas));
}

/**
 * Genera y descarga un reporte PDF tamaño carta con título, fecha y una tabla.
 * Los anchos de columna se reparten según el texto más largo de cada columna.
 */
export function exportarTablaPDF(nombre: string, titulo: string, encabezados: string[], filas: Fila[]): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const margen = 12;

  // Ancho de cada columna proporcional al contenido (mínimo 18 mm)
  const largos = encabezados.map((h, i) => Math.max(h.length, ...filas.map((f) => String(f[i] ?? "").length)));
  const total = largos.reduce((a, b) => a + b, 0) || 1;
  const anchos = largos.map((l) => Math.max(18, ((ancho - margen * 2) * l) / total));
  const escala = (ancho - margen * 2) / anchos.reduce((a, b) => a + b, 0);
  const cols = anchos.map((a) => a * escala);

  const encabezadoPagina = () => {
    doc.setFillColor(194, 65, 12);
    doc.rect(0, 0, ancho, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`SIGRE · ECM Training Center — ${titulo}`, margen, 11.5);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${new Date().toLocaleString("es-CO")}`, ancho - margen, 11.5, { align: "right" });
  };

  const filaTabla = (valores: Fila, y: number, esEncabezado: boolean) => {
    let x = margen;
    doc.setFont("helvetica", esEncabezado ? "bold" : "normal");
    doc.setFontSize(8.5);
    if (esEncabezado) {
      doc.setFillColor(243, 244, 246);
      doc.rect(margen, y - 4.5, ancho - margen * 2, 7, "F");
    }
    doc.setTextColor(17, 24, 39);
    valores.forEach((v, i) => {
      const texto = doc.splitTextToSize(String(v ?? ""), cols[i] - 2)[0] ?? "";
      doc.text(texto, x + 1, y);
      x += cols[i];
    });
  };

  encabezadoPagina();
  let y = 28;
  filaTabla(encabezados, y, true);
  y += 7;
  filas.forEach((fila) => {
    if (y > alto - 15) {
      doc.addPage();
      encabezadoPagina();
      y = 28;
      filaTabla(encabezados, y, true);
      y += 7;
    }
    filaTabla(fila, y, false);
    doc.setDrawColor(229, 231, 235);
    doc.line(margen, y + 2.5, ancho - margen, y + 2.5);
    y += 6.5;
  });

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(`Total de registros: ${filas.length}`, margen, alto - 8);
  doc.save(nombre);
}
