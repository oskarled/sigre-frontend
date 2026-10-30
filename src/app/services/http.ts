// Cliente HTTP mínimo para la API de SIGRE (Spring Boot).
// La URL base sale de la variable de entorno VITE_API_URL (archivo .env.local).

export const API_URL: string = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** true cuando hay backend configurado; si no, la app usa los datos de demostración. */
export const usaBackend = API_URL !== "";

/** Error de la API con el mensaje que envía el backend (formato ProblemDetail de Spring). */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...init,
      headers: { "Content-Type": "application/json", Accept: "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor de SIGRE. ¿Está encendido el backend?", 0);
  }

  if (!respuesta.ok) {
    let mensaje = `Error ${respuesta.status}`;
    try {
      const problema = await respuesta.json();
      // ProblemDetail: { title, detail, status, errores? }
      mensaje = problema.detail ?? problema.title ?? mensaje;
      if (problema.errores && typeof problema.errores === "object") {
        mensaje += ": " + Object.values(problema.errores).join(", ");
      }
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    throw new ApiError(mensaje, respuesta.status);
  }

  if (respuesta.status === 204) return undefined as T;
  return (await respuesta.json()) as T;
}
