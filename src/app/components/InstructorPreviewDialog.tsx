import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { User, Mail, Phone, GraduationCap, Award, Briefcase, Calendar, FileText } from "lucide-react";
import { parseISODate } from "../lib/dates";

interface InstructorPreviewDialogProps {
  instructor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCertifications?: (instructor: any) => void;
}

/**
 * Diálogo con la hoja de vida de un instructor (datos, formación y especialidades).
 */
export function InstructorPreviewDialog({ instructor, open, onOpenChange, onOpenCertifications }: InstructorPreviewDialogProps) {
  if (!instructor) return null;

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
      case 'Vacaciones':
        return 'bg-blue-100 text-blue-800';
      case 'Licencia':
        return 'bg-yellow-100 text-yellow-800';
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
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            Vista Previa del Instructor
          </DialogTitle>
          <DialogDescription>
            Información completa del instructor y su perfil profesional
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {instructor.nombre || `${instructor.nombres} ${instructor.apellidos}` || "Sin nombre"}
                </h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className="bg-orange-100 text-orange-800">
                    {instructor.titulo || "Instructor"}
                  </Badge>
                  {instructor.especialidad && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {instructor.especialidad}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700">
                  {instructor.documento || instructor.numeroDocumento || "---"}
                </p>
              </div>
              <Badge className={getEstadoColor(instructor.estado)}>
                {instructor.estado || "Activo"}
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
                  <span className="text-sm text-gray-600">Documento:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.tipoDocumento || "CC"} {instructor.documento || instructor.numeroDocumento || "---"}
                  </span>
                </div>
                {instructor.fechaNacimiento && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fecha de nacimiento:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(instructor.fechaNacimiento)}
                    </span>
                  </div>
                )}
                {instructor.genero && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Género:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {instructor.genero}
                    </span>
                  </div>
                )}
                {(instructor.ciudad || instructor.departamento) && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ubicación:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {instructor.ciudad && instructor.departamento 
                        ? `${instructor.ciudad}, ${instructor.departamento}`
                        : instructor.ciudad || instructor.departamento || "---"}
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
                    {instructor.email || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Teléfono:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.telefono || "---"}
                  </span>
                </div>
                {instructor.direccion && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Dirección:</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                      {instructor.direccion}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Información Académica */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Formación Académica</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Título:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.titulo || "---"}
                  </span>
                </div>
                {instructor.nivelEducativo && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nivel:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {instructor.nivelEducativo}
                    </span>
                  </div>
                )}
                {instructor.universidadEgreso && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Universidad:</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                      {instructor.universidadEgreso}
                    </span>
                  </div>
                )}
                {instructor.anioGraduacion && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Año de graduación:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {instructor.anioGraduacion}
                    </span>
                  </div>
                )}
                {instructor.registroProfesional && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Registro:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {instructor.registroProfesional}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Experiencia y Certificaciones */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Experiencia</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Años de experiencia:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.aniosExperiencia ? `${instructor.aniosExperiencia} años` : "---"}
                  </span>
                </div>
                {instructor.certificaciones !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Certificaciones:</span>
                    <span className="text-sm font-medium text-orange-600">
                      {instructor.certificaciones}
                    </span>
                  </div>
                )}
                {instructor.horasFormacion && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Horas dictadas:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {instructor.horasFormacion} horas
                    </span>
                  </div>
                )}
                {instructor.cursosActivos !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cursos activos:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {instructor.cursosActivos}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Áreas de Especialización */}
          {instructor.areasEspecializacion && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Áreas de Especialización</h3>
              </div>
              <p className="text-sm text-gray-700">
                {instructor.areasEspecializacion}
              </p>
            </div>
          )}

          {/* Cursos Dictados */}
          {instructor.cursosDictados && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Cursos Dictados</h3>
              </div>
              <p className="text-sm text-gray-700">
                {instructor.cursosDictados}
              </p>
            </div>
          )}

          {/* Información del Sistema */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Información del Sistema</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {instructor.id && (
                <div>
                  <span className="text-gray-600">ID del instructor:</span>
                  <p className="font-medium text-gray-900">#{instructor.id}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600">Estado:</span>
                <p className="font-medium text-gray-900">{instructor.estado || "Activo"}</p>
              </div>
              {instructor.fechaRegistro && (
                <div>
                  <span className="text-gray-600">Registrado:</span>
                  <p className="font-medium text-gray-900">{instructor.fechaRegistro}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {onOpenCertifications && (
            <Button 
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onOpenCertifications(instructor);
              }}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Award className="w-4 h-4 mr-2" />
              Ver Certificaciones
            </Button>
          )}
          <Button className="bg-orange-700 hover:bg-orange-800">
            Editar Instructor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
