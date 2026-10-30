import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useForm } from "react-hook-form@7.55.0";
import { toast } from "sonner@2.0.3";
import { GraduationCap, User, Award, Briefcase } from "lucide-react";

interface NewInstructorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstructorAdded: (instructor: any) => void;
}

interface InstructorFormData {
  // Información Personal
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: string;
  
  // Información de Contacto
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  
  // Información Profesional
  titulo: string;
  especialidad: string;
  nivelEducativo: string;
  universidadEgreso: string;
  anioGraduacion: string;
  registroProfesional: string;
  
  // Experiencia y Certificaciones
  aniosExperiencia: string;
  areasEspecializacion: string;
  certificacionesPrincipales: string;
  cursosDictados: string;
  horasFormacion: string;
  idiomas: string;
}

const especialidades = [
  "Trabajos en Alturas",
  "Seguridad Industrial",
  "Primeros Auxilios",
  "Espacios Confinados",
  "Riesgo Eléctrico",
  "Manejo de Extintores",
  "SGSST",
  "Brigadista",
  "Manejo Defensivo",
  "Ergonomía",
  "Higiene Industrial"
];

export function NewInstructorDialog({ open, onOpenChange, onInstructorAdded }: NewInstructorDialogProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<InstructorFormData>();

  const onSubmit = (data: InstructorFormData) => {
    const newInstructor = {
      id: Date.now(),
      nombre: `${data.nombres} ${data.apellidos}`,
      documento: data.numeroDocumento,
      especialidad: data.especialidad,
      titulo: data.titulo,
      email: data.email,
      telefono: data.telefono,
      aniosExperiencia: data.aniosExperiencia,
      certificaciones: data.certificacionesPrincipales?.split('\n').length || 0,
      cursosActivos: 0,
      estado: "Activo",
      fechaRegistro: new Date().toLocaleDateString('es-CO'),
      ...data
    };

    onInstructorAdded(newInstructor);
    toast.success("Instructor registrado exitosamente", {
      description: `${data.nombres} ${data.apellidos} ha sido agregado al sistema`
    });
    reset();
    setCurrentSection(1);
    onOpenChange(false);
  };

  const nextSection = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const sections = [
    { number: 1, title: "Personal", icon: User },
    { number: 2, title: "Contacto", icon: User },
    { number: 3, title: "Profesional", icon: GraduationCap },
    { number: 4, title: "Experiencia", icon: Award }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            Nuevo Instructor
          </DialogTitle>
          <DialogDescription>
            Complete la información del instructor en {sections.length} secciones
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6 px-4">
          {sections.map((section, index) => (
            <div key={section.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentSection === section.number
                      ? "bg-orange-700 text-white scale-110 shadow-lg"
                      : currentSection > section.number
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentSection > section.number ? (
                    <span>✓</span>
                  ) : (
                    <section.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  currentSection === section.number ? "text-orange-600" : "text-gray-500"
                }`}>
                  {section.title}
                </span>
              </div>
              {index < sections.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-all ${
                    currentSection > section.number ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 pb-6">
            {/* Sección 1: Información Personal */}
            {currentSection === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-orange-900 mb-1">Información Personal</h3>
                  <p className="text-sm text-orange-700">
                    Datos de identificación del instructor
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombres">
                      Nombres <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombres"
                      {...register("nombres", { required: "Campo requerido" })}
                      placeholder="Ej: María Fernanda"
                      className={errors.nombres ? "border-red-500" : ""}
                    />
                    {errors.nombres && (
                      <p className="text-xs text-red-500 mt-1">{errors.nombres.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellidos">
                      Apellidos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apellidos"
                      {...register("apellidos", { required: "Campo requerido" })}
                      placeholder="Ej: González Pérez"
                      className={errors.apellidos ? "border-red-500" : ""}
                    />
                    {errors.apellidos && (
                      <p className="text-xs text-red-500 mt-1">{errors.apellidos.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tipoDocumento">
                      Tipo de Documento <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("tipoDocumento", value)}>
                      <SelectTrigger className={errors.tipoDocumento ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="PAS">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("tipoDocumento", { required: "Campo requerido" })} />
                    {errors.tipoDocumento && (
                      <p className="text-xs text-red-500 mt-1">{errors.tipoDocumento.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="numeroDocumento">
                      Número de Documento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="numeroDocumento"
                      {...register("numeroDocumento", { required: "Campo requerido" })}
                      placeholder="Ej: 1234567890"
                      className={errors.numeroDocumento ? "border-red-500" : ""}
                    />
                    {errors.numeroDocumento && (
                      <p className="text-xs text-red-500 mt-1">{errors.numeroDocumento.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      {...register("fechaNacimiento")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="genero">Género</Label>
                    <Select onValueChange={(value) => setValue("genero", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("genero")} />
                  </div>
                </div>
              </div>
            )}

            {/* Sección 2: Información de Contacto */}
            {currentSection === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-1">Información de Contacto</h3>
                  <p className="text-sm text-blue-700">
                    Datos de comunicación y ubicación
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">
                      Teléfono <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telefono"
                      {...register("telefono", { required: "Campo requerido" })}
                      placeholder="Ej: +57 312 456 7890"
                      className={errors.telefono ? "border-red-500" : ""}
                    />
                    {errors.telefono && (
                      <p className="text-xs text-red-500 mt-1">{errors.telefono.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Campo requerido",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })}
                      placeholder="Ej: instructor@email.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      {...register("direccion")}
                      placeholder="Ej: Calle 123 #45-67"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      {...register("ciudad")}
                      placeholder="Ej: Bogotá"
                    />
                  </div>

                  <div>
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                      id="departamento"
                      {...register("departamento")}
                      placeholder="Ej: Cundinamarca"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sección 3: Información Profesional */}
            {currentSection === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-900 mb-1">Información Profesional</h3>
                  <p className="text-sm text-green-700">
                    Formación académica y títulos profesionales
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="titulo">
                      Título Profesional <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="titulo"
                      {...register("titulo", { required: "Campo requerido" })}
                      placeholder="Ej: Ingeniero en Seguridad Industrial"
                      className={errors.titulo ? "border-red-500" : ""}
                    />
                    {errors.titulo && (
                      <p className="text-xs text-red-500 mt-1">{errors.titulo.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="especialidad">
                      Especialidad Principal <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("especialidad", value)}>
                      <SelectTrigger className={errors.especialidad ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccione especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("especialidad", { required: "Campo requerido" })} />
                    {errors.especialidad && (
                      <p className="text-xs text-red-500 mt-1">{errors.especialidad.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
                    <Select onValueChange={(value) => setValue("nivelEducativo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="tecnologo">Tecnólogo</SelectItem>
                        <SelectItem value="profesional">Profesional</SelectItem>
                        <SelectItem value="especializacion">Especialización</SelectItem>
                        <SelectItem value="maestria">Maestría</SelectItem>
                        <SelectItem value="doctorado">Doctorado</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("nivelEducativo")} />
                  </div>

                  <div>
                    <Label htmlFor="universidadEgreso">Universidad de Egreso</Label>
                    <Input
                      id="universidadEgreso"
                      {...register("universidadEgreso")}
                      placeholder="Ej: Universidad Nacional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="anioGraduacion">Año de Graduación</Label>
                    <Input
                      id="anioGraduacion"
                      type="number"
                      {...register("anioGraduacion")}
                      placeholder="Ej: 2015"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="registroProfesional">Registro Profesional</Label>
                    <Input
                      id="registroProfesional"
                      {...register("registroProfesional")}
                      placeholder="Ej: TP-123456"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sección 4: Experiencia y Certificaciones */}
            {currentSection === 4 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-purple-900 mb-1">Experiencia y Certificaciones</h3>
                  <p className="text-sm text-purple-700">
                    Experiencia docente y certificaciones especializadas
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aniosExperiencia">
                      Años de Experiencia <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="aniosExperiencia"
                      type="number"
                      {...register("aniosExperiencia", { required: "Campo requerido", min: 0 })}
                      placeholder="Ej: 10"
                      className={errors.aniosExperiencia ? "border-red-500" : ""}
                    />
                    {errors.aniosExperiencia && (
                      <p className="text-xs text-red-500 mt-1">{errors.aniosExperiencia.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="horasFormacion">Horas de Formación Dictadas</Label>
                    <Input
                      id="horasFormacion"
                      type="number"
                      {...register("horasFormacion")}
                      placeholder="Ej: 500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="areasEspecializacion">Áreas de Especialización</Label>
                    <Input
                      id="areasEspecializacion"
                      {...register("areasEspecializacion")}
                      placeholder="Ej: Alturas, Espacios Confinados, Primeros Auxilios"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="certificacionesPrincipales">
                      Certificaciones Principales (una por línea)
                    </Label>
                    <Textarea
                      id="certificacionesPrincipales"
                      {...register("certificacionesPrincipales")}
                      placeholder="Certificación en Trabajos en Alturas&#10;Instructor Certificado SENA&#10;Primeros Auxilios Cruz Roja"
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="cursosDictados">Cursos Dictados</Label>
                    <Input
                      id="cursosDictados"
                      {...register("cursosDictados")}
                      placeholder="Ej: Trabajos en Alturas I, II, III, SGSST"
                    />
                  </div>

                  <div>
                    <Label htmlFor="idiomas">Idiomas</Label>
                    <Input
                      id="idiomas"
                      {...register("idiomas")}
                      placeholder="Ej: Español, Inglés"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-amber-900 mb-2">Resumen del Instructor</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-amber-700">
                      <span className="font-medium">Nombre:</span> {watch("nombres") || "---"} {watch("apellidos") || ""}
                    </div>
                    <div className="text-amber-700">
                      <span className="font-medium">Especialidad:</span> {watch("especialidad") || "---"}
                    </div>
                    <div className="text-amber-700">
                      <span className="font-medium">Título:</span> {watch("titulo") || "---"}
                    </div>
                    <div className="text-amber-700">
                      <span className="font-medium">Experiencia:</span> {watch("aniosExperiencia") ? `${watch("aniosExperiencia")} años` : "---"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 1}
            >
              Anterior
            </Button>

            <div className="text-sm text-gray-600">
              Paso {currentSection} de {sections.length}
            </div>

            {currentSection < 4 ? (
              <Button
                type="button"
                onClick={nextSection}
                className="bg-orange-700 hover:bg-orange-800"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                Crear Instructor
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
