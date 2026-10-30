import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Award, Plus, Trash2, Calendar, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { parseISODate } from "../lib/dates";

interface Certification {
  id: number;
  nombre: string;
  entidad: string;
  fechaEmision: string;
  fechaVencimiento: string;
  numeroCertificado: string;
  estado: "vigente" | "por_vencer" | "vencida";
}

interface InstructorCertificationsDialogProps {
  instructor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstructorCertificationsDialog({ instructor, open, onOpenChange }: InstructorCertificationsDialogProps) {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      nombre: "Instructor Certificado en Trabajos en Alturas",
      entidad: "SENA",
      fechaEmision: "2023-01-15",
      fechaVencimiento: "2027-01-15",
      numeroCertificado: "TA-2023-001234",
      estado: "vigente"
    },
    {
      id: 2,
      nombre: "Primeros Auxilios y RCP",
      entidad: "Cruz Roja Colombiana",
      fechaEmision: "2024-03-10",
      fechaVencimiento: "2026-12-10",
      numeroCertificado: "PA-2024-005678",
      estado: "por_vencer"
    },
    {
      id: 3,
      nombre: "Sistema de Gestión SST",
      entidad: "ICONTEC",
      fechaEmision: "2022-06-20",
      fechaVencimiento: "2026-06-20",
      numeroCertificado: "SST-2022-009876",
      estado: "vigente"
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCertification, setNewCertification] = useState({
    nombre: "",
    entidad: "",
    fechaEmision: "",
    fechaVencimiento: "",
    numeroCertificado: ""
  });

  const handleAddCertification = () => {
    if (!newCertification.nombre || !newCertification.entidad || !newCertification.fechaEmision) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    const certification: Certification = {
      id: Date.now(),
      ...newCertification,
      estado: "vigente"
    };

    setCertifications([...certifications, certification]);
    setNewCertification({
      nombre: "",
      entidad: "",
      fechaEmision: "",
      fechaVencimiento: "",
      numeroCertificado: ""
    });
    setIsAddingNew(false);
    toast.success("Certificación agregada exitosamente");
  };

  const handleDeleteCertification = (id: number) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    toast.success("Certificación eliminada");
  };

  // El estado se calcula con la fecha de vencimiento (antes estaba escrito a mano y quedaba desactualizado).
  const calcularEstado = (cert: Certification): Certification["estado"] => {
    const vence = parseISODate(cert.fechaVencimiento);
    if (!vence) return "vigente";
    const dias = (vence.getTime() - Date.now()) / 86_400_000;
    if (dias < 0) return "vencida";
    if (dias <= 90) return "por_vencer";
    return "vigente";
  };

  const getEstadoBadge = (estado: Certification["estado"]) => {
    switch (estado) {
      case "vigente":
        return <Badge className="bg-green-100 text-green-800">Vigente</Badge>;
      case "por_vencer":
        return <Badge className="bg-yellow-100 text-yellow-800">Por Vencer</Badge>;
      case "vencida":
        return <Badge className="bg-red-100 text-red-800">Vencida</Badge>;
    }
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

  if (!instructor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            Certificaciones del Instructor
          </DialogTitle>
          <DialogDescription>
            Gestione las certificaciones y licencias de {instructor.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Instructor Info */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{instructor.nombre}</h3>
                <p className="text-sm text-gray-600">{instructor.especialidad || instructor.titulo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Certificaciones</p>
                <p className="text-2xl font-bold text-orange-600">{certifications.length}</p>
              </div>
            </div>
          </div>

          {/* Add New Certification Button */}
          {!isAddingNew && (
            <div className="mb-6">
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-orange-700 hover:bg-orange-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Certificación
              </Button>
            </div>
          )}

          {/* Add New Certification Form */}
          {isAddingNew && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nueva Certificación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nombreCert">
                    Nombre de la Certificación <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombreCert"
                    value={newCertification.nombre}
                    onChange={(e) => setNewCertification({ ...newCertification, nombre: e.target.value })}
                    placeholder="Ej: Instructor en Trabajos en Alturas"
                  />
                </div>

                <div>
                  <Label htmlFor="entidad">
                    Entidad Emisora <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="entidad"
                    value={newCertification.entidad}
                    onChange={(e) => setNewCertification({ ...newCertification, entidad: e.target.value })}
                    placeholder="Ej: SENA"
                  />
                </div>

                <div>
                  <Label htmlFor="numeroCertificado">Número de Certificado</Label>
                  <Input
                    id="numeroCertificado"
                    value={newCertification.numeroCertificado}
                    onChange={(e) => setNewCertification({ ...newCertification, numeroCertificado: e.target.value })}
                    placeholder="Ej: TA-2024-001234"
                  />
                </div>

                <div>
                  <Label htmlFor="fechaEmision">
                    Fecha de Emisión <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaEmision"
                    type="date"
                    value={newCertification.fechaEmision}
                    onChange={(e) => setNewCertification({ ...newCertification, fechaEmision: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                  <Input
                    id="fechaVencimiento"
                    type="date"
                    value={newCertification.fechaVencimiento}
                    onChange={(e) => setNewCertification({ ...newCertification, fechaVencimiento: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={handleAddCertification} className="bg-green-600 hover:bg-green-700">
                  Guardar Certificación
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Certifications List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Certificaciones Registradas</h3>
            
            {certifications.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No hay certificaciones registradas</p>
              </div>
            ) : (
              certifications.map((cert) => (
                <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{cert.nombre}</h4>
                        {getEstadoBadge(calcularEstado(cert))}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Entidad:</span> {cert.entidad}
                      </p>
                      {cert.numeroCertificado && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">N° Certificado:</span> {cert.numeroCertificado}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <span className="font-medium">Emisión:</span> {formatDate(cert.fechaEmision)}
                      </div>
                    </div>
                    {cert.fechaVencimiento && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <span className="font-medium">Vencimiento:</span> {formatDate(cert.fechaVencimiento)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button className="bg-orange-700 hover:bg-orange-800">
            Exportar Certificaciones
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
