import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch, ApiError } from "../services/http";

afterEach(() => vi.unstubAllGlobals());

describe("cliente HTTP", () => {
  it("convierte un ProblemDetail del backend en un error legible", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 409, detail: "El curso no tiene cupos disponibles" }), { status: 409 }),
      ),
    );
    await expect(apiFetch("/api/cursos/1/inscripciones")).rejects.toMatchObject({
      message: "El curso no tiene cupos disponibles",
      status: 409,
    });
  });

  it("incluye los errores de validación por campo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ detail: "Los datos enviados no son validos", errores: { lugar: "El lugar es obligatorio" } }),
          { status: 400 },
        ),
      ),
    );
    await expect(apiFetch("/api/cursos")).rejects.toThrow("El lugar es obligatorio");
  });

  it("avisa cuando el backend no responde", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const error = (await apiFetch("/api/cursos").catch((e) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toMatch(/backend/);
  });
});
