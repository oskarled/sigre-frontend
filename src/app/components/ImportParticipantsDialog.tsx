import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { todayISO } from "../lib/dates";

interface ImportParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipantsImported: (participants: any[]) => void;
}

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
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (validExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setImportResults(null);
      } else {
        toast.error("Formato de archivo no válido. Use .xlsx, .xls o .csv");
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Por favor seleccione un archivo");
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento del archivo
    setTimeout(() => {
      // Datos de ejemplo que se importarían del Excel
      const mockImportedParticipants = [
        {
          id: Date.now() + 1,
          nombre: "Carlos Rodríguez",
          documento: "1098765432",
          empresa: "Constructora ABC S.A.S",
          cargo: "Operario de Altura",
          telefono: "310-5551234",
          email: "carlos.rodriguez@constructoraabc.com",
          curso: "Trabajos en Alturas",
          estado: "Activo",
          fechaInscripcion: todayISO()
        },
        {
          id: Date.now() + 2,
          nombre: "María Fernanda López",
          documento: "1087654321",
          empresa: "Industrias Metalúrgicas XYZ",
          cargo: "Supervisor HSE",
          telefono: "320-5554321",
          email: "mf.lopez@metalurgicas.com",
          curso: "Seguridad Industrial",
          estado: "Activo",
          fechaInscripcion: todayISO()
        },
        {
          id: Date.now() + 3,
          nombre: "Juan Pablo Martínez",
          documento: "1076543210",
          empresa: "Petroquímica del Valle",
          cargo: "Técnico de Mantenimiento",
          telefono: "315-5552222",
          email: "jp.martinez@petrovalle.com",
          curso: "Riesgo Eléctrico",
          estado: "Activo",
          fechaInscripcion: todayISO()
        },
        {
          id: Date.now() + 4,
          nombre: "Ana Lucía Gómez",
          documento: "1065432109",
          empresa: "Servicios Generales Ltda",
          cargo: "Coordinadora de Seguridad",
          telefono: "318-5553333",
          email: "ana.gomez@servicios.com",
          curso: "Primeros Auxilios",
          estado: "Activo",
          fechaInscripcion: todayISO()
        },
        {
          id: Date.now() + 5,
          nombre: "Roberto Sánchez",
          documento: "1054321098",
          empresa: "Construcciones del Norte",
          cargo: "Ingeniero Civil",
          telefono: "300-5554444",
          email: "roberto.sanchez@construnorte.com",
          curso: "Espacios Confinados",
          estado: "Activo",
          fechaInscripcion: todayISO()
        }
      ];

      const results = {
        success: mockImportedParticipants.length,
        failed: 0,
        total: mockImportedParticipants.length
      };

      setImportResults(results);
      onParticipantsImported(mockImportedParticipants);
      setIsProcessing(false);

      toast.success(`¡Importación exitosa! ${results.success} participantes agregados.`);
    }, 2000);
  };

  const handleClose = () => {
    setFile(null);
    setImportResults(null);
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    toast.success("Descargando plantilla de Excel...");
    // En una implementación real, aquí se descargaría un archivo Excel de plantilla
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
              <li>El archivo debe ser formato Excel (.xlsx, .xls) o CSV (.csv)</li>
              <li>Debe contener las siguientes columnas: Nombre, Documento, Empresa, Cargo, Teléfono, Email, Curso</li>
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
              Descargar Plantilla de Excel
            </Button>
          </div>

          {/* Área de carga de archivo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.xls,.csv"
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
                    Formatos soportados: .xlsx, .xls, .csv
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
