import type { Area, Ans, HistoricoApuracao, Indicador, Rac } from "../types/ans"

export const areas: Area[] = [
  { id: "diris", nome: "Diris" },
  { id: "ditec", nome: "Ditec" },
  { id: "diope", nome: "Diope" },
]

function gerarHistorico(
  direcao: "ascendente" | "descendente" | "bidirecional",
  meta: number,
): HistoricoApuracao[] {
  const meses = [
    "Jan/2025", "Fev/2025", "Mar/2025", "Abr/2025", "Mai/2025",
    "Jun/2025", "Jul/2025", "Ago/2025", "Set/2025", "Out/2025",
  ]
  return meses.map((periodo) => {
    const variacao = (Math.random() - 0.4) * meta * 0.3
    const apurado = Number.parseFloat((meta + variacao).toFixed(2))
    let resultado: HistoricoApuracao["resultado"]
    if (direcao === "ascendente") {
      resultado = apurado >= meta ? "conformidade" : "nao_conformidade"
    } else if (direcao === "descendente") {
      resultado = apurado <= meta ? "conformidade" : "nao_conformidade"
    } else {
      const diff = Math.abs(apurado - meta)
      resultado = diff <= meta * 0.1 ? "conformidade" : "nao_conformidade"
    }
    return { periodo, meta, apurado, resultado }
  })
}

const servicosMap: Record<string, { servico: string; oferta: string }> = {
  "IND-101": { servico: "Monitoramento de Disponibilidade", oferta: "Disponibilidade 24x7" },
  "IND-102": { servico: "Gestao de Incidentes", oferta: "Suporte Nivel 2" },
  "IND-201": { servico: "Gestao de Incidentes", oferta: "Tratamento de Incidentes Criticos" },
  "IND-202": { servico: "Central de Servicos", oferta: "Atendimento ao Usuario" },
  "IND-301": { servico: "Performance de Aplicacoes", oferta: "APM e Observabilidade" },
  "IND-302": { servico: "Performance de Aplicacoes", oferta: "Gestao de Capacidade" },
}

const responsaveisMap: Record<string, { apuracao: string; performance: string }> = {
  "IND-101": { apuracao: "20580", performance: "31245" },
  "IND-102": { apuracao: "20580", performance: "31245" },
  "IND-201": { apuracao: "18742", performance: "25610" },
  "IND-202": { apuracao: "18742", performance: "25610" },
  "IND-301": { apuracao: "22390", performance: "28155" },
  "IND-302": { apuracao: "22390", performance: "28155" },
}

function gerarIndicadores(periodo: string): Indicador[] {
  const defs = [
    { idRco: "RCO-001", idIndicador: "IND-101", nome: "Disponibilidade de Sistemas Criticos", tipo: "Disponibilidade", direcao: "ascendente" as const, meta: 99.5 },
    { idRco: "RCO-001", idIndicador: "IND-102", nome: "Tempo Medio de Recuperacao (MTTR)", tipo: "Tempo", direcao: "descendente" as const, meta: 30 },
    { idRco: "RCO-002", idIndicador: "IND-201", nome: "Taxa de Incidentes Criticos", tipo: "Incidentes", direcao: "descendente" as const, meta: 5 },
    { idRco: "RCO-002", idIndicador: "IND-202", nome: "Indice de Satisfacao do Usuario", tipo: "Qualidade", direcao: "ascendente" as const, meta: 85 },
    { idRco: "RCO-003", idIndicador: "IND-301", nome: "Tempo de Resposta de Transacoes", tipo: "Performance", direcao: "descendente" as const, meta: 2.5 },
    { idRco: "RCO-003", idIndicador: "IND-302", nome: "Variacao de Performance", tipo: "Performance", direcao: "bidirecional" as const, meta: 10 },
  ]
  return defs.map((d, i) => {
    const variacao = (Math.random() - 0.4) * d.meta * 0.2
    const apurado = Number.parseFloat((d.meta + variacao).toFixed(2))
    let resultado: Indicador["resultado"]
    if (d.direcao === "ascendente") {
      resultado = apurado >= d.meta ? "conformidade" : apurado >= d.meta * 0.95 ? "indicio" : "nao_conformidade"
    } else if (d.direcao === "descendente") {
      resultado = apurado <= d.meta ? "conformidade" : apurado <= d.meta * 1.05 ? "indicio" : "nao_conformidade"
    } else {
      const diff = Math.abs(apurado - d.meta)
      resultado = diff <= d.meta * 0.05 ? "conformidade" : diff <= d.meta * 0.1 ? "indicio" : "nao_conformidade"
    }
    const justificativa = resultado === "nao_conformidade"
      ? `Desvio identificado no periodo ${periodo}. Plano de acao em andamento para correcao dos indicadores afetados.`
      : resultado === "indicio"
        ? `Indicador proximo ao limite da meta. Monitoramento intensificado.`
        : undefined
    const svc = servicosMap[d.idIndicador] ?? { servico: "N/A", oferta: "N/A" }
    const resp = responsaveisMap[d.idIndicador] ?? { apuracao: "00000", performance: "00000" }
    return {
      id: `ind-${periodo}-${i}`,
      idRco: d.idRco,
      idIndicador: d.idIndicador,
      nome: d.nome,
      tipo: d.tipo,
      direcao: d.direcao,
      meta: d.meta,
      apurado,
      resultado,
      justificativa,
      servico: svc.servico,
      ofertaServico: svc.oferta,
      periodicidade: "Mensal",
      responsavelApuracao: resp.apuracao,
      responsavelPerformance: resp.performance,
      historico: gerarHistorico(d.direcao, d.meta),
    }
  })
}

