/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVICENOW_BASE_URL: string
  readonly VITE_HISTORICO_MESES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
