import { CalendarDays, Users, GraduationCap, Award, ArrowRight } from "lucide-react";
import logoECM from "figma:asset/7c493e705c8937b276f08841602854180eaa99e0.png";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { LocationSection } from "./LocationSection";
import { NewsSection } from "./NewsSection";
import { mockParticipants } from "./ParticipantsTable";
import { mockInstructors } from "./InstructorsTable";
import { mockCertificates } from "./CertificateManagementNew";
import {
  ESTADO_CURSO_COLOR,
  ESTADO_CURSO_LABEL,
  ESTADO_INSCRIPCION_LABEL,
  horario,
  inscripcionActiva,
  type CursoEvento,
  type Inscripcion,
} from "../models/curso";
import { formatDateShort } from "../lib/dates";
import type { NavId, SessionUser } from "../lib/roles";

interface HomeViewProps {
  user: SessionUser;
  cursos: CursoEvento[];
  misInscripciones: Inscripcion[];
  onNavigate: (id: NavId) => void;
  onViewAllNews: () => void;
}

/**
 * Pantalla de inicio. Muestra un resumen distinto según el rol:
 * próximos cursos, inscripciones del participante y accesos rápidos a los módulos.
 */
export function HomeView({ user, cursos, misInscripciones, onNavigate, onViewAllNews }: HomeViewProps) {
  const activos = cursos.filter((c) => c.estado === "PROGRAMADO" || c.estado === "EN_CURSO");
  const emitidos = mockCertificates.filter((c) => c.estado === "emitido");
  const aprobacion = emitidos.length
    ? Math.round((emitidos.filter((c) => Number(c.calificacion) >= 70).length / emitidos.length) * 100)
    : 0;

  const stats = [
    { label: "Cursos abiertos", desc: "Programados o en curso", value: activos.length, icon: CalendarDays, color: "orange" },
    { label: "Participantes", desc: "Registrados en el sistema", value: mockParticipants.length, icon: Users, color: "green" },
    { label: "Instructores", desc: "Especialistas certificados", value: mockInstructors.length, icon: GraduationCap, color: "blue" },
    { label: "Aprobación", desc: "Certificados emitidos con nota ≥ 70", value: `${aprobacion}%`, icon: Award, color: "purple" },
  ] as const;

  const colorClass = {
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  const primerNombre = user.nombre.replace(/^(Ing\.|Dr\.|Lic\.)\s*/, "").split(" ")[0];

  // Bloque personalizado según el rol: cada fila es { curso, detalle }
  const porFecha = (a: CursoEvento, b: CursoEvento) => a.fechaInicio.localeCompare(b.fechaInicio);
  const filas: { curso: CursoEvento; detalle?: string }[] =
    user.role === "participante"
      ? misInscripciones
          .filter(inscripcionActiva)
          .map((i) => ({
            curso: cursos.find((c) => c.id === i.idCurso),
            detalle: `Inscripción: ${ESTADO_INSCRIPCION_LABEL[i.estado]}`,
          }))
          .filter((f): f is { curso: CursoEvento; detalle: string } => !!f.curso)
      : (user.role === "instructor"
          ? cursos.filter((c) => c.idInstructor === user.idInstructor)
          : cursos.filter((c) => c.estado === "PROGRAMADO")
        )
          .sort(porFecha)
          .slice(0, 5)
          .map((c) => ({ curso: c, detalle: `${c.inscritos}/${c.cupoMaximo} inscritos` }));

  const tituloMisCursos =
    user.role === "participante"
      ? "Mis inscripciones"
      : user.role === "instructor"
        ? "Mis cursos asignados"
        : "Próximos cursos";

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logoECM} alt="ECM Training Center" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Hola, {primerNombre}</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Bienvenido a SIGRE, el Sistema de Registro para Eventos de ECM Training Center
          </p>
        </div>

        {/* Mis cursos / inscripciones */}
        <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-10">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2 className="text-xl font-semibold text-gray-900">{tituloMisCursos}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("eventos")}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              {user.role === "participante" ? "Ver cursos disponibles" : "Ir a cursos"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {filas.length === 0 ? (
            <p className="text-gray-700">
              {user.role === "participante"
                ? "Todavía no estás inscrito en ningún curso. Revisa los cursos disponibles e inscríbete."
                : "No hay cursos pendientes por revisar."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filas.map(({ curso, detalle }) => (
                <li key={curso.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium text-gray-900">{curso.nombreCurso}</p>
                    <p className="text-sm text-gray-700">
                      {formatDateShort(curso.fechaInicio)} · {horario(curso)} · {curso.lugar}
                      {detalle && <> · {detalle}</>}
                    </p>
                  </div>
                  <Badge variant="secondary" className={ESTADO_CURSO_COLOR[curso.estado]}>
                    {ESTADO_CURSO_LABEL[curso.estado]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Estadísticas calculadas a partir de los datos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorClass[s.color]}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">{s.label}</h3>
              <p className="text-sm text-gray-700">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Misión</h2>
            </div>
            <p className="text-gray-800 leading-relaxed">
              En ECM Training Center nos comprometemos a formar profesionales altamente capacitados
              en seguridad industrial, proporcionando conocimientos técnicos y prácticos que garanticen
              ambientes de trabajo seguros y productivos. Nuestros programas están diseñados para cumplir
              con los más altos estándares internacionales de seguridad.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Visión</h2>
            </div>
            <p className="text-gray-800 leading-relaxed">
              Ser reconocidos como el centro de formación líder en seguridad industrial en América Latina
              para el año 2030, destacándonos por la excelencia académica, innovación en metodologías
              de enseñanza y el impacto positivo en la reducción de accidentes laborales, contribuyendo
              al desarrollo de una cultura de prevención y seguridad en todas las industrias.
            </p>
          </div>
        </div>

        <LocationSection />
        <NewsSection onViewAll={onViewAllNews} />
      </div>
    </div>
  );
}
