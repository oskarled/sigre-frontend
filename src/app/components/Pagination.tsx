import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ 
  currentPage = 1, 
  totalPages = 3, 
  onPageChange 
}: PaginationProps) {
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
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange?.(page)}
            className="w-8"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}