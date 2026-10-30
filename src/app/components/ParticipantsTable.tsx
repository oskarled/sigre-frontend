import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ParticipantPreviewDialog } from "./ParticipantPreviewDialog";

export interface Participant {
  id: number;
  nombre: string;
  documento: string;
  curso: string;
  email: string;
  telefono: string;
  empresa: string;
  cargo: string;
  fechaRegistro: string;
  estado: string;
  // Campos adicionales del formulario
  nombres?: string;
  apellidos?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  fechaNacimiento?: string;
  genero?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  areaLaboral?: string;
  experienciaAnios?: string;
  cursoSeleccionado?: string;
  modalidad?: string;
  nivelConocimiento?: string;
}

export const mockParticipants: Participant[] = [
  {
    id: 1,
    nombre: "Carlos Alberto Rodríguez",
    nombres: "Carlos Alberto",
    apellidos: "Rodríguez",
    documento: "1.234.567-8",
    numeroDocumento: "1234567890",
    tipoDocumento: "CC",
    curso: "Trabajos en Alturas",
    cursoSeleccionado: "Trabajos en Alturas",
    email: "carlos.rodriguez@empresa.com",
    telefono: "+57 312 456 7890",
    empresa: "Construcciones ABC S.A.S",
    cargo: "Supervisor de Obra",
    fechaRegistro: "15/03/2026",
    estado: "Activo",
    fechaNacimiento: "1985-05-15",
    genero: "Masculino",
    direccion: "Calle 123 #45-67",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    areaLaboral: "Construcción",
    experienciaAnios: "10",
    modalidad: "presencial",
    nivelConocimiento: "intermedio"
  },
  {
    id: 2,
    nombre: "María Fernanda Gómez",
    nombres: "María Fernanda",
    apellidos: "Gómez",
    documento: "2.345.678-9",
    numeroDocumento: "2345678901",
    tipoDocumento: "CC",
    curso: "Seguridad Industrial",
    cursoSeleccionado: "Seguridad Industrial",
    email: "maria.gomez@empresa.com",
    telefono: "+57 315 789 0123",
    empresa: "Industrial Solutions Ltda",
    cargo: "Coordinadora HSE",
    fechaRegistro: "18/03/2026",
    estado: "Activo",
    fechaNacimiento: "1990-08-22",
    genero: "Femenino",
    direccion: "Carrera 45 #23-12",
    ciudad: "Medellín",
    departamento: "Antioquia",
    areaLaboral: "Seguridad y Salud",
    experienciaAnios: "7",
    modalidad: "virtual",
    nivelConocimiento: "avanzado"
  },
  {
    id: 3,
    nombre: "Jorge Luis Martínez",
    nombres: "Jorge Luis",
    apellidos: "Martínez",
    documento: "3.456.789-0",
    numeroDocumento: "3456789012",
    tipoDocumento: "CC",
    curso: "Primeros Auxilios",
    cursoSeleccionado: "Primeros Auxilios",
    email: "jorge.martinez@empresa.com",
    telefono: "+57 318 234 5678",
    empresa: "Manufacturas del Norte",
    cargo: "Operario",
    fechaRegistro: "20/03/2026",
    estado: "Egresado",
    fechaNacimiento: "1988-12-10",
    genero: "Masculino",
    direccion: "Avenida 30 #18-45",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    areaLaboral: "Producción",
    experienciaAnios: "5",
    modalidad: "presencial",
    nivelConocimiento: "basico"
  },
  {
    id: 4,
    nombre: "Ana Patricia Silva",
    nombres: "Ana Patricia",
    apellidos: "Silva",
    documento: "4.567.890-1",
    numeroDocumento: "4567890123",
    tipoDocumento: "CC",
    curso: "Espacios Confinados",
    cursoSeleccionado: "Espacios Confinados",
    email: "ana.silva@empresa.com",
    telefono: "+57 320 567 8901",
    empresa: "Petroquímica Nacional",
    cargo: "Ingeniera de Seguridad",
    fechaRegistro: "22/03/2026",
    estado: "Activo",
    fechaNacimiento: "1992-03-28",
    genero: "Femenino",
    direccion: "Transversal 12 #34-56",
    ciudad: "Barranquilla",
    departamento: "Atlántico",
    areaLaboral: "Ingeniería",
    experienciaAnios: "8",
    modalidad: "hibrido",
    nivelConocimiento: "avanzado"
  },
  {
    id: 5,
    nombre: "Pedro Antonio Ramírez",
    nombres: "Pedro Antonio",
    apellidos: "Ramírez",
    documento: "5.678.901-2",
    numeroDocumento: "5678901234",
    tipoDocumento: "CC",
    curso: "Trabajos en Alturas",
    cursoSeleccionado: "Trabajos en Alturas",
    email: "pedro.ramirez@empresa.com",
    telefono: "+57 314 890 1234",
    empresa: "Montajes Industriales S.A",
    cargo: "Técnico en Montaje",
    fechaRegistro: "25/03/2026",
    estado: "Activo",
    fechaNacimiento: "1987-07-05",
    genero: "Masculino",
    direccion: "Calle 67 #89-01",
    ciudad: "Bucaramanga",
    departamento: "Santander",
    areaLaboral: "Montaje",
    experienciaAnios: "12",
    modalidad: "presencial",
    nivelConocimiento: "avanzado"
  }
];

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'Activo':
      return 'bg-green-100 text-green-800';
    case 'Inactivo':
      return 'bg-gray-100 text-gray-800';
    case 'Egresado':
      return 'bg-blue-100 text-blue-800';
    case 'Suspendido':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

interface ParticipantsTableProps {
  participants: Participant[];
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleViewParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsPreviewOpen(true);
  };

  const filteredParticipants = participants;

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="w-32">Estado</TableHead>
              <TableHead className="w-24">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron participantes
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id} className="hover:bg-gray-50">
                  <TableCell>{participant.id}</TableCell>
                  <TableCell className="font-medium">{participant.nombre}</TableCell>
                  <TableCell>{participant.documento}</TableCell>
                  <TableCell>{participant.curso}</TableCell>
                  <TableCell className="text-gray-600">{participant.empresa}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getEstadoColor(participant.estado)}
                    >
                      {participant.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewParticipant(participant)}
                      className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Móvil: tarjetas */}
      <ul className="md:hidden divide-y divide-gray-100">
        {filteredParticipants.length === 0 && (
          <li className="p-6 text-center text-gray-700">No se encontraron participantes</li>
        )}
        {filteredParticipants.map((participant) => (
          <li key={participant.id} className="p-4 space-y-1">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-gray-900">{participant.nombre}</p>
              <Badge variant="secondary" className={getEstadoColor(participant.estado)}>
                {participant.estado}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{participant.curso} · {participant.empresa}</p>
            <Button size="sm" variant="outline" onClick={() => handleViewParticipant(participant)}>
              <Eye className="w-4 h-4" /> Ver detalle
            </Button>
          </li>
        ))}
      </ul>

      {/* Participant Preview Dialog */}
      {selectedParticipant && (
        <ParticipantPreviewDialog
          participant={selectedParticipant}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </>
  );
}
