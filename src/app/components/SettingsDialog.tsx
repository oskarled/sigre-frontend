import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { 
  Settings, Lock, Bell, Shield, Palette, Globe,
  Moon, Sun, Monitor, Mail, MessageSquare, Calendar,
  Database, Info, Check, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Diálogo de ajustes de la cuenta: cambio de contraseña, preferencias (idioma, zona horaria, formato de fecha)
 * y notificaciones.
 */
export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("cuenta");
  
  // Estados de configuración de cuenta
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Estados de configuración general
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("es");
  const [timezone, setTimezone] = useState("America/Bogota");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Estados de notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [certificateAlerts, setCertificateAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Estados de privacidad
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [allowDataCollection, setAllowDataCollection] = useState(true);

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Completa todos los campos", {
        description: "Todos los campos de contraseña son obligatorios"
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden", {
        description: "La nueva contraseña y la confirmación deben ser iguales"
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Contraseña muy corta", {
        description: "La contraseña debe tener al menos 8 caracteres"
      });
      return;
    }

    // Simulación de cambio de contraseña exitoso
    toast.success("Contraseña actualizada", {
      description: "Tu contraseña ha sido cambiada exitosamente"
    });

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSaveSettings = () => {
    toast.success("Configuración guardada", {
      description: "Tus preferencias han sido actualizadas"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Configuración
          </DialogTitle>
          <DialogDescription>
            Personaliza tu experiencia en el sistema SIGRE
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cuenta" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Cuenta
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="privacidad" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacidad
            </TabsTrigger>
          </TabsList>

          {/* TAB CUENTA */}
          <TabsContent value="cuenta" className="space-y-6 mt-6">
            {/* Cambiar Contraseña */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Cambiar Contraseña
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Actualizar Contraseña
                </Button>
              </div>
            </div>

            {/* Sesiones Activas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                Sesiones Activas
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Navegador Actual</p>
                      <p className="text-sm text-gray-600">Windows • Chrome • Cartagena, Colombia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-semibold">Activo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Dispositivo Móvil</p>
                      <p className="text-sm text-gray-600">Android • Chrome • Hace 2 días</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>

            {/* Autenticación de Dos Factores */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Autenticación de Dos Factores
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Recomendado:</strong> Activa 2FA para proteger mejor tu cuenta
                </p>
              </div>
            </div>
          </TabsContent>

          {/* TAB GENERAL */}
          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Apariencia */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Apariencia
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Tema del Sistema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Oscuro
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Sistema
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "light" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="w-full h-20 bg-white rounded border mb-2"></div>
                    <p className="text-sm text-center font-semibold">Claro</p>
                  </div>
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "dark" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="w-full h-20 bg-gray-900 rounded border mb-2"></div>
                    <p className="text-sm text-center font-semibold">Oscuro</p>
                  </div>
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "system" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 rounded border mb-2"></div>
                    <p className="text-sm text-center font-semibold">Sistema</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Idioma y Región */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Idioma y Región
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="pt">🇧🇷 Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                      <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat">Formato de Fecha</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeFormat">Formato de Hora</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger id="timeFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 horas</SelectItem>
                      <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Accesibilidad */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Accesibilidad
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Texto Grande</p>
                    <p className="text-sm text-gray-600">Aumentar el tamaño del texto en el sistema</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Alto Contraste</p>
                    <p className="text-sm text-gray-600">Mejorar la visibilidad de elementos</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Animaciones Reducidas</p>
                    <p className="text-sm text-gray-600">Minimizar movimientos en la interfaz</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB NOTIFICACIONES */}
          <TabsContent value="notificaciones" className="space-y-6 mt-6">
            {/* Notificaciones por Email */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600" />
                Notificaciones por Correo
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Correos Electrónicos</p>
                    <p className="text-sm text-gray-600">Recibir notificaciones por email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Recordatorios de Eventos</p>
                    <p className="text-sm text-gray-600">Avisos sobre cursos próximos</p>
                  </div>
                  <Switch checked={eventReminders} onCheckedChange={setEventReminders} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Certificados Disponibles</p>
                    <p className="text-sm text-gray-600">Notificación cuando un certificado está listo</p>
                  </div>
                  <Switch checked={certificateAlerts} onCheckedChange={setCertificateAlerts} />
                </div>
              </div>
            </div>

            {/* Notificaciones Push */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Notificaciones Push
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Notificaciones del Navegador</p>
                    <p className="text-sm text-gray-600">Mostrar alertas en el navegador</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Actualizaciones del Sistema</p>
                    <p className="text-sm text-gray-600">Novedades y mejoras en SIGRE</p>
                  </div>
                  <Switch checked={systemUpdates} onCheckedChange={setSystemUpdates} />
                </div>
              </div>
            </div>

            {/* Marketing */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Marketing y Comunicaciones
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Correos Promocionales</p>
                    <p className="text-sm text-gray-600">Ofertas y nuevos cursos disponibles</p>
                  </div>
                  <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB PRIVACIDAD */}
          <TabsContent value="privacidad" className="space-y-6 mt-6">
            {/* Visibilidad del Perfil */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Visibilidad del Perfil
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility">Visibilidad</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger id="profileVisibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público - Todos pueden ver mi perfil</SelectItem>
                      <SelectItem value="private">Privado - Solo yo veo mi perfil</SelectItem>
                      <SelectItem value="instructors">Instructores - Solo instructores y admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Mostrar Email</p>
                    <p className="text-sm text-gray-600">Visible en tu perfil público</p>
                  </div>
                  <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Mostrar Teléfono</p>
                    <p className="text-sm text-gray-600">Visible en tu perfil público</p>
                  </div>
                  <Switch checked={showPhone} onCheckedChange={setShowPhone} />
                </div>
              </div>
            </div>

            {/* Datos y Privacidad */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-600" />
                Datos y Privacidad
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Recopilación de Datos</p>
                    <p className="text-sm text-gray-600">Permitir análisis para mejorar el servicio</p>
                  </div>
                  <Switch checked={allowDataCollection} onCheckedChange={setAllowDataCollection} />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Descargar Mis Datos
                  </Button>
                  <p className="text-xs text-gray-500">
                    Solicita una copia de toda tu información almacenada
                  </p>
                </div>
              </div>
            </div>

            {/* Zona de Peligro */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Zona de Peligro
              </h4>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 border-red-300">
                  Eliminar Mi Cuenta
                </Button>
                <p className="text-xs text-red-700">
                  ⚠️ Esta acción es permanente e irreversible. Todos tus datos serán eliminados.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer con Información del Sistema */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Sistema SIGRE v1.3</p>
              <p className="text-sm text-gray-600">
                ECM Training Center • Última actualización: 19 Oct 2026
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveSettings}
          >
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
