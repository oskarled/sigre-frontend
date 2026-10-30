import { Button } from "./ui/button";
import { navItemsFor, type NavId, type UserRole } from "../lib/roles";

interface NavigationProps {
  role: UserRole;
  activeItem: NavId;
  onItemClick: (itemId: NavId) => void;
}

export function Navigation({ role, activeItem, onItemClick }: NavigationProps) {
  const navItems = navItemsFor(role);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      {/* En pantallas pequeñas las pestañas se desplazan horizontalmente en vez de desbordar la página */}
      <div className="px-2 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 sm:gap-4 min-w-max">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              aria-current={activeItem === item.id ? "page" : undefined}
              className={`py-4 px-4 sm:px-6 rounded-none border-b-3 transition-all duration-200 font-semibold tracking-wide ${
                activeItem === item.id
                  ? "border-orange-600 text-orange-700 bg-orange-50/50"
                  : "border-transparent text-gray-700 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50/30"
              }`}
              onClick={() => onItemClick(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
