/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del backend Spring Boot (sigre-modulo-cursos). Vacío = modo demostración. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "figma:asset/*" {
  const src: string;
  export default src;
}
declare module "@radix-ui/react-*";
