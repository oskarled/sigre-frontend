import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useForm } from "react-hook-form@7.55.0";
import { toast } from "sonner@2.0.3";
import { X } from "lucide-react";

interface NewParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipantAdded: (participant: any) => void;
}

interface ParticipantFormData {
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
  
  // Información Laboral
  empresa: string;
  cargo: string;
  areaLaboral: string;
  experienciaAnios: string;
  
  // Información del Curso
  cursoSeleccionado: string;
  modalidad: string;
  nivelConocimiento: string;
}

const cursos = [
  "Trabajos en Alturas",
  "Seguridad Industrial",
  "Primeros Auxilios",
  "Manejo de Extintores",
  "Espacios Confinados",
  "Riesgo Eléctrico",
  "Manejo Defensivo"
];

export function NewParticipantDialog({ open, onOpenChange, onParticipantAdded }: NewParticipantDialogProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ParticipantFormData>();

  const onSubmit = (data: ParticipantFormData) => {
    const newParticipant = {
      id: Date.now(),
      nombre: `${data.nombres} ${data.apellidos}`,
      documento: data.numeroDocumento,
      curso: data.cursoSeleccionado,
      email: data.email,
      telefono: data.telefono,
      empresa: data.empresa,
      cargo: data.cargo,
      fechaRegistro: new Date().toLocaleDateString('es-CO'),
      estado: "Activo",
      ...data
    };

    onParticipantAdded(newParticipant);
    toast.success("Participante registrado exitosamente", {
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
    { number: 1, title: "Personal" },
    { number: 2, title: "Contacto" },
    { number: 3, title: "Laboral" },
    { number: 4, title: "Curso" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nuevo Participante</DialogTitle>
          <DialogDescription>
            Complete la información del participante en las siguientes secciones
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {sections.map((section, index) => (
            <div key={section.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentSection === section.number
                      ? "bg-orange-700 text-white"
                      : currentSection > section.number
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {section.number}
                </div>
                <span className="mt-2 text-xs text-gray-600">{section.title}</span>
              </div>
              {index < sections.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all ${
                    currentSection > section.number ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección 1: Información Personal */}
          {currentSection === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-600 border-b pb-2">Información Personal</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    {...register("nombres", { required: "Este campo es requerido" })}
                    placeholder="Juan Carlos"
                  />
                  {errors.nombres && (
                    <p className="text-sm text-red-600 mt-1">{errors.nombres.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    {...register("apellidos", { required: "Este campo es requerido" })}
                    placeholder="Pérez López"
                  />
                  {errors.apellidos && (
                    <p className="text-sm text-red-600 mt-1">{errors.apellidos.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select onValueChange={(value) => setValue("tipoDocumento", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="PP">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                  <Input
                    id="numeroDocumento"
                    {...register("numeroDocumento", { required: "Este campo es requerido" })}
                    placeholder="1234567890"
                  />
                  {errors.numeroDocumento && (
                    <p className="text-sm text-red-600 mt-1">{errors.numeroDocumento.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    {...register("fechaNacimiento", { required: "Este campo es requerido" })}
                  />
                  {errors.fechaNacimiento && (
                    <p className="text-sm text-red-600 mt-1">{errors.fechaNacimiento.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="genero">Género *</Label>
                  <Select onValueChange={(value) => setValue("genero", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="O">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Sección 2: Información de Contacto */}
          {currentSection === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-600 border-b pb-2">Información de Contacto</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    {...register("telefono", { required: "Este campo es requerido" })}
                    placeholder="3001234567"
                  />
                  {errors.telefono && (
                    <p className="text-sm text-red-600 mt-1">{errors.telefono.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo inválido"
                      }
                    })}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  {...register("direccion", { required: "Este campo es requerido" })}
                  placeholder="Calle 123 #45-67"
                />
                {errors.direccion && (
                  <p className="text-sm text-red-600 mt-1">{errors.direccion.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    {...register("ciudad", { required: "Este campo es requerido" })}
                    placeholder="Bogotá"
                  />
                  {errors.ciudad && (
                    <p className="text-sm text-red-600 mt-1">{errors.ciudad.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Input
                    id="departamento"
                    {...register("departamento", { required: "Este campo es requerido" })}
                    placeholder="Cundinamarca"
                  />
                  {errors.departamento && (
                    <p className="text-sm text-red-600 mt-1">{errors.departamento.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sección 3: Información Laboral */}
          {currentSection === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-600 border-b pb-2">Información Laboral</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    {...register("empresa", { required: "Este campo es requerido" })}
                    placeholder="Nombre de la empresa"
                  />
                  {errors.empresa && (
                    <p className="text-sm text-red-600 mt-1">{errors.empresa.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    {...register("cargo", { required: "Este campo es requerido" })}
                    placeholder="Supervisor de seguridad"
                  />
                  {errors.cargo && (
                    <p className="text-sm text-red-600 mt-1">{errors.cargo.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="areaLaboral">Área Laboral *</Label>
                  <Select onValueChange={(value) => setValue("areaLaboral", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construccion">Construcción</SelectItem>
                      <SelectItem value="manufactura">Manufactura</SelectItem>
                      <SelectItem value="mineria">Minería</SelectItem>
                      <SelectItem value="petroleo">Petróleo y Gas</SelectItem>
                      <SelectItem value="transporte">Transporte</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experienciaAnios">Años de Experiencia</Label>
                  <Input
                    id="experienciaAnios"
                    type="number"
                    {...register("experienciaAnios")}
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sección 4: Información del Curso */}
          {currentSection === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-600 border-b pb-2">Información del Curso</h3>
              
              <div>
                <Label htmlFor="cursoSeleccionado">Curso a Inscribir *</Label>
                <Select onValueChange={(value) => setValue("cursoSeleccionado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un curso..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.map((curso) => (
                      <SelectItem key={curso} value={curso}>
                        {curso}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modalidad">Modalidad *</Label>
                  <Select onValueChange={(value) => setValue("modalidad", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nivelConocimiento">Nivel de Conocimiento</Label>
                  <Select onValueChange={(value) => setValue("nivelConocimiento", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Resumen del Registro:</strong>
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Nombre: {watch("nombres")} {watch("apellidos")}</li>
                  <li>• Documento: {watch("numeroDocumento")}</li>
                  <li>• Email: {watch("email")}</li>
                  <li>• Empresa: {watch("empresa")}</li>
                  <li>• Curso: {watch("cursoSeleccionado")}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 1}
            >
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setCurrentSection(1);
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>

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
                  Registrar Participante
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
