import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Download, Award, GraduationCap, X, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { parseISODate, todayISO } from "../lib/dates";

interface InstructorCertificateDesignerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructor?: any;
}

export function InstructorCertificateDesigner({ open, onOpenChange, instructor }: InstructorCertificateDesignerProps) {
  const [formData, setFormData] = useState({
    nombreInstructor: "",
    documentoInstructor: "",
    tipoCertificacion: "",
    especialidad: "",
    entidadCertificadora: "",
    fechaEmision: "",
    fechaVencimiento: "",
    numeroCertificado: "",
    horasFormacion: "",
    competencias: "",
    lugarEmision: "Cartagena de Indias",
    observaciones: ""
  });

  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 1400, height: 850 });
  const dragRef = useRef(null);

  useEffect(() => {
    if (instructor) {
      setFormData({
        nombreInstructor: instructor.nombre || "",
        documentoInstructor: instructor.documento || instructor.numeroDocumento || "",
        tipoCertificacion: "",
        especialidad: instructor.especialidad || "",
        entidadCertificadora: "",
        fechaEmision: todayISO(),
        fechaVencimiento: "",
        numeroCertificado: `INST-${Date.now().toString().slice(-6)}`,
        horasFormacion: instructor.horasFormacion || "",
        competencias: "",
        lugarEmision: "Cartagena de Indias",
        observaciones: ""
      });
    } else {
      setFormData({
        nombreInstructor: "",
        documentoInstructor: "",
        tipoCertificacion: "",
        especialidad: "",
        entidadCertificadora: "",
        fechaEmision: todayISO(),
        fechaVencimiento: "",
        numeroCertificado: `INST-${Date.now().toString().slice(-6)}`,
        horasFormacion: "",
        competencias: "",
        lugarEmision: "Cartagena de Indias",
        observaciones: ""
      });
    }
  }, [instructor, open]);

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
    if (!formData.nombreInstructor || !formData.tipoCertificacion) {
      toast.error("Complete los campos obligatorios", {
        description: "Nombre del instructor y tipo de certificación son requeridos"
      });
      return;
    }

    try {
      const certificateElement = document.getElementById("instructor-certificate-preview");
      
      if (!certificateElement) {
        toast.error("Error al generar el certificado");
        return;
      }

      toast.info("Generando certificado PDF...", {
        description: "Por favor espere un momento"
      });

      const canvas = await html2canvas(certificateElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
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

      const fileName = `Certificado_Instructor_${formData.nombreInstructor.replace(/\s+/g, '_')}.pdf`;
      
      pdf.save(fileName);

      toast.success("Certificado generado exitosamente", {
        description: `El certificado de ${formData.nombreInstructor} se ha descargado`
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el certificado PDF");
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
            <div className="drag-handle bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 cursor-move flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Certificado de Instructor</h2>
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-1">Certificación de Instructor</h3>
                    <p className="text-sm text-blue-700">
                      Complete la información para emitir el certificado
                    </p>
                  </div>

                  {/* Información del Instructor */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Datos del Instructor
                    </h4>
                    
                    <div>
                      <Label htmlFor="nombreInstructor">
                        Nombre Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombreInstructor"
                        value={formData.nombreInstructor}
                        onChange={(e) => handleInputChange("nombreInstructor", e.target.value)}
                        placeholder="Ej: Ing. María González Pérez"
                      />
                    </div>

                    <div>
                      <Label htmlFor="documentoInstructor">Documento de Identidad</Label>
                      <Input
                        id="documentoInstructor"
                        value={formData.documentoInstructor}
                        onChange={(e) => handleInputChange("documentoInstructor", e.target.value)}
                        placeholder="Ej: 52.345.678"
                      />
                    </div>
                  </div>

                  {/* Información de la Certificación */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Datos de la Certificación
                    </h4>

                    <div>
                      <Label htmlFor="tipoCertificacion">
                        Tipo de Certificación <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.tipoCertificacion}
                        onValueChange={(value) => handleInputChange("tipoCertificacion", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instructor Certificado">Instructor Certificado</SelectItem>
                          <SelectItem value="Instructor Avanzado">Instructor Avanzado</SelectItem>
                          <SelectItem value="Especialista en Formación">Especialista en Formación</SelectItem>
                          <SelectItem value="Coordinador de Formación">Coordinador de Formación</SelectItem>
                          <SelectItem value="Auditor de Seguridad">Auditor de Seguridad</SelectItem>
                          <SelectItem value="Consultor SST">Consultor SST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Select
                        value={formData.especialidad}
                        onValueChange={(value) => handleInputChange("especialidad", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Trabajos en Alturas">Trabajos en Alturas</SelectItem>
                          <SelectItem value="Seguridad Industrial">Seguridad Industrial</SelectItem>
                          <SelectItem value="Primeros Auxilios">Primeros Auxilios</SelectItem>
                          <SelectItem value="Espacios Confinados">Espacios Confinados</SelectItem>
                          <SelectItem value="Riesgo Eléctrico">Riesgo Eléctrico</SelectItem>
                          <SelectItem value="SGSST">Sistema de Gestión SST</SelectItem>
                          <SelectItem value="Higiene Industrial">Higiene Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="entidadCertificadora">Entidad Certificadora</Label>
                      <Input
                        id="entidadCertificadora"
                        value={formData.entidadCertificadora}
                        onChange={(e) => handleInputChange("entidadCertificadora", e.target.value)}
                        placeholder="Ej: ECM Training Center"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numeroCertificado">Número de Certificado</Label>
                      <Input
                        id="numeroCertificado"
                        value={formData.numeroCertificado}
                        onChange={(e) => handleInputChange("numeroCertificado", e.target.value)}
                        placeholder="Ej: INST-123456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
                        <Input
                          id="fechaEmision"
                          type="date"
                          value={formData.fechaEmision}
                          onChange={(e) => handleInputChange("fechaEmision", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                        <Input
                          id="fechaVencimiento"
                          type="date"
                          value={formData.fechaVencimiento}
                          onChange={(e) => handleInputChange("fechaVencimiento", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="horasFormacion">Horas de Formación Certificadas</Label>
                      <Input
                        id="horasFormacion"
                        type="number"
                        value={formData.horasFormacion}
                        onChange={(e) => handleInputChange("horasFormacion", e.target.value)}
                        placeholder="Ej: 120"
                      />
                    </div>

                    <div>
                      <Label htmlFor="competencias">Competencias Certificadas</Label>
                      <Textarea
                        id="competencias"
                        value={formData.competencias}
                        onChange={(e) => handleInputChange("competencias", e.target.value)}
                        placeholder="Liste las competencias certificadas..."
                        rows={3}
                      />
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
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={formData.observaciones}
                        onChange={(e) => handleInputChange("observaciones", e.target.value)}
                        placeholder="Observaciones adicionales..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section - Right Side - Tamaño Carta Horizontal */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Vista Previa - Tamaño Carta (Horizontal)</h3>
                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!formData.nombreInstructor || !formData.tipoCertificacion}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>

                {/* Certificate Preview - Letter Size (11x8.5 inches) Landscape */}
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '1000px' }}>
                  <div 
                    id="instructor-certificate-preview"
                    className="relative bg-white p-12"
                    style={{
                      aspectRatio: '11/8.5',
                      backgroundImage: `
                        linear-gradient(to bottom, rgba(59, 130, 246, 0.03), rgba(37, 99, 235, 0.03)),
                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.02) 10px, rgba(59, 130, 246, 0.02) 20px)
                      `
                    }}
                  >
                    {/* Border Decoration */}
                    <div className="absolute inset-3 border-4 border-blue-600 rounded-lg"></div>
                    <div className="absolute inset-5 border-2 border-blue-400 rounded-lg"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Header */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">ECM</span>
                          </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          ECM TRAINING CENTER
                        </h1>
                        <p className="text-sm text-gray-700 mb-3">
                          Centro de Formación en Seguridad Industrial
                        </p>
                        <div className="h-1 w-48 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-4"></div>
                        <h2 className="text-xl font-bold text-blue-600 mb-4">
                          CERTIFICACIÓN DE INSTRUCTOR
                        </h2>
                      </div>

                      {/* Body */}
                      <div className="flex-1 flex flex-col justify-center px-8">
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-700 mb-3">
                            Se certifica que
                          </p>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-2 inline-block px-6">
                            {formData.nombreInstructor || "[Nombre del Instructor]"}
                          </h3>
                          {formData.documentoInstructor && (
                            <p className="text-xs text-gray-600 mb-4">
                              Identificado(a) con C.C. {formData.documentoInstructor}
                            </p>
                          )}
                        </div>

                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-700 mb-2">
                            Ha sido certificado(a) como
                          </p>
                          <h4 className="text-xl font-bold text-blue-600 mb-2">
                            {formData.tipoCertificacion || "[Tipo de Certificación]"}
                          </h4>
                          {formData.especialidad && (
                            <p className="text-base text-gray-700">
                              Especialidad en {formData.especialidad}
                            </p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center max-w-3xl mx-auto mb-3">
                          {formData.horasFormacion && (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <span className="text-xs text-gray-600 block mb-1">Horas Certificadas</span>
                              <p className="text-sm font-semibold text-blue-600">{formData.horasFormacion} horas</p>
                            </div>
                          )}
                          {formData.fechaEmision && (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <span className="text-xs text-gray-600 block mb-1">Fecha de Emisión</span>
                              <p className="text-sm font-semibold text-gray-900">{formatDate(formData.fechaEmision)}</p>
                            </div>
                          )}
                          {formData.fechaVencimiento && (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <span className="text-xs text-gray-600 block mb-1">Vigencia Hasta</span>
                              <p className="text-sm font-semibold text-gray-900">{formatDate(formData.fechaVencimiento)}</p>
                            </div>
                          )}
                        </div>

                        {formData.competencias && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 max-w-2xl mx-auto">
                            <p className="text-xs text-gray-600 mb-1 text-center font-semibold">Competencias Certificadas:</p>
                            <p className="text-xs text-gray-700 text-center">{formData.competencias}</p>
                          </div>
                        )}

                        {formData.entidadCertificadora && (
                          <p className="text-xs text-gray-600 text-center mb-2">
                            Certificado por: <span className="font-semibold text-gray-900">{formData.entidadCertificadora}</span>
                          </p>
                        )}
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
                            <p className="text-xs font-semibold text-gray-900">Coordinador Académico</p>
                            <p className="text-xs text-gray-600">Certificaciones</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
                          <div>
                            {formData.lugarEmision && (
                              <p>Expedido en: {formData.lugarEmision}</p>
                            )}
                          </div>
                          <div>
                            {formData.numeroCertificado && (
                              <p>Certificado No. {formData.numeroCertificado}</p>
                            )}
                          </div>
                          <div>
                            <p>Fecha: {formatDate(formData.fechaEmision || todayISO())}</p>
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
                  disabled={!formData.nombreInstructor || !formData.tipoCertificacion}
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
