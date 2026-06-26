import type {
  AnsAreaResponse,
  AnsRacsResponse,
  ApiError,
  RacRcosResponse,
  RcoHistoricoResponse,
} from "../types/portal";

const BASE_URL = import.meta.env.VITE_SERVICENOW_BASE_URL;

if (!BASE_URL) {
  // Falha cedo e de forma clara se a variável de ambiente não estiver configurada.
  throw new Error(
    "VITE_SERVICENOW_BASE_URL não definida. Copie .env.example para .env e configure a URL base do ServiceNow.",
  );
}

type Params = Record<string, string | number | undefined>;

// O ServiceNow Scripted REST pode encapsular a resposta do script em
// `{ "result": <payload> }`. Quando isso acontece, `body.result` é o ENVELOPE
// (objeto com count/result/indicador) e não o array de dados — então desembrulhamos
// um nível. Se a resposta já vier "crua" (`body.result` é o array de dados), nada muda.
function unwrapServiceNow<T>(body: unknown): T {
  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    "result" in body
  ) {
    const inner = (body as { result: unknown }).result;
    if (
      inner &&
      typeof inner === "object" &&
      !Array.isArray(inner) &&
      ("count" in inner || "result" in inner || "indicador" in inner)
    ) {
      return inner as T;
    }
  }
  return body as T;
}

async function callPortalApi<T>(params: Params): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.append(k, String(v));
  }

  const res = await fetch(`${BASE_URL}?${qs.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const err: ApiError = await res
      .json()
      .catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  const body = await res.json();
  return unwrapServiceNow<T>(body);
}

export const portalApi = {
  ansPorArea: (area: string) =>
    callPortalApi<AnsAreaResponse>({ acao: "ans_area", area }),

  racsDoAns: (ans: string) =>
    callPortalApi<AnsRacsResponse>({ acao: "ans_racs", ans }),

  rcosDoRac: (rac: string) =>
    callPortalApi<RacRcosResponse>({ acao: "rac_rcos", rac }),

  historicoDoRco: (rco: string, meses = 6) =>
    callPortalApi<RcoHistoricoResponse>({ acao: "rco_historico", rco, meses }),
};
