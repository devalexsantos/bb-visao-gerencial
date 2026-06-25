import type {
  AnsAreaResponse,
  AnsServicoResponse,
  ApiError,
  ApuracaoHistoricoResponse,
  ApuracoesResponse,
  IndicadoresAnsResponse,
} from "../types/portal"

const BASE_URL = import.meta.env.VITE_SERVICENOW_BASE_URL

if (!BASE_URL) {
  // Falha cedo e de forma clara se a variável de ambiente não estiver configurada.
  throw new Error(
    "VITE_SERVICENOW_BASE_URL não definida. Copie .env.example para .env e configure a URL base do ServiceNow.",
  )
}

type Params = Record<string, string | number | undefined>

async function callPortalApi<T>(params: Params): Promise<T> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.append(k, String(v))
  }

  const res = await fetch(`${BASE_URL}?${qs.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include", // usa a sessão autenticada do ServiceNow
  })

  if (!res.ok) {
    const err: ApiError = await res
      .json()
      .catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const portalApi = {
  ansPorArea: (area: string) =>
    callPortalApi<AnsAreaResponse>({ acao: "ans_area", area }),

  ansPorServico: (servico?: string) =>
    callPortalApi<AnsServicoResponse>({ acao: "ans_servico", servico }),

  indicadoresDoAns: (ans: string) =>
    callPortalApi<IndicadoresAnsResponse>({ acao: "indicadores_ans", ans }),

  apuracoes: (indicador: string) =>
    callPortalApi<ApuracoesResponse>({ acao: "apuracoes", indicador }),

  historicoApuracao: (apuracao: string, meses = 6) =>
    callPortalApi<ApuracaoHistoricoResponse>({
      acao: "apuracao_historico",
      apuracao,
      meses,
    }),
}
