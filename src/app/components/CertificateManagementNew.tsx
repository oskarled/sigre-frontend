import { useState } from "react";
import { Plus, Search, FileText, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CertificateDesigner } from "./CertificateDesigner";
import { Pagination } from "./Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { StatCard } from "./StatCard";
import { Award, Clock, TrendingUp } from "lucide-react";
import { can, mismoInstructor, type SessionUser } from "../lib/roles";
import { toast } from "sonner@2.0.3";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export interface Certificate {
  id: number;
  participante: string;
  curso: string;
  fechaEmision: string;
  estado: "emitido" | "pendiente" | "anulado";
  instructor: string;
  calificacion: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: 1,
    participante: "Maria Perez",
    curso: "Coordinador de Trabajo en Alturas",
    fechaEmision: "07/08/2026",
    estado: "emitido",
    instructor: "Carlos Ortega",
    calificacion: "95"
  },
  {
    id: 2,
    participante: "María Fernanda Gómez",
    curso: "Seguridad Industrial",
    fechaEmision: "18/03/2026",
    estado: "emitido",
    instructor: "Pedro Martínez",
    calificacion: "88"
  },
  {
    id: 3,
    participante: "Diana Patricia Mora",
    curso: "Primeros Auxilios",
    fechaEmision: "16/09/2026",
    estado: "emitido",
    instructor: "Jorge Ramírez",
    calificacion: "92"
  },
  {
    id: 4,
    participante: "Luis Fernando Torres",
    curso: "Coordinador de Trabajo en Alturas",
    fechaEmision: "07/08/2026",
    estado: "pendiente",
    instructor: "Carlos Ortega",
    calificacion: "81"
  },
  {
    id: 5,
    participante: "Ana Patricia Silva",
    curso: "Espacios Confinados",
    fechaEmision: "22/05/2026",
    estado: "anulado",
    instructor: "Ana Méndez",
    calificacion: "64"
  }
];

function getEstadoBadge(estado: Certificate["estado"]) {
  switch (estado) {
    case "emitido":
      return <Badge className="bg-green-100 text-green-800">Emitido</Badge>;
    case "pendiente":
      return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    case "anulado":
      return <Badge className="bg-red-100 text-red-800">Anulado</Badge>;
  }
}

const PAGE_SIZE = 5;

interface CertificateManagementProps {
  user: SessionUser;
}

/**
 * Módulo de certificados: lista con búsqueda, estado, paginación, indicadores y descarga en PDF.
 * El participante solo ve sus propios certificados. Prop: user (usuario en sesión).
 */
