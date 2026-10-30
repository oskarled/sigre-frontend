import { useCallback, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { EventManagement } from "./components/EventManagement";
import { CertificateManagementNew } from "./components/CertificateManagementNew";
import { ParticipantManagement } from "./components/ParticipantManagement";
import { InstructorManagement } from "./components/InstructorManagement";
import { ReportsManagement } from "./components/ReportsManagement";
import { AllNewsView } from "./components/AllNewsView";
import { HomeView } from "./components/HomeView";
import { LoginScreen } from "./components/LoginScreen";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { canAccess, type NavId, type SessionUser } from "./lib/roles";
import type { CursoEvento, CursoEventoRequest, Inscripcion } from "./models/curso";
import { cursosService } from "./services/cursosService";
import { usaBackend } from "./services/http";

/**
 * Componente raíz de SIGRE.
 * - Guarda la sesión del usuario y la pestaña activa del menú.
 * - Mantiene el estado compartido (cursos e inscripciones) para que todas las vistas muestren los mismos datos.
 * - Es el único componente que crea cursos, inscribe y cancela inscripciones a través de cursosService.
 */
export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<NavId>("inicio");
  const [showAllNews, setShowAllNews] = useState(false);

  // Estado compartido: así un curso creado o una inscripción se ven en todas las pantallas.
  const [cursos, setCursos] = useState<CursoEvento[]>([]);
  const [misInscripciones, setMisInscripciones] = useState<Inscripcion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  // Consulta los cursos (y, si es participante, sus inscripciones) a la API o a los datos de demostración.
  const cargarDatos = useCallback(async (sesion: SessionUser) => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const [listaCursos, inscripciones] = await Promise.all([
        cursosService.listarCursos(),
        sesion.role === "participante" ? cursosService.inscripcionesDeUsuario(sesion.idUsuario) : Promise.resolve([]),
      ]);
      setCursos(listaCursos);
      setMisInscripciones(inscripciones);
    } catch (e) {
      setErrorCarga(e instanceof Error ? e.message : "No se pudieron cargar los datos");
    } finally {
      setCargando(false);
    }
  }, []);

  // Cada vez que cambia el usuario en sesión se vuelven a cargar los datos.
  useEffect(() => {
    if (user) cargarDatos(user);
  }, [user, cargarDatos]);

  // Inicio de sesión: guarda el usuario y lo lleva a Inicio.
  const handleLogin = (sessionUser: SessionUser) => {
    setUser(sessionUser);
    setActiveNavItem("inicio");
  };

  // Cierre de sesión: limpia todo el estado para que el siguiente usuario no vea datos del anterior.
  const handleLogout = () => {
    setUser(null);
    setActiveNavItem("inicio");
    setShowAllNews(false);
    setCursos([]);
    setMisInscripciones([]);
  };

  // Cambio de opción en el menú.
  const handleNavigate = (id: NavId) => {
    setShowAllNews(false);
    setActiveNavItem(id);
  };

  // Crea un curso (administrador). Devuelve true si se guardó para que el formulario se cierre.
  const handleCrearCurso = async (datos: CursoEventoRequest): Promise<boolean> => {
    try {
      const creado = await cursosService.crearCurso(datos);
      setCursos((prev) => [...prev, creado]);
      toast.success("Curso creado", { description: `${creado.nombreCurso} quedó programado` });
      return true;
    } catch (e) {
      toast.error("No se pudo crear el curso", { description: e instanceof Error ? e.message : undefined });
      return false;
    }
  };

  // Inscribe al participante en sesión. El servidor valida el aforo y responde con error si no hay cupos.
  const handleInscribirse = async (idCurso: number) => {
    if (!user) return;
    try {
      const inscripcion = await cursosService.inscribir(idCurso, user.idUsuario);
      toast.success("Inscripción registrada", {
        description: `Quedaste inscrito en ${inscripcion.nombreCurso}. Estado: pendiente de pago.`,
      });
    } catch (e) {
      toast.error("No fue posible inscribirse", { description: e instanceof Error ? e.message : undefined });
    }
    await cargarDatos(user); // refresca cupos e inscripciones con lo que diga el servidor
  };

  // Cancela una inscripción del participante y libera el cupo.
  const handleCancelarInscripcion = async (idInscripcion: number) => {
    if (!user) return;
    try {
      await cursosService.cancelarInscripcion(idInscripcion);
      toast.success("Inscripción cancelada", { description: "Se liberó tu cupo" });
    } catch (e) {
      toast.error("No fue posible cancelar", { description: e instanceof Error ? e.message : undefined });
    }
    await cargarDatos(user);
  };

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  // Si por algún motivo la pestaña activa no corresponde al rol, se vuelve a Inicio.
  const current: NavId = canAccess(user.role, activeNavItem) ? activeNavItem : "inicio";

  // Elige qué vista mostrar según la opción del menú.
  const renderContent = () => {
    if (showAllNews) {
      return <AllNewsView onBack={() => setShowAllNews(false)} />;
    }

    switch (current) {
      case "eventos":
        return (
          <EventManagement
            user={user}
            cursos={cursos}
            misInscripciones={misInscripciones}
            onCrearCurso={handleCrearCurso}
            onInscribirse={handleInscribirse}
            onCancelarInscripcion={handleCancelarInscripcion}
          />
        );
      case "participantes":
        return <ParticipantManagement user={user} cursos={cursos} />;
      case "instructores":
        return <InstructorManagement />;
      case "certificados":
        return <CertificateManagementNew user={user} />;
      case "reportes":
        return <ReportsManagement />;
      case "inicio":
      default:
        return (
          <HomeView
            user={user}
            cursos={cursos}
            misInscripciones={misInscripciones}
            onNavigate={handleNavigate}
            onViewAllNews={() => setShowAllNews(true)}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1745448797900-35d08e85e9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc2FmZXR5JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTk4NzQ5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
      }}
    >
      <div className="relative z-10">
        <Header onLogout={handleLogout} user={user} />
        <Navigation role={user.role} activeItem={current} onItemClick={handleNavigate} />
        <main className="bg-white/95 backdrop-blur-sm min-h-[calc(100vh-120px)] shadow-lg">
          {!usaBackend && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-900">
              Modo demostración: los datos son de prueba y se reinician al recargar la página.
            </div>
          )}
          {errorCarga && (
            <div role="alert" className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-sm text-red-800">
              {errorCarga}{" "}
              <button className="font-semibold underline" onClick={() => cargarDatos(user)}>
                Reintentar
              </button>
            </div>
          )}
          {cargando && cursos.length === 0 ? (
            <p className="p-10 text-center text-gray-700">Cargando información…</p>
          ) : (
            renderContent()
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
