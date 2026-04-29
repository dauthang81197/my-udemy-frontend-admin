/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_SERVICE_PREFIX: string;
  readonly VITE_COURSE_SERVICE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
