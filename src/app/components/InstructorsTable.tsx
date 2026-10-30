import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, Award, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { InstructorPreviewDialog } from "./InstructorPreviewDialog";
import { InstructorCertificationsDialog } from "./InstructorCertificationsDialog";
import { InstructorCertificateDesigner } from "./InstructorCertificateDesigner";

export interface Instructor {
  id: number;
  nombre: string;
  documento: string;
  especialidad: string;
  titulo: string;
  email: string;
  telefono: string;
  aniosExperiencia: string;
  certificaciones: number;
  cursosActivos: number;
  estado: string;
  fechaRegistro: string;
  // Campos adicionales
  nombres?: string;
  apellidos?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  fechaNacimiento?: string;
  genero?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  nivelEducativo?: string;
  universidadEgreso?: string;
  anioGraduacion?: string;
  registroProfesional?: string;
  areasEspecializacion?: string;
  certificacionesPrincipales?: string;
  cursosDictados?: string;
  horasFormacion?: string;
  idiomas?: string;
}

export const mockInstructors: Instructor[] = [
  {
    id: 1,
    nombre: "Ing. María González Pérez",
    nombres: "María",
    apellidos: "González Pérez",
    documento: "52.345.678",
    numeroDocumento: "52345678",
    tipoDocumento: "CC",
    especialidad: "Trabajos en Alturas",
    titulo: "Ingeniera en Seguridad Industrial",
    email: "maria.gonzalez@ecm.com",
    telefono: "+57 312 456 7890",
    aniosExperiencia: "12",
    certificaciones: 8,
    cursosActivos: 3,
    estado: "Activo",
    fechaRegistro: "10/01/2020",
    fechaNacimiento: "1985-03-15",
    genero: "Femenino",
    direccion: "Calle 100 #15-20",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    nivelEducativo: "Especialización",
    universidadEgreso: "Universidad Nacional de Colombia",
    anioGraduacion: "2010",
    registroProfesional: "TP-123456",
    areasEspecializacion: "Trabajos en Alturas, Espacios Confinados, SGSST",
    cursosDictados: "Trabajos en Alturas I, II, III, Coordinador de Alturas",
    horasFormacion: "1500",
    idiomas: "Español, Inglés"
  },
  {
    id: 2,
    nombre: "Ing. Pedro Martínez Silva",
    nombres: "Pedro",
    apellidos: "Martínez Silva",
    documento: "80.123.456",
    numeroDocumento: "80123456",
    tipoDocumento: "CC",
    especialidad: "Seguridad Industrial",
    titulo: "Ingeniero Industrial",
    email: "pedro.martinez@ecm.com",
    telefono: "+57 315 789 0123",
    aniosExperiencia: "15",
    certificaciones: 10,
    cursosActivos: 4,
    estado: "Activo",
    fechaRegistro: "15/03/2019",
    fechaNacimiento: "1980-07-22",
    genero: "Masculino",
    direccion: "Carrera 45 #78-90",
    ciudad: "Medellín",
    departamento: "Antioquia",
    nivelEducativo: "Maestría",
    universidadEgreso: "Universidad de Antioquia",
    anioGraduacion: "2005",
    registroProfesional: "TP-234567",
    areasEspecializacion: "Seguridad Industrial, SGSST, Higiene Industrial",
    cursosDictados: "Seguridad Industrial Básica, SGSST, Manejo de Extintores",
    horasFormacion: "2000",
    idiomas: "Español, Inglés, Portugués"
  },
  {
    id: 3,
    nombre: "Dr. Jorge Ramírez López",
    nombres: "Jorge",
    apellidos: "Ramírez López",
    documento: "79.876.543",
    numeroDocumento: "79876543",
    tipoDocumento: "CC",
    especialidad: "Primeros Auxilios",
    titulo: "Médico Especialista en Urgencias",
    email: "jorge.ramirez@ecm.com",
    telefono: "+57 318 234 5678",
    aniosExperiencia: "18",
    certificaciones: 12,
    cursosActivos: 2,
    estado: "Activo",
    fechaRegistro: "20/06/2018",
    fechaNacimiento: "1978-11-10",
    genero: "Masculino",
    direccion: "Avenida 30 #50-25",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    nivelEducativo: "Especialización",
    universidadEgreso: "Universidad del Valle",
    anioGraduacion: "2003",
    registroProfesional: "RM-345678",
    areasEspecializacion: "Primeros Auxilios, RCP, Atención Pre-hospitalaria",
    cursosDictados: "Primeros Auxilios Básico y Avanzado, RCP, Brigadista",
    horasFormacion: "1800",
    idiomas: "Español"
  },
  {
    id: 4,
    nombre: "Ing. Carlos Ruiz Mendoza",
    nombres: "Carlos",
    apellidos: "Ruiz Mendoza",
    documento: "1.024.567.890",
    numeroDocumento: "1024567890",
    tipoDocumento: "CC",
    especialidad: "Riesgo Eléctrico",
    titulo: "Ingeniero Eléctrico",
    email: "carlos.ruiz@ecm.com",
    telefono: "+57 320 567 8901",
    aniosExperiencia: "10",
    certificaciones: 6,
    cursosActivos: 2,
    estado: "Activo",
    fechaRegistro: "05/09/2021",
    fechaNacimiento: "1988-05-28",
    genero: "Masculino",
    direccion: "Transversal 12 #34-56",
    ciudad: "Barranquilla",
    departamento: "Atlántico",
    nivelEducativo: "Profesional",
    universidadEgreso: "Universidad del Norte",
    anioGraduacion: "2012",
    registroProfesional: "TP-456789",
    areasEspecializacion: "Riesgo Eléctrico, Subestaciones, Alta Tensión",
    cursosDictados: "Riesgo Eléctrico I y II, Subestaciones Eléctricas",
    horasFormacion: "800",
    idiomas: "Español, Inglés"
  },
  {
    id: 5,
    nombre: "Ing. Ana Méndez Torres",
    nombres: "Ana",
    apellidos: "Méndez Torres",
    documento: "63.789.012",
    numeroDocumento: "63789012",
    tipoDocumento: "CC",
    especialidad: "Espacios Confinados",
    titulo: "Ingeniera Ambiental",
    email: "ana.mendez@ecm.com",
    telefono: "+57 314 890 1234",
    aniosExperiencia: "8",
    certificaciones: 5,
    cursosActivos: 1,
    estado: "Activo",
    fechaRegistro: "12/02/2022",
    fechaNacimiento: "1990-09-05",
    genero: "Femenino",
    direccion: "Calle 67 #89-01",
    ciudad: "Bucaramanga",
    departamento: "Santander",
    nivelEducativo: "Profesional",
    universidadEgreso: "Universidad Industrial de Santander",
    anioGraduacion: "2015",
    registroProfesional: "TP-567890",
    areasEspecializacion: "Espacios Confinados, Higiene Industrial, Monitoreo de Gases",
    cursosDictados: "Espacios Confinados, Monitoreo de Atmósferas",
    horasFormacion: "600",
    idiomas: "Español"
  }
];

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'Activo':
      return 'bg-green-100 text-green-800';
    case 'Inactivo':
      return 'bg-gray-100 text-gray-800';
    case 'Vacaciones':
      return 'bg-blue-100 text-blue-800';
    case 'Licencia':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

