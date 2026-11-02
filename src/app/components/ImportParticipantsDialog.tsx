import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { exportarCSV, leerCSV } from "../lib/exportar";
import type { NuevoParticipante } from "../services/directorioService";

interface ImportParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Recibe las filas válidas del archivo; el contenedor las registra en el sistema. */
  onParticipantsImported: (participants: NuevoParticipante[]) => void;
}

/**
 * Diálogo para importar participantes de forma masiva desde un archivo CSV (se guarda desde Excel
 * con "CSV UTF-8"). Lee y valida cada fila (nombre, documento, correo) y descarga la plantilla.
 * Rol: administrador.
 */
export function ImportParticipantsDialog({ 
  open, 
  onOpenChange,
  onParticipantsImported 
}: ImportParticipantsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar que sea un archivo Excel
      const validExtensions = ['.csv'];
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (validExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setImportResults(null);
      } else {
        toast.error("Formato no válido. En Excel use Archivo > Guardar como > CSV UTF-8 (.csv)");
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Por favor seleccione un archivo");
      return;
    }

    setIsProcessing(true);
    try {
      const filas = leerCSV(await file.text());
      if (filas.length > 1000) throw new Error("El archivo supera el máximo de 1000 registros");

      // Columnas esperadas (sin tildes ni mayúsculas): nombre, documento, correo/email, telefono, empresa, cargo, curso
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validos: NuevoParticipante[] = [];
      filas.forEach((f) => {
        const datos: NuevoParticipante = {
          nombre: f.nombre ?? "",
          documento: (f.documento ?? "").replace(/\D/g, ""),
          correo: f.correo || f.email || "",
          telefono: f.telefono ?? "",
          empresa: f.empresa ?? "",
          cargo: f.cargo ?? "",
          curso: f.curso ?? "",
        };
        if (datos.nombre && datos.documento.length >= 5 && correoValido.test(datos.correo)) validos.push(datos);
      });

      const results = { success: validos.length, failed: filas.length - validos.length, total: filas.length };
      setImportResults(results);
      if (validos.length > 0) onParticipantsImported(validos);
      if (results.failed > 0) {
        toast.warning(`${results.failed} filas no se importaron`, {
          description: "Revise que tengan nombre, documento (solo números) y un correo válido",
        });
      }
    } catch (error) {
      toast.error("No se pudo leer el archivo", { description: error instanceof Error ? error.message : "" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResults(null);
    onOpenChange(false);
  };

  /** Descarga la plantilla CSV con los encabezados esperados y una fila de ejemplo. */
  const downloadTemplate = () => {
    exportarCSV(
      "plantilla_participantes_sigre.csv",
      ["Nombre", "Documento", "Correo", "Telefono", "Empresa", "Cargo", "Curso"],
      [["Juan Pablo Martinez", "1045234890", "juan.martinez@correo.com", "3001234567", "Construcciones Seguras S.A.S.", "Operario", "Trabajo en Alturas Nivel Avanzado"]],
    );
    toast.success("Plantilla descargada", { description: "Ábrala en Excel, complete los datos y guárdela como CSV UTF-8" });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-orange-600" />
            Importar Participantes desde Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Instrucciones de importación:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>El archivo debe ser CSV (.csv). Desde Excel: Archivo &gt; Guardar como &gt; CSV UTF-8</li>
              <li>Columnas: Nombre, Documento, Correo, Telefono, Empresa, Cargo, Curso (use la plantilla)</li>
              <li>La primera fila debe contener los encabezados</li>
              <li>Máximo 1000 registros por importación</li>
            </ul>
          </div>

          {/* Botón de descarga de plantilla */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar plantilla (CSV para Excel)
            </Button>
          </div>

          {/* Área de carga de archivo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-orange-600" />
              </div>
              
              {file ? (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                  >
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    Haz clic para seleccionar un archivo
                  </p>
                  <p className="text-sm text-gray-500">
                    o arrastra y suelta aquí
                  </p>
                  <p className="text-xs text-gray-400">
                    Formato soportado: .csv (UTF-8)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Resultados de importación */}
          {importResults && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Importación completada
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-green-700 font-semibold">Total</p>
                      <p className="text-2xl font-bold text-green-900">{importResults.total}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-semibold">Exitosos</p>
                      <p className="text-2xl font-bold text-green-600">{importResults.success}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-semibold">Fallidos</p>
                      <p className="text-2xl font-bold text-red-600">{importResults.failed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estado de procesamiento */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 text-orange-600">
              <div className="animate-spin w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full" />
              <span className="font-semibold">Procesando archivo...</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            {importResults ? "Cerrar" : "Cancelar"}
          </Button>
          {!importResults && (
            <Button
              onClick={handleImport}
              disabled={!file || isProcessing}
              className="bg-orange-700 hover:bg-orange-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Participantes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
