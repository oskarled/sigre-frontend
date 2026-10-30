import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Mail, Lock, User, GraduationCap, Award, Eye, EyeOff, ShieldCheck, Settings } from "lucide-react";
import { toast } from "sonner@2.0.3";
import logoECM from "figma:asset/7c493e705c8937b276f08841602854180eaa99e0.png";
import { DEMO_USERS, ROLE_LABEL, type SessionUser, type UserRole } from "../lib/roles";

interface LoginScreenProps {
  onLogin: (user: SessionUser) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("participante");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!form.email) nextErrors.email = "Ingresa tu correo electrónico";
    else if (!EMAIL_PATTERN.test(form.email)) nextErrors.email = "El correo no tiene un formato válido";
    if (!form.password) nextErrors.password = "Ingresa tu contraseña";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Revisa los datos del formulario");
      return;
    }

    // Prototipo: no hay servidor de autenticación. Se entra con el usuario de demostración del rol elegido.
    toast.success("Inicio de sesión exitoso", { description: "Bienvenido al Sistema SIGRE" });
    setTimeout(() => onLogin({ ...DEMO_USERS[role], email: form.email }), 400);
  };

  const buttonClass: Record<UserRole, string> = {
    participante: "bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-800 hover:to-red-800",
    instructor: "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800",
    administrador: "bg-gray-800 hover:bg-gray-900",
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80')`
      }}
    >
      {/* Background Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.1) 35px, rgba(255, 255, 255, 0.1) 70px)`
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="text-white space-y-6 hidden lg:block">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={logoECM} 
                alt="ECM Training Center" 
                className="w-24 h-24 object-contain bg-white rounded-2xl p-2 shadow-2xl"
              />
              <div>
                <h1 className="text-4xl font-bold">ECM Training Center</h1>
                <p className="text-xl text-gray-300">Centro de Formación en Seguridad Industrial</p>
              </div>
            </div>

            <div className="space-y-4 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">Sistema SIGRE</h2>
              <p className="text-lg text-gray-200">
                Sistema de Registro para Eventos de Capacitación
              </p>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Formación Certificada</p>
                    <p className="text-sm text-gray-300">Programas avalados internacionalmente</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Instructores Expertos</p>
                    <p className="text-sm text-gray-300">Especialistas con amplia experiencia</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Certificaciones Vigentes</p>
                    <p className="text-sm text-gray-300">Documentos con validez oficial</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400 bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Plataforma segura y confiable</p>
              <p className="mt-1 flex items-center gap-2"><Award className="w-4 h-4" /> Gestión integral de cursos y certificados</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md">
              <CardHeader className="text-center pb-4">
                {/* Mobile Logo */}
                <div className="flex justify-center mb-4 lg:hidden">
                  <img
                    src={logoECM}
                    alt="ECM Training Center"
                    className="w-20 h-20 object-contain bg-white rounded-2xl p-1 shadow-lg"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Accede al sistema SIGRE con tu cuenta
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="participante" className="flex items-center gap-1.5">
                      <User className="w-4 h-4 hidden sm:block" />
                      Participante
                    </TabsTrigger>
                    <TabsTrigger value="instructor" className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 hidden sm:block" />
                      Instructor
                    </TabsTrigger>
                    <TabsTrigger value="administrador" className="flex items-center gap-1.5">
                      <Settings className="w-4 h-4 hidden sm:block" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">
                      {role === "participante" ? "Correo Electrónico" : "Correo Electrónico Institucional"}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder={role === "participante" ? "tu@email.com" : "nombre@ecmtc.com.co"}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "login-email-error" : undefined}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p id="login-email-error" className="text-sm text-red-700">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "login-password-error" : undefined}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="login-password-error" className="text-sm text-red-700">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-gray-700">Recordarme</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => toast.info("Recuperación de contraseña", { description: "Escribe a comercial@ecmtc.com.co para restablecer tu acceso" })}
                      className="text-sm text-orange-700 hover:text-orange-800 font-semibold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full text-white font-semibold py-6 shadow-lg ${buttonClass[role]}`}
                  >
                    Ingresar como {ROLE_LABEL[role]}
                  </Button>

                  {role === "participante" ? (
                    <div className="text-center text-sm text-gray-700">
                      ¿No tienes cuenta?{" "}
                      <button
                        type="button"
                        onClick={() => toast.info("Registro de participantes", { description: "La inscripción la realiza ECM Training Center. Contáctanos por WhatsApp al (+57) 314-8656932" })}
                        className="text-sm text-orange-700 hover:text-orange-800 font-semibold"
                      >
                        Regístrate aquí
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="font-semibold text-blue-900">Acceso para personal autorizado</p>
                      <p className="text-xs mt-1">Si no tienes cuenta, contacta con administración</p>
                    </div>
                  )}
                </form>

                {/* Aviso de prototipo */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-semibold text-amber-900 mb-1">Modo demostración (prototipo)</p>
                  <p className="text-xs text-amber-900">
                    Esta versión no tiene servidor de autenticación: con cualquier correo válido y contraseña
                    entras con un usuario de prueba del rol elegido.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-white/90">
              <p>© {new Date().getFullYear()} ECM Training Center. Todos los derechos reservados.</p>
              <p className="mt-1">Sistema SIGRE v1.1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