interface InstructorsTableProps {
  instructors?: Instructor[];
  searchQuery?: string;
}

/**
 * Tabla del directorio de instructores. Desde cada fila se abre el detalle,
 * las certificaciones o el diseñador de certificado. Props: instructors, searchQuery.
 */
export function InstructorsTable({ instructors = mockInstructors, searchQuery = "" }: InstructorsTableProps) {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [isCertificateDesignerOpen, setIsCertificateDesignerOpen] = useState(false);

  const handleViewInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsPreviewOpen(true);
  };

  const handleViewCertifications = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsCertificationsOpen(true);
  };

  const handleOpenCertificationsFromPreview = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsCertificationsOpen(true);
  };

  const handleGenerateCertificate = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsCertificateDesignerOpen(true);
  };

  // Filtrar instructores según la búsqueda
  const filteredInstructors = instructors.filter(instructor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      instructor.nombre.toLowerCase().includes(query) ||
      instructor.documento.toLowerCase().includes(query) ||
      instructor.especialidad.toLowerCase().includes(query) ||
      instructor.email.toLowerCase().includes(query) ||
      instructor.titulo.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead className="w-32">Experiencia</TableHead>
              <TableHead className="w-32">Certificaciones</TableHead>
              <TableHead className="w-32">Estado</TableHead>
              <TableHead className="w-40">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstructors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron instructores
                </TableCell>
              </TableRow>
            ) : (
              filteredInstructors.map((instructor) => (
                <TableRow key={instructor.id} className="hover:bg-gray-50">
                  <TableCell>{instructor.id}</TableCell>
                  <TableCell className="font-medium">{instructor.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {instructor.especialidad}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {instructor.aniosExperiencia} años
                  </TableCell>
                  <TableCell>
                    <span className="text-orange-600 font-medium">
                      {instructor.certificaciones}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getEstadoColor(instructor.estado)}
                    >
                      {instructor.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewInstructor(instructor)}
                        className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewCertifications(instructor)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Ver certificaciones"
                      >
                        <Award className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerateCertificate(instructor)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Generar certificado"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Instructor Preview Dialog */}
      {selectedInstructor && (
        <InstructorPreviewDialog
          instructor={selectedInstructor}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          onOpenCertifications={handleOpenCertificationsFromPreview}
        />
      )}

      {/* Certifications Dialog */}
      {selectedInstructor && (
        <InstructorCertificationsDialog
          instructor={selectedInstructor}
          open={isCertificationsOpen}
          onOpenChange={setIsCertificationsOpen}
        />
      )}

      {/* Certificate Designer Dialog */}
      {selectedInstructor && (
        <InstructorCertificateDesigner
          instructor={selectedInstructor}
          open={isCertificateDesignerOpen}
          onOpenChange={setIsCertificateDesignerOpen}
        />
      )}
    </>
  );
}
