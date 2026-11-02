import { afterEach, describe, expect, it, vi } from "vitest";
import { aSesion, CONTRASENA_DEMO, correoDemo, iniciarSesion, MENSAJE_CREDENCIALES } from "../services/authService";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("autenticación en modo demostración", () => {
  it("entra con un usuario de prueba y toma el rol del sistema", async () => {
    const usuario = await iniciarSesion("ELKIN.CAICEDO@ecm.com", CONTRASENA_DEMO);
    expect(usuario).toMatchObject({ role: "administrador", idUsuario: 1, nombre: "Elkin Caicedo" });
  });

  it("rechaza una contraseña incorrecta", async () => {
    await expect(iniciarSesion("maria.perez@correo.com", "otra-clave")).rejects.toMatchObject({
      message: MENSAJE_CREDENCIALES,
      status: 401,
    });
  });

  it("rechaza un correo que no existe aunque tenga formato válido", async () => {
    await expect(iniciarSesion("cualquiera@correo.com", CONTRASENA_DEMO)).rejects.toMatchObject({ status: 401 });
  });

  it("autocompleta el correo de prueba de cada rol", () => {
    expect(correoDemo("instructor")).toBe("carlos.ortega@ecm.com");
  });

  it("convierte la respuesta del backend en la sesión con el id de instructor", () => {
    const sesion = aSesion({ mensaje: "Autenticacion satisfactoria", idUsuario: 2, nombre: "Carlos Ortega", correo: "carlos.ortega@ecm.com", rol: "INSTRUCTOR", idInstructor: 1 });
    expect(sesion).toEqual({ role: "instructor", idUsuario: 2, idInstructor: 1, nombre: "Carlos Ortega", email: "carlos.ortega@ecm.com" });
  });
});

describe("autenticación con backend", () => {
  it("envía las credenciales a POST /api/auth/login", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ mensaje: "Autenticacion satisfactoria", idUsuario: 3, nombre: "Maria Perez", correo: "maria.perez@correo.com", rol: "ASISTENTE", idInstructor: null }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { iniciarSesion: login } = await import("../services/authService");
    const usuario = await login("maria.perez@correo.com", "Sigre2026");
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/auth/login", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ correo: "maria.perez@correo.com", contrasena: "Sigre2026" });
    expect(usuario.role).toBe("participante");
  });

  it("muestra un mensaje claro cuando el backend responde 401", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 401, detail: "Credenciales invalidas" }), { status: 401 })));
    const { iniciarSesion: login } = await import("../services/authService");
    await expect(login("maria.perez@correo.com", "mala")).rejects.toMatchObject({ message: MENSAJE_CREDENCIALES, status: 401 });
  });
});
