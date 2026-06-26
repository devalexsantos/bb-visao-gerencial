import type { ResultadoRco } from "../types/portal"

// Na v2 o `resultado` vem pronto do backend, em dois formatos:
//  - RCO: token de máquina ("conformidade" | "indicio" | "nao_conformidade")
//  - RAC: texto de display ("Conformidade" | "Não Conformidade" | "Indício")
// Esta função normaliza ambos para o status canônico usado nas cores/rótulos.
export type ResultadoStatus =
  | "conformidade"
  | "indicio"
  | "nao_conformidade"
  | "sem_dado"

export function normalizeResultado(value: unknown): ResultadoStatus {
  if (typeof value !== "string") return "sem_dado"
  const v = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
  if (!v) return "sem_dado"
  if (v.includes("nao") && v.includes("conform")) return "nao_conformidade"
  if (v.includes("indic")) return "indicio"
  if (v.includes("conform")) return "conformidade"
  return "sem_dado"
}

// Ponto do gráfico de histórico: o resultado já vem por ponto na v2.
export function pontoResultado(p: {
  resultado?: ResultadoRco | null
}): ResultadoStatus {
  return normalizeResultado(p.resultado)
}

export const resultadoLabels: Record<ResultadoStatus, string> = {
  conformidade: "Conformidade",
  indicio: "Indicio",
  nao_conformidade: "Nao Conformidade",
  sem_dado: "Sem dado",
}

// Classes do badge (reaproveitam os tokens definidos em index.css).
export const resultadoBadgeClasses: Record<ResultadoStatus, string> = {
  conformidade: "bg-success text-white",
  indicio: "bg-warning text-text-black",
  nao_conformidade: "bg-danger text-white",
  sem_dado: "bg-gray-300 text-gray-700",
}

// Cor da barra do gráfico por resultado.
export const resultadoBarColor: Record<ResultadoStatus, string> = {
  conformidade: "#4ADE80",
  indicio: "#FACC15",
  nao_conformidade: "#F87171",
  sem_dado: "#D1D5DB",
}
