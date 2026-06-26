// Tipos da API v2 do Portal de Disponibilidade (Scripted REST do ServiceNow).
// Modelo: ANS → RAC (mês) → RCO (indicador/mês). Espelham break-change-visao-cliente.md.

// ---------- Erro ----------
export interface ApiError {
  error: string
  detail?: string
}

// ---------- Resultado (token de máquina ou "sem dado") ----------
export type ResultadoRco =
  | "conformidade"
  | "indicio"
  | "nao_conformidade"
  | "sem_dado"
  | string

// ---------- Ação: ans_area (cards) ----------
export interface Ans {
  numero_ans: string
  apelido: string
  objetivo?: string
  servico: string
  ofertas: string[]
  oferta_fixo?: string
  nome_uor: string
  cd_uor?: string
  status?: string
  state?: string
  active?: string
  opened_at?: string
  closed_at?: string
  // % de conformidade já calculado pelo backend (a partir dos RCOs do ANS).
  conformidade: number | null
  conformidade_conformes: number
  conformidade_total: number
  sys_id: string
  url?: string
}

export interface AnsAreaResponse {
  count: number
  area_filtro: string
  result: Ans[]
}

// ---------- Ação: ans_racs (acompanhamento mensal do ANS) ----------
export interface AnsPanel {
  numero_ans: string
  apelido: string
  servico: string
  ofertas: string[]
  nome_uor: string
  opened_at?: string
  closed_at?: string
  sys_id: string
}

export interface RacRow {
  number: string // RAC...
  periodo: string // "2026/05"
  periodo_date: string // "2026-05-01"
  periodo_label: string // "Mai/2026"
  resultado: string // texto do RAC (mapear cor no front)
  resultado_code: string // código bruto
  data_de_abertura?: string
  data_de_conclusao?: string
  status?: string
  state?: string
  total_indicadores: number
  fora_da_meta: number
  sys_id: string
}

export interface AnsRacsResponse {
  count: number
  ans_filtro: string
  ans_number: string
  ans: AnsPanel
  result: RacRow[]
  aviso?: string
}

// ---------- Ação: rac_rcos (indicadores/RCOs de um mês) ----------
export interface RcoIndicadorRow {
  rco_id: string // RCO...
  rco_number: string // TASK...
  indicador_sys_id: string
  indicador_number: string | null
  nome_indicador: string | null
  tipo: string | null
  direcao: string | null
  meta: number | null
  unidade_de_medida: string | null
  periodicidade: string | null
  apurado: number | null
  resultado: ResultadoRco
  motivo: string
  situacao?: string
  periodo: string
  periodo_label: string
  sys_id: string // sys_id do RCO (usar p/ rco_historico)
}

export interface RacRcosResponse {
  count: number
  rac_filtro: string
  rac_number: string
  periodo: string
  periodo_label: string
  resultado: string // consolidado do mês (texto, do RAC)
  total_indicadores: number
  fora_da_meta: number
  result: RcoIndicadorRow[]
  aviso?: string
}

// ---------- Ação: rco_historico (detalhe do indicador + RCO + histórico) ----------
export interface IndicadorHeader {
  sys_id: string
  number: string
  nome_indicador: string
  tipo: string
  servico: string
  oferta_de_servico: string
  meta: string
  direcao: string
  periodicidade: string
  unidade_de_medida: string
}

export interface RcoDetalhe {
  id: string
  number?: string
  apurado: number | null
  resultado: ResultadoRco
  periodo?: string
  periodo_label: string
  motivo: string
  acoes_preventivas: string
  parecer_do_aprovador: string
  data_de_resposta?: string
  situacao?: string
  reiteracoes?: string
  sys_id: string
}

export interface HistoricoPonto {
  rco_id: string
  periodo?: string
  periodo_date?: string
  periodo_label: string
  apurado: number | null
  meta: number | null
  resultado: ResultadoRco
  selecionada: boolean
  sys_id?: string
}

export interface RcoHistoricoResponse {
  count: number
  rco_base: string
  periodo_base: string
  meses: number
  indicador: IndicadorHeader
  rco: RcoDetalhe
  result: HistoricoPonto[]
}
