import { useState } from "react";
import { Calendar, TrendingUp, Award, AlertCircle, Search, Filter, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
  imageUrl: string;
  categoryColor: string;
  content?: string;
}

const allNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Nuevas Normativas de Seguridad Industrial 2026",
    category: "Normatividad",
    date: "10 de Octubre, 2026",
    summary: "El Ministerio de Trabajo actualiza los requisitos para trabajos en alturas y espacios confinados.",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    categoryColor: "orange",
    content: "El Ministerio de Trabajo ha emitido nuevas directrices para fortalecer la seguridad en trabajos de alto riesgo. Las actualizaciones incluyen requisitos más estrictos para certificaciones y equipos de protección personal."
  },
  {
    id: 2,
    title: "ECM Training Center Certifica 150 Nuevos Profesionales",
    category: "Logros",
    date: "8 de Octubre, 2026",
    summary: "Ceremonia de graduación exitosa para especialistas en seguridad industrial y primeros auxilios.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    categoryColor: "green",
    content: "En una emotiva ceremonia, 150 nuevos profesionales recibieron sus certificaciones en diversas áreas de seguridad industrial, marcando un hito importante para nuestra institución."
  },
  {
    id: 3,
    title: "Curso Especializado en Riesgo Eléctrico",
    category: "Capacitación",
    date: "5 de Octubre, 2026",
    summary: "Inscripciones abiertas para el programa certificado de prevención de accidentes eléctricos.",
    imageUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80",
    categoryColor: "blue",
    content: "Nuevo programa de capacitación especializada en prevención de riesgos eléctricos. El curso incluye módulos teóricos y prácticos con equipamiento de última generación."
  },
  {
    id: 4,
    title: "Estadísticas de Seguridad: Reducción del 40% en Accidentes",
    category: "Estadísticas",
    date: "2 de Octubre, 2026",
    summary: "Las empresas que implementan nuestros programas reportan mejoras significativas en indicadores.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    categoryColor: "purple",
    content: "Un estudio reciente muestra que las empresas que han implementado nuestros programas de capacitación han logrado reducir significativamente sus índices de accidentalidad laboral."
  },
  {
    id: 5,
    title: "Alianza Estratégica con Empresa Líder en Construcción",
    category: "Logros",
    date: "28 de Septiembre, 2026",
    summary: "ECM Training Center firma convenio para capacitar a más de 500 trabajadores en el próximo año.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    categoryColor: "green",
    content: "Esta alianza representa un paso importante en nuestra misión de promover la seguridad industrial en grandes proyectos de infraestructura."
  },
  {
    id: 6,
    title: "Actualización de Protocolos de Espacios Confinados",
    category: "Normatividad",
    date: "25 de Septiembre, 2026",
    summary: "Nuevos estándares internacionales para trabajos en espacios confinados entran en vigencia.",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    categoryColor: "orange",
    content: "Los protocolos actualizados enfatizan la importancia de la evaluación de riesgos y el uso de equipos de monitoreo de atmósfera."
  },
  {
    id: 7,
    title: "Taller Gratuito de Primeros Auxilios para la Comunidad",
    category: "Capacitación",
    date: "20 de Septiembre, 2026",
    summary: "Jornada de capacitación comunitaria en respuesta a emergencias y primeros auxilios básicos.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    categoryColor: "blue",
    content: "Como parte de nuestro compromiso social, ofrecemos talleres gratuitos para enseñar habilidades básicas de primeros auxilios a la comunidad."
  },
  {
    id: 8,
    title: "Récord de Certificaciones en Trabajos en Alturas",
    category: "Estadísticas",
    date: "18 de Septiembre, 2026",
    summary: "Más de 300 profesionales certificados en el último trimestre, superando todas las expectativas.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    categoryColor: "purple",
    content: "Este trimestre marca un récord histórico en certificaciones de trabajos en alturas, reflejando la creciente demanda por formación especializada."
  },
  {
    id: 9,
    title: "Inauguración de Nuevo Laboratorio de Prácticas",
    category: "Logros",
    date: "15 de Septiembre, 2026",
    summary: "Modernas instalaciones equipadas con tecnología de punta para entrenamiento práctico.",
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    categoryColor: "green",
    content: "Nuestras nuevas instalaciones cuentan con simuladores de última generación y equipos certificados para ofrecer la mejor experiencia de aprendizaje."
  },
  {
    id: 10,
    title: "Certificación Internacional ISO 9001:2015",
    category: "Logros",
    date: "10 de Septiembre, 2026",
    summary: "ECM Training Center obtiene certificación internacional de calidad en servicios de formación.",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    categoryColor: "green",
    content: "Esta certificación valida nuestro compromiso con la excelencia y los estándares internacionales de calidad en capacitación."
  },
  {
    id: 11,
    title: "Programa de Capacitación en Manejo de Sustancias Peligrosas",
    category: "Capacitación",
    date: "5 de Septiembre, 2026",
    summary: "Nuevo curso especializado en identificación, almacenamiento y manejo seguro de materiales peligrosos.",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=80",
    categoryColor: "blue",
    content: "Curso integral que cubre todos los aspectos del manejo seguro de sustancias químicas y materiales peligrosos conforme a normativas internacionales."
  },
  {
    id: 12,
    title: "Estadísticas Q3 2026: Crecimiento del 45% en Inscripciones",
    category: "Estadísticas",
    date: "1 de Septiembre, 2026",
    summary: "El tercer trimestre muestra un crecimiento significativo en todas las líneas de capacitación.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    categoryColor: "purple",
    content: "Los datos muestran un aumento sostenido en la demanda de capacitación en seguridad industrial, especialmente en sectores de construcción y manufactura."
  }
];

