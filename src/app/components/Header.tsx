import { useState } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserProfileDialog } from "./UserProfileDialog";
import { SettingsDialog } from "./SettingsDialog";
import { Badge } from "./ui/badge";
import logoECM from "figma:asset/7c493e705c8937b276f08841602854180eaa99e0.png";
import { ROLE_LABEL, type SessionUser } from "../lib/roles";

interface HeaderProps {
  onLogout?: () => void;
  user: SessionUser;
}

const ROLE_BADGE: Record<SessionUser["role"], string> = {
  participante: "border-orange-700 text-orange-700",
  instructor: "border-blue-700 text-blue-700",
  administrador: "border-gray-800 text-gray-800",
};

/**
 * Encabezado de la aplicación: logo, nombre y rol del usuario, y menú para perfil, ajustes y cerrar sesión.
 */
export function Header({ onLogout, user }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoECM} 
              alt="ECM Training Center" 
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                SIGRE <span className="font-normal text-gray-600 hidden sm:inline">· ECM Training Center</span>
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">Sistema de Registro para Eventos de Capacitación</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100/80">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="font-medium max-w-[180px] truncate">{user.nombre}</span>
                  <Badge variant="outline" className={`text-xs ${ROLE_BADGE[user.role]}`}>
                    {ROLE_LABEL[user.role]}
                  </Badge>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Profile Dialog */}
      <UserProfileDialog 
        user={user}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      {/* Settings Dialog */}
      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </header>
  );
}