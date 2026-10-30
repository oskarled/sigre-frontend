import { Calendar, TrendingUp, Award, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
  imageUrl: string;
  categoryColor: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Nuevas Normativas de Seguridad Industrial 2026",
    category: "Normatividad",
    date: "10 de Octubre, 2026",
    summary: "El Ministerio de Trabajo actualiza los requisitos para trabajos en alturas y espacios confinados.",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    categoryColor: "orange"
  },
  {
    id: 2,
    title: "ECM Training Center Certifica 150 Nuevos Profesionales",
    category: "Logros",
    date: "8 de Octubre, 2026",
    summary: "Ceremonia de graduación exitosa para especialistas en seguridad industrial y primeros auxilios.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    categoryColor: "green"
  },
  {
    id: 3,
    title: "Curso Especializado en Riesgo Eléctrico",
    category: "Capacitación",
    date: "5 de Octubre, 2026",
    summary: "Inscripciones abiertas para el programa certificado de prevención de accidentes eléctricos.",
    imageUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80",
    categoryColor: "blue"
  },
  {
    id: 4,
    title: "Estadísticas de Seguridad: Reducción del 40% en Accidentes",
    category: "Estadísticas",
    date: "2 de Octubre, 2026",
    summary: "Las empresas que implementan nuestros programas reportan mejoras significativas en indicadores.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    categoryColor: "purple"
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

interface NewsSectionProps {
  onViewAll: () => void;
}

/**
 * Resumen de las últimas noticias en la pantalla de inicio. Prop: onViewAll (abre la vista completa).
 */
export function NewsSection({ onViewAll }: NewsSectionProps) {
  return (
    <div className="mt-16 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Últimas noticias
        </h2>
        <p className="text-gray-600">
          Mantente informado sobre actualizaciones, eventos y logros en seguridad industrial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsItems.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
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

      {/* View All Button */}
      <div className="mt-8 text-center">
        <button 
          onClick={onViewAll}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-700 to-red-700 text-white font-semibold rounded-lg hover:from-orange-800 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
        >
          Ver todas las noticias
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}