function getCategoryIcon(category: string) {
  switch (category) {
    case "Normatividad":
      return <AlertCircle className="w-4 h-4" />;
    case "Logros":
      return <Award className="w-4 h-4" />;
    case "Capacitación":
      return <TrendingUp className="w-4 h-4" />;
    case "Estadísticas":
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
}

function getCategoryColorClass(color: string) {
  switch (color) {
    case "orange":
      return "bg-orange-100 text-orange-600 border-orange-200";
    case "green":
      return "bg-green-100 text-green-600 border-green-200";
    case "blue":
      return "bg-blue-100 text-blue-600 border-blue-200";
    case "purple":
      return "bg-purple-100 text-purple-600 border-purple-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

interface AllNewsViewProps {
  onBack: () => void;
}

/**
 * Vista completa de noticias de ECM Training Center con buscador.
 * Props: onBack (vuelve al inicio). Rol: todos.
 */
export function AllNewsView({ onBack }: AllNewsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const categories = ["Todas", "Normatividad", "Logros", "Capacitación", "Estadísticas"];

  const filteredNews = allNewsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedNews) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedNews(null)}
            className="mb-6 text-orange-700 hover:text-orange-800 hover:bg-orange-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver a noticias
          </Button>

          {/* Article */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image */}
            <div className="relative h-96 bg-gray-200">
              <ImageWithFallback
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getCategoryColorClass(selectedNews.categoryColor)}>
                  {getCategoryIcon(selectedNews.category)}
                  <span className="ml-1">{selectedNews.category}</span>
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{selectedNews.date}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {selectedNews.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {selectedNews.summary}
              </p>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNews.content}
                </p>
              </div>

              {/* Share buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Compartir esta noticia:
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-orange-700 hover:text-orange-800 hover:bg-orange-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Todas las noticias
            </h1>
            <p className="text-gray-600">
              Mantente informado sobre las últimas novedades en seguridad industrial
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700 text-sm">Categoría:</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-orange-700 hover:bg-orange-800" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{filteredNews.length}</span> resultados
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedNews(news)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColorClass(news.categoryColor)}`}>
                    {getCategoryIcon(news.category)}
                    {news.category}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{news.date}</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {news.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {news.summary}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-orange-700 group-hover:text-orange-800">
                    Leer más →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              No se encontraron noticias
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o cambia el filtro de categoría
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
