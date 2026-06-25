// Tipos da API do Portal de Disponibilidade (Scripted REST do ServiceNow).
// Espelham a seção 6 da doc-endpoint-ans.md.

// ---------- Envelope genérico ----------
export interface ApiEnvelope<T> {
  count: number
  result: T[]
}

// ---------- Erro ----------
export interface ApiError {
  error: string
  detail?: string
}

// ---------- Ação: ans_area / ans_servico ----------
export interface Ans {
  number: string
  numero_ans: string
  apelido: string
  objetivo?: string
  servico: string
  ofertas: string[]
  oferta_fixo: string
  indicadores: string // sys_ids vinculados (lista separada por vírgula)
  nome_uor: string
  cd_uor?: string
  status: string
  state: string
  active: string // "true" | "false" | "0" | "1"
  opened_at?: string
  closed_at?: string
  // % de conformidade já calculado pelo backend (ans_area).
  conformidade?: number | null
  conformidade_conformes?: number
  conformidade_total?: number
  sys_id: string
  url: string
}

export interface AnsAreaResponse extends ApiEnvelope<Ans> {
  area_filtro: string
}

export interface AnsServicoResponse extends ApiEnvelope<Ans> {
  servico_filtro: string | null
  ofertas: string[] // união consolidada das ofertas
}

// ---------- Ação: indicadores_ans ----------
export interface IndicadorDoAns {
  number: string
  nome_indicador: string
  complemento_do_nome: string
  tipo: string
  natureza: string
  direcao: string
  unidade_de_medida: string
  periodicidade: string
  nivel_ofertado: string // = Meta
  metodologia_calculo: string
  servico: string
  oferta_de_servico: string
  status: string
  sys_id: string
  url: string
}

export interface IndicadoresAnsResponse extends ApiEnvelope<IndicadorDoAns> {
  ans_filtro: string
  ans_number: string
  vinculo_indicadores?: string
  aviso?: string // presente quando count = 0 por falta de vínculo
}

// ---------- Cabeçalho do indicador (apuracoes / apuracao_historico) ----------
export interface IndicadorHeader {
  sys_id: string
  number: string
  nome_indicador: string
  tipo: string
  servico: string
  oferta_de_servico: string
  meta: string // string (vem de nivel_ofertado)
  direcao: string
  periodicidade: string
  unidade_de_medida: string
}

// ---------- Resultado consolidado (tri-estado + sem dado) ----------
export type ResultadoPeriodo =
  | "conformidade"
  | "indicio"
  | "nao_conformidade"
  | "sem_dado"

// ---------- Ponto da série (gráfico) ----------
export interface ApuracaoPonto {
  number: string // RAP...
  periodo: string // "2025-01-01"
  periodo_label: string // "Jan/2025"
  periodo_mascara: string // "Janeiro"
  ano: string
  apurado: number | null
  meta: number | null
  conforme: boolean | null
  resultado?: ResultadoPeriodo // tri-estado já calculado pelo backend
  unidade_de_medida: string
  justificativa: string
  versao: string
  selecionada?: boolean // só em apuracao_historico
  sys_id: string
}

// ---------- Ação: ans_periodos (acompanhamento mensal do ANS) ----------
export interface AnsHeader {
  numero_ans: string
  apelido: string
  servico: string
  ofertas: string[]
  nome_uor: string
  opened_at?: string
  closed_at?: string
  sys_id: string
}

export interface PeriodoResultado {
  periodo: string // "2025-01-01"
  periodo_label: string // "Jan/2025"
  periodo_mascara: string // "Janeiro"
  ano: string
  resultado: ResultadoPeriodo
  total_indicadores: number
  conformidade: number
  indicio: number
  nao_conformidade: number
}

export interface AnsPeriodosResponse {
  count: number
  ans_filtro: string
  ans_number: string
  ans: AnsHeader
  result: PeriodoResultado[]
  aviso?: string // presente quando o ANS não tem indicadores vinculados
}

// ---------- Ação: indicadores_periodo (indicadores de um ANS num mês) ----------
export interface IndicadorDoPeriodo {
  sys_id: string
  number: string
  nome_indicador: string
  tipo: string
  direcao: string // "ascendente" | "descendente" | "bidirecional"
  unidade_de_medida: string
  meta: number | null
  apurado: number | null
  resultado: ResultadoPeriodo
  justificativa: string
  apuracao_sys_id: string | null
  apuracao_number: string | null
}

export interface IndicadoresPeriodoResponse {
  count: number
  ans_filtro: string
  ans_number: string
  periodo: string // "2025-01-01"
  periodo_label: string // "Jan/2025"
  ano: string
  resultado: ResultadoPeriodo // consolidado do mês
  total_indicadores: number
  result: IndicadorDoPeriodo[]
  aviso?: string
}

// ---------- Ação: apuracoes ----------
export interface ApuracoesResponse extends ApiEnvelope<ApuracaoPonto> {
  indicador_filtro: string
  indicador: IndicadorHeader
}

// ---------- Ação: apuracao_historico ----------
export interface ApuracaoHistoricoResponse extends ApiEnvelope<ApuracaoPonto> {
  apuracao_base: string
  periodo_base: string
  meses: number
  indicador: IndicadorHeader
}
