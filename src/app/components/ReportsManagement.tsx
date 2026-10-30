import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { 
  Download, FileText, TrendingUp, Users, Award, Calendar,
  CheckCircle, Clock, AlertCircle, BookOpen, Target, Activity,
  Filter, FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// Mock data para gráficos
const eventosData = [
  { mes: "Ene", eventos: 12, participantes: 145, certificados: 120 },
  { mes: "Feb", eventos: 15, participantes: 178, certificados: 156 },
  { mes: "Mar", eventos: 18, participantes: 210, certificados: 189 },
  { mes: "Abr", eventos: 14, participantes: 167, certificados: 145 },
  { mes: "May", eventos: 20, participantes: 234, certificados: 210 },
  { mes: "Jun", eventos: 22, participantes: 256, certificados: 228 },
];

const cursosPopularesData = [
  { nombre: "Trabajos en Alturas", participantes: 245, color: "#ea580c" },
  { nombre: "Seguridad Industrial", participantes: 198, color: "#dc2626" },
  { nombre: "Primeros Auxilios", participantes: 167, color: "#f59e0b" },
  { nombre: "Manejo de Sustancias", participantes: 134, color: "#ef4444" },
  { nombre: "Espacios Confinados", participantes: 112, color: "#fb923c" },
];

const tasaAprobacionData = [
  { categoria: "Aprobados", valor: 89, color: "#10b981" },
  { categoria: "Reprobados", valor: 8, color: "#ef4444" },
  { categoria: "En Proceso", valor: 3, color: "#f59e0b" },
];

const asistenciaData = [
  { semana: "Sem 1", asistencia: 92, inasistencia: 8 },
  { semana: "Sem 2", asistencia: 88, inasistencia: 12 },
  { semana: "Sem 3", asistencia: 95, inasistencia: 5 },
  { semana: "Sem 4", asistencia: 90, inasistencia: 10 },
];

const instructoresData = [
  { nombre: "Ing. María González", cursos: 24, calificacion: 4.9, participantes: 312 },
  { nombre: "Ing. Pedro Martínez", cursos: 20, calificacion: 4.8, participantes: 276 },
  { nombre: "Dr. Jorge Ramírez", cursos: 18, calificacion: 4.7, participantes: 245 },
  { nombre: "Ing. Ana Torres", cursos: 16, calificacion: 4.8, participantes: 198 },
  { nombre: "Lic. Carlos Ruiz", cursos: 14, calificacion: 4.6, participantes: 167 },
];

const certificacionesMensuales = [
  { mes: "Ene", cantidad: 120 },
  { mes: "Feb", cantidad: 156 },
  { mes: "Mar", cantidad: 189 },
  { mes: "Abr", cantidad: 145 },
  { mes: "May", cantidad: 210 },
  { mes: "Jun", cantidad: 228 },
];

/**
 * Módulo de reportes: indicadores y gráficos (Recharts) por periodo, organizados en pestañas, con exportación.
 * Rol: administrador.
 */
export function ReportsManagement() {
  const [periodo, setPeriodo] = useState("6meses");
  const [tipoReporte, setTipoReporte] = useState("general");
  const [activeTab, setActiveTab] = useState("general");

  const handleExportPDF = () => {
    toast.success("Exportando a PDF", {
      description: "El reporte se está generando y descargará en breve"
    });
  };

  const handleExportExcel = () => {
    toast.success("Exportando a Excel", {
      description: "El archivo se está generando y descargará en breve"
    });
  };

  const handleGenerateReport = () => {
    toast.info("Generando reporte personalizado", {
      description: "Por favor espere mientras procesamos los datos"
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reportes y estadísticas
            </h1>
            <p className="mt-2 text-gray-600">
              Análisis detallado del desempeño del sistema de formación en seguridad
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1mes">Último mes</SelectItem>
                <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                <SelectItem value="1ano">Último año</SelectItem>
                <SelectItem value="todo">Todo el período</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              onClick={handleExportExcel}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleExportPDF}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            
            <Button 
              onClick={handleGenerateReport}
              className="bg-orange-700 hover:bg-orange-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-orange-800 mb-1">Total Eventos</p>
            <p className="text-3xl font-bold text-orange-900">124</p>
            <p className="text-xs text-orange-700 mt-2">+15% vs mes anterior</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800 mb-1">Participantes Activos</p>
            <p className="text-3xl font-bold text-blue-900">1,456</p>
            <p className="text-xs text-blue-700 mt-2">+8% vs mes anterior</p>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-green-800 mb-1">Certificados Emitidos</p>
            <p className="text-3xl font-bold text-green-900">1,048</p>
            <p className="text-xs text-green-700 mt-2">+12% vs mes anterior</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-purple-800 mb-1">Tasa de Aprobación</p>
            <p className="text-3xl font-bold text-purple-900">89%</p>
            <p className="text-xs text-purple-700 mt-2">Meta: 85%</p>
          </Card>
        </div>

        {/* Tabs para diferentes vistas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="certificados">Certificados</TabsTrigger>
            <TabsTrigger value="instructores">Instructores</TabsTrigger>
          </TabsList>

          {/* TAB GENERAL */}
          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Gráfico de tendencias */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Tendencias Generales</h3>
                  <p className="text-sm text-gray-600">Evolución de eventos, participantes y certificados</p>
                </div>
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={eventosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="eventos" 
                    stroke="#ea580c" 
                    strokeWidth={3}
                    name="Eventos"
                    dot={{ fill: '#ea580c', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="participantes" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Participantes"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="certificados" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Certificados"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cursos más populares */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Cursos Más Populares</h3>
                    <p className="text-sm text-gray-600">Top 5 por participantes</p>
                  </div>
                  <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cursosPopularesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="nombre" type="category" width={150} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="participantes" radius={[0, 8, 8, 0]}>
                      {cursosPopularesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Tasa de aprobación */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Tasa de Aprobación</h3>
                    <p className="text-sm text-gray-600">Distribución de resultados</p>
                  </div>
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="50%" height={250}>
                    <PieChart>
                      <Pie
                        data={tasaAprobacionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="valor"
                      >
                        {tasaAprobacionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {tasaAprobacionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-700">{item.categoria}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.valor}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB EVENTOS */}
          <TabsContent value="eventos" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Eventos por Mes</h3>
                  <p className="text-sm text-gray-600">Cantidad de eventos realizados</p>
                </div>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={eventosData}>
                  <defs>
                    <linearGradient id="colorEventos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="eventos" 
                    stroke="#ea580c" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEventos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Estadísticas de eventos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eventos Completados</p>
                    <p className="text-2xl font-bold text-gray-900">98</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">En Progreso</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próximos</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB PARTICIPANTES */}
          <TabsContent value="participantes" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Participantes por Mes</h3>
                  <p className="text-sm text-gray-600">Crecimiento de la base de estudiantes</p>
                </div>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={eventosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="participantes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Asistencia */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Asistencia Promedio</h3>
                  <p className="text-sm text-gray-600">Porcentaje de asistencia semanal</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={asistenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="semana" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="asistencia" fill="#10b981" radius={[8, 8, 0, 0]} name="Asistencia %" />
                  <Bar dataKey="inasistencia" fill="#ef4444" radius={[8, 8, 0, 0]} name="Inasistencia %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* TAB CERTIFICADOS */}
          <TabsContent value="certificados" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Certificaciones Mensuales</h3>
                  <p className="text-sm text-gray-600">Certificados emitidos por mes</p>
                </div>
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={certificacionesMensuales}>
                  <defs>
                    <linearGradient id="colorCertificados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cantidad" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCertificados)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Estadísticas de certificados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Emitidos</p>
                    <p className="text-2xl font-bold text-gray-900">1,048</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">42</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Este Mes</p>
                    <p className="text-2xl font-bold text-gray-900">228</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB INSTRUCTORES */}
          <TabsContent value="instructores" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Rendimiento de Instructores</h3>
                  <p className="text-sm text-gray-600">Top 5 instructores por participantes</p>
                </div>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">#</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Instructor</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Cursos</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Participantes</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Calificación</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructoresData.map((instructor, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{instructor.nombre}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-orange-600">{instructor.cursos}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-blue-600">{instructor.participantes}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold text-green-600">{instructor.calificacion}</span>
                            <span className="text-gray-400 text-sm">/5.0</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                              style={{ width: `${(instructor.participantes / 312) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Estadísticas de instructores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Instructores</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Calificación Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">4.76</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cursos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Información adicional */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Exportación de reportes
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Los reportes se pueden exportar en formato PDF o Excel para análisis offline y presentaciones.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-1">Gráficos interactivos</p>
                  <p className="text-gray-600">Visualizaciones dinámicas con datos en tiempo real</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-1">Filtros de período</p>
                  <p className="text-gray-600">Analiza datos por mes, trimestre o año completo</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
