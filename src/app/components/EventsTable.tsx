import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, CheckCircle2, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { EventPreviewDialog } from "./EventPreviewDialog";
import {
  ESTADO_CURSO_COLOR,
  ESTADO_CURSO_LABEL,
  admiteInscripcion,
  inscripcionActiva,
  type CursoEvento,
  type Inscripcion,
} from "../models/curso";
import { formatDateShort } from "../lib/dates";
import { can, type UserRole } from "../lib/roles";

interface EventsTableProps {
  cursos: CursoEvento[];
  role: UserRole;
  misInscripciones: Inscripcion[];
  onInscribirse: (idCurso: number) => Promise<void>;
  onCancelarInscripcion: (idInscripcion: number) => Promise<void>;
}

/**
 * Tabla de cursos con estado, fechas, cupos y acción de inscripción.
 * Aplica las reglas de aforo del modelo (admiteInscripcion) para mostrar "Inscribirme", "Inscrito", "Sin cupos" o "Cerrado".
 */
export function EventsTable({ cursos, role, misInscripciones, onInscribirse, onCancelarInscripcion }: EventsTableProps) {
  // Curso abierto en el diálogo de detalle (null = ninguno)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Curso cuya inscripción se está enviando; sirve para deshabilitar el botón y evitar doble clic
  const [enviando, setEnviando] = useState<number | null>(null);
  const selected = cursos.find((c) => c.id === selectedId) ?? null;
  const puedeInscribirse = can.inscribirse(role);

  // Inscripción activa del usuario en un curso, si existe
  const inscripcionDe = (idCurso: number) =>
    misInscripciones.find((i) => i.idCurso === idCurso && inscripcionActiva(i));

  const inscribir = async (idCurso: number) => {
    setEnviando(idCurso);
    try {
      await onInscribirse(idCurso);
    } finally {
      setEnviando(null);
    }
  };

  // Muestra la acción que corresponde al curso: Inscrito, Sin cupos / Cerrado o el botón Inscribirme
  const AccionInscripcion = ({ curso }: { curso: CursoEvento }) => {
    if (!puedeInscribirse) return null;
    if (inscripcionDe(curso.id)) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-green-800">
          <CheckCircle2 className="w-4 h-4" /> Inscrito
        </span>
      );
    }
    if (!admiteInscripcion(curso)) {
      return (
        <span className="text-sm text-gray-600">
          {curso.estado === "PROGRAMADO" && curso.aforoDisponible === 0 ? "Sin cupos" : "Cerrado"}
        </span>
      );
    }
    return (
      <Button
        size="sm"
        className="bg-orange-700 hover:bg-orange-800"
        disabled={enviando === curso.id}
        onClick={() => inscribir(curso.id)}
      >
        <UserPlus className="w-4 h-4" /> {enviando === curso.id ? "Inscribiendo…" : "Inscribirme"}
      </Button>
    );
  };

  if (cursos.length === 0) {
    return <p className="text-center py-10 text-gray-700">No se encontraron cursos con esos criterios.</p>;
  }

  return (
    <>
      {/* Escritorio: tabla */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Curso</TableHead>
              <TableHead className="w-32">Inicio</TableHead>
              <TableHead className="w-28">Cupos</TableHead>
              <TableHead className="w-32">Estado</TableHead>
              <TableHead className="w-56">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id} className="hover:bg-gray-50">
                <TableCell>
                  <p className="font-medium text-gray-900">{curso.nombreCurso}</p>
                  <p className="text-xs text-gray-600">{curso.nombreInstructor}</p>
                </TableCell>
                <TableCell>{formatDateShort(curso.fechaInicio)}</TableCell>
                <TableCell>
                  {curso.inscritos}/{curso.cupoMaximo}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={ESTADO_CURSO_COLOR[curso.estado]}>
                    {ESTADO_CURSO_LABEL[curso.estado]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedId(curso.id)}
                      className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <AccionInscripcion curso={curso} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Móvil: tarjetas, para no forzar scroll horizontal */}
      <ul className="md:hidden divide-y divide-gray-100">
        {cursos.map((curso) => (
          <li key={curso.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-gray-900">{curso.nombreCurso}</p>
              <Badge variant="secondary" className={ESTADO_CURSO_COLOR[curso.estado]}>
                {ESTADO_CURSO_LABEL[curso.estado]}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">
              Inicia {formatDateShort(curso.fechaInicio)} · Cupos {curso.inscritos}/{curso.cupoMaximo}
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedId(curso.id)}>
                <Eye className="w-4 h-4" /> Ver detalle
              </Button>
              <AccionInscripcion curso={curso} />
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <EventPreviewDialog
          curso={selected}
          role={role}
          inscripcion={inscripcionDe(selected.id)}
          onInscribirse={inscribir}
          onCancelarInscripcion={onCancelarInscripcion}
          open={selectedId !== null}
          onOpenChange={(open) => !open && setSelectedId(null)}
        />
      )}
    </>
  );
}
