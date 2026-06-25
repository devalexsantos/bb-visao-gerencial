// Mapeia o campo tri-estado `conforme` (true | false | null) da API para o status
// visual do portal. A faixa "indício" (amarela) é regra de negócio que a API ainda
// não calcula, então só temos 3 estados: conformidade, não conformidade e sem dado.

export type StatusConforme = "conformidade" | "nao_conformidade" | "sem_dado"

export function conformeToStatus(conforme: boolean | null | undefined): StatusConforme {
  if (conforme === true) return "conformidade"
  if (conforme === false) return "nao_conformidade"
  return "sem_dado"
}

export const statusLabels: Record<StatusConforme, string> = {
  conformidade: "Conformidade",
  nao_conformidade: "Nao Conformidade",
  sem_dado: "Sem dado",
}

// Classes do badge (reaproveitam os tokens definidos em index.css).
export const statusBadgeClasses: Record<StatusConforme, string> = {
  conformidade: "bg-success text-white",
  nao_conformidade: "bg-danger text-white",
  sem_dado: "bg-gray-300 text-gray-700",
}

// Cor da barra do gráfico por conformidade.
export const statusBarColor: Record<StatusConforme, string> = {
  conformidade: "#4ADE80",
  nao_conformidade: "#F87171",
  sem_dado: "#D1D5DB",
}
