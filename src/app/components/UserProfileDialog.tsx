import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  GraduationCap, Award, Upload, Camera,
  IdCard, Building, BookOpen
} from "lucide-react";
import type { SessionUser } from "../lib/roles";

interface UserProfileDialogProps {
  user: SessionUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {
  const role = user.role;
  // Nombre y correo de la sesión. El resto del perfil es de ejemplo hasta que exista GET /api/usuarios/{id}.
  const [primerNombre, ...apellidosSesion] = user.nombre.split(" ");
  // Cada usuario ve solo su propio perfil. El administrador usa la vista de instructor (personal de ECM).
  const activeTab = role === "participante" ? "participante" : "instructor";
  const [participantImage, setParticipantImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80");
  const [instructorImage, setInstructorImage] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80");
  
  // Estados editables del participante
  const [participantEditData, setParticipantEditData] = useState({
    email: user.email,
    telefono: "+57 310 456 7890",
    direccion: "Calle 45 #23-67",
    ciudad: "Cartagena de Indias",
    empresa: "Constructora del Norte S.A.",
    cargo: "Supervisor de Obra"
  });

  // Estados editables del instructor
  const [instructorEditData, setInstructorEditData] = useState({
    email: user.email,
    telefono: "+57 315 678 9012",
    direccion: "Carrera 15 #89-45",
    ciudad: "Cartagena de Indias",
    especialidad: "Trabajos en Alturas",
    experiencia: "8 años"
  });

  // Datos del Participante
  const participantData = {
    nombres: primerNombre,
    apellidos: apellidosSesion.join(" "),
    documento: "1.234.567-8",
    email: user.email,
    telefono: "+57 310 456 7890",
    direccion: "Calle 45 #23-67",
    ciudad: "Cartagena de Indias",
    fechaNacimiento: "15/03/1992",
    empresa: "Constructora del Norte S.A.",
    cargo: "Supervisor de Obra",
    cursosInscritos: 3,
    cursosCompletados: 2,
    certificaciones: 2,
    calificacionPromedio: "92"
  };

  // Datos del Instructor
  const instructorData = {
    nombres: primerNombre,
    apellidos: apellidosSesion.join(" "),
    titulo: "Ingeniera Industrial",
    documento: "52.345.678",
    email: user.email,
    telefono: "+57 315 678 9012",
    direccion: "Carrera 15 #89-45",
    ciudad: "Cartagena de Indias",
    especialidad: "Trabajos en Alturas",
    experiencia: "8 años",
    cursosImpartidos: 45,
    estudiantesFormados: 380,
    certificaciones: 5,
    calificacionPromedio: "4.8"
  };

  const handleImageUpload = (type: "participante" | "instructor") => {
    // Simulación de carga de imagen
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          if (type === "participante") {
            setParticipantImage(event.target.result);
          } else {
            setInstructorImage(event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Mi Perfil
          </DialogTitle>
          <DialogDescription>
            Administra tu información personal y profesional
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} className="w-full">

          {/* PERFIL PARTICIPANTE */}
          <TabsContent value="participante" className="space-y-6 mt-6">
            {/* Header con foto */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={participantImage} alt="Participante" />
                    <AvatarFallback className="bg-orange-200 text-orange-700">
                      {participantData.nombres.charAt(0)}{participantData.apellidos.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    onClick={() => handleImageUpload("participante")}
                    className="absolute bottom-0 right-0 w-8 h-8 p-0 rounded-full bg-orange-700 hover:bg-orange-800 shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {participantData.nombres} {participantData.apellidos}
                  </h3>
                  <p className="text-gray-600 mb-3">{participantData.cargo} - {participantData.empresa}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      {participantData.cursosCompletados} Cursos Completados
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {participantData.certificaciones} Certificaciones
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700">
                      Promedio: {participantData.calificacionPromedio}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-orange-600" />
                Información Personal
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-nombres">Nombres</Label>
                  <Input id="p-nombres" value={participantData.nombres} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="p-apellidos">Apellidos</Label>
                  <Input id="p-apellidos" value={participantData.apellidos} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="p-documento">Documento</Label>
                  <Input id="p-documento" value={participantData.documento} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="p-nacimiento">Fecha de Nacimiento</Label>
                  <Input id="p-nacimiento" value={participantData.fechaNacimiento} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="p-email">Correo Electrónico</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input 
                      id="p-email" 
                      value={participantEditData.email} 
                      onChange={(e) => setParticipantEditData({ ...participantEditData, email: e.target.value })}
                      className="flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="p-telefono">Teléfono</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input 
                      id="p-telefono" 
                      value={participantEditData.telefono} 
                      onChange={(e) => setParticipantEditData({ ...participantEditData, telefono: e.target.value })}
                      className="flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="p-direccion">Dirección</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <Input 
                      id="p-direccion" 
                      value={participantEditData.direccion} 
                      onChange={(e) => setParticipantEditData({ ...participantEditData, direccion: e.target.value })}
                      className="flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="p-ciudad">Ciudad</Label>
                  <Input 
                    id="p-ciudad" 
                    value={participantEditData.ciudad} 
                    onChange={(e) => setParticipantEditData({ ...participantEditData, ciudad: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Información Laboral */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                Información Laboral
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-empresa">Empresa</Label>
                  <Input 
                    id="p-empresa" 
                    value={participantEditData.empresa} 
                    onChange={(e) => setParticipantEditData({ ...participantEditData, empresa: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="p-cargo">Cargo</Label>
                  <Input 
                    id="p-cargo" 
                    value={participantEditData.cargo} 
                    onChange={(e) => setParticipantEditData({ ...participantEditData, cargo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Estadísticas de Formación */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                Estadísticas de Formación
              </h4>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{participantData.cursosInscritos}</p>
                  <p className="text-sm text-gray-600">Cursos Inscritos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{participantData.cursosCompletados}</p>
                  <p className="text-sm text-gray-600">Completados</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{participantData.certificaciones}</p>
                  <p className="text-sm text-gray-600">Certificaciones</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{participantData.calificacionPromedio}%</p>
                  <p className="text-sm text-gray-600">Promedio</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* PERFIL INSTRUCTOR */}
          <TabsContent value="instructor" className="space-y-6 mt-6">
            {/* Header con foto */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={instructorImage} alt="Instructor" />
                    <AvatarFallback className="bg-blue-200 text-blue-700">
                      {instructorData.nombres.charAt(0)}{instructorData.apellidos.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    onClick={() => handleImageUpload("instructor")}
                    className="absolute bottom-0 right-0 w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {instructorData.nombres} {instructorData.apellidos}
                  </h3>
                  <p className="text-gray-600 mb-1">{instructorData.titulo}</p>
                  <p className="text-blue-600 mb-3">Especialista en {instructorData.especialidad}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-700">
                      {instructorData.cursosImpartidos} Cursos Impartidos
                    </Badge>
                    <Badge className="bg-green-100 text-green-700">
                      {instructorData.estudiantesFormados} Estudiantes Formados
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700">
                      {instructorData.certificaciones} Certificaciones
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700">
                      Calificación: {instructorData.calificacionPromedio}/5
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-blue-600" />
                Información Personal
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="i-nombres">Nombres</Label>
                  <Input id="i-nombres" value={instructorData.nombres} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="i-apellidos">Apellidos</Label>
                  <Input id="i-apellidos" value={instructorData.apellidos} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="i-titulo">Título Profesional</Label>
                  <Input id="i-titulo" value={instructorData.titulo} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="i-documento">Documento</Label>
                  <Input id="i-documento" value={instructorData.documento} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="i-email">Correo Electrónico</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input 
                      id="i-email" 
                      value={instructorEditData.email} 
                      onChange={(e) => setInstructorEditData({ ...instructorEditData, email: e.target.value })}
                      className="flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="i-telefono">Teléfono</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input 
                      id="i-telefono" 
                      value={instructorEditData.telefono} 
                      onChange={(e) => setInstructorEditData({ ...instructorEditData, telefono: e.target.value })}
                      className="flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="i-direccion">Dirección</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <Input 
                      id="i-direccion" 
                      value={instructorEditData.direccion} 
                      onChange={(e) => setInstructorEditData({ ...instructorEditData, direccion: e.target.value })}
                      className="flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="i-ciudad">Ciudad</Label>
                  <Input 
                    id="i-ciudad" 
                    value={instructorEditData.ciudad} 
                    onChange={(e) => setInstructorEditData({ ...instructorEditData, ciudad: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Información Profesional
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="i-especialidad">Especialidad</Label>
                  <Input 
                    id="i-especialidad" 
                    value={instructorEditData.especialidad} 
                    onChange={(e) => setInstructorEditData({ ...instructorEditData, especialidad: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="i-experiencia">Años de Experiencia</Label>
                  <Input 
                    id="i-experiencia" 
                    value={instructorEditData.experiencia} 
                    onChange={(e) => setInstructorEditData({ ...instructorEditData, experiencia: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Estadísticas de Instructor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Estadísticas de Instructor
              </h4>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{instructorData.cursosImpartidos}</p>
                  <p className="text-sm text-gray-600">Cursos Dictados</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{instructorData.estudiantesFormados}</p>
                  <p className="text-sm text-gray-600">Estudiantes</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{instructorData.certificaciones}</p>
                  <p className="text-sm text-gray-600">Certificaciones</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{instructorData.calificacionPromedio}</p>
                  <p className="text-sm text-gray-600">Calificación</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              Cambiar Contraseña
            </Button>
            <Button className="bg-orange-700 hover:bg-orange-800">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