export function CertificateManagementNew({ user }: CertificateManagementProps) {
  const esParticipante = user.role === "participante";
  const puedeEmitir = can.emitirCertificados(user.role);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleNewCertificate = () => {
    setSelectedCertificate(null);
    setIsDesignerOpen(true);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDesignerOpen(true);
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      const loadingToast = toast.loading("🔄 Generando certificado PDF...", {
        description: "Preparando documento..."
      });

      // Crear un elemento temporal con el certificado
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '1056px';
      tempDiv.style.height = '816px';
      
      // Parsear fecha de emisión (formato DD/MM/YYYY a Date)
      const [day, month, year] = certificate.fechaEmision.split('/');
      const fechaEmisionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      tempDiv.innerHTML = `
        <div style="
          width: 1056px;
          height: 816px;
          padding: 60px;
          background: linear-gradient(to bottom right, #fff7ed, #ffffff);
          border: 8px double #ea580c;
          position: relative;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        ">
          <!-- Decorative corners -->
          <div style="position: absolute; top: 16px; left: 16px; width: 64px; height: 64px; border-left: 4px solid #fb923c; border-top: 4px solid #fb923c;"></div>
          <div style="position: absolute; top: 16px; right: 16px; width: 64px; height: 64px; border-right: 4px solid #fb923c; border-top: 4px solid #fb923c;"></div>
          <div style="position: absolute; bottom: 16px; left: 16px; width: 64px; height: 64px; border-left: 4px solid #fb923c; border-bottom: 4px solid #fb923c;"></div>
          <div style="position: absolute; bottom: 16px; right: 16px; width: 64px; height: 64px; border-right: 4px solid #fb923c; border-bottom: 4px solid #fb923c;"></div>

          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); border-radius: 50%; margin: 0 auto 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); position: relative;">
              <span style="color: #ffffff; font-weight: bold; font-size: 32px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">ECM</span>
            </div>
            <h1 style="font-size: 32px; font-weight: bold; color: #111827; margin: 10px 0; font-family: Arial, sans-serif;">ECM TRAINING CENTER</h1>
            <p style="font-size: 16px; color: #6b7280; margin: 5px 0; font-family: Arial, sans-serif;">Centro de Formación en Seguridad Industrial</p>
            <div style="width: 128px; height: 4px; background: linear-gradient(90deg, #f97316 0%, #dc2626 100%); margin: 15px auto; border-radius: 2px;"></div>
          </div>

          <!-- Certificate Title -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 28px; font-weight: bold; color: #ea580c; margin-bottom: 10px; font-family: Arial, sans-serif;">CERTIFICADO DE PARTICIPACIÓN</h2>
            <p style="font-size: 14px; color: #6b7280; font-family: Arial, sans-serif;">Se otorga el presente certificado a:</p>
          </div>

          <!-- Participant Name -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="border-bottom: 2px solid #fdba74; padding-bottom: 10px; display: inline-block; min-width: 500px;">
              <p style="font-size: 36px; font-weight: bold; color: #111827; margin: 0; font-family: Arial, sans-serif;">${certificate.participante}</p>
            </div>
            <p style="font-size: 12px; color: #6b7280; margin-top: 10px; font-family: Arial, sans-serif;">Documento de Identidad: N/A</p>
          </div>

          <!-- Certificate Body -->
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 16px; color: #374151; margin: 10px 0; font-family: Arial, sans-serif;">Por haber completado satisfactoriamente el curso de</p>
            <p style="font-size: 24px; font-weight: bold; color: #ea580c; margin: 10px 0; font-family: Arial, sans-serif;">${certificate.curso}</p>
            <p style="font-size: 14px; color: #374151; margin: 10px 0; font-family: Arial, sans-serif;">Con una duración de <strong style="font-weight: bold;">40 horas</strong></p>
            <p style="font-size: 14px; color: #374151; margin: 10px 0; font-family: Arial, sans-serif;">realizado el ${fechaEmisionDate.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="font-size: 14px; color: #374151; margin: 10px 0; font-family: Arial, sans-serif;">obteniendo una calificación de <strong style="color: #ea580c; font-weight: bold;">${certificate.calificacion}/100</strong></p>
          </div>

          <!-- Instructor Signature -->
          <div style="display: flex; justify-content: space-around; align-items: flex-end; margin-top: 60px;">
            <div style="text-align: center;">
              <div style="border-top: 2px solid #9ca3af; padding-top: 10px; width: 220px; margin: 0 auto;">
                <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 5px 0; font-family: Arial, sans-serif;">${certificate.instructor}</p>
                <p style="font-size: 12px; color: #6b7280; margin: 5px 0; font-family: Arial, sans-serif;">Instructor Certificado</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <div style="border-top: 2px solid #9ca3af; padding-top: 10px; width: 220px; margin: 0 auto;">
                <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 5px 0; font-family: Arial, sans-serif;">Director ECM Training Center</p>
                <p style="font-size: 12px; color: #6b7280; margin: 5px 0; font-family: Arial, sans-serif;">Representante Legal</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #9ca3af; font-family: Arial, sans-serif;">
              Certificado emitido el ${new Date().toLocaleDateString('es-CO')} | SIGRE - Sistema de Registro para Eventos
            </p>
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);

      toast.loading("🔄 Generando certificado PDF...", {
        id: loadingToast,
        description: "Capturando imagen en alta calidad..."
      });

      // Capturar el elemento como imagen
      const canvas = await html2canvas(tempDiv, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Remover el elemento temporal
      document.body.removeChild(tempDiv);

      toast.loading("🔄 Generando certificado PDF...", {
        id: loadingToast,
        description: "Creando documento PDF..."
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Crear PDF en tamaño carta horizontal
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "letter"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const yPosition = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", 10, yPosition > 0 ? yPosition : 10, imgWidth, imgHeight);

      const fileName = `Certificado_${certificate.participante.replace(/\s+/g, '_')}_${certificate.curso.replace(/\s+/g, '_')}.pdf`;
      
      toast.loading("🔄 Generando certificado PDF...", {
        id: loadingToast,
        description: "Guardando archivo..."
      });

      pdf.save(fileName);

      toast.success("✅ Certificado descargado exitosamente", {
        id: loadingToast,
        description: `${fileName} guardado en tu carpeta de Descargas`
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("❌ Error al generar el certificado", {
        description: "Por favor intente nuevamente o contacte al administrador"
      });
    }
  };

  // Cada rol ve solo los certificados que le corresponden.
  const visibles = mockCertificates.filter((cert) => {
    if (esParticipante) return cert.participante === user.nombre;
    if (user.role === "instructor") return mismoInstructor(cert.instructor, user.nombre);
    return true;
  });

  const conNota = visibles.filter((c) => c.estado !== "anulado");
  const promedio = conNota.length
    ? Math.round(conNota.reduce((acc, c) => acc + Number(c.calificacion), 0) / conNota.length)
    : 0;

  const stats = [
    { label: "Total certificados", value: visibles.length, icon: FileText, color: "orange" as const },
    { label: "Emitidos", value: visibles.filter((c) => c.estado === "emitido").length, icon: Award, color: "green" as const },
    { label: "Pendientes", value: visibles.filter((c) => c.estado === "pendiente").length, icon: Clock, color: "yellow" as const },
    { label: "Calificación promedio", value: `${promedio}%`, icon: TrendingUp, color: "purple" as const },
  ];

  const filteredCertificatesAll = visibles.filter(cert => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      cert.participante.toLowerCase().includes(query) ||
      cert.curso.toLowerCase().includes(query) ||
      cert.instructor.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredCertificatesAll.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const filteredCertificates = filteredCertificatesAll.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {esParticipante ? "Mis certificados" : "Gestión de certificados"}
          </h1>
          <p className="mt-2 text-gray-700">
            {esParticipante
              ? "Descarga en PDF los certificados de los cursos que aprobaste"
              : "Diseñe, genere y administre certificados de formación en seguridad industrial"}
          </p>
        </div>

        {/* Action Buttons */}
        {puedeEmitir && (
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-orange-700 hover:bg-orange-800 shadow-md"
            onClick={handleNewCertificate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo certificado
          </Button>
          <Button
            variant="outline"
            className="shadow-md"
            onClick={() => toast.info("Exportar listado", { description: "Disponible en la siguiente versión" })}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar listado
          </Button>
        </div>
        )}

        {/* Help Card */}
        {puedeEmitir && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Descarga de certificados en PDF
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Los certificados se descargan automáticamente en tu equipo local en formato PDF profesional tamaño carta horizontal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-1">Descarga rápida</p>
                  <p className="text-gray-600">Haz clic en el botón <strong className="text-green-600">PDF</strong> en la tabla para descarga instantánea</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-1">Diseñador</p>
                  <p className="text-gray-600">Usa <strong className="text-orange-600">Ver</strong> para editar y personalizar antes de descargar</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-1">Ubicación</p>
                  <p className="text-gray-600">Los archivos se guardan en tu carpeta de <strong>Descargas</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <label htmlFor="buscar-certificados" className="sr-only">Buscar certificados</label>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="buscar-certificados"
              type="search"
              placeholder="Buscar por participante, curso o instructor…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st) => (
            <StatCard key={st.label} {...st} />
          ))}
        </div>

        {/* Certificates Table */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Listado de certificados <span className="text-gray-600 font-normal text-base">({filteredCertificatesAll.length})</span>
          </h2>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="border border-gray-200 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Participante</TableHead>
                    <TableHead>Curso</TableHead>
                    {!esParticipante && <TableHead>Instructor</TableHead>}
                    <TableHead className="w-32">Calificación</TableHead>
                    <TableHead className="w-32">Fecha Emisión</TableHead>
                    <TableHead className="w-32">Estado</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-700">
                        {esParticipante ? "Aún no tienes certificados emitidos" : "No se encontraron certificados"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <TableRow key={cert.id} className="hover:bg-gray-50">
                        <TableCell>{cert.id}</TableCell>
                        <TableCell className="font-medium">{cert.participante}</TableCell>
                        <TableCell>{cert.curso}</TableCell>
                        {!esParticipante && <TableCell className="text-gray-700">{cert.instructor}</TableCell>}
                        <TableCell>
                          <span className="font-medium text-gray-900">{cert.calificacion}%</span>
                        </TableCell>
                        <TableCell>{cert.fechaEmision}</TableCell>
                        <TableCell>{getEstadoBadge(cert.estado)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {puedeEmitir && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCertificate(cert)}
                              className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                              title="Ver y editar certificado"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                            )}
                            {(puedeEmitir || cert.estado === "emitido") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadCertificate(cert)}
                              className="text-green-800 hover:text-green-900 hover:bg-green-50"
                              title="Descargar certificado en PDF"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>

        {/* Certificate Designer Dialog */}
        {puedeEmitir && (
        <CertificateDesigner
          open={isDesignerOpen}
          onOpenChange={setIsDesignerOpen}
          certificate={selectedCertificate}
        />
        )}
      </div>
    </div>
  );
}
