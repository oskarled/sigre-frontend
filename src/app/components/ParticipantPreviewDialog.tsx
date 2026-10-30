import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { User, Mail, Phone, Building2, Briefcase, Calendar, FileText, Award, MapPin, IdCard } from "lucide-react";
import { parseISODate } from "../lib/dates";

interface ParticipantPreviewDialogProps {
  participant: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ParticipantPreviewDialog({ participant, open, onOpenChange }: ParticipantPreviewDialogProps) {
  if (!participant) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = parseISODate(dateString) ?? new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'Egresado':
        return 'bg-blue-100 text-blue-800';
      case 'Suspendido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getModalidadColor = (modalidad: string) => {
    switch (modalidad) {
      case 'presencial':
        return 'bg-blue-100 text-blue-800';
      case 'virtual':
        return 'bg-green-100 text-green-800';
      case 'hibrido':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'avanzado':
        return 'bg-purple-100 text-purple-800';
      case 'intermedio':
        return 'bg-blue-100 text-blue-800';
      case 'basico':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Vista Previa del Participante
          </DialogTitle>
          <DialogDescription>
            Información completa del participante registrado en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {participant.nombre || `${participant.nombres} ${participant.apellidos}` || "Sin nombre"}
                </h2>
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <IdCard className="w-4 h-4" />
                  <span>{participant.tipoDocumento || "CC"} {participant.documento || participant.numeroDocumento || "---"}</span>
                </div>
              </div>
              <Badge className={getEstadoColor(participant.estado)}>
                {participant.estado || "Activo"}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Información Personal */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Información Personal</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nombres:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.nombres || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Apellidos:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.apellidos || "---"}
                  </span>
                </div>
                {participant.fechaNacimiento && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fecha de nacimiento:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(participant.fechaNacimiento)}
                    </span>
                  </div>
                )}
                {participant.genero && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Género:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {participant.genero}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Información de Contacto</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.email || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Teléfono:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.telefono || "---"}
                  </span>
                </div>
                {participant.direccion && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Dirección:</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                      {participant.direccion}
                    </span>
                  </div>
                )}
                {(participant.ciudad || participant.departamento) && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ubicación:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {participant.ciudad && participant.departamento 
                        ? `${participant.ciudad}, ${participant.departamento}`
                        : participant.ciudad || participant.departamento || "---"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Información Laboral */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Información Laboral</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Empresa:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.empresa || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cargo:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.cargo || "---"}
                  </span>
                </div>
                {participant.areaLaboral && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Área laboral:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {participant.areaLaboral}
                    </span>
                  </div>
                )}
                {participant.experienciaAnios && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experiencia:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {participant.experienciaAnios} años
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Curso */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Información del Curso</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Curso inscrito:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {participant.curso || participant.cursoSeleccionado || "---"}
                  </span>
                </div>
                {participant.modalidad && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Modalidad:</span>
                    <Badge className={getModalidadColor(participant.modalidad)}>
                      {participant.modalidad.charAt(0).toUpperCase() + participant.modalidad.slice(1)}
                    </Badge>
                  </div>
                )}
                {participant.nivelConocimiento && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nivel:</span>
                    <Badge className={getNivelColor(participant.nivelConocimiento)}>
                      {participant.nivelConocimiento.charAt(0).toUpperCase() + participant.nivelConocimiento.slice(1)}
                    </Badge>
                  </div>
                )}
                {participant.fechaRegistro && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fecha de registro:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {participant.fechaRegistro}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          {participant.id && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Información del Sistema</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID del participante:</span>
                  <p className="font-medium text-gray-900">#{participant.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <p className="font-medium text-gray-900">{participant.estado || "Activo"}</p>
                </div>
                {participant.fechaRegistro && (
                  <div>
                    <span className="text-gray-600">Registrado:</span>
                    <p className="font-medium text-gray-900">{participant.fechaRegistro}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button className="bg-orange-700 hover:bg-orange-800">
            Editar Participante
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
