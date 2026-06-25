import type { ResultadoPeriodo } from "../types/portal"

// O backend agora entrega o `resultado` já consolidado (tri-estado + sem dado),
// tanto no acompanhamento mensal (ans_periodos) quanto em cada ponto das séries
// (apuracoes / apuracao_historico). O frontend só mapeia para rótulo e cor.

export function toResultado(value: unknown): ResultadoPeriodo {
  if (
    value === "conformidade" ||
    value === "indicio" ||
    value === "nao_conformidade"
  ) {
    return value
  }
  return "sem_dado"
}

// Quando um ponto da série não trouxer `resultado` (compatibilidade), deriva do
// campo booleano `conforme`.
export function pontoResultado(p: {
  resultado?: ResultadoPeriodo | null
  conforme?: boolean | null
}): ResultadoPeriodo {
  if (p.resultado) return toResultado(p.resultado)
  if (p.conforme === true) return "conformidade"
  if (p.conforme === false) return "nao_conformidade"
  return "sem_dado"
}

export const resultadoLabels: Record<ResultadoPeriodo, string> = {
  conformidade: "Conformidade",
  indicio: "Indicio",
  nao_conformidade: "Nao Conformidade",
  sem_dado: "Sem dado",
}

// Classes do badge (reaproveitam os tokens definidos em index.css).
export const resultadoBadgeClasses: Record<ResultadoPeriodo, string> = {
  conformidade: "bg-success text-white",
  indicio: "bg-warning text-text-black",
  nao_conformidade: "bg-danger text-white",
  sem_dado: "bg-gray-300 text-gray-700",
}

// Cor da barra do gráfico por resultado.
export const resultadoBarColor: Record<ResultadoPeriodo, string> = {
  conformidade: "#4ADE80",
  indicio: "#FACC15",
  nao_conformidade: "#F87171",
  sem_dado: "#D1D5DB",
}
