import { useState } from "react";
import { Plus, Search, Award, Users, UserCheck, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InstructorsTable, mockInstructors, type Instructor } from "./InstructorsTable";
import { StatCard } from "./StatCard";
import { NewInstructorDialog } from "./NewInstructorDialog";
import { InstructorCertificateDesigner } from "./InstructorCertificateDesigner";

/**
 * Vista contenedora del módulo de instructores: indicadores, buscador, registro de instructores
 * y diseñador de certificados. Rol: administrador.
 */
export function InstructorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewInstructorOpen, setIsNewInstructorOpen] = useState(false);
  const [isCertificateDesignerOpen, setIsCertificateDesignerOpen] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);

  const handleInstructorAdded = (instructor: Instructor) => {
    setInstructors((prev) => [...prev, instructor]);
  };

  const stats = [
    { label: "Total instructores", value: instructors.length, icon: Users, color: "orange" as const },
    { label: "Activos", value: instructors.filter((i) => i.estado === "Activo").length, icon: UserCheck, color: "green" as const },
    { label: "Certificaciones", value: instructors.reduce((acc, i) => acc + (i.certificaciones || 0), 0), icon: Award, color: "blue" as const },
    { label: "Cursos activos", value: instructors.reduce((acc, i) => acc + (i.cursosActivos || 0), 0), icon: BookOpen, color: "purple" as const },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de instructores</h1>
          <p className="mt-2 text-gray-700">
            Administre especialistas y formadores certificados en seguridad industrial
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-orange-700 hover:bg-orange-800 shadow-md"
            onClick={() => setIsNewInstructorOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo instructor
          </Button>
          <Button 
            variant="outline" 
            className="shadow-md border-blue-700 text-blue-700 hover:bg-blue-50"
            onClick={() => setIsCertificateDesignerOpen(true)}
          >
            <Award className="w-4 h-4 mr-2" />
            Emitir certificado de instructor
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <label htmlFor="buscar-instructores" className="sr-only">Buscar instructores</label>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="buscar-instructores"
              type="search"
              placeholder="Buscar por nombre, documento o especialidad…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st) => (
            <StatCard key={st.label} {...st} />
          ))}
        </div>

        {/* Instructors Table Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Listado de instructores
          </h2>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <InstructorsTable searchQuery={searchQuery} instructors={instructors} />
          </div>
        </div>

        {/* New Instructor Dialog */}
        <NewInstructorDialog
          open={isNewInstructorOpen}
          onOpenChange={setIsNewInstructorOpen}
          onInstructorAdded={handleInstructorAdded}
        />

        {/* Instructor Certificate Designer */}
        <InstructorCertificateDesigner
          open={isCertificateDesignerOpen}
          onOpenChange={setIsCertificateDesignerOpen}
        />
      </div>
    </div>
  );
}
