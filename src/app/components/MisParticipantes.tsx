import { useEffect, useMemo, useState } from "react";
import { Search, Users, UserCheck, Clock } from "lucide-react";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { StatCard } from "./StatCard";
import { ESTADO_INSCRIPCION_LABEL, inscripcionActiva, type CursoEvento, type Inscripcion } from "../models/curso";
import { cursosService } from "../services/cursosService";
import { formatDateShort } from "../lib/dates";
import type { SessionUser } from "../lib/roles";

interface MisParticipantesProps {
  user: SessionUser;
  cursos: CursoEvento[];
}

/** Vista del instructor: inscritos en sus cursos, leídos de GET /api/cursos/{id}/inscripciones. */
export function MisParticipantes({ user, cursos }: MisParticipantesProps) {
  const [inscripciones, setInscripciones] = useState<Inscripcion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const misCursos = useMemo(() => cursos.filter((c) => c.idInstructor === user.idInstructor), [cursos, user]);

  useEffect(() => {
    let vigente = true;
    setInscripciones(null);
    Promise.all(misCursos.map((c) => cursosService.inscripcionesDeCurso(c.id)))
      .then((listas) => vigente && setInscripciones(listas.flat().filter(inscripcionActiva)))
      .catch((e) => vigente && setError(e instanceof Error ? e.message : "No se pudieron cargar los inscritos"));
    return () => {
      vigente = false;
    };
  }, [misCursos]);

  const filtradas = (inscripciones ?? []).filter((i) => {
    const q = busqueda.trim().toLowerCase();
    return !q || i.nombreUsuario.toLowerCase().includes(q) || i.nombreCurso.toLowerCase().includes(q);
  });

  const lista = inscripciones ?? [];
  const stats = [
    { label: "Inscritos", value: lista.length, icon: Users, color: "orange" as const },
    { label: "Personas distintas", value: new Set(lista.map((i) => i.idUsuario)).size, icon: UserCheck, color: "blue" as const },
    { label: "Pendientes de pago", value: lista.filter((i) => i.estado === "PENDIENTE").length, icon: Clock, color: "yellow" as const },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis participantes</h1>
          <p className="mt-2 text-gray-700">Personas inscritas en los {misCursos.length} cursos que tienes asignados</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <label htmlFor="buscar-inscritos" className="sr-only">Buscar inscritos</label>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="buscar-inscritos"
              type="search"
              placeholder="Buscar por participante o curso…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {error && <p className="p-6 text-red-700">{error}</p>}
          {!error && inscripciones === null && <p className="p-6 text-gray-700">Cargando inscritos…</p>}
          {inscripciones && filtradas.length === 0 && (
            <p className="p-6 text-gray-700">No hay participantes inscritos en tus cursos.</p>
          )}
          {filtradas.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Participante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Inscrito el</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>
                      <p className="font-medium text-gray-900">{i.nombreUsuario}</p>
                      <p className="text-xs text-gray-600">{i.correoUsuario}</p>
                    </TableCell>
                    <TableCell>{i.nombreCurso}</TableCell>
                    <TableCell>{formatDateShort(i.fechaInscripcion)}</TableCell>
                    <TableCell>{ESTADO_INSCRIPCION_LABEL[i.estado]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
