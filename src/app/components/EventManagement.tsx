import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { EventsTable } from "./EventsTable";
import { Pagination } from "./Pagination";
import { NewEventDialog } from "./NewEventDialog";
import type { CursoEvento, CursoEventoRequest, Inscripcion } from "../models/curso";
import { inscripcionActiva } from "../models/curso";
import { can, type SessionUser } from "../lib/roles";

const PAGE_SIZE = 5;

interface EventManagementProps {
  user: SessionUser;
  cursos: CursoEvento[];
  misInscripciones: Inscripcion[];
  onCrearCurso: (datos: CursoEventoRequest) => Promise<boolean>;
  onInscribirse: (idCurso: number) => Promise<void>;
  onCancelarInscripcion: (idInscripcion: number) => Promise<void>;
}

/**
 * Vista contenedora del módulo de cursos.
 * Filtra los cursos según el rol (el instructor ve solo los suyos y los borradores solo el administrador),
 * y maneja la búsqueda, la paginación y el diálogo de nuevo curso.
 */
export function EventManagement({
  user,
  cursos,
  misInscripciones,
  onCrearCurso,
  onInscribirse,
  onCancelarInscripcion,
}: EventManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);

  // Solo el administrador puede crear cursos (ver lib/roles.ts)
  const puedeGestionar = can.gestionarEventos(user.role);

  // Título y descripción de la pantalla según el rol

  const copy = {
    participante: {
      title: "Cursos disponibles",
      desc: "Explora los cursos abiertos e inscríbete en los que te interesen",
    },
    instructor: {
      title: "Mis cursos",
      desc: "Cursos que tienes asignados como instructor",
    },
    administrador: {
      title: "Gestión de cursos",
      desc: "Administre cursos y programas de formación en seguridad industrial",
    },
  }[user.role];

  // Ids de los cursos en los que el participante tiene una inscripción activa
  const inscritoEn = useMemo(
    () => new Set(misInscripciones.filter(inscripcionActiva).map((i) => i.idCurso)),
    [misInscripciones],
  );

  // Qué cursos ve cada rol: el participante los abiertos y los suyos; el instructor solo los asignados
  const visibles = useMemo(() => {
    return cursos.filter((c) => {
      if (user.role === "participante") {
        return c.estado === "PROGRAMADO" || c.estado === "EN_CURSO" || inscritoEn.has(c.id);
      }
      if (user.role === "instructor") return c.idInstructor === user.idInstructor;
      return true;
    });
  }, [cursos, user, inscritoEn]);

  // Búsqueda por nombre, lugar, instructor o estado (sin distinguir mayúsculas)
  const filtrados = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return visibles;
    return visibles.filter(
      (c) =>
        c.nombreCurso.toLowerCase().includes(q) ||
        c.lugar.toLowerCase().includes(q) ||
        c.nombreInstructor.toLowerCase().includes(q) ||
        (c.tipo ?? "").toLowerCase().includes(q) ||
        c.estado.replace("_", " ").toLowerCase().includes(q),
    );
  }, [visibles, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pagina = filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
            <p className="mt-2 text-gray-700">{copy.desc}</p>
          </div>
          {puedeGestionar && (
            <Button className="bg-orange-700 hover:bg-orange-800 shadow-md" onClick={() => setIsNewEventOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo curso
            </Button>
          )}
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <label htmlFor="buscar-eventos" className="sr-only">Buscar eventos</label>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="buscar-eventos"
              type="search"
              placeholder="Buscar por curso, lugar, instructor o estado…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Listado de cursos{" "}
            <span className="text-gray-600 font-normal text-base">({filtrados.length})</span>
          </h2>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <EventsTable
              cursos={pagina}
              role={user.role}
              misInscripciones={misInscripciones}
              onInscribirse={onInscribirse}
              onCancelarInscripcion={onCancelarInscripcion}
            />
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>

        {puedeGestionar && (
          <NewEventDialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen} onCrear={onCrearCurso} />
        )}
      </div>
    </div>
  );
}
