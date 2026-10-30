import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useForm } from "react-hook-form@7.55.0";
import { Calendar } from "lucide-react";
import type { CursoEventoRequest } from "../models/curso";
import { cursosService, type InstructorOpcion } from "../services/cursosService";
import { todayISO } from "../lib/dates";

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Devuelve true si el curso se creó (para cerrar y limpiar el formulario). */
  onCrear: (datos: CursoEventoRequest) => Promise<boolean>;
}

// Mismos campos y reglas que CursoEventoRequest en el backend.
interface CursoFormData {
  nombreCurso: string;
  duracionHoras: string;
  fechaInicio: string;
  horaInicio: string;
  fechaFin: string;
  horaFin: string;
  lugar: string;
  cupoMaximo: string;
  idInstructor: string;
}

function Campo({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} <span className="text-red-700">*</span>
      </Label>
      {children}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function NewEventDialog({ open, onOpenChange, onCrear }: NewEventDialogProps) {
  const [instructores, setInstructores] = useState<InstructorOpcion[]>([]);
  const [guardando, setGuardando] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CursoFormData>({ defaultValues: { horaInicio: "08:00", horaFin: "17:00" } });

  useEffect(() => {
    if (open) cursosService.listarInstructores().then(setInstructores).catch(() => setInstructores([]));
  }, [open]);

  const onSubmit = async (data: CursoFormData) => {
    setGuardando(true);
    const ok = await onCrear({
      nombreCurso: data.nombreCurso.trim(),
      duracionHoras: Number(data.duracionHoras),
      fechaInicio: `${data.fechaInicio}T${data.horaInicio}:00`,
      fechaFin: `${data.fechaFin}T${data.horaFin}:00`,
      lugar: data.lugar.trim(),
      cupoMaximo: Number(data.cupoMaximo),
      idInstructor: Number(data.idInstructor),
    });
    setGuardando(false);
    if (ok) {
      reset();
      onOpenChange(false);
    }
  };

  const requerido = "Campo obligatorio";
  const fechaInicio = watch("fechaInicio");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Nuevo curso
          </DialogTitle>
          <DialogDescription>El curso queda en estado Programado y abierto a inscripciones.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Campo id="nombreCurso" label="Nombre del curso" error={errors.nombreCurso?.message}>
            <Input
              id="nombreCurso"
              placeholder="Ej: Trabajo Seguro en Alturas - Nivel Avanzado"
              aria-invalid={!!errors.nombreCurso}
              {...register("nombreCurso", {
                required: requerido,
                maxLength: { value: 150, message: "Máximo 150 caracteres" },
              })}
            />
          </Campo>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo id="fechaInicio" label="Fecha de inicio" error={errors.fechaInicio?.message}>
              <Input
                id="fechaInicio"
                type="date"
                min={todayISO()}
                aria-invalid={!!errors.fechaInicio}
                {...register("fechaInicio", {
                  required: requerido,
                  validate: (v) => v > todayISO() || "Debe ser posterior a hoy",
                })}
              />
            </Campo>
            <Campo id="horaInicio" label="Hora de inicio" error={errors.horaInicio?.message}>
              <Input id="horaInicio" type="time" {...register("horaInicio", { required: requerido })} />
            </Campo>
            <Campo id="fechaFin" label="Fecha de fin" error={errors.fechaFin?.message}>
              <Input
                id="fechaFin"
                type="date"
                min={fechaInicio || todayISO()}
                aria-invalid={!!errors.fechaFin}
                {...register("fechaFin", {
                  required: requerido,
                  validate: (v, form) =>
                    `${v}T${form.horaFin}` > `${form.fechaInicio}T${form.horaInicio}` ||
                    "Debe ser posterior al inicio",
                })}
              />
            </Campo>
            <Campo id="horaFin" label="Hora de fin" error={errors.horaFin?.message}>
              <Input id="horaFin" type="time" {...register("horaFin", { required: requerido })} />
            </Campo>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo id="duracionHoras" label="Duración (horas)" error={errors.duracionHoras?.message}>
              <Input
                id="duracionHoras"
                type="number"
                min={1}
                placeholder="Ej: 40"
                aria-invalid={!!errors.duracionHoras}
                {...register("duracionHoras", {
                  required: requerido,
                  min: { value: 1, message: "Debe ser mayor que cero" },
                })}
              />
            </Campo>
            <Campo id="cupoMaximo" label="Cupo máximo" error={errors.cupoMaximo?.message}>
              <Input
                id="cupoMaximo"
                type="number"
                min={1}
                placeholder="Ej: 25"
                aria-invalid={!!errors.cupoMaximo}
                {...register("cupoMaximo", {
                  required: requerido,
                  min: { value: 1, message: "Debe ser mayor que cero" },
                })}
              />
            </Campo>
          </div>

          <Campo id="lugar" label="Lugar" error={errors.lugar?.message}>
            <Input
              id="lugar"
              placeholder="Ej: Aula 301 - Sede Principal"
              aria-invalid={!!errors.lugar}
              {...register("lugar", { required: requerido, maxLength: { value: 150, message: "Máximo 150 caracteres" } })}
            />
          </Campo>

          <Campo id="idInstructor" label="Instructor a cargo" error={errors.idInstructor?.message}>
            <Select onValueChange={(v) => setValue("idInstructor", v, { shouldValidate: true })}>
              <SelectTrigger id="idInstructor" aria-invalid={!!errors.idInstructor}>
                <SelectValue placeholder="Seleccione el instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructores.map((i) => (
                  <SelectItem key={i.id} value={String(i.id)}>
                    {i.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("idInstructor", { required: requerido })} />
          </Campo>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-700 hover:bg-orange-800" disabled={guardando}>
              {guardando ? "Guardando…" : "Crear curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
