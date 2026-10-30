import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, MapPin, Users, Clock, GraduationCap, CheckCircle2, UserPlus, XCircle } from "lucide-react";
import {
  ESTADO_CURSO_COLOR,
  ESTADO_CURSO_LABEL,
  ESTADO_INSCRIPCION_LABEL,
  MODALIDAD_COLOR,
  MODALIDAD_LABEL,
  admiteInscripcion,
  horario,
  type CursoEvento,
  type Inscripcion,
} from "../models/curso";
import { cursosService } from "../services/cursosService";
import { formatDateLong, formatDateShort } from "../lib/dates";
import { can, type UserRole } from "../lib/roles";

interface EventPreviewDialogProps {
  curso: CursoEvento;
  role: UserRole;
  /** Inscripción activa del participante en este curso, si existe. */
  inscripcion?: Inscripcion;
  onInscribirse: (idCurso: number) => Promise<void>;
  onCancelarInscripcion: (idInscripcion: number) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Fila({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{children}</span>
    </div>
  );
}

function Bloque({ icon: Icon, color, title, children }: { icon: typeof Calendar; color: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/**
 * Diálogo con el detalle completo de un curso (horario, lugar, instructor y aforo)
 * y los botones para inscribirse o cancelar la inscripción.
 */
export function EventPreviewDialog({
  curso,
  role,
  inscripcion,
  onInscribirse,
  onCancelarInscripcion,
  open,
  onOpenChange,
}: EventPreviewDialogProps) {
  const esPersonal = role !== "participante";
  const [asistentes, setAsistentes] = useState<Inscripcion[] | null>(null);
  const [errorAsistentes, setErrorAsistentes] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // El instructor y el administrador ven quiénes están inscritos (GET /api/cursos/{id}/inscripciones).
  useEffect(() => {
    if (!open || !esPersonal) return;
    setAsistentes(null);
    setErrorAsistentes(null);
    cursosService
      .inscripcionesDeCurso(curso.id)
      .then(setAsistentes)
      .catch((e) => setErrorAsistentes(e instanceof Error ? e.message : "Error al cargar inscritos"));
  }, [open, esPersonal, curso.id, curso.inscritos]);

  const accion = async (fn: () => Promise<void>) => {
    setEnviando(true);
    try {
      await fn();
    } finally {
      setEnviando(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            Detalle del curso
          </DialogTitle>
          <DialogDescription>Información del curso y su disponibilidad de cupos</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 sm:px-6 pb-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{curso.nombreCurso}</h2>
                {curso.tipo && <p className="text-gray-700">{curso.tipo}</p>}
              </div>
              <div className="flex gap-2">
                <Badge className={ESTADO_CURSO_COLOR[curso.estado]}>{ESTADO_CURSO_LABEL[curso.estado]}</Badge>
                {curso.modalidad && (
                  <Badge className={MODALIDAD_COLOR[curso.modalidad]}>{MODALIDAD_LABEL[curso.modalidad]}</Badge>
                )}
              </div>
            </div>
            {curso.descripcion && <p className="text-gray-800 text-sm leading-relaxed">{curso.descripcion}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Bloque icon={Calendar} color="bg-blue-100 text-blue-700" title="Fechas y horario">
              <Fila label="Inicio:">{formatDateLong(curso.fechaInicio)}</Fila>
              <Fila label="Fin:">{formatDateLong(curso.fechaFin)}</Fila>
              <Fila label="Horario:">{horario(curso)}</Fila>
            </Bloque>

            <Bloque icon={Clock} color="bg-green-100 text-green-700" title="Duración y aforo">
              <Fila label="Duración:">{curso.duracionHoras} horas</Fila>
              <Fila label="Cupo máximo:">{curso.cupoMaximo} personas</Fila>
              <Fila label="Inscritos:">{curso.inscritos}</Fila>
              <Fila label="Cupos libres:">
                <span className={curso.aforoDisponible === 0 ? "text-red-700" : "text-green-800"}>
                  {curso.aforoDisponible}
                </span>
              </Fila>
            </Bloque>

            <Bloque icon={MapPin} color="bg-purple-100 text-purple-700" title="Ubicación">
              <Fila label="Lugar:">{curso.lugar}</Fila>
              {curso.ciudad && <Fila label="Ciudad:">{curso.ciudad}</Fila>}
            </Bloque>

            <Bloque icon={Users} color="bg-orange-100 text-orange-700" title="Instructor y costo">
              <Fila label="Instructor:">{curso.nombreInstructor}</Fila>
              {curso.costo !== undefined && <Fila label="Costo:">{formatCurrency(curso.costo)}</Fila>}
            </Bloque>
          </div>

          {/* Inscripción del participante */}
          {inscripcion && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-900">
              Estás inscrito desde el {formatDateShort(inscripcion.fechaInscripcion)}. Estado:{" "}
              <strong>{ESTADO_INSCRIPCION_LABEL[inscripcion.estado]}</strong>.
            </div>
          )}

          {/* Inscritos (solo personal de ECM) */}
          {esPersonal && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Inscritos</h3>
              {errorAsistentes && <p className="text-sm text-red-700">{errorAsistentes}</p>}
              {!errorAsistentes && asistentes === null && <p className="text-sm text-gray-700">Cargando…</p>}
              {asistentes && asistentes.length === 0 && (
                <p className="text-sm text-gray-700">Todavía no hay inscritos en este curso.</p>
              )}
              {asistentes && asistentes.length > 0 && (
                <ul className="divide-y divide-gray-100">
                  {asistentes.map((a) => (
                    <li key={a.id} className="py-2 flex items-center justify-between gap-4 flex-wrap text-sm">
                      <span>
                        <span className="font-medium text-gray-900">{a.nombreUsuario}</span>{" "}
                        <span className="text-gray-700">· {a.correoUsuario}</span>
                      </span>
                      <span className="text-gray-800">{ESTADO_INSCRIPCION_LABEL[a.estado]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 flex-wrap">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {can.inscribirse(role) &&
            (inscripcion ? (
              <>
                <span className="inline-flex items-center gap-1 px-3 text-sm font-medium text-green-800">
                  <CheckCircle2 className="w-4 h-4" /> Ya estás inscrito
                </span>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  disabled={enviando}
                  onClick={() => accion(() => onCancelarInscripcion(inscripcion.id))}
                >
                  <XCircle className="w-4 h-4" /> Cancelar inscripción
                </Button>
              </>
            ) : (
              <Button
                className="bg-orange-700 hover:bg-orange-800"
                disabled={!admiteInscripcion(curso) || enviando}
                onClick={() => accion(() => onInscribirse(curso.id))}
              >
                <UserPlus className="w-4 h-4" />
                {admiteInscripcion(curso) ? "Inscribirme" : "Inscripción cerrada"}
              </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
