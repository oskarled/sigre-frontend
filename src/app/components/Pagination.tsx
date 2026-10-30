import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

/**
 * Controles de paginación reutilizables (anterior, números de página y siguiente).
 * Se usa en cursos, participantes y certificados.
 */
export function Pagination({ 
  currentPage = 1, 
  totalPages = 3, 
  onPageChange 
}: PaginationProps) {
  // Arreglo [1, 2, ..., totalPages] para dibujar un botón por página
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          aria-label="Página anterior"
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1} // en la primera página no se puede retroceder
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange?.(page)}
            className="w-8"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          aria-label="Página siguiente"
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages} // en la última página no se puede avanzar
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}