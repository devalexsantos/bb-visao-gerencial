/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVICENOW_BASE_URL: string
  readonly VITE_HISTORICO_MESES?: string
  readonly VITE_API_URL: string
  readonly VITE_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
