import { useMemo, useState } from "react";
import { Plus, Search, Upload, Users, UserCheck, GraduationCap, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ParticipantsTable, mockParticipants, type Participant } from "./ParticipantsTable";
import { Pagination } from "./Pagination";
import { NewParticipantDialog } from "./NewParticipantDialog";
import { ImportParticipantsDialog } from "./ImportParticipantsDialog";
import { StatCard } from "./StatCard";
import type { CursoEvento } from "../models/curso";
import { can, type SessionUser } from "../lib/roles";
import { MisParticipantes } from "./MisParticipantes";

const PAGE_SIZE = 5;

interface ParticipantManagementProps {
  user: SessionUser;
  cursos: CursoEvento[];
}

export function ParticipantManagement({ user, cursos }: ParticipantManagementProps) {
  // El instructor ve los inscritos reales de sus cursos (vienen del backend).
  if (user.role === "instructor") return <MisParticipantes user={user} cursos={cursos} />;
  return <DirectorioParticipantes user={user} />;
}

// Directorio general de participantes (administrador).
// Pendiente en el backend: módulo de usuarios (GET/POST /api/usuarios). Mientras tanto usa datos de ejemplo.
function DirectorioParticipantes({ user }: { user: SessionUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewParticipantOpen, setIsNewParticipantOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);

  const puedeGestionar = can.gestionarParticipantes(user.role);

  const visibles = participants;

  const filtrados = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return visibles;
    return visibles.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.documento.toLowerCase().includes(q) ||
        p.curso.toLowerCase().includes(q) ||
        p.empresa.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
  }, [visibles, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pagina = filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    { label: "Total participantes", value: visibles.length, icon: Users, color: "orange" as const },
    { label: "Activos", value: visibles.filter((p) => p.estado === "Activo").length, icon: UserCheck, color: "green" as const },
    { label: "Egresados", value: visibles.filter((p) => p.estado === "Egresado").length, icon: GraduationCap, color: "blue" as const },
    { label: "Empresas", value: new Set(visibles.map((p) => p.empresa)).size, icon: Building2, color: "purple" as const },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de participantes
          </h1>
          <p className="mt-2 text-gray-700">
            Administre estudiantes y participantes inscritos en cursos de seguridad industrial
          </p>
        </div>

        {puedeGestionar && (
          <div className="flex flex-wrap gap-3">
            <Button className="bg-orange-700 hover:bg-orange-800 shadow-md" onClick={() => setIsNewParticipantOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo participante
            </Button>
            <Button
              variant="outline"
              className="shadow-md border-orange-300 text-orange-800 hover:bg-orange-50"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar lista
            </Button>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <label htmlFor="buscar-participantes" className="sr-only">Buscar participantes</label>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="buscar-participantes"
              type="search"
              placeholder="Buscar por nombre, documento, curso o empresa…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Listado de participantes <span className="text-gray-600 font-normal text-base">({filtrados.length})</span>
          </h2>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <ParticipantsTable participants={pagina} />
          </div>

          {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>

        {puedeGestionar && (
          <>
            <NewParticipantDialog
              open={isNewParticipantOpen}
              onOpenChange={setIsNewParticipantOpen}
              onParticipantAdded={(p) => setParticipants((prev) => [...prev, p])}
            />
            <ImportParticipantsDialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
              onParticipantsImported={(list) => setParticipants((prev) => [...prev, ...list])}
            />
          </>
        )}
      </div>
    </div>
  );
}
