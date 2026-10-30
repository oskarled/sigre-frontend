import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Download, Award, User, Calendar, GraduationCap, X, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { parseISODate, todayISO } from "../lib/dates";

interface CertificateDesignerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: any;
}

/**
 * Editor del certificado de un participante.
 * Muestra una vista previa en una ventana arrastrable y redimensionable y la exporta a PDF (jsPDF + html2canvas).
 * Rol: instructor y administrador.
 */
export function CertificateDesigner({ open, onOpenChange, certificate }: CertificateDesignerProps) {
  const [formData, setFormData] = useState({
    participante: "",
    documento: "",
    curso: "",
    fechaInicio: "",
    fechaFin: "",
    calificacion: "",
    instructor: "",
    duracion: "",
    lugarEmision: "Cartagena de Indias",
    numeroRegistro: "",
    observaciones: ""
  });
  
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 1400, height: 850 });
  const dragRef = useRef(null);

  useEffect(() => {
    if (certificate) {
      setFormData({
        participante: certificate.participante || "",
        documento: certificate.documento || "",
        curso: certificate.curso || "",
        fechaInicio: certificate.fechaInicio || "",
        fechaFin: certificate.fechaFin || "",
        calificacion: certificate.calificacion || "",
        instructor: certificate.instructor || "",
        duracion: certificate.duracion || "40",
        lugarEmision: certificate.lugarEmision || "Cartagena de Indias",
        numeroRegistro: certificate.numeroRegistro || "",
        observaciones: certificate.observaciones || ""
      });
    } else {
      // Valores por defecto para nuevo certificado
      setFormData({
        participante: "",
        documento: "",
        curso: "",
        fechaInicio: todayISO(),
        fechaFin: todayISO(),
        calificacion: "",
        instructor: "",
        duracion: "40",
        lugarEmision: "Cartagena de Indias",
        numeroRegistro: `CERT-${Date.now().toString().slice(-6)}`,
        observaciones: ""
      });
    }
  }, [certificate, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = parseISODate(dateString) ?? new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDownloadPDF = async () => {
    if (!formData.participante || !formData.curso) {
      toast.error("⚠️ Complete los campos obligatorios", {
        description: "Nombre del participante y curso son requeridos"
      });
      return;
    }

    try {
      const certificateElement = document.getElementById("certificate-preview");
      
      if (!certificateElement) {
        toast.error("Error al generar el certificado");
        return;
      }

      const loadingToast = toast.loading("🔄 Generando certificado PDF...", {
        description: "Capturando diseño en alta calidad..."
      });

      const canvas = await html2canvas(certificateElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      toast.loading("🔄 Generando certificado PDF...", {
        id: loadingToast,
        description: "Creando documento PDF..."
      });

      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "letter"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const yPosition = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", 10, yPosition > 0 ? yPosition : 10, imgWidth, imgHeight);

      toast.loading("🔄 Generando certificado PDF...", {
        id: loadingToast,
        description: "Guardando archivo en tu equipo..."
      });

      const fileName = `Certificado_${formData.participante.replace(/\s+/g, '_')}_${formData.curso.replace(/\s+/g, '_')}.pdf`;
      
      pdf.save(fileName);

      toast.success("✅ Certificado descargado exitosamente", {
        id: loadingToast,
        description: `${fileName} guardado en Descargas`
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("❌ Error al generar el certificado PDF", {
        description: "Intente nuevamente o verifique los datos"
      });
    }
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 1400, height: 850 });
    } else {
      setSize({ 
        width: window.innerWidth - 40, 
        height: window.innerHeight - 40 
      });
    }
    setIsMaximized(!isMaximized);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Draggable Modal */}
      <Draggable
        handle=".drag-handle"
        nodeRef={dragRef}
        bounds="parent"
        disabled={isMaximized}
      >
        <div 
          ref={dragRef}
          className="fixed z-50"
          style={{
            left: isMaximized ? '20px' : '50%',
            top: isMaximized ? '20px' : '50%',
            transform: isMaximized ? 'none' : 'translate(-50%, -50%)',
          }}
        >
          <Resizable
            size={size}
            onResizeStop={(e, direction, ref, d) => {
              setSize({
                width: size.width + d.width,
                height: size.height + d.height,
              });
            }}
            minWidth={900}
            minHeight={600}
            maxWidth={window.innerWidth - 40}
            maxHeight={window.innerHeight - 40}
            enable={{
              top: !isMaximized,
              right: !isMaximized,
              bottom: !isMaximized,
              left: !isMaximized,
              topRight: !isMaximized,
              bottomRight: !isMaximized,
              bottomLeft: !isMaximized,
              topLeft: !isMaximized
            }}
            className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header - Draggable */}
            <div className="drag-handle bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 cursor-move flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold">
                    {certificate ? "Editar Certificado" : "Diseñar Nuevo Certificado"}
                  </h2>
                  <p className="text-white/80 text-sm">
                    Complete los datos y vea la vista previa en tiempo real
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMaximize}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Form Section - Left Side */}
              <div className="w-96 border-r overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-1">Información del Certificado</h3>
                    <p className="text-sm text-orange-700">
                      Complete los datos para generar el certificado
                    </p>
                  </div>

                  {/* Información del Participante */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Datos del Participante
                    </h4>
                    
                    <div>
                      <Label htmlFor="participante">
                        Nombre Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="participante"
                        value={formData.participante}
                        onChange={(e) => handleInputChange("participante", e.target.value)}
                        placeholder="Ej: Carlos Alberto Rodríguez"
                      />
                    </div>

                    <div>
                      <Label htmlFor="documento">Documento de Identidad</Label>
                      <Input
                        id="documento"
                        value={formData.documento}
                        onChange={(e) => handleInputChange("documento", e.target.value)}
                        placeholder="Ej: 1.234.567-8"
                      />
                    </div>
                  </div>

                  {/* Información del Curso */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Datos del Curso
                    </h4>

                    <div>
                      <Label htmlFor="curso">
                        Nombre del Curso <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.curso}
                        onValueChange={(value) => handleInputChange("curso", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Trabajos en Alturas">Trabajos en Alturas</SelectItem>
                          <SelectItem value="Seguridad Industrial">Seguridad Industrial</SelectItem>
                          <SelectItem value="Primeros Auxilios">Primeros Auxilios</SelectItem>
                          <SelectItem value="Espacios Confinados">Espacios Confinados</SelectItem>
                          <SelectItem value="Riesgo Eléctrico">Riesgo Eléctrico</SelectItem>
                          <SelectItem value="Manejo de Extintores">Manejo de Extintores</SelectItem>
                          <SelectItem value="SGSST">Sistema de Gestión SST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duracion">Duración (horas)</Label>
                      <Input
                        id="duracion"
                        type="number"
                        value={formData.duracion}
                        onChange={(e) => handleInputChange("duracion", e.target.value)}
                        placeholder="Ej: 40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                        <Input
                          id="fechaInicio"
                          type="date"
                          value={formData.fechaInicio}
                          onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fechaFin">Fecha de Fin</Label>
                        <Input
                          id="fechaFin"
                          type="date"
                          value={formData.fechaFin}
                          onChange={(e) => handleInputChange("fechaFin", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="calificacion">Calificación Final (%)</Label>
                      <Input
                        id="calificacion"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.calificacion}
                        onChange={(e) => handleInputChange("calificacion", e.target.value)}
                        placeholder="Ej: 95"
                      />
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Información Adicional
                    </h4>

                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Select
                        value={formData.instructor}
                        onValueChange={(value) => handleInputChange("instructor", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ing. María González">Ing. María González</SelectItem>
                          <SelectItem value="Ing. Pedro Martínez">Ing. Pedro Martínez</SelectItem>
                          <SelectItem value="Dr. Jorge Ramírez">Dr. Jorge Ramírez</SelectItem>
                          <SelectItem value="Ing. Carlos Ruiz">Ing. Carlos Ruiz</SelectItem>
                          <SelectItem value="Ing. Ana Méndez">Ing. Ana Méndez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="lugarEmision">Lugar de Emisión</Label>
                      <Input
                        id="lugarEmision"
                        value={formData.lugarEmision}
                        onChange={(e) => handleInputChange("lugarEmision", e.target.value)}
                        placeholder="Ej: Cartagena de Indias"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numeroRegistro">Número de Registro</Label>
                      <Input
                        id="numeroRegistro"
                        value={formData.numeroRegistro}
                        onChange={(e) => handleInputChange("numeroRegistro", e.target.value)}
                        placeholder="Ej: CERT-123456"
                      />
                    </div>

                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={formData.observaciones}
                        onChange={(e) => handleInputChange("observaciones", e.target.value)}
                        placeholder="Observaciones adicionales..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section - Right Side */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Vista Previa del Certificado</h3>
                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!formData.participante || !formData.curso}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>

                {/* Certificate Preview */}
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '1000px' }}>
                  <div 
                    id="certificate-preview"
                    className="relative bg-white p-12"
                    style={{
                      aspectRatio: '11/8.5',
                      backgroundImage: `
                        linear-gradient(to bottom, rgba(249, 115, 22, 0.03), rgba(239, 68, 68, 0.03)),
                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(249, 115, 22, 0.02) 10px, rgba(249, 115, 22, 0.02) 20px)
                      `
                    }}
                  >
                    {/* Border Decoration */}
                    <div className="absolute inset-3 border-4 border-orange-600 rounded-lg"></div>
                    <div className="absolute inset-5 border-2 border-orange-400 rounded-lg"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Header */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">ECM</span>
                          </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          ECM TRAINING CENTER
                        </h1>
                        <p className="text-base text-gray-700 mb-4">
                          Centro de Formación en Seguridad Industrial
                        </p>
                        <div className="h-1 w-48 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-6"></div>
                        <h2 className="text-2xl font-bold text-orange-600 mb-6">
                          CERTIFICADO DE FORMACIÓN
                        </h2>
                      </div>

                      {/* Body */}
                      <div className="flex-1 flex flex-col justify-center text-center px-8">
                        <p className="text-base text-gray-700 mb-4">
                          El Centro de Formación ECM Training Center certifica que
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-orange-600 pb-2 inline-block mx-auto px-6">
                          {formData.participante || "[Nombre del Participante]"}
                        </h3>
                        {formData.documento && (
                          <p className="text-sm text-gray-600 mb-4">
                            Identificado(a) con C.C. {formData.documento}
                          </p>
                        )}
                        <p className="text-base text-gray-700 mb-3">
                          Ha completado satisfactoriamente el curso de
                        </p>
                        <h4 className="text-2xl font-bold text-orange-600 mb-5">
                          {formData.curso || "[Nombre del Curso]"}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-6 text-left max-w-xl mx-auto mb-4">
                          {formData.duracion && (
                            <div>
                              <span className="text-xs text-gray-600">Duración:</span>
                              <p className="font-semibold text-gray-900">{formData.duracion} horas</p>
                            </div>
                          )}
                          {formData.fechaInicio && formData.fechaFin && (
                            <div>
                              <span className="text-xs text-gray-600">Período:</span>
                              <p className="font-semibold text-gray-900 text-sm">
                                {formatDate(formData.fechaInicio)} - {formatDate(formData.fechaFin)}
                              </p>
                            </div>
                          )}
                          {formData.calificacion && (
                            <div>
                              <span className="text-xs text-gray-600">Calificación:</span>
                              <p className="font-semibold text-green-600">{formData.calificacion}%</p>
                            </div>
                          )}
                          {formData.instructor && (
                            <div>
                              <span className="text-xs text-gray-600">Instructor:</span>
                              <p className="font-semibold text-gray-900">{formData.instructor}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center">
                        <div className="flex justify-center items-center gap-12 mb-3">
                          <div className="text-center">
                            <div className="w-40 border-t-2 border-gray-800 mb-2"></div>
                            <p className="text-xs font-semibold text-gray-900">Director General</p>
                            <p className="text-xs text-gray-600">ECM Training Center</p>
                          </div>
                          <div className="text-center">
                            <div className="w-40 border-t-2 border-gray-800 mb-2"></div>
                            <p className="text-xs font-semibold text-gray-900">
                              {formData.instructor || "Instructor"}
                            </p>
                            <p className="text-xs text-gray-600">Instructor Certificado</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-600 mt-4">
                          <div>
                            {formData.lugarEmision && (
                              <p>Expedido en: {formData.lugarEmision}</p>
                            )}
                          </div>
                          <div>
                            {formData.numeroRegistro && (
                              <p>Registro No. {formData.numeroRegistro}</p>
                            )}
                          </div>
                          <div>
                            <p>Fecha: {formatDate(formData.fechaFin || todayISO())}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">
                  Guardar Borrador
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-orange-700 hover:bg-orange-800"
                  disabled={!formData.participante || !formData.curso}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generar y Descargar
                </Button>
              </div>
            </div>
          </Resizable>
        </div>
      </Draggable>
    </>
  );
}
