export interface Area {
  id: string
  nome: string
}

export interface Ans {
  id: string
  areaId: string
  nome: string
  vigenciaInicio: string
  vigenciaFim: string
  servico: string
  ofertas: string[]
  racs: Rac[]
}

export interface Rac {
  id: string
  ansId: string
  periodo: string
  conformidade: "conformidade" | "nao_conformidade" | "indicio"
  dataAbertura: string
  dataConclusao: string
  status: "Concluido" | "Em andamento" | "Pendente"
  indicadores: Indicador[]
}

export interface Indicador {
  id: string
  idRco: string
  idIndicador: string
  nome: string
  tipo: string
  direcao: "ascendente" | "descendente" | "bidirecional"
  meta: number
  apurado: number
  resultado: "conformidade" | "nao_conformidade" | "indicio"
  justificativa?: string
  servico: string
  ofertaServico: string
  periodicidade: string
  responsavelApuracao: string
  responsavelPerformance: string
  historico: HistoricoApuracao[]
}

export interface HistoricoApuracao {
  periodo: string
  meta: number
  apurado: number
  resultado: "conformidade" | "nao_conformidade" | "indicio"
}