function gerarRacs(ansId: string): Rac[] {
  const meses = [
    { periodo: "Jan/2025", mes: "01", abr: "jan25" },
    { periodo: "Fev/2025", mes: "02", abr: "fev25" },
    { periodo: "Mar/2025", mes: "03", abr: "mar25" },
    { periodo: "Abr/2025", mes: "04", abr: "abr25" },
    { periodo: "Mai/2025", mes: "05", abr: "mai25" },
    { periodo: "Jun/2025", mes: "06", abr: "jun25" },
    { periodo: "Jul/2025", mes: "07", abr: "jul25" },
    { periodo: "Ago/2025", mes: "08", abr: "ago25" },
    { periodo: "Set/2025", mes: "09", abr: "set25" },
    { periodo: "Out/2025", mes: "10", abr: "out25" },
    { periodo: "Nov/2025", mes: "11", abr: "nov25" },
    { periodo: "Dez/2025", mes: "12", abr: "dez25" },
  ]
  return meses.map((m, idx) => {
    const indicadores = gerarIndicadores(m.periodo)
    const temNaoConformidade = indicadores.some((i) => i.resultado === "nao_conformidade")
    const temIndicio = indicadores.some((i) => i.resultado === "indicio")
    const conformidade: Rac["conformidade"] = temNaoConformidade
      ? "nao_conformidade"
      : temIndicio
        ? "indicio"
        : "conformidade"
    const isConcluido = idx < 10
    const isEmAndamento = idx === 10
    return {
      id: `RAC-${ansId}-${m.abr}`,
      ansId,
      periodo: m.periodo,
      conformidade,
      dataAbertura: `01/${m.mes}/2025`,
      dataConclusao: isConcluido ? `28/${m.mes}/2025` : "",
      status: isConcluido ? "Concluido" as const : isEmAndamento ? "Em andamento" as const : "Pendente" as const,
      indicadores,
    }
  })
}

export const ansList: Ans[] = [
  // Diris
  {
    id: "ans-diris-001",
    areaId: "diris",
    nome: "ANS Canais Digitais",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Disponibilidade dos Canais Digitais",
    ofertas: ["App BB", "Internet Banking", "Portal BB"],
    racs: gerarRacs("ans-diris-001"),
  },
  {
    id: "ans-diris-002",
    areaId: "diris",
    nome: "ANS Atendimento Agencias",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Sistemas de Atendimento em Agencias",
    ofertas: ["Terminal de Autoatendimento", "Guiche Digital", "Gestao de Filas"],
    racs: gerarRacs("ans-diris-002"),
  },
  {
    id: "ans-diris-003",
    areaId: "diris",
    nome: "ANS Open Finance",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Plataforma Open Finance",
    ofertas: ["APIs Open Banking", "Consentimento", "Compartilhamento de Dados"],
    racs: gerarRacs("ans-diris-003"),
  },
  // Ditec
  {
    id: "ans-ditec-001",
    areaId: "ditec",
    nome: "ANS Infraestrutura Core",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Infraestrutura de Tecnologia Core Banking",
    ofertas: ["Mainframe", "Middleware", "Barramento de Servicos"],
    racs: gerarRacs("ans-ditec-001"),
  },
  {
    id: "ans-ditec-002",
    areaId: "ditec",
    nome: "ANS Cloud e Containers",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Plataforma Cloud e Orquestracao",
    ofertas: ["Kubernetes", "Cloud Privada", "CI/CD Pipelines"],
    racs: gerarRacs("ans-ditec-002"),
  },
  {
    id: "ans-ditec-003",
    areaId: "ditec",
    nome: "ANS Banco de Dados",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Administracao de Banco de Dados",
    ofertas: ["Oracle", "PostgreSQL", "MongoDB"],
    racs: gerarRacs("ans-ditec-003"),
  },
  // Diope
  {
    id: "ans-diope-001",
    areaId: "diope",
    nome: "ANS Processamento Batch",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Processamento de Rotinas Batch",
    ofertas: ["Fechamento Contabil", "Conciliacao", "Geracao de Relatorios"],
    racs: gerarRacs("ans-diope-001"),
  },
  {
    id: "ans-diope-002",
    areaId: "diope",
    nome: "ANS Compensacao e Liquidacao",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Sistemas de Compensacao e Liquidacao",
    ofertas: ["SPB", "STR", "CIP"],
    racs: gerarRacs("ans-diope-002"),
  },
  {
    id: "ans-diope-003",
    areaId: "diope",
    nome: "ANS Pix e Pagamentos",
    vigenciaInicio: "01/01/2025",
    vigenciaFim: "31/12/2025",
    servico: "Infraestrutura Pix e Meios de Pagamento",
    ofertas: ["Pix Instantaneo", "TED/DOC", "Boletos"],
    racs: gerarRacs("ans-diope-003"),
  },
]